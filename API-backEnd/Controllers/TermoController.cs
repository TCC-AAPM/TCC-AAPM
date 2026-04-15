using API_backEnd.DTOs.Termo;
using API_backEnd.Enums;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TermoController : ControllerBase
    {
        private readonly AapmContext db;
        

        public TermoController(AapmContext context)
        {
            db = context;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarTermo(CriarTermoRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var termoExistente = db.TabelaTermos.FirstOrDefault(t => t.Referencia == dto.Referencia.ToString() && t.IsAtivo);
            if (termoExistente != null) 
            {
                termoExistente.IsAtivo = false;
                termoExistente.DataAlteracao = DateTime.Now;
            }
            
            var termos = new TabelaTermo
            {
                Termos = dto.Termos,
                Referencia = dto.Referencia.ToString(),
                DataCriacao = DateTime.Now,
                IsAtivo = true
            };

            db.TabelaTermos.Add(termos);
            db.SaveChanges();

            return Ok("Termo criado com sucesso");
        }

        [HttpGet]
        public IActionResult GetTermosAtivo()
        {
            var termos = db.TabelaTermos
                .AsNoTracking()
                .ToList()
                .Where(t => t.IsAtivo).Select(l => new TermoResponse
                {
                    Termos = l.Termos,
                    Referencia = Enum.TryParse<ReferenciaTermos>(l.Referencia, out var refEnum)
                    ? refEnum
                    : default
                }).ToList();
            return Ok(termos);
        }
    }   
}
