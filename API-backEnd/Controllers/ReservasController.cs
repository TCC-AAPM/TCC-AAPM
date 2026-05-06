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
        private readonly ReservaService _reservaService;
        public ReservasController( ReservaService reservaService)
        {           
            _reservaService = reservaService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("cadastro-armario")]
        public IActionResult CadastroReservaArmarioCompleto(CriarCadastroArmarioRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var resultado = _reservaService.CadastrarReservaArmario(dto);

            if(!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
            
        }

        [Authorize(Roles = "admin")]
        [HttpPost("recadastrar-armario")]
        public IActionResult RecadastroReserva(RecadastrarReservaRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var resultado = _reservaService.RecadastrarReserva(dto);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
        }

        

        [Authorize(Roles = "admin")]
        [HttpGet("historico-reserva")]
        public IActionResult HistoricoReserva()
        {
            var resultado = _reservaService.HistoricoReserva();

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Dados);
        }
    }
}
