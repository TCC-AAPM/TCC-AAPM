using API_backEnd.DTOs;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlunosController : ControllerBase
    {
        private readonly AapmContext db;

        public AlunosController(AapmContext context)
        {
            db = context;
        }

        [Authorize(Roles = "aluno")]
        [HttpGet("me")]
        public  IActionResult GetUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized("userId nao encontrado");
            }

            if (!int.TryParse(userId, out int id))
            {
                return BadRequest("ID inválido");
            }


            var config = db.ConfigReservas.FirstOrDefault();
            if (config == null)
            {
                return NotFound("Configuração não encontrada");
            }
            var data = config.DataExpiracaoGlobal;
            var dadosAluno =
            (
                from a in db.TabelaAlunos
                join t in db.TabelaTurmas on a.TurmaId equals t.Id
                join c in db.TabelaCursos on a.CursoId equals c.Id
                join tr in db.TabelaReservaArmarios on a.Id equals tr.IdAluno into reservas
                from tr in reservas.DefaultIfEmpty()
                join p in db.TabelaPagamentos on a.Id equals p.IdAluno into pagamentos
                from p in pagamentos.DefaultIfEmpty()
                where a.IdUsuario == id
                select new DadosAlunoDTO
                {
                    NumeroArmario = tr.IdArmario,
                    Nome = a.Nome,
                    CPF = a.Cpf,
                    Telefone = a.Telefone,
                    Matricula = a.Matricula,
                    Email = a.Email,
                    Turma = t.Turma,
                    Curso = c.Nome,
                    Pagamento = p.Metodo ?? "Pagamento não identificado",
                    DataExpiracao = data
                    
                }
            ).FirstOrDefault();
            if (dadosAluno == null)
            {
                return NoContent(); // 204
            }

            return Ok(dadosAluno);
        }
    }
}
