using API_backEnd.Common;
using API_backEnd.DTOs.Aluno;
using API_backEnd.DTOs.Armario;
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
    public class ReservasController : BaseController
    {
        private readonly ReservaService _reservaService;
        public ReservasController(ReservaService reservaService)
        {           
            _reservaService = reservaService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("cadastro-armario")]
        public IActionResult CadastroReservaArmarioCompleto(CriarCadastroArmarioRequest dto)
        {
            return Resultado(_reservaService.CadastrarReservaArmario(dto));
        }

        [Authorize(Roles = "admin")]
        [HttpPost("recadastrar-armario")]
        public IActionResult RecadastroReserva(RecadastrarReservaRequest dto)
        {
            return Resultado(_reservaService.RecadastrarReserva(dto));
        }

        
        [Authorize(Roles = "admin")]
        [HttpGet("historico-reserva")]
        public IActionResult HistoricoReserva()
        {
            return Resultado(_reservaService.HistoricoReserva());
        }

        // buscar armario com reserva
        [Authorize(Roles = "admin")]
        [HttpGet("com-reserva")]
        public IActionResult BuscarAlunosComReserva()
        {
            return Resultado(_reservaService.AlunosComReservaAtiva());
        }
       
        // transferir o aluno de armario
        [Authorize(Roles = "admin")]
        [HttpPost("transferir")]
        public IActionResult TransferirAlunoArmario(TransferirAlunoArmarioRequest dto)
        {
            return Resultado(_reservaService.TransferirAlunoDeArmario(dto));
        }
    }
}
