using API_backEnd.DTOs;
using API_backEnd.DTOs.Curso;
using API_backEnd.DTOs.Turma;
using API_backEnd.Enums;
using API_backEnd.Models;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurmasController : BaseController
    {
        private readonly TurmaService _turmaService;
        public TurmasController( TurmaService turmaService)
        {
            _turmaService = turmaService;
        }

        /// <summary>
        /// Retorna todas as turmas ativas
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetTurma()
        {
            return Resultado(_turmaService.BuscarTurmasAtivas());
        }

        /// <summary>
        /// Retorna as turmas vinculadas a um curso
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpGet("por-curso/{idCurso}")]
        public IActionResult GetTurmaPorCurso(int idCurso)
        {
            return Resultado(_turmaService.BuscarTurmaPeloCurso(idCurso));
        }

        /// <summary>
        /// Cria uma nova turma
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarTurma(CriarTurmaRequest dto)
        {
            return Resultado(_turmaService.CriarTurma(dto));
        }

        /// <summary>
        /// Remove uma turma
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpDelete("{IdTurma}")]
        public IActionResult DeletarTurma(int IdTurma)
        {
            return Resultado(_turmaService.DeletarTurma(IdTurma));
        }

        /// <summary>
        /// Atualiza os dados de uma turma
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult EditarTurma(int id, EditarTurmaRequest dto)
        {
            return Resultado(_turmaService.EditarTurma(id, dto));
        }
    }
}
