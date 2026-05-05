using API_backEnd.Common;
using API_backEnd.DTOs.Reserva;
using API_backEnd.Enums;
using API_backEnd.Models;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservasController : ControllerBase
    {
        private readonly AapmContext db;
        private readonly TermoService _termoService;
        private readonly CadastroService _cadastroService;
        public ReservasController(AapmContext context, TermoService termoService, CadastroService cadastroService)
        {
            db = context;
            _termoService = termoService;
            _cadastroService = cadastroService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CadastroCompleto(CriarCadastroArmarioRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var resultado = _cadastroService.CadastrarReservaArmario(dto);

            if(resultado.Erro)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
            
        }

        [Authorize(Roles = "admin")]
        [HttpPost("recadastrar")]
        public IActionResult RecadastroReserva(RecadastrarReservaRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var resultado = _cadastroService.RecadastrarReserva(dto);

            if (resultado.Erro)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
        }

        // fazer o service de pre cadastro
        [HttpPost("pre-cadastro")]
        public IActionResult PreCadastro(PreCadastroRequest dto)
        {
            // validar o aceite do termo site com service
            var termoSiteResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.S, dto.IdTermoSite, dto.AceitouTermoSite);

            if (termoSiteResultado.Erro)
                return BadRequest(termoSiteResultado.Mensagem);

            var termoArmarioResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.A, dto.IdTermoArmario, dto.AceitouTermoArmario);

            if (termoArmarioResultado.Erro)
                return BadRequest(termoArmarioResultado.Mensagem);

            
            return Ok();
        }
      
    }
}
