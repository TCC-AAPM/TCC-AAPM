using API_backEnd.DTOs;
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
                .Select(c => new CursoResponseDTO
                {
                    Id = c.Id,
                    Nome = c.Nome
                }).ToList();

            return Ok(cursos);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("criar-curso")]
        public IActionResult CriarCurso(CursoCreateDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var nome = dto.Nome.Trim().ToUpper();
            var existe = db.TabelaCursos.Any(c => c.Nome.ToLower() == nome);

            if(existe)
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
        [HttpDelete("{IdCurso}")]
        public IActionResult DeletarCurso(int IdCurso) 
        {
            var curso = db.TabelaCursos.FirstOrDefault(c => c.Id == IdCurso);

            if (curso == null)
            {
                NotFound("Curso não encontrado");
            }
            
            curso.IsAtivo = false;
            db.SaveChanges();
            return Ok("Curso deletado com sucesso");
        }

        // editar Curso ?
    }
}
