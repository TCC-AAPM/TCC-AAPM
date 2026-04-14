using API_backEnd.DTOs;
using API_backEnd.DTOs.Curso;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CursosController : ControllerBase
    {
        private readonly AapmContext db;
        public CursosController(AapmContext context)
        {
            db = context;
        }

        [HttpGet]
        public IActionResult GetCurso()
        {
            var cursos = db.TabelaCursos.Where(c => c.IsAtivo)
                .Select(c => new CursoResponse
                {
                    Id = c.Id,
                    Nome = c.Nome
                }).ToList();

            return Ok(cursos);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("criar-curso")]
        public IActionResult CriarCurso(CursoRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var nome = dto.Nome.Trim().ToUpper();
            var existe = db.TabelaCursos.Any(c => c.Nome.ToLower() == nome);

            if (existe)
            {
                return BadRequest("Curso ja existe");
            }
            var cursoNew = new TabelaCurso
            {
                Nome = dto.Nome.Trim()
            };
            db.TabelaCursos.Add(cursoNew);
            db.SaveChanges();
            return Ok("Curso criado com sucesso");
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{idCurso}")]
        public IActionResult DeletarCurso(int idCurso)
        {
            var curso = db.TabelaCursos.FirstOrDefault(c => c.Id == idCurso);

            if (curso == null)
            {
                NotFound("Curso não encontrado");
            }

            curso.IsAtivo = false;
            db.SaveChanges();
            return Ok("Curso deletado com sucesso");
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{idCurso}")]
        public IActionResult EditarCurso(int idCurso, CursoRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var curso = db.TabelaCursos.FirstOrDefault(c => c.Id == idCurso);

            if (curso == null)
            {
                return NotFound("Curso não encontrado");
            }

            curso.Nome = dto.Nome.Trim();
            db.SaveChanges();
            return Ok("Curso editado com sucesso");
        }
    }
}
