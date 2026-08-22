using API_backEnd.Common;
using API_backEnd.DTOs.Notificacao;
using API_backEnd.Models;
using System.Security.Claims;

namespace API_backEnd.Services
{
    public class NotificacaoService
    {
        private readonly AapmContext db;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public NotificacaoService(AapmContext db, IHttpContextAccessor httpContextAccessor)
        {
            this.db = db;
           _httpContextAccessor = httpContextAccessor;
        }


        public ResultadoPadrao<object> MostrarNotificacoes()
        {
            var id = ObterIdUsuarioLogado();

            var dataLimite = DateTime.Now.AddDays(-30);

            var notificacoes = db.TabelaHistoricoNotificacaos.Where(n => n.IdUsuario == id && n.DataEnvio >= dataLimite).OrderByDescending(n => n.DataEnvio).Select(a => new NotificacaoResponse
            {
                Id = a.Id,
                Titulo = a.IdNotificacaoNavigation.Titulo,
                Mensagem = a.IdNotificacaoNavigation.Mensagem,
                Tipo = a.IdNotificacaoNavigation.Evento,
                Lida = a.Lida,
                DataCriacao = a.DataEnvio
            }).ToList();

            if (notificacoes.Count == 0)
                return ResultadoPadrao<object>.Ok("Nenhuma notificação");

            return ResultadoPadrao<object>.Ok(notificacoes);
        }

        public ResultadoPadrao<object> NotificacoesNaoLidas()
        {

            var id = ObterIdUsuarioLogado();

            var dataLimite = DateTime.Now.AddDays(-30);

            var notiNaoLidas = db.TabelaHistoricoNotificacaos.Where(a => a.IdUsuario == id && a.DataEnvio >= dataLimite && a.Lida == false).Count();

            return ResultadoPadrao<object>.Ok(notiNaoLidas);
        }

        public ResultadoPadrao<object> LerNotificacao(int idNotificao)
        {
            var userId = ObterIdUsuarioLogado();

            var notificacao = db.TabelaHistoricoNotificacaos.FirstOrDefault(n => n.IdUsuario == userId && n.Id == idNotificao);

            if (notificacao == null)
                return ResultadoPadrao<object>.Falha("Notificação não encontrada.",404);

            if (notificacao.Lida)
                return ResultadoPadrao<object>.Ok("A notificação já foi marcada como lida.");

            notificacao.Lida = true;
            db.SaveChanges();
            return ResultadoPadrao<object>.Ok("Notificação marcada como lida.");
        }

        public ResultadoPadrao<object> LerTodasNotificacoes()
        {
            var userId = ObterIdUsuarioLogado();

            var notificacoes = db.TabelaHistoricoNotificacaos.Where(n => n.IdUsuario == userId && !n.Lida).ToList();

            if (notificacoes.Count == 0)
                return ResultadoPadrao<object>.Ok("Não há notificações não lidas.");

            notificacoes.ForEach(n =>
            {
                n.Lida = true;
            });
            db.SaveChanges();
            return ResultadoPadrao<object>.Ok("Todas as notificações foram marcadas como lidas.");
        }

        public ResultadoPadrao<List<NotificacaoAutomaticaResponse>> ListaDeNotificacoes()
        {
            var notificacoes = db.TabelaNotificacaos.Select(a => new NotificacaoAutomaticaResponse
            {
                Titulo = a.Titulo,
                Mensagem = a.Mensagem,
                Evento = a.Evento,
                Ativa = a.IsAtivo
            }).ToList();

            return ResultadoPadrao<List<NotificacaoAutomaticaResponse>>.Ok(notificacoes);
        }

        public ResultadoPadrao<object> AlterarStatusNotificacaoAutomatica(int idNotificacao)
        {
            var notificacao = db.TabelaNotificacaos.FirstOrDefault(n => n.Id == idNotificacao);

            if (notificacao == null)
                return ResultadoPadrao<object>.Falha("Notificação não encontrada");

            notificacao.IsAtivo = !notificacao.IsAtivo;

            db.SaveChanges();

            return ResultadoPadrao<object>.Ok(notificacao.IsAtivo ? "Notificação automática ativada" : "Notificação automática inativada");
        }

        public void CriarNotificacao(int idUsuario, string evento)
        {
            var notificacao = db.TabelaNotificacaos.FirstOrDefault(n => n.Evento == evento && n.IsAtivo);

            if (notificacao == null)
                return;

            var historico = new TabelaHistoricoNotificacao
            {
                IdUsuario = idUsuario,
                IdNotificacao = notificacao.Id,
                DataEnvio = DateTime.Now,
                Lida = false
            };

            db.TabelaHistoricoNotificacaos.Add(historico);
            db.SaveChanges();
        }

        public int ObterIdUsuarioLogado()
        {

            var user = _httpContextAccessor.HttpContext?.User;

            var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;


            if (!int.TryParse(userId, out int id))
                throw new Exception("Usuário não autenticado ou ID inválido");

            return id;
        }
    }
}
