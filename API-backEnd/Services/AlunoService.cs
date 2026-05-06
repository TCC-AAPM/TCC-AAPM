using API_backEnd.Common;
using API_backEnd.DTOs.Aluno;
using API_backEnd.DTOs.Auth;
using API_backEnd.DTOs.Reserva;
using API_backEnd.Enums;
using API_backEnd.Models;
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

        public bool ExisteAlunoPorCpf(string Cpf)
        {
            return db.TabelaAlunos.Any(a => a.Cpf == Cpf && a.IsAtivo);
        }

        public ResultadoPadrao<AlunoLogadoResponse> DadosAlunoLogado()
        {
            var id = _usuarioService.ObterIdUsuarioLogado();

            var config = db.ConfigReservas.FirstOrDefault();

            if (config == null)
            {
                return ResultadoPadrao<AlunoLogadoResponse>.Falha("Configuração não encontrada");
            }
           
            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.IdUsuario == id && a.IsAtivo);

            if (aluno == null)
                return ResultadoPadrao<AlunoLogadoResponse>.Falha("Aluno não encontrado");

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
            dadosAluno.NumeroArmario = db.TabelaReservaArmarios.Where(r => r.IdAluno == aluno.Id && r.IsAtivo).Select(a => (int?) a.IdArmario).FirstOrDefault() ?? null;
            dadosAluno.IdVaga = db.TabelaReservaEstacionamentos.Where(r => r.IdAluno == aluno.Id && r.IsAtivo).Select(e => (int?) e.IdVaga).FirstOrDefault() ?? null;
            dadosAluno.Pagamento = db.TabelaPagamentos.Where(p => p.IdAluno == aluno.Id).Select(p => p.Metodo).FirstOrDefault() ?? "Pagamento não identificado";
            dadosAluno.DataExpiracao = config.DataExpiracaoGlobal;


            return ResultadoPadrao<AlunoLogadoResponse>.Ok(dadosAluno);
        }

        public ResultadoPadrao<object> DeletarConta(ConfirmarSenhaRequest dto)
        {
            var id = _usuarioService.ObterIdUsuarioLogado();

            var usuario = db.TabelaUsuarios.FirstOrDefault(a => a.Id == id && a.IsAtivo);

            if (usuario == null)
            {
                return ResultadoPadrao<object>.Falha("Usuário não encontrado");
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha))
            {
                return ResultadoPadrao<object>.Falha("Senha incorreta");
            }

            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.IdUsuario == id && a.IsAtivo);

            if (aluno == null)
            {
                return ResultadoPadrao<object>.Falha("Aluno não encontrado");
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
                        armario.Estado = EstadoArmario.P.ToString();
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
                return ResultadoPadrao<object>.Falha("Erro ao deletar conta");
            }
        }

        public ResultadoPadrao<RecadastroResponse> BuscarAlunoPeloCPF(BuscarAlunoPorCpfRequest dto)
        {           
            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Cpf == dto.CPF && a.IsAtivo);

            if (aluno == null)
            {
                return ResultadoPadrao<RecadastroResponse>.Falha("Aluno não encontrado");
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
    }
}
