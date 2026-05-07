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
        /// Retorna todos os cursos ativos
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public IActionResult BuscarCursosAtivos()
        {
            return Resultado(_cursoService.BuscarCursoAtivo());
        }

        /// <summary>
        /// Cria um novo curso
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarCurso(CursoRequest dto)
        {
            return Resultado(_cursoService.CriarCurso(dto));
        }

        /// <summary>
        /// Atualiza os dados de um curso
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpPut("{idCurso}")]
        public IActionResult EditarCurso(int idCurso, CursoRequest dto)
        {
            return Resultado(_cursoService.EditarCurso(idCurso, dto));
        }

        /// <summary>
        /// Remove um curso
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpDelete("{idCurso}")]
        public IActionResult DeletarCurso(int idCurso)
        {
            return Resultado(_cursoService.DeletarCurso(idCurso));
        }


    }
}
