using API_backEnd.DTOs;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlunosController : ControllerBase
    {
        private readonly AapmContext db;
        private static readonly Regex SenhaRegex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$");
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

        [Authorize(Roles ="aluno")]
        [HttpPut("trocar-senha")]
        public IActionResult TrocarSenha(TrocarSenhaDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.SenhaAtual) || string.IsNullOrWhiteSpace(dto.SenhaNova) || string.IsNullOrWhiteSpace(dto.ConfirmarSenha))
            {
                return BadRequest("Preencha todos os campos");
            }

            if (dto.SenhaNova != dto.ConfirmarSenha)
            {
                return BadRequest("As senhas não coincidem");
            }

            if (!SenhaRegex.IsMatch(dto.SenhaNova))
            {
                return BadRequest("A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula e número");
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized("userId nao encontrado");
            }

            if (!int.TryParse(userId, out int id))
            {
                return BadRequest("ID inválido");
            }

            var aluno = db.TabelaUsuarios.SingleOrDefault(a => a.Id == id);

            if (aluno == null)
            {
                return NotFound("Aluno nao encontrado");
            }

            if(!BCrypt.Net.BCrypt.Verify(dto.SenhaAtual, aluno.Senha)){
                return BadRequest("senha atual incorreta");
            }

            if(BCrypt.Net.BCrypt.Verify(dto.SenhaNova, aluno.Senha))
            {
                return BadRequest("A senha nova tem que ser diferente da antiga");
            }

            

            aluno.Senha = BCrypt.Net.BCrypt.HashPassword(dto.SenhaNova);
            db.SaveChanges();

            return Ok("Senha atualizada com sucesso");
        }

        [Authorize(Roles ="aluno")]
        [HttpDelete("deletar-conta")]
        public IActionResult DeletarConta()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userId, out int id))
            {
                return Unauthorized("ID inválido");
            }

            var aluno = db.TabelaUsuarios.SingleOrDefault(a => a.Id == id);

            if (aluno == null) {
                return NotFound("Aluno não encontrado");
            }

            aluno.IsAtivo = 0;

            db.SaveChanges();

            return Ok("Conta deletada");
        }
    }
}
