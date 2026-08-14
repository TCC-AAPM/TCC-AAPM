using API_backEnd.Services;
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

        [HttpGet]
        public IActionResult MostrarNotificacoes()
        {
            return Resultado(_notificacaoService.MostrarNotificacoes());
        }

        [HttpGet("nao-lidas")]
        public IActionResult NotificacoesNaoLidas()
        {
            return Resultado(_notificacaoService.NotificacoesNaoLidas());
        }
    }
}
