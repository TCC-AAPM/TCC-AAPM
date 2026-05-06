using API_backEnd.DTOs.Auth;
using API_backEnd.Models;
using API_backEnd.Services;
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
        [HttpPost]
        public IActionResult VerificarEmail(ConfirmarEmailRequest dto)
        {
            return Resultado(_emailService.VerificarEmail(dto));
        }

        [HttpPost("verificar-codigo")]
        public IActionResult VerificarCodigo(VerificarCodigoRequest dto)
        {
            return Resultado(_emailService.VerificarCodigo(dto));
        }


        [HttpPost("resetar-senha")]
        public IActionResult ResetarSenha(ResetarSenhaRequest dto)
        {
            return Resultado(_emailService.ResetarSenha(dto));
        }

    }
}
