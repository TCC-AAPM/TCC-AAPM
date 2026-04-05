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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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

        [Authorize(Roles = "aluno")]
        [HttpPost("deletar-conta")]
        public IActionResult DeletarConta(ConfirmarSenhaDTO dto)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userId, out int id))
            {
                return BadRequest("ID inválido");
            }

            var usuario = db.TabelaUsuarios.FirstOrDefault(a => a.Id == id);

            if (usuario == null) {
                return NotFound("Usuário não encontrado");
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha))
            {
                return Unauthorized("Senha incorreta");
            }

            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.IdUsuario == id);

            if (aluno == null)
            {
                return NotFound("Aluno não encontrado");
            }

            using var transaction = db.Database.BeginTransaction();
            try
            {
                var reserva = db.TabelaReservaArmarios.FirstOrDefault(r => r.IdAluno == aluno.Id && r.IsAtivo);
                if (reserva != null)
                {
                    var armario = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == reserva.IdArmario);
                    
                    if (armario != null)
                    {
                        armario.Observacao = $"O aluno {aluno.Nome} excluiu a conta";
                        armario.Estado = "P";
                    }

                    reserva.IsAtivo = false;
                }

                
                
                aluno.IsAtivo = false;
                usuario.IsAtivo = false;

                db.SaveChanges();

                transaction.Commit();

                return Ok("Conta deletada");
            }
            catch
            {
                transaction.Rollback();
                return StatusCode(500, "Erro ao deletar conta");
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("buscar-por-cpf")]
        public IActionResult BuscarPorCPF(BuscarAlunoPorCpfDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Cpf == dto.CPF);

            if (aluno == null)
            {
                return NotFound("Aluno não encontrado");
            }
            var dados = new DadosRecadastroDTO
            {
                Nome = aluno.Nome,
                Telefone = aluno.Telefone,
                Email = aluno.Email,
                Matricula = aluno.Matricula,
                IdCurso = aluno.CursoId,
                IdTurma = aluno.TurmaId
            };

            return Ok(dados);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("historico-reserva")]
        public IActionResult HistoricoReserva()
        {
            var dados =
            (
                from r in db.TabelaReservaArmarios
                join a in db.TabelaAlunos on r.IdAluno equals a.Id
                select new DadosHistoricoDTO
                {
                    Nome = a.Nome,
                    CPF = a.Cpf,
                    NumeroArmario = r.IdArmario,
                    IsAtivo = r.IsAtivo
                }
            );
            return Ok(dados);
        }
    }
}
