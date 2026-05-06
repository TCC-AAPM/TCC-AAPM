using API_backEnd.Common;
using API_backEnd.DTOs.Aluno;
using API_backEnd.DTOs.Armario;
using API_backEnd.Enums;
using API_backEnd.Models;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArmariosController : BaseController
    {
        private readonly ArmarioService _armarioService;
        public ArmariosController(ArmarioService armarioService)
        {
            _armarioService = armarioService;
        }

        // buscar todos os armarios
        [Authorize(Roles = "admin")]
        [HttpGet]
        public IActionResult BuscarArmario()
        {
            return Resultado(_armarioService.BuscarArmariosAtivos());
        }

        // criar um novo armario
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarArmario(CriarArmarioRequest dto)
        {
            return Resultado(_armarioService.CriarArmario(dto));
        }

        // buscar armario pelo numero dele
        [Authorize(Roles = "admin")]
        [HttpGet("{numeroArmario}")]
        public IActionResult BuscarArmarioPeloNumero(int numeroArmario)
        {
            return Resultado(_armarioService.BuscarArmarioPeloNumero(numeroArmario));
        }

        // buscar armario pelo estado
        [Authorize(Roles = "admin")]
        [HttpGet("estado")]
        public IActionResult BuscarArmarioPeloEstado(EstadoArmario estado)
        {
            return Resultado(_armarioService.BuscarArmarioPeloEstado(estado));
        }

        // deletar um armario
        [Authorize(Roles = "admin")]
        [HttpDelete("{numeroArmario}")]
        public IActionResult DeletarArmario(int numeroArmario)
        {
            return Resultado(_armarioService.DeletarArmario(numeroArmario));
        }

        // mudar o estado do armario
        [Authorize(Roles = "admin")]
        [HttpPut("estado/{numeroArmario}")]
        public IActionResult MudarEstadoArmario(int numeroArmario, AtualizarEstadoArmarioRequest dto)
        {
            return Resultado(_armarioService.MudarEstadoArmario(numeroArmario, dto));
        }
    }
}
