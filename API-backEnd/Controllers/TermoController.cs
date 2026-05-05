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
        private readonly AapmContext db;
        private readonly TermoService _termoService;
        private readonly UsuarioService _usuarioService;
        public TermoController(AapmContext context, TermoService termoService, UsuarioService usuarioService)
        {
            db = context;
            _termoService = termoService;
            _usuarioService = usuarioService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CriarTermo([FromForm] CriarTermoRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var resultado = await _termoService.CriarTermo(dto);

            if(resultado.Erro)
                return BadRequest(resultado.Mensagem);
            
            return Ok(resultado.Mensagem);
        }

        [HttpGet("termo-pdf")]
        public IActionResult ObterPdf(ReferenciaTermos referencia)
        {
            var termo = db.TabelaTermos
                .FirstOrDefault(t => t.Referencia == referencia && t.IsAtivo);

            if (termo == null)
                return NotFound("Termo não encontrado");

            var caminhoFisico = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                termo.CaminhoPdf.TrimStart('/')
            );

            if (!System.IO.File.Exists(caminhoFisico))
                return NotFound("Arquivo não encontrado");

            return PhysicalFile(caminhoFisico, "application/pdf");
        }


        [Authorize]
        [HttpGet("verificar-termos-aceito")]
        public IActionResult VerificarTermosAceito()
        {
            var id = _usuarioService.ObterIdUsuarioLogado();

            return Ok(_termoService.ObterStatusTermos(id));
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
            if (aceiteTermo.Erro)
                return BadRequest(aceiteTermo.Mensagem);
            db.SaveChanges();
            return Ok();

        }
                
    }   
}
