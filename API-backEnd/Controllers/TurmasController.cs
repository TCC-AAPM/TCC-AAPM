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
    public class TurmasController : ControllerBase
    {
        private readonly TurmaService _turmaService;
        public TurmasController( TurmaService turmaService)
        {
            _turmaService = turmaService;
        }

        [HttpGet]
        public IActionResult GetTurma()
        {
            var resultado = _turmaService.BuscarTurmasAtivas();

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);
            
            return Ok(resultado.Dados);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("por-curso/{idCurso}")]
        public IActionResult GetTurmaPorCurso(int idCurso)
        {
            var resultado = _turmaService.BuscarTurmaPeloCurso(idCurso);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Dados);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarTurma(CriarTurmaRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var resultado = _turmaService.CriarTurma(dto);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
        }

        // deletar turma
        [Authorize(Roles = "admin")]
        [HttpDelete("{IdTurma}")]
        public IActionResult DeletarTurma(int IdTurma)
        {
            var resultado = _turmaService.DeletarTurma(IdTurma);

            if (!resultado.Sucesso)
                return NotFound(resultado.Mensagem);

            return Ok(resultado.Mensagem);
        }


        // editar turma ?
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult EditarTurma(int id, EditarTurmaRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var resultado = _turmaService.EditarTurma(id, dto);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
        }
    }
}
