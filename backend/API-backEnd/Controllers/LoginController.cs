
using API_backEnd.DTOs.Auth;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly Auth0CodigoService _auth0CodigoService;
        private readonly IConfiguration _configuration;
        public LoginController(
            AuthService authService,
            Auth0CodigoService auth0CodigoService,
            IConfiguration configuration)
        {
            _authService = authService;
            _auth0CodigoService = auth0CodigoService;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login(LoginRequest login)
        {
            var resultado = _authService.Login(login);

            if (!resultado.Sucesso)
                return Unauthorized(resultado.Mensagem);

            return Ok(new { token = resultado.Dados });
        }

        // Inicia a autenticação com Google pelo Auth0.
        [AllowAnonymous]
        [HttpGet("google")]
        public IActionResult IniciarLoginGoogle()
        {
            var apiUrl = _configuration["Auth0:ApiUrl"];

            if (string.IsNullOrWhiteSpace(apiUrl))
                return StatusCode(500, "URL pública da API não configurada.");

            var redirectUri = $"{apiUrl.TrimEnd('/')}/api/Login/google/finalizar";

            var propriedades = new AuthenticationProperties
            {
                RedirectUri = redirectUri
            };

            return Challenge(propriedades, "Auth0");
        }


        // Recebe o usuário autenticado pelo middleware Auth0.
        [Authorize(AuthenticationSchemes = "Auth0Cookie")]
        [HttpGet("google/finalizar")]
        public async Task<IActionResult> FinalizarLoginGoogle()
        {
            var resultado = _authService.LoginGoogle(User);

            if (!resultado.Sucesso || resultado.Dados == null)
            {
                await HttpContext.SignOutAsync("Auth0Cookie");

                return StatusCode(
                    resultado.StatusCode,
                    resultado.Mensagem
                );
            }

            var auth0Id = User.FindFirst("sub")?.Value;
            var email = User.FindFirst("email")?.Value;

            if (string.IsNullOrWhiteSpace(auth0Id) ||
                string.IsNullOrWhiteSpace(email))
            {
                await HttpContext.SignOutAsync("Auth0Cookie");
                return Unauthorized("Não foi possível identificar a conta Google.");
            }

            var codigo = await _auth0CodigoService.GerarCodigoAsync(
                auth0Id,
                email
            );

            await HttpContext.SignOutAsync("Auth0Cookie");

            var pagina = resultado.Dados.CadastroCompleto
                ? "https://aapm.dev/login-google-sucesso"
                : "https://aapm.dev/cadastro-google";

            return Redirect(
                $"{pagina}?code={Uri.EscapeDataString(codigo)}"
            );

        }


        [AllowAnonymous]
        [HttpPost("google/trocar-codigo")]
        public async Task<IActionResult> TrocarCodigoGoogle(
            [FromBody] TrocarCodigoGoogleRequest request)
        {
            var registro = await _auth0CodigoService.ValidarCodigoAsync(
                request.Codigo
            );

            if (registro == null)
                return Unauthorized("Código inválido ou expirado.");

            var consumido = await _auth0CodigoService.MarcarComoUsadoAsync(
                registro
            );

            if (!consumido)
                return Unauthorized("Código já utilizado ou expirado.");

            var resultado = _authService.GerarTokenGoogle(registro.Auth0Id);

            if (!resultado.Sucesso)
                return StatusCode(resultado.StatusCode, resultado.Mensagem);

            return Ok(new
            {
                token = resultado.Dados,
                mensagem = "Login realizado com sucesso."
            });
        }


        [AllowAnonymous]
        [HttpPost("google/completar-cadastro")]
        public async Task<IActionResult> CompletarCadastroGoogle([FromBody] CompletarCadastroGoogleRequest request)
        {
            var resultado = await _authService.CompletarCadastroGoogle(request);

            if (!resultado.Sucesso)
                return StatusCode(resultado.StatusCode, resultado.Mensagem);

            return Ok(new
            {
                token = resultado.Dados,
                mensagem = "Cadastro realizado com sucesso."
            });
        }
        
    }
}
