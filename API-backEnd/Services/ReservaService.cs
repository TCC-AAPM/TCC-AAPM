using API_backEnd.Common;
using API_backEnd.DTOs.Aluno;
using API_backEnd.DTOs.Armario;
using API_backEnd.DTOs.Reserva;
using API_backEnd.Enums;
using API_backEnd.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace API_backEnd.Services
{
    public class ReservaService
    {
        private readonly AapmContext db;
        private readonly IdadeService _idadeService;
        private readonly TermoService _termoService;
        private readonly AlunoService _alunoService;
        private readonly ArmarioService _armarioService;
        private readonly NotificacaoService _notificacaoService;
        public ReservaService(AapmContext context, IdadeService idadeService, TermoService termoService, AlunoService alunoService, ArmarioService armarioService, NotificacaoService notificacaoService)
        {
            db = context;
            _idadeService = idadeService;
            _termoService = termoService;
            _alunoService = alunoService;
            _armarioService = armarioService;
            _notificacaoService = notificacaoService;
        }

        public ResultadoPadrao<object> CadastrarReservaArmario(CriarCadastroArmarioRequest dto)
        {
            // validar idade e termos
            var validarIdadeETermos = ValidarIdadeETermos(dto.DataNasc, dto.IdTermoSite, dto.AceitouTermoSite, dto.IdTermoArmario, dto.AceitouTermoArmario, 14);
            if (!validarIdadeETermos.Sucesso)
                return validarIdadeETermos;

            // validar se ta ocupado com service 
            if (_armarioService.ArmarioIndisponivel(dto.IdArmario))
                return ResultadoPadrao<object>.Falha("Armário não está disponível", 409);


            // validar se o aluno existe pelo cpf no service
            if (_alunoService.ExisteAlunoPorCpf(dto.CPF))
                return ResultadoPadrao<object>.Falha("CPF já cadastrado", 409);


            var armario = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == dto.IdArmario);
            if (armario == null)
                return ResultadoPadrao<object>.Falha("Armário não encontrado", 404);



            using var transaction = db.Database.BeginTransaction();

            try
            {
                var usuario = new TabelaUsuario
                {
                    Senha = BCrypt.Net.BCrypt.HashPassword(dto.CPF),
                    IsAtivo = true
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
                    IdUsuario = idUsuario,
                    IsAtivo = true
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


                armario.Estado = EstadoArmario.O;
                db.TabelaReservaArmarios.Add(reserva);
                db.SaveChanges();

                _notificacaoService.CriarNotificacao(aluno.IdUsuario, EventosNotificacao.CadastroRealizado);
                _notificacaoService.CriarNotificacao(aluno.IdUsuario, EventosNotificacao.PagamentoFeito);
                _notificacaoService.CriarNotificacao(aluno.IdUsuario, EventosNotificacao.ReservaCriada);

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
            var aluno = _alunoService.ObterAlunoPorCpf(dto.CPF);
            if (aluno == null)
            {
                return ResultadoPadrao<object>.Falha("Aluno não encontrado", 404);
            }

            var validarIdadeETermos = ValidarIdadeETermos(dto.DataNasc, dto.IdTermoSite, dto.AceitouTermoSite, dto.IdTermoArmario, dto.AceitouTermoArmario, 14);
            if (!validarIdadeETermos.Sucesso)
                return validarIdadeETermos;

            var reservaAtiva = db.TabelaReservaArmarios.FirstOrDefault(r => r.IdAluno == aluno.Id && r.IsAtivo);

            if (reservaAtiva != null)
            {
                return ResultadoPadrao<object>.Falha("Aluno com armário já reservado", 409);

            }

            if (_armarioService.ArmarioIndisponivel(dto.IdArmario))
                return ResultadoPadrao<object>.Falha("Armário não está disponível", 409);


            var armario = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == dto.IdArmario);
            if (armario == null)
                return ResultadoPadrao<object>.Falha("Armário não encontrado", 404);


            var validacao = _alunoService.ValidarAtualizacaoAluno(aluno.Id, dto);

            if (!validacao.Sucesso)
                return validacao;

            using var transaction = db.Database.BeginTransaction();

            try
            {
               

                _alunoService.AtualizarCadastroAluno(aluno, dto);


                var reserva = new TabelaReservaArmario
                {
                    IdAluno = aluno.Id,
                    IdArmario = dto.IdArmario,
                    IsAtivo = true
                };

                AceitarTermos(aluno.IdUsuario, dto.IdTermoSite, dto.IdTermoArmario);

                armario.Estado = EstadoArmario.O;

                db.TabelaReservaArmarios.Add(reserva);

                var pagamento = new TabelaPagamento
                {
                    IdAluno = aluno.Id,
                    IdProduto = (int)TipoProduto.Armario,
                    Metodo = dto.MetodoPagamento,
                };

                db.TabelaPagamentos.Add(pagamento);

                db.SaveChanges();


                _notificacaoService.CriarNotificacao(aluno.IdUsuario, EventosNotificacao.ReservaCriada);
                _notificacaoService.CriarNotificacao(aluno.IdUsuario, EventosNotificacao.PagamentoFeito);

                transaction.Commit();

                return ResultadoPadrao<object>.Ok(mensagem: "Recadastro feito");


            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return ResultadoPadrao<object>.Falha(ex.Message);
            }
        }

        public ResultadoPadrao<object> HistoricoReserva()
        {
            var dados =
            (
                from r in db.TabelaReservaArmarios
                join a in db.TabelaAlunos on r.IdAluno equals a.Id
                where a.IsAtivo == true
                select new HistoricoReservaResponse
                {
                    Nome = a.Nome,
                    CPF = a.Cpf,
                    NumeroArmario = r.IdArmario,
                    IsAtivo = r.IsAtivo
                }
            ).ToList();
            return ResultadoPadrao<object>.Ok(dados);
        }

        public ResultadoPadrao<object> AlunosComReservaAtiva()
        {
            var config = db.ConfigReservas.FirstOrDefault();
            if (config == null)
            {
                return ResultadoPadrao<object>.Falha("Configuração não encontrada", 404);
            }

            var dados = (
            from r in db.TabelaReservaArmarios
            join a in db.TabelaAlunos on r.IdAluno equals a.Id
            join ar in db.TabelaArmarios on r.IdArmario equals ar.NumeroArmario
            join c in db.TabelaCursos on a.CursoId equals c.Id
            join t in db.TabelaTurmas on a.TurmaId equals t.Id
            join p in db.TabelaPagamentos on a.Id equals p.IdAluno
            where r.IsAtivo && a.IsAtivo
            select new AlunoComReservaResponse
            {
                NomeAluno = a.Nome,
                NomeSocial = string.IsNullOrWhiteSpace(a.NomeSocial) ? null : a.NomeSocial,
                NumeroArmario = ar.NumeroArmario,
                Telefone = a.Telefone,
                CPF = a.Cpf,
                Email = a.Email,
                Curso = c.Nome,
                Turma = t.Turma,
                Pagamento = p.Metodo,
                DataExpiracao = config.DataExpiracaoGlobal
            }
            ).ToList();

            if (dados.Count == 0)
            {
                return ResultadoPadrao<object>.Falha("");
            }
            return ResultadoPadrao<object>.Ok(dados);
        }

        public ResultadoPadrao<object> TransferirAlunoDeArmario(TransferirAlunoArmarioRequest dto)
        {

            if (dto.NumeroArmarioAtual == dto.NumeroArmarioNovo)
            {
                return ResultadoPadrao<object>.Falha("Escolha um armario diferente do atual", 409);
            }

            var armarioReservaAtual = db.TabelaReservaArmarios.FirstOrDefault(a => a.IdArmario == dto.NumeroArmarioAtual && a.IsAtivo);

            if (armarioReservaAtual == null)
            {
                return ResultadoPadrao<object>.Falha("Reserva nao encontrada", 404);
            }
            var idUsuario = db.TabelaAlunos.Where(a => a.Id == armarioReservaAtual.IdAluno).Select(a => a.IdUsuario).FirstOrDefault();

            var armarioAtual = db.TabelaArmarios.SingleOrDefault(a => a.NumeroArmario == armarioReservaAtual.IdArmario);

            if (armarioAtual == null)
            {
                return ResultadoPadrao<object>.Falha("Armario não encontrado", 404);
            }

            var armarioNovo = db.TabelaArmarios.SingleOrDefault(a => a.NumeroArmario == dto.NumeroArmarioNovo);

            if (armarioNovo == null)
            {
                return ResultadoPadrao<object>.Falha("Armario nao existe", 404);
            }

            if (armarioNovo.Estado == EstadoArmario.O || armarioNovo.Estado == EstadoArmario.M)
            {
                return ResultadoPadrao<object>.Falha("armario em manutencao ou ocupado", 409);
            }

            //mudar para o armario novo e o estado
            armarioReservaAtual.IdArmario = armarioNovo.NumeroArmario;
            armarioNovo.Estado = EstadoArmario.O;

            //mudar o estado do armario antigo e colocar a obs
            armarioAtual.Estado = EstadoArmario.M;
            armarioAtual.Observacao = string.IsNullOrWhiteSpace(dto.Observacao) ? null : dto.Observacao;

            db.SaveChanges();

            _notificacaoService.CriarNotificacao(idUsuario, EventosNotificacao.ArmarioTransferido);

            return ResultadoPadrao<object>.Ok(mensagem: "Aluno realocado de armário com sucesso");
        }

        public ResultadoPadrao<object> ExcluirReserva(int numeroArmario)
        {
            var reservaAtiva = db.TabelaReservaArmarios.FirstOrDefault(a => a.IdArmario == numeroArmario && a.IsAtivo);
            if (reservaAtiva == null)
                return ResultadoPadrao<object>.Falha("Reserva não encontrada", 404);

            var armario = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == numeroArmario && a.IsAtivo);
            if (armario == null)
                return ResultadoPadrao<object>.Falha("Armário não encontrado", 404);

            armario.Estado = EstadoArmario.D;
            reservaAtiva.IsAtivo = false;
            db.SaveChanges();

            var idUsuario = db.TabelaReservaArmarios.Where(a => a.Id == reservaAtiva.Id).Select(a => a.IdAlunoNavigation.IdUsuario).FirstOrDefault();


            _notificacaoService.CriarNotificacao(idUsuario, EventosNotificacao.ReservaCancelada);

            return ResultadoPadrao<object>.Ok();
        }


        public ResultadoPadrao<List<ReservaMensalResponse>> ReservasUltimos6Meses()
        {
            var hoje = DateTime.Now;

            var inicio = new DateTime(hoje.Year, hoje.Month, 1).AddMonths(-5);

            var reservas = db.TabelaReservaArmarios
                .Where(r => r.CriadaEm >= inicio)
                .ToList();

            var resultado = Enumerable.Range(0, 6)
                .Select(i =>
                {
                    var data = inicio.AddMonths(i);

                    var quantidade = reservas
                        .Count(r =>
                            r.CriadaEm.Year == data.Year &&
                            r.CriadaEm.Month == data.Month);

                    return new ReservaMensalResponse
                    {
                        Mes = data.ToString("MM/yyyy"),
                        Quantidade = quantidade
                    };
                })
                .ToList();

            return ResultadoPadrao<List<ReservaMensalResponse>>.Ok(resultado);
        }

        public ResultadoPadrao<int> TotalReservasMes()
        {
            var hoje = DateTime.Now;

            var inicioMes = new DateTime(
                hoje.Year,
                hoje.Month,
                1
            );

            var inicioProximoMes = inicioMes.AddMonths(1);

            var total = db.TabelaReservaArmarios
                .Count(r =>
                    r.CriadaEm >= inicioMes &&
                    r.CriadaEm < inicioProximoMes
                );

            return ResultadoPadrao<int>.Ok(total);
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
