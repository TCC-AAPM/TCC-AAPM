using API_backEnd.DTOs.Auth;
using API_backEnd.DTOs.Termo;
using API_backEnd.Enums;
using API_backEnd.Models;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TermoController : BaseController
    {
        private readonly TermoService _termoService;
        private readonly UsuarioService _usuarioService;
        public TermoController( TermoService termoService, UsuarioService usuarioService)
        {
            _termoService = termoService;
            _usuarioService = usuarioService;
        }

        /// <summary>
        /// Retorna o arquivo PDF de um termo
        /// </summary>
        [AllowAnonymous]
        [HttpGet("obter-pdf")]
        public IActionResult ObterPdf(ReferenciaTermos referencia)
        {
            var resultado = _termoService.ObterCaminhoPdf(referencia);

            if (!resultado.Sucesso)
                return NotFound(resultado.Mensagem);

            return PhysicalFile(resultado.Dados, "application/pdf");
        }

        /// <summary>
        /// Verifica os termos aceitos pelo usuário autenticado
        /// </summary>
        [Authorize]
        [HttpGet("verificar-termos-aceito")]
        public IActionResult VerificarTermosAceito()
        {
            var id = _usuarioService.ObterIdUsuarioLogado();
            return Resultado(_termoService.ObterStatusTermos(id));
        }

        /// <summary>
        /// Cria um novo termo
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpPost("criar-termo")]
        public async Task<IActionResult> CriarTermo([FromForm] CriarTermoRequest dto)
        {
            return Resultado(await _termoService.CriarTermo(dto));
        }

        /// <summary>
        /// Registra o aceite de um termo pelo usuário autenticado
        /// </summary>
        [Authorize]
        [HttpPost("aceitar-novos-termos")]
        public IActionResult AceitarTermos(AceitarTermoRequest dto)
        {
            var id = _usuarioService.ObterIdUsuarioLogado();
            return Resultado(_termoService.AceitarTermo(id, dto.IdTermo));
        }

    }   
}
