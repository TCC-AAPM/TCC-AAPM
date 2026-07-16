using API_backEnd.Common;
using API_backEnd.DTOs.Aluno;
using API_backEnd.DTOs.Auth;
using API_backEnd.DTOs.Reserva;
using API_backEnd.Enums;
using API_backEnd.Models;
using System.Text.RegularExpressions;
namespace API_backEnd.Services
{
    public class AlunoService
    {
        private readonly AapmContext db;
        private readonly UsuarioService _usuarioService;
        
        public AlunoService(AapmContext db, UsuarioService suarioService)
        {
            this.db = db;
            _usuarioService = suarioService;
        }

        public bool ExisteAlunoPorCpf(string cpf)
        {
            return db.TabelaAlunos.Any(a => a.Cpf == cpf && a.IsAtivo);
        }

        public ResultadoPadrao<AlunoLogadoResponse> DadosAlunoLogado()
        {
            var id = _usuarioService.ObterIdUsuarioLogado();

            var config = db.ConfigReservas.FirstOrDefault();

            if (config == null)
            {
                return ResultadoPadrao<AlunoLogadoResponse>.Falha("Configuração não encontrada", 404);
            }

            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.IdUsuario == id && a.IsAtivo);

            if (aluno == null)
                return ResultadoPadrao<AlunoLogadoResponse>.Falha("Aluno não encontrado", 404);

            var hoje = DateOnly.FromDateTime(DateTime.Today);
            var reservaValida = config.DataExpiracaoGlobal >= hoje;

            var dadosAluno = new AlunoLogadoResponse
            {
                Nome = aluno.Nome,
                NomeSocial = aluno.NomeSocial,
                CPF = aluno.Cpf,
                Matricula = aluno.Matricula ?? "Matrícula não identificada",
                Telefone = aluno.Telefone,
                Email = aluno.Email,
                DataNasc = aluno.DataNasc,
            };

            dadosAluno.Turma = db.TabelaTurmas.Where(t => t.Id == aluno.TurmaId && t.IsAtivo).Select(t => t.Turma).FirstOrDefault() ?? "Turma não identificada";
            dadosAluno.Curso = db.TabelaCursos.Where(c => c.Id == aluno.CursoId && c.IsAtivo).Select(c => c.Nome).FirstOrDefault() ?? "Curso não identificado";

            dadosAluno.NumeroArmario = reservaValida
                ? db.TabelaReservaArmarios.Where(r => r.IdAluno == aluno.Id && r.IsAtivo).Select(a => (int?)a.IdArmario).FirstOrDefault() ?? null
                : null;

            dadosAluno.IdVaga = reservaValida
                ? db.TabelaReservaEstacionamentos.Where(r => r.IdAluno == aluno.Id && r.IsAtivo).Select(e => (int?)e.IdVaga).FirstOrDefault() ?? null
                : null;

            dadosAluno.Pagamento = db.TabelaPagamentos.Where(p => p.IdAluno == aluno.Id).Select(p => p.Metodo).FirstOrDefault() ?? "Pagamento não identificado";
            dadosAluno.DataExpiracao = config.DataExpiracaoGlobal;
            dadosAluno.JaTeveReserva = db.TabelaReservaArmarios.Any(r => r.IdAluno == aluno.Id);

            return ResultadoPadrao<AlunoLogadoResponse>.Ok(dadosAluno);
        }

