using API_backEnd.DTOs;
using API_backEnd.DTOs.Curso;
using API_backEnd.DTOs.Turma;
using API_backEnd.Enums;
using API_backEnd.Models;
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
        private readonly AapmContext db;
        public TurmasController(AapmContext context)
        {
            db = context;
        }

        [HttpGet]
        public IActionResult GetTurma()
        {
            var turmas = db.TabelaTurmas
                .Where(c => c.IsAtivo)
                .AsEnumerable()
                .Select(c => new TurmaResponse
                {
                    IdTurma = c.Id,
                    NomeTurma = c.Turma,
                    IdCurso = c.CursoId,
                    Periodo = (PeriodoTurma)Enum.Parse(typeof(PeriodoTurma), c.Periodo),
                    SemestreInicio = c.SemestreInicio
                });

            return Ok(turmas);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("por-curso/{idCurso}")]
        public IActionResult GetTurmaPorCurso(int idCurso)
        {
            var turmas = db.TabelaTurmas
                .Where(t => t.CursoId == idCurso && t.IsAtivo)
                .Select(t => new TurmaPorCursoResponse
                {
                    NomeCurso = t.Curso.Nome,
                    NomeTurma = t.Turma
                }).ToList();

            return Ok(turmas);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarTurma(CriarTurmaRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var nome = dto.NomeTurma.Trim().ToUpper();


            var existe = db.TabelaTurmas.Any(t => t.Turma.ToUpper() == nome);

            if (existe)
            {
                return BadRequest("Turma ja existe");
            }

            var turmaNew = new TabelaTurma
            {
                Turma = dto.NomeTurma,
                CursoId = dto.IdCurso,
                Periodo = dto.Periodo.ToString(),
                SemestreInicio = dto.SemestreInicio
            };

            db.TabelaTurmas.Add(turmaNew);
            db.SaveChanges();
            return Ok("Turma criada com sucesso");
        }

        // deletar turma
        [Authorize(Roles = "admin")]
        [HttpDelete("{IdTurma}")]
        public IActionResult DeletarTurma(int IdTurma)
        {
            var turma = db.TabelaTurmas.SingleOrDefault(t => t.Id == IdTurma);

            if (turma == null)
            {
                return NotFound("Turma não encontrada");
            }

            turma.IsAtivo = false;
            db.SaveChanges();

            return Ok("Turma deletada com sucesso");
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
            var turma = db.TabelaTurmas.SingleOrDefault(t => t.Id == id);

            if (turma == null)
            {
                return NotFound("Turma não encontrado");
            }
            var cursoExiste = db.TabelaCursos.Any(c => c.Id == dto.IdCurso);

            if (!cursoExiste)
            {
                return BadRequest("Curso inválido");
            }

            turma.Turma = dto.NomeTurma;
            turma.CursoId = dto.IdCurso;
            turma.Periodo = dto.Periodo.ToString();
            turma.SemestreInicio = dto.SemestreInicio;
            db.SaveChanges();

            return Ok("Turma editada com sucesso");
        }
    }
}
