using API_backEnd.DTOs;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArmariosController : ControllerBase
    {
        private readonly AapmContext db;
        public ArmariosController(AapmContext context)
        {
            db = context;
        }

        // buscar todos os armarios
        [Authorize(Roles = "admin")]
        [HttpGet]
        public IActionResult Get()
        {
            var armarios = db.TabelaArmarios.ToList();
            if (!armarios.Any())
            {
                return NoContent();
            }
            return Ok(armarios);
        }

        // buscar armario por Id
        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var armarioId = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == id);
            if (armarioId == null)
            {
                return NotFound();
            }
            return Ok(armarioId);
        }

        // buscar armario com reserva
        [Authorize(Roles = "admin")]
        [HttpGet("com-reserva")]
        public IActionResult GetAlunosComReserva()
        {
            var config = db.ConfigReservas.FirstOrDefault();
            if (config == null)
            {
                return NotFound("Configuração não encontrada");
            }
            var data = config.DataExpiracaoGlobal;
            var dados = (
            from r in db.TabelaReservaArmarios
            join a in db.TabelaAlunos on r.IdAluno equals a.Id
            join ar in db.TabelaArmarios on r.IdArmario equals ar.NumeroArmario
            join c in db.TabelaCursos on a.CursoId equals c.Id
            join t in db.TabelaTurmas on a.TurmaId equals t.Id
            join p in db.TabelaPagamentos on a.Id equals p.IdAluno
            where r.IsAtivo == 1
            select new AlunoReservaDTO
            {
                NomeAluno = a.Nome,
                NumeroArmario = ar.NumeroArmario,
                Telefone = a.Telefone,
                CPF = a.Cpf,
                Email = a.Email,
                Curso = c.Nome,
                Turma = t.Turma,
                Pagamento = p.Metodo,
                DataExpiracao = data
            }
            ).ToList();

            if (!dados.Any())
            {
                return NoContent(); // 204
            }
            return Ok(dados);
        }


    }
}
