using API_backEnd.Common;
using API_backEnd.DTOs.Auth;
using API_backEnd.Models;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EsqueciSenhaController : BaseController
    {
        private readonly EmailService _emailService;

        public EsqueciSenhaController(EmailService emailService)
        {
            _emailService = emailService;
        }

        /// <summary>
        /// Verifica se o e-mail informado possui cadastro no sistema.
        /// </summary>
        /// <remarks>
        /// Caso o e-mail exista, um código de recuperação será enviado.
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <param name="dto">
        /// E-mail utilizado para recuperação de senha.
        /// </param>
        /// <response code="200">Código enviado com sucesso.</response>
        /// <response code="400">E-mail inválido ou não cadastrado.</response>
        [AllowAnonymous]
        [HttpPost]
        public IActionResult VerificarEmail(ConfirmarEmailRequest dto)
        {
            return Resultado(_emailService.VerificarEmail(dto));
        }

        /// <summary>
        /// Valida o código de recuperação de senha.
        /// </summary>
        /// <remarks>
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para validação do código.
        /// </param>
        /// <response code="200">Código validado com sucesso.</response>
        /// <response code="400">Código inválido ou expirado.</response>
        [AllowAnonymous]
        [HttpPost("verificar-codigo")]
        public IActionResult VerificarCodigo(VerificarCodigoRequest dto)
        {
            return Resultado(_emailService.VerificarCodigo(dto));
        }

        /// <summary>
        /// Redefine a senha do usuário.
        /// </summary>
        /// <remarks>
        /// Necessário informar um código de recuperação válido.
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para redefinição da senha.
        /// </param>
        /// <response code="200">Senha redefinida com sucesso.</response>
        /// <response code="400">Código inválido, expirado ou dados incorretos.</response>
        [AllowAnonymous]
        [HttpPost("resetar-senha")]
        public IActionResult ResetarSenha(ResetarSenhaRequest dto)
        {
            return Resultado(_emailService.ResetarSenha(dto));
        }

        [HttpPost("reenviar-codigo-recuperacao")]
        public ResultadoPadrao<object> ReenviarCodigoRecuperacao(ConfirmarEmailRequest dto)
        {
            return _emailService.ReenviarCodigoRecuperacao(dto);
        }
    }
}