using API_backEnd.Common;
using API_backEnd.DTOs.Notificacao;
using API_backEnd.Models;

namespace API_backEnd.Services
{
    public class NotificacaoService
    {
        private readonly AapmContext db;
        private readonly UsuarioService _usuarioService;

        public NotificacaoService(AapmContext db, UsuarioService usuarioService)
        {
            this.db = db;
            _usuarioService = usuarioService;
        }


        public ResultadoPadrao<object> MostrarNotificacoes()
        {
            var id = _usuarioService.ObterIdUsuarioLogado();

            var dataLimite = DateTime.Now.AddDays(-30);

            var notificacoes = db.TabelaNotificacaos.Where(n => n.IdUsuario == id && n.DataCriacao >= dataLimite).OrderByDescending(n => n.DataCriacao).Select(a => new NotificacaoResponse
            {
                Id = a.Id,
                Titulo = a.Titulo,
                Mensagem = a.Mensagem,
                Tipo = a.Tipo,
                Lida = a.Lida,
                DataCriacao = a.DataCriacao
            }).ToList();

            if (notificacoes.Count == 0)
                return ResultadoPadrao<object>.Ok("Nenhuma notificação");

            return ResultadoPadrao<object>.Ok(notificacoes);
        }

        public ResultadoPadrao<object> NotificacoesNaoLidas()
        {

            var id = _usuarioService.ObterIdUsuarioLogado();

            var dataLimite = DateTime.Now.AddDays(-30);

            var notiNaoLidas = db.TabelaNotificacaos.Where(a => a.IdUsuario == id && a.DataCriacao >= dataLimite && a.Lida == false).Count();

            return ResultadoPadrao<object>.Ok(notiNaoLidas);
        }
    }
}
