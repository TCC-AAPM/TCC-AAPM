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
        /// Retorna todos os armários ativos.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem acessar esta rota.
        /// </remarks>
        /// <response code="200">Armários retornados com sucesso.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        [Authorize(Roles = "admin")]
        [HttpGet]
        public IActionResult BuscarArmario()
        {
            return Resultado(_armarioService.BuscarArmariosAtivos());
        }

        /// <summary>
        /// Busca um armário pelo número.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem acessar esta rota.
        /// </remarks>
        /// <param name="numeroArmario">
        /// Número do armário que será buscado.
        /// </param>
        /// <response code="200">Armário encontrado com sucesso.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Armário não encontrado.</response>
        [Authorize(Roles = "admin")]
        [HttpGet("{numeroArmario}")]
        public IActionResult BuscarArmarioPeloNumero(int numeroArmario)
        {
            return Resultado(_armarioService.BuscarArmarioPeloNumero(numeroArmario));
        }

        /// <summary>
        /// Retorna os armários filtrados pelo estado.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem acessar esta rota.
        /// </remarks>
        /// <param name="estado">
        /// Estado utilizado para filtrar os armários.
        /// </param>
        /// <response code="200">Armários retornados com sucesso.</response>
        /// <response code="400">Estado informado inválido.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        [Authorize(Roles = "admin")]
        [HttpGet("estado")]
        public IActionResult BuscarArmarioPeloEstado(EstadoArmario estado)
        {
            return Resultado(_armarioService.BuscarArmarioPeloEstado(estado));
        }

        /// <summary>
        /// Cria um novo armário.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para criação do armário.
        /// </param>
        /// <response code="200">Armário criado com sucesso.</response>
        /// <response code="400">Dados inválidos ou armário já existente.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarArmario(CriarArmarioRequest dto)
        {
            return Resultado(_armarioService.CriarArmario(dto));
        }

        /// <summary>
        /// Atualiza o estado de um armário.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="numeroArmario">
        /// Número do armário que será atualizado.
        /// </param>
        /// <param name="dto">
        /// Novo estado do armário.
        /// </param>
        /// <response code="200">Estado do armário atualizado com sucesso.</response>
        /// <response code="400">Dados inválidos.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Armário não encontrado.</response>
        [Authorize(Roles = "admin")]
        [HttpPut("estado/{numeroArmario}")]
        public IActionResult MudarEstadoArmario(int numeroArmario, AtualizarEstadoArmarioRequest dto)
        {
            return Resultado(_armarioService.MudarEstadoArmario(numeroArmario, dto));
        }

        /// <summary>
        /// Remove um armário.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="numeroArmario">
        /// Número do armário que será removido.
        /// </param>
        /// <response code="200">Armário removido com sucesso.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Armário não encontrado.</response>
        [Authorize(Roles = "admin")]
        [HttpDelete("{numeroArmario}")]
        public IActionResult DeletarArmario(int numeroArmario)
        {
            return Resultado(_armarioService.DeletarArmario(numeroArmario));
        }
    }
}