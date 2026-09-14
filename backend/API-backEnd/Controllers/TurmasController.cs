using API_backEnd.DTOs.Turma;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurmasController : BaseController
    {
        private readonly TurmaService _turmaService;

        public TurmasController(TurmaService turmaService)
        {
            _turmaService = turmaService;
        }

        /// <summary>
        /// Retorna todas as turmas ativas.
        /// </summary>
        /// <remarks>
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <response code="200">Turmas retornadas com sucesso.</response>
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetTurma()
        {
            return Resultado(_turmaService.BuscarTurmasAtivas());
        }

        /// <summary>
        /// Retorna as turmas vinculadas a um curso.
        /// </summary>
        /// <remarks>
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <param name="idCurso">
        /// Identificador do curso utilizado para busca das turmas.
        /// </param>
        /// <response code="200">Turmas retornadas com sucesso.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="404">Curso não encontrado.</response>
        [AllowAnonymous]
        [HttpGet("por-curso/{idCurso}")]
        public IActionResult GetTurmaPorCurso(int idCurso)
        {
            return Resultado(_turmaService.BuscarTurmaPeloCurso(idCurso));
        }

        /// <summary>
        /// Cria uma nova turma.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para criação da turma.
        /// </param>
        /// <response code="200">Turma criada com sucesso.</response>
        /// <response code="400">Dados inválidos ou turma já existente.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarTurma(CriarTurmaRequest dto)
        {
            return Resultado(_turmaService.CriarTurma(dto));
        }

        /// <summary>
        /// Remove uma turma.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="IdTurma">
        /// Identificador da turma que será removida.
        /// </param>
        /// <response code="200">Turma removida com sucesso.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Turma não encontrada.</response>
        [Authorize(Roles = "admin")]
        [HttpDelete("{IdTurma}")]
        public IActionResult DeletarTurma(int IdTurma)
        {
            return Resultado(_turmaService.DeletarTurma(IdTurma));
        }

        /// <summary>
        /// Atualiza os dados de uma turma.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="id">
        /// Identificador da turma que será atualizada.
        /// </param>
        /// <param name="dto">
        /// Novos dados da turma.
        /// </param>
        /// <response code="200">Turma atualizada com sucesso.</response>
        /// <response code="400">Dados inválidos.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Turma não encontrada.</response>
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult EditarTurma(int id, EditarTurmaRequest dto)
        {
            return Resultado(_turmaService.EditarTurma(id, dto));
        }
    }
}
