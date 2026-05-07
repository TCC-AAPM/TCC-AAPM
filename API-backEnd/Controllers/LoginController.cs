using API_backEnd.DTOs.Auth;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AuthService _authService;

        public LoginController(AuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Realiza a autenticação do usuário no sistema.
        /// </summary>
        /// <remarks>
        /// Retorna um token JWT utilizado para autenticação nas demais rotas protegidas.
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <param name="login">
        /// Credenciais de acesso do usuário.
        /// </param>
        /// <response code="200">Autenticação realizada com sucesso.</response>
        /// <response code="401">Usuário ou senha inválidos.</response>
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login(LoginRequest login)
        {
            var resultado = _authService.Login(login);

            if (!resultado.Sucesso)
                return Unauthorized(resultado.Mensagem);

            return Ok(new { token = resultado.Dados });
        }
    }
}