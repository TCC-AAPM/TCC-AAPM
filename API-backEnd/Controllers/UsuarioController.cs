using API_backEnd.DTOs.Auth;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : BaseController
    {
        private readonly UsuarioService _usuarioService;

        public UsuarioController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [Authorize]
        [HttpPost("trocar-senha")]
        public IActionResult TrocarSenha(TrocarSenhaRequest dto)
        {
            return Resultado(_usuarioService.TrocarSenha(dto));
        }
    }
}
