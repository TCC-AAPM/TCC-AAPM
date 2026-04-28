using API_backEnd.DTOs.Auth;
using API_backEnd.DTOs.Termo;
using API_backEnd.Enums;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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


        [Authorize]
        [HttpGet("verificar-termos-aceito")]
        public IActionResult VerificarTermosAceito()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userId, out int id))
                return BadRequest("ID inválido");

            return Ok(ObterStatusTermos(id));
        }


        [Authorize]
        [HttpPost("aceitar-termos")]
        public IActionResult AceitarTermos() 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userId, out int id))
                return BadRequest("ID inválido");

            // salvar aceite aqui
            var status = ObterStatusTermos(id);

            if (!status.TermosArmario)
            {
                var aluno = db.TabelaAlunos.FirstOrDefault(a => a.IdUsuario == id && a.IsAtivo);

                if(aluno == null)
                {
                    return BadRequest("Aluno não encontrado");
                }

                var reservaAtiva = db.TabelaReservaArmarios.Any(r => r.IdAluno == aluno.Id && r.IsAtivo);

                if (reservaAtiva) 
                {
                    // aceitar os termos do armario aqui
                }
            }
            if (!status.TermosSite)
            {

            }
            return Ok();
        }

        private StatusTermosResponse ObterStatusTermos(int id)
        {
            var termosAceitoIds = db.TabelaTermosAceitos
                .Where(t => t.IdUsuario == id && t.IsAtivo)
                .Select(t => t.IdTermos)
                .ToList();

            return new StatusTermosResponse
            {
                TermosSite = db.TabelaTermos.Any(t =>
                    termosAceitoIds.Contains(t.Id) &&
                    t.Referencia == ReferenciaTermos.S.ToString() &&
                    t.IsAtivo),

                TermosArmario = db.TabelaTermos.Any(t =>
                    termosAceitoIds.Contains(t.Id) &&
                    t.Referencia == ReferenciaTermos.A.ToString() &&
                    t.IsAtivo),

                TermosEstacionamento = db.TabelaTermos.Any(t =>
                    termosAceitoIds.Contains(t.Id) &&
                    t.Referencia == ReferenciaTermos.E.ToString() &&
                    t.IsAtivo)
            };
        }
    }   
}
