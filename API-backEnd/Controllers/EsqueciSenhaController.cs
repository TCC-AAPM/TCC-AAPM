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
        /// Verifica se o email informado possui cadastro no sistema
        /// </summary>
        [AllowAnonymous]
        [HttpPost]
        public IActionResult VerificarEmail(ConfirmarEmailRequest dto)
        {
            return Resultado(_emailService.VerificarEmail(dto));
        }

        /// <summary>
        /// Valida o código de recuperação de senha
        /// </summary>
        [AllowAnonymous]
        [HttpPost("verificar-codigo")]
        public IActionResult VerificarCodigo(VerificarCodigoRequest dto)
        {
            return Resultado(_emailService.VerificarCodigo(dto));
        }

        /// <summary>
        /// Redefine a senha do usuário
        /// </summary>
        [AllowAnonymous]
        [HttpPost("resetar-senha")]
        public IActionResult ResetarSenha(ResetarSenhaRequest dto)
        {
            return Resultado(_emailService.ResetarSenha(dto));
        }

    }
}
