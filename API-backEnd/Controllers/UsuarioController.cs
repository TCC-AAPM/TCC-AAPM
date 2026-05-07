using API_backEnd.DTOs.Auth;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
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

        /// <summary>
        /// Altera a senha do usuário autenticado.
        /// </summary>
        /// <remarks>
        /// Necessário informar a senha atual para realizar a alteração.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para alteração da senha.
        /// </param>
        /// <response code="200">Senha alterada com sucesso.</response>
        /// <response code="400">Senha atual inválida ou dados incorretos.</response>
        /// <response code="401">Usuário não autenticado.</response>
        [Authorize]
        [HttpPost("trocar-senha")]
        public IActionResult TrocarSenha(TrocarSenhaRequest dto)
        {
            return Resultado(_usuarioService.TrocarSenha(dto));
        }
    }
}