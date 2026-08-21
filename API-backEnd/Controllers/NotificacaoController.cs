using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificacaoController : BaseController
    {
        private readonly NotificacaoService _notificacaoService;

        public NotificacaoController(NotificacaoService notificacaoService)
        {
            _notificacaoService = notificacaoService;
        }

        [Authorize]
        [HttpGet]
        public IActionResult MostrarNotificacoes()
        {
            return Resultado(_notificacaoService.MostrarNotificacoes());
        }

        [Authorize]
        [HttpGet("nao-lidas")]
        public IActionResult NotificacoesNaoLidas()
        {
            return Resultado(_notificacaoService.NotificacoesNaoLidas());
        }

        [Authorize]
        [HttpPut("ler-notificacao")]
        public IActionResult LerNotificao(int id)
        {
            return Resultado(_notificacaoService.LerNotificacao(id));
        }

        [Authorize]
        [HttpPut("ler-todas-notificacoes")]
        public IActionResult LerTodasNotifacacoes()
        {
            return Resultado(_notificacaoService.LerTodasNotificacoes());
        }

        [HttpGet("lista-notificacoes")]
        public IActionResult ListaNotificacoes()
        {
            return Resultado(_notificacaoService.ListaDeNotificacoes());
        }
    }
}
