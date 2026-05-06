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
        private readonly CadastroService _cadastroService;
        public ReservasController(CadastroService cadastroService)
        {
            _cadastroService = cadastroService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("cadastro-armario")]
        public IActionResult CadastroReservaArmarioCompleto(CriarCadastroArmarioRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var resultado = _cadastroService.CadastrarReservaArmario(dto);

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
            
            var resultado = _cadastroService.RecadastrarReserva(dto);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
        }

        [HttpPost("pre-cadastro")]
        public IActionResult PreCadastro(PreCadastroRequest dto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var resultado = _cadastroService.PreCadastroAluno(dto);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
        }
      
    }
}
