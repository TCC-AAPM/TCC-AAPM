using API_backEnd.DTOs;
using API_backEnd.DTOs.Curso;
using API_backEnd.Models;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CursosController : ControllerBase
    {
        private readonly CursoService _cursoService;
        public CursosController(CursoService cursoService)
        {
            _cursoService = cursoService;
        }

        [HttpGet]
        public IActionResult GetCurso()
        {
            var resultado = _cursoService.BuscarCursoAtivo();

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Dados);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("criar-curso")]
        public IActionResult CriarCurso(CursoRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var resultado = _cursoService.CriarCurso(dto);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{idCurso}")]
        public IActionResult DeletarCurso(int idCurso)
        {
            var resultado = _cursoService.DeletarCurso(idCurso);

            if (!resultado.Sucesso)
                return NotFound(resultado.Sucesso);

            return Ok(resultado.Mensagem);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{idCurso}")]
        public IActionResult EditarCurso(int idCurso, CursoRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var resultado = _cursoService.EditarCurso(idCurso, dto);

            if (!resultado.Sucesso)
                return NotFound(resultado.Sucesso);

            return Ok(resultado.Mensagem);
        }
    }
}
