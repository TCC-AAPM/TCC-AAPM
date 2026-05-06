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
    public class TermoController : ControllerBase
    {
        private readonly TermoService _termoService;
        private readonly UsuarioService _usuarioService;
        public TermoController( TermoService termoService, UsuarioService usuarioService)
        {
            _termoService = termoService;
            _usuarioService = usuarioService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("criar-termo")]
        public async Task<IActionResult> CriarTermo([FromForm] CriarTermoRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var resultado = await _termoService.CriarTermo(dto);

            if(!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);
            
            return Ok(resultado.Mensagem);
        }

        [HttpGet("obter-pdf")]
        public IActionResult ObterPdf(ReferenciaTermos referencia)
        {
            var resultado = _termoService.ObterCaminhoPdf(referencia);

            if (!resultado.Sucesso)
                return NotFound(resultado.Mensagem);

            return PhysicalFile(resultado.Dados, "application/pdf");
        }


        [Authorize]
        [HttpGet("verificar-termos-aceito")]
        public IActionResult VerificarTermosAceito()
        {
            var id = _usuarioService.ObterIdUsuarioLogado();

            var resultado = _termoService.ObterStatusTermos(id);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Dados);
        }

        [Authorize]
        [HttpPost("aceitar-novos-termos")]
        public IActionResult AceitarTermos(AceitarTermoRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var id = _usuarioService.ObterIdUsuarioLogado();
            
            var aceiteTermo = _termoService.AceitarTermo(id, dto.IdTermo);
            if (!aceiteTermo.Sucesso)
                return BadRequest(aceiteTermo.Mensagem);

            return Ok(aceiteTermo.Mensagem);

        }
                
    }   
}
