using API_backEnd.Common;
using API_backEnd.DTOs.Reserva;
using API_backEnd.Enums;
using API_backEnd.Models;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API_backEnd.Services
{
    public class CadastroService
    {
        private readonly AapmContext db;
        private readonly IdadeService _idadeService;
        private readonly TermoService _termoService;
        private readonly AlunoService _alunoService;
        private readonly ArmarioService _armarioService;
        public CadastroService(AapmContext context, IdadeService idadeService, TermoService termoService, AlunoService alunoService, ArmarioService armarioService)
        {
            db = context;
            _idadeService = idadeService;
            _termoService = termoService;
            _alunoService = alunoService;
            _armarioService = armarioService;
        }

        public ResultadoCadastro CadastrarReservaArmario(CriarCadastroArmarioRequest dto)
        {
            // validar idade com service 
            var validacaoIdadeResultado = _idadeService.ValidarIdade(dto.DataNasc, 14);

            if (validacaoIdadeResultado.Erro)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = validacaoIdadeResultado.Mensagem
                };

            // validar o aceite do termo site com m
            var termoSiteResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.S, dto.IdTermoSite, dto.AceitouTermoSite);

            if (termoSiteResultado.Erro)
                return new ResultadoCadastro {
                    Erro = true,
                    Mensagem = termoSiteResultado.Mensagem 
                };

            var termoArmarioResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.A, dto.IdTermoArmario, dto.AceitouTermoArmario);

            if (termoArmarioResultado.Erro)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = termoArmarioResultado.Mensagem
                };

            // validar se ta ocupado com service 
            if (_armarioService.ArmarioEstaOcupado(dto.IdArmario))
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = "Armário já está ocupado"
                };

            // validar se o aluno existe pelo cpf no service
            if (_alunoService.ExisteAlunoPorCpf(dto.CPF))
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = "CPF já cadastrado"
                };

            var armario = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == dto.IdArmario);
            if (armario == null)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = "Armário não encontrado"
                };

            var usuario = new TabelaUsuario
            {
                Senha = BCrypt.Net.BCrypt.HashPassword(dto.CPF)
            };

            db.TabelaUsuarios.Add(usuario);
            db.SaveChanges();

            int idUsuario = usuario.Id;

            var aceiteTermoSite = _termoService.AceitarTermo(idUsuario, dto.IdTermoSite);
            if (aceiteTermoSite.Erro)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = aceiteTermoSite.Mensagem,
                };


            var aceiteTermoArmario = _termoService.AceitarTermo(idUsuario, dto.IdTermoArmario);
            if (aceiteTermoArmario.Erro)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = aceiteTermoArmario.Mensagem,
                };
            using var transaction = db.Database.BeginTransaction();

            try
            {
                var aluno = new TabelaAluno
                {
                    Cpf = dto.CPF,
                    Nome = dto.Nome,
                    NomeSocial = string.IsNullOrWhiteSpace(dto.NomeSocial) ? null : dto.NomeSocial,
                    DataNasc = dto.DataNasc,
                    Matricula = string.IsNullOrWhiteSpace(dto.Matricula) ? null : dto.Matricula,
                    Telefone = Regex.Replace(dto.Telefone, @"\D", ""),
                    Email = dto.Email,
                    CursoId = dto.IdCurso,
                    TurmaId = dto.IdTurma,
                    IdUsuario = idUsuario
                };

                db.TabelaAlunos.Add(aluno);
                db.SaveChanges();
                var pagamento = new TabelaPagamento
                {
                    IdAluno = aluno.Id,
                    IdProduto = (int)TipoProduto.Armario,
                    Metodo = dto.MetodoPagamento,

                };

                db.TabelaPagamentos.Add(pagamento);

                var reserva = new TabelaReservaArmario
                {
                    IdAluno = aluno.Id,
                    IdArmario = dto.IdArmario,
                    IsAtivo = true
                };

                
                armario.Estado = EstadoArmario.O.ToString();
                db.TabelaReservaArmarios.Add(reserva);
                db.SaveChanges();
                transaction.Commit();
                return new ResultadoCadastro
                {
                    Erro = false,
                    Mensagem = "Cadastro feito",

                };
            }
            catch (Exception)
            {
                transaction.Rollback();
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = "Erro ao realizar cadastro"
                };
            }


        }

        public ResultadoCadastro RecadastrarReserva(RecadastrarReservaRequest dto)
        {
            
            // validar idade com service 
            var validacaoIdadeResultado = _idadeService.ValidarIdade(dto.DataNasc, 14);

            if (validacaoIdadeResultado.Erro)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = validacaoIdadeResultado.Mensagem
                };

            // validar o aceite do termo site com service
            var termoSiteResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.S, dto.IdTermoSite, dto.AceitouTermoSite);

            if (termoSiteResultado.Erro)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = termoSiteResultado.Mensagem
                };

            // validar o aceite do termo da reserva armario com service
            var termoArmarioResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.A, dto.IdTermoArmario, dto.AceitouTermoArmario);

            if (termoArmarioResultado.Erro)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = termoArmarioResultado.Mensagem
                };

            var aluno = db.TabelaAlunos.SingleOrDefault(a => a.Cpf == dto.CPF);

            if (aluno == null)
            {
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = "Aluno não encontrado"
                };
            }

            var reservaAtiva = db.TabelaReservaArmarios.FirstOrDefault(r => r.IdAluno == aluno.Id && r.IsAtivo);

            if (reservaAtiva != null)
            {
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = "Aluno com armário já reservado"
                };
            }

            if (_armarioService.ArmarioEstaOcupado(dto.IdArmario))
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = "Armário já está ocupado"
                };

            var armario = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == dto.IdArmario);
            if (armario == null)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = "Armário não encontrado"
                };

            var aceiteTermoSite = _termoService.AceitarTermo(aluno.IdUsuario, dto.IdTermoSite);
            if (aceiteTermoSite.Erro)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = aceiteTermoSite.Mensagem,
                };


            var aceiteTermoArmario = _termoService.AceitarTermo(aluno.IdUsuario, dto.IdTermoArmario);
            if (aceiteTermoArmario.Erro)
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = aceiteTermoArmario.Mensagem,
                };

            using var transaction = db.Database.BeginTransaction();

            try
            {
                aluno.Nome = dto.Nome;
                aluno.NomeSocial = string.IsNullOrWhiteSpace(dto.NomeSocial) ? null : dto.NomeSocial;
                aluno.Matricula = string.IsNullOrWhiteSpace(dto.Matricula) ? null : dto.Matricula;
                aluno.Telefone = Regex.Replace(dto.Telefone, @"\D", "");
                aluno.Email = dto.Email;
                aluno.DataNasc = dto.DataNasc;
                aluno.CursoId = dto.IdCurso;
                aluno.TurmaId = dto.IdTurma;

                
                var reserva = new TabelaReservaArmario
                {
                    IdAluno = aluno.Id,
                    IdArmario = dto.IdArmario,
                    IsAtivo = true
                };

                

                armario.Estado = EstadoArmario.O.ToString();

                db.TabelaReservaArmarios.Add(reserva);

                var pagamento = new TabelaPagamento
                {
                    IdAluno = aluno.Id,
                    IdProduto = (int)TipoProduto.Armario,
                    Metodo = dto.MetodoPagamento,
                };

                db.TabelaPagamentos.Add(pagamento);

                db.SaveChanges();
                transaction.Commit();

                return new ResultadoCadastro
                {
                    Erro = false,
                    Mensagem = "Recadastro feito"
                };

            }
            catch (Exception)
            {
                transaction.Rollback();
                return new ResultadoCadastro
                {
                    Erro = true,
                    Mensagem = "Erro ao fazer recadastro"
                };
            }
        }
    }
}