        public ResultadoPadrao<object> DeletarConta(ConfirmarSenhaRequest dto)
        {
            var id = _usuarioService.ObterIdUsuarioLogado();

            var usuario = db.TabelaUsuarios.FirstOrDefault(a => a.Id == id && a.IsAtivo);

            if (usuario == null)
            {
                return ResultadoPadrao<object>.Falha("Usuário não encontrado", 404);
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha))
            {
                return ResultadoPadrao<object>.Falha("Senha incorreta", 400);
            }

            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.IdUsuario == id && a.IsAtivo);

            if (aluno == null)
            {
                return ResultadoPadrao<object>.Falha("Aluno não encontrado", 404);
            }

            using var transaction = db.Database.BeginTransaction();
            try
            {
                var reserva = db.TabelaReservaArmarios.FirstOrDefault(r => r.IdAluno == aluno.Id && r.IsAtivo);
                if (reserva != null)
                {
                    var armario = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == reserva.IdArmario && a.IsAtivo);

                    if (armario != null)
                    {
                        armario.Observacao = $"O aluno {aluno.Nome} excluiu a conta";
                        armario.Estado = EstadoArmario.P;
                    }

                    reserva.IsAtivo = false;
                }



                aluno.IsAtivo = false;
                usuario.IsAtivo = false;

                db.SaveChanges();

                transaction.Commit();

                return ResultadoPadrao<object>.Ok(mensagem: "Conta deletada");
            }
            catch
            {
                transaction.Rollback();
                return ResultadoPadrao<object>.Falha("Erro ao deletar conta", 500);
            }
        }

        public ResultadoPadrao<RecadastroResponse> BuscarAlunoPeloCPF(BuscarAlunoPorCpfRequest dto)
        {
            var aluno = ObterAlunoPorCpf(dto.CPF); 

            if (aluno == null)
            {
                return ResultadoPadrao<RecadastroResponse>.Falha("Aluno não encontrado", 404);
            }
            var dados = new RecadastroResponse
            {
                Nome = aluno.Nome,
                Telefone = aluno.Telefone,
                Email = aluno.Email,
                Matricula = aluno.Matricula,
                IdCurso = aluno.CursoId,
                IdTurma = aluno.TurmaId
            };

            return ResultadoPadrao<RecadastroResponse>.Ok(dados);
        }

        public ResultadoPadrao<object> EditarAluno(int id, EditarAlunoRequest dto) 
        {
            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Id == id && a.IsAtivo);
                        
            if (aluno == null)
                return ResultadoPadrao<object>.Falha("Nenhum aluno encontrado");

            var validacao = ValidarAtualizacaoAluno(id, dto);

            if (!validacao.Sucesso)
                return validacao;

            AtualizarCadastroAluno(aluno, dto);

            db.SaveChanges();


            return ResultadoPadrao<object>.Ok("Aluno atualizado com sucesso");
        }

        public void AtualizarCadastroAluno(TabelaAluno aluno, DadosAlunoRequest dto)
        {
            aluno.Cpf = dto.CPF;
            aluno.Nome = dto.Nome;
            aluno.NomeSocial = string.IsNullOrWhiteSpace(dto.NomeSocial) ? null : dto.NomeSocial;
            aluno.Matricula = string.IsNullOrWhiteSpace(dto.Matricula) ? null : dto.Matricula;
            aluno.Telefone = Regex.Replace(dto.Telefone, @"\D", "");
            aluno.Email = dto.Email;
            aluno.DataNasc = dto.DataNasc;
            aluno.CursoId = dto.IdCurso;
            aluno.TurmaId = dto.IdTurma;
        }

        public TabelaAluno? ObterAlunoPorCpf(string cpf)
        {
            return db.TabelaAlunos.FirstOrDefault(a => a.Cpf == cpf && a.IsAtivo);
        }

        public ResultadoPadrao<object> ValidarAtualizacaoAluno(int idAluno, DadosAlunoRequest dto)
        {
            if (db.TabelaAlunos.Any(a =>
                a.Id != idAluno &&
                a.Cpf == dto.CPF &&
                a.IsAtivo))
            {
                return ResultadoPadrao<object>.Falha("CPF já cadastrado", 409);
            }

            if (db.TabelaAlunos.Any(a => a.Id != idAluno && a.Email == dto.Email && a.IsAtivo))
            {
                return ResultadoPadrao<object>.Falha("E-mail já cadastrado", 409);
            }

            return ResultadoPadrao<object>.Ok();
        }
    }
}
