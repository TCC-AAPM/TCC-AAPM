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

        public ResultadoPadrao<object> CadastrarReservaArmario(CriarCadastroArmarioRequest dto)
        {
            // validar idade e termos
            var validarIdadeETermos = ValidarIdadeETermos(dto.DataNasc, dto.IdTermoSite, dto.AceitouTermoSite, dto.IdTermoArmario, dto.AceitouTermoArmario, 14);
            if (!validarIdadeETermos.Sucesso)
                return validarIdadeETermos;

            // validar se ta ocupado com service 
            if (_armarioService.ArmarioIndisponivel(dto.IdArmario))
                return ResultadoPadrao<object>.Falha("Armário não está disponível");


            // validar se o aluno existe pelo cpf no service
            if (_alunoService.ExisteAlunoPorCpf(dto.CPF))
                return ResultadoPadrao<object>.Falha("CPF já cadastrado");
                

            var armario = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == dto.IdArmario);
            if (armario == null)
                return ResultadoPadrao<object>.Falha("Armário não encontrado");
                

            
            using var transaction = db.Database.BeginTransaction();

            try
            {
                var usuario = new TabelaUsuario
                {
                    Senha = BCrypt.Net.BCrypt.HashPassword(dto.CPF)
                };

                db.TabelaUsuarios.Add(usuario);
                db.SaveChanges();

                int idUsuario = usuario.Id;

                AceitarTermos(idUsuario, dto.IdTermoSite, dto.IdTermoArmario);

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
                return ResultadoPadrao<object>.Ok(mensagem: "Cadastro feito");
                
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return ResultadoPadrao<object>.Falha(ex.Message);
                
            }


        }

        public ResultadoPadrao<object> RecadastrarReserva(RecadastrarReservaRequest dto)
        {
            var aluno = db.TabelaAlunos.SingleOrDefault(a => a.Cpf == dto.CPF);
            if (aluno == null)
            {
                return ResultadoPadrao<object>.Falha("Aluno não encontrado");
            }

            var validarIdadeETermos = ValidarIdadeETermos(dto.DataNasc, dto.IdTermoSite, dto.AceitouTermoSite, dto.IdTermoArmario, dto.AceitouTermoArmario, 14);
            if (!validarIdadeETermos.Sucesso)
                return validarIdadeETermos;

            var reservaAtiva = db.TabelaReservaArmarios.FirstOrDefault(r => r.IdAluno == aluno.Id && r.IsAtivo);

            if (reservaAtiva != null)
            {
                return ResultadoPadrao<object>.Falha("Aluno com armário já reservado");
                
            }

            if (_armarioService.ArmarioIndisponivel(dto.IdArmario))
                return ResultadoPadrao<object>.Falha("Armário não está disponível");
               

            var armario = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == dto.IdArmario);
            if (armario == null)
                return ResultadoPadrao<object>.Falha("Armário não encontrado");
                

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

                AceitarTermos(aluno.IdUsuario, dto.IdTermoSite, dto.IdTermoArmario);

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

                return ResultadoPadrao<object>.Ok(mensagem: "Recadastro feito");
                

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return ResultadoPadrao<object>.Falha(ex.Message);
            }
        }

        public ResultadoPadrao<object> PreCadastroAluno(PreCadastroRequest dto)
        {
            var validarIdadeETermos = ValidarIdadeETermos(dto.DataNasc, dto.IdTermoSite, dto.AceitouTermoSite, dto.IdTermoArmario, dto.AceitouTermoArmario, 18);
            if (!validarIdadeETermos.Sucesso)
                return validarIdadeETermos;


            var validarCpf = _alunoService.ExisteAlunoPorCpf(dto.CPF);
            if (validarCpf)
                return ResultadoPadrao<object>.Falha("CPF já cadastrado");
                

            
            using var transaction = db.Database.BeginTransaction();

            try
            {
                var usuario = new TabelaUsuario
                {
                    Senha = BCrypt.Net.BCrypt.HashPassword(dto.CPF)
                };

                db.TabelaUsuarios.Add(usuario);
                db.SaveChanges();

                int idUsuario = usuario.Id;

                AceitarTermos(idUsuario, dto.IdTermoSite, dto.IdTermoArmario);

                var aluno = new TabelaAluno
                {
                    Cpf = dto.CPF,
                    Nome = dto.Nome,
                    NomeSocial = string.IsNullOrWhiteSpace(dto.NomeSocial) ? null : dto.NomeSocial,
                    Matricula = string.IsNullOrWhiteSpace(dto.Matricula) ? null : dto.Matricula,
                    Telefone = Regex.Replace(dto.Telefone, @"\D", ""),
                    Email = dto.Email,
                    DataNasc = dto.DataNasc,
                    CursoId = dto.IdCurso,
                    TurmaId = dto.IdTurma,
                    IdUsuario = idUsuario
                };

                db.TabelaAlunos.Add(aluno);
                db.SaveChanges();
                transaction.Commit();
                return ResultadoPadrao<object>.Ok(mensagem: "Pré cadastro realizado com sucesso");
                
            }
            catch (Exception ex) 
            {
                transaction.Rollback();
                return ResultadoPadrao<object>.Falha(ex.Message);
               
            }
        }
        
        private ResultadoPadrao<object> ValidarIdadeETermos(DateOnly dataNasc, int idTermoSite, 
            bool aceitouTermoSite, int idTermoArmario, bool aceitouTermoArmario, int idadeMin)
        {
            var validacaoIdadeResultado = _idadeService.ValidarIdade(dataNasc, idadeMin);

            if (!validacaoIdadeResultado.Sucesso)
                return ResultadoPadrao<object>.Falha(validacaoIdadeResultado.Mensagem);
                

            // validar o aceite do termo site com m
            var termoSiteResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.S, idTermoSite, aceitouTermoSite);

            if (!termoSiteResultado.Sucesso)
                return ResultadoPadrao<object>.Falha(termoSiteResultado.Mensagem);
                

            var termoArmarioResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.A, idTermoArmario, aceitouTermoArmario);

            if (!termoArmarioResultado.Sucesso)
                return ResultadoPadrao<object>.Falha(termoArmarioResultado.Mensagem);


            return ResultadoPadrao<object>.Ok();
        }

        private void AceitarTermos(int idUsuario, int idTermoSite, int idTermoArmario)
        {
            var aceiteTermoSite = _termoService.AceitarTermoSemSalvar(idUsuario, idTermoSite);
            if (!aceiteTermoSite.Sucesso)
                throw new Exception(aceiteTermoSite.Mensagem);



            var aceiteTermoArmario = _termoService.AceitarTermoSemSalvar(idUsuario, idTermoArmario);
            if (!aceiteTermoArmario.Sucesso)
                throw new Exception(aceiteTermoArmario.Mensagem);

        }
    }
}
