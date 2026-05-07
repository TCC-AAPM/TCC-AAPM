using API_backEnd.DTOs;
using API_backEnd.DTOs.Curso;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CursosController : BaseController
    {
        private readonly CursoService _cursoService;

        public CursosController(CursoService cursoService)
        {
            _cursoService = cursoService;
        }

        /// <summary>
        /// Retorna todos os cursos ativos.
        /// </summary>
        /// <remarks>
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <response code="200">Cursos retornados com sucesso.</response>
        [AllowAnonymous]
        [HttpGet]
        public IActionResult BuscarCursosAtivos()
        {
            return Resultado(_cursoService.BuscarCursoAtivo());
        }

        /// <summary>
        /// Cria um novo curso.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para criação do curso.
        /// </param>
        /// <response code="200">Curso criado com sucesso.</response>
        /// <response code="400">Dados inválidos ou curso já existente.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarCurso(CursoRequest dto)
        {
            return Resultado(_cursoService.CriarCurso(dto));
        }

        /// <summary>
        /// Atualiza os dados de um curso.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="idCurso">
        /// Identificador do curso que será atualizado.
        /// </param>
        /// <param name="dto">
        /// Novos dados do curso.
        /// </param>
        /// <response code="200">Curso atualizado com sucesso.</response>
        /// <response code="400">Dados inválidos.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Curso não encontrado.</response>
        [Authorize(Roles = "admin")]
        [HttpPut("{idCurso}")]
        public IActionResult EditarCurso(int idCurso, CursoRequest dto)
        {
            return Resultado(_cursoService.EditarCurso(idCurso, dto));
        }

        /// <summary>
        /// Remove um curso.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="idCurso">
        /// Identificador do curso que será removido.
        /// </param>
        /// <response code="200">Curso removido com sucesso.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Curso não encontrado.</response>
        [Authorize(Roles = "admin")]
        [HttpDelete("{idCurso}")]
        public IActionResult DeletarCurso(int idCurso)
        {
            return Resultado(_cursoService.DeletarCurso(idCurso));
        }
    }
}