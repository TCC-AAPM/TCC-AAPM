
using API_backEnd.DTOs.Armario;
using API_backEnd.Enums;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        /// <summary>
        /// Retorna todos os armários ativos
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpGet]
        public IActionResult BuscarArmario()
        {
            return Resultado(_armarioService.BuscarArmariosAtivos());
        }

        /// <summary>
        /// Busca um armário pelo número
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpGet("{numeroArmario}")]
        public IActionResult BuscarArmarioPeloNumero(int numeroArmario)
        {
            return Resultado(_armarioService.BuscarArmarioPeloNumero(numeroArmario));
        }

        /// <summary>
        /// Retorna os armários filtrados pelo estado
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpGet("estado")]
        public IActionResult BuscarArmarioPeloEstado(EstadoArmario estado)
        {
            return Resultado(_armarioService.BuscarArmarioPeloEstado(estado));
        }

        /// <summary>
        /// Cria um novo armário
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarArmario(CriarArmarioRequest dto)
        {
            return Resultado(_armarioService.CriarArmario(dto));
        }

        /// <summary>
        /// Atualiza o estado de um armário
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpPut("estado/{numeroArmario}")]
        public IActionResult MudarEstadoArmario(int numeroArmario, AtualizarEstadoArmarioRequest dto)
        {
            return Resultado(_armarioService.MudarEstadoArmario(numeroArmario, dto));
        }

        /// <summary>
        /// Remove um armário
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpDelete("{numeroArmario}")]
        public IActionResult DeletarArmario(int numeroArmario)
        {
            return Resultado(_armarioService.DeletarArmario(numeroArmario));
        }


    }
}
