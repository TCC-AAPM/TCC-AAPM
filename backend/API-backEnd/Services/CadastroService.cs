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
        private readonly NotificacaoService _notificacaoService;
        public CadastroService(AapmContext context, IdadeService idadeService, TermoService termoService, AlunoService alunoService, NotificacaoService notificacaoService)
        {
            db = context;
            _idadeService = idadeService;
            _termoService = termoService;
            _alunoService = alunoService;
            _notificacaoService = notificacaoService;
        }

        // rever essa parte de pre cadastro, vai entrar a parte de pagamento com API 
        public ResultadoPadrao<object> PreCadastroAluno(PreCadastroRequest dto)
        {
            var validarIdadeETermos = ValidarIdadeETermos(dto.DataNasc, dto.IdTermoSite, dto.AceitouTermoSite, dto.IdTermoArmario, dto.AceitouTermoArmario, 18);
            if (!validarIdadeETermos.Sucesso)
                return validarIdadeETermos;


            var validarCpf = _alunoService.ExisteAlunoPorCpf(dto.CPF);
            if (validarCpf)
                return ResultadoPadrao<object>.Falha("CPF já cadastrado", 409);
            
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

                _notificacaoService.CriarNotificacao(aluno.IdUsuario, EventosNotificacao.CadastroRealizado);
                
                transaction.Commit();
                return ResultadoPadrao<object>.Ok(mensagem: "Pré cadastro realizado com sucesso");
                
            }
            catch (Exception ex) 
            {
                transaction.Rollback();
                return ResultadoPadrao<object>.Falha(ex.Message);
               
            }
        }
        
        // ta errado
        private ResultadoPadrao<object> ValidarIdadeETermos(DateOnly dataNasc, int idTermoSite, 
            bool aceitouTermoSite, int idTermoArmario, bool aceitouTermoArmario, int idadeMin)
        {
            var validacaoIdadeResultado = _idadeService.ValidarIdade(dataNasc, idadeMin);

            if (!validacaoIdadeResultado.Sucesso)
                return ResultadoPadrao<object>.Falha(validacaoIdadeResultado.Mensagem, validacaoIdadeResultado.StatusCode);
                

            // validar o aceite do termo site com m
            var termoSiteResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.S, idTermoSite, aceitouTermoSite);

            if (!termoSiteResultado.Sucesso)
                return ResultadoPadrao<object>.Falha(termoSiteResultado.Mensagem, termoSiteResultado.StatusCode);
                

            var termoArmarioResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.A, idTermoArmario, aceitouTermoArmario);

            if (!termoArmarioResultado.Sucesso)
                return ResultadoPadrao<object>.Falha(termoArmarioResultado.Mensagem, termoArmarioResultado.StatusCode);


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
