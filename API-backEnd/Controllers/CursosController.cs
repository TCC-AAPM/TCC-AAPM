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
    public class CursosController : BaseController
    {
        private readonly CursoService _cursoService;
        public CursosController(CursoService cursoService)
        {
            _cursoService = cursoService;
        }

        [HttpGet]
        public IActionResult BuscarCursosAtivos()
        {
            return Resultado(_cursoService.BuscarCursoAtivo());

        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarCurso(CursoRequest dto)
        {
            return Resultado(_cursoService.CriarCurso(dto));
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{idCurso}")]
        public IActionResult DeletarCurso(int idCurso)
        {
            return Resultado(_cursoService.DeletarCurso(idCurso));
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{idCurso}")]
        public IActionResult EditarCurso(int idCurso, CursoRequest dto)
        {
            return Resultado(_cursoService.EditarCurso(idCurso, dto));
        }
    }
}
