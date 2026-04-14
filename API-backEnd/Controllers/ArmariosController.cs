using API_backEnd.DTOs.Aluno;
using API_backEnd.DTOs.Armario;
using API_backEnd.Enums;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var armarioId = db.TabelaArmarios.FirstOrDefault(a => a.NumeroArmario == id && a.IsAtivo);
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
            where r.IsAtivo && a.IsAtivo
            select new AlunoComReservaResponse
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

        // buscar armario pelo estado
        [Authorize(Roles = "admin")]
        [HttpGet("buscar-por-estado")]
        public IActionResult GetArmarioEstado(EstadoArmario estado)
        {
            var armarios = db.TabelaArmarios.Where(a => a.Estado == estado.ToString() && a.IsAtivo).ToList();

            return Ok(armarios);
        }

        // criar um novo armario
        [Authorize(Roles = "admin")]
        [HttpPost("criar-armario")]
        public IActionResult CriarArmario(CriarArmarioRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.NumeroArmario <= 0)
            {
                return BadRequest("Número do armário deve ser maior que zero.");
            }

            var armarioExiste = db.TabelaArmarios.SingleOrDefault(a => a.NumeroArmario == dto.NumeroArmario);

            if (armarioExiste != null && armarioExiste.IsAtivo)
            {
                return BadRequest("Armario ja existe");
            }

            if (armarioExiste != null && !armarioExiste.IsAtivo)
            {
                armarioExiste.IsAtivo = true;
                armarioExiste.Estado = dto.Estado.ToString();
                armarioExiste.Observacao = string.IsNullOrWhiteSpace(dto.Observacao)
                    ? null
                    : dto.Observacao;
            }
            else
            {
                var armario = new TabelaArmario
                {
                    NumeroArmario = dto.NumeroArmario,
                    Estado = dto.Estado.ToString(),
                    Observacao = string.IsNullOrWhiteSpace(dto.Observacao) ? null : dto.Observacao
                };


                db.TabelaArmarios.Add(armario);
            }
            db.SaveChanges();

            return Ok("Armário criado com sucesso.");

        }

        // transferir o aluno de armario
        [Authorize(Roles = "admin")]
        [HttpPost("transferir")]
        public IActionResult TransferirAlunoArmario(TransferirAlunoArmarioRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.NumeroArmarioAtual == dto.NumeroArmarioNovo)
            {
                return BadRequest("Escolha um armario diferente do atual");
            }

            var armarioReservaAtual = db.TabelaReservaArmarios.FirstOrDefault(a => a.IdArmario == dto.NumeroArmarioAtual && a.IsAtivo);

            if (armarioReservaAtual == null)
            {
                return NotFound("Reserva nao encontrada");
            }

            var armarioAtual = db.TabelaArmarios.SingleOrDefault(a => a.NumeroArmario == armarioReservaAtual.IdArmario);

            if (armarioAtual == null)
            {
                return NotFound("Armario não encontrado");
            }

            var armarioNovo = db.TabelaArmarios.SingleOrDefault(a => a.NumeroArmario == dto.NumeroArmarioNovo);

            if (armarioNovo == null)
            {
                return NotFound("Armario nao existe");
            }

            if (armarioNovo.Estado == EstadoArmario.O.ToString() || armarioNovo.Estado == EstadoArmario.M.ToString())
            {
                return BadRequest("armario em manutencao ou ocupado");
            }

            //mudar para o armario novo e o estado
            armarioReservaAtual.IdArmario = armarioNovo.NumeroArmario;
            armarioNovo.Estado = EstadoArmario.O.ToString();

            //mudar o estado do armario antigo e colocar a obs
            armarioAtual.Estado = EstadoArmario.M.ToString();
            armarioAtual.Observacao = string.IsNullOrWhiteSpace(dto.Observacao) ? null : dto.Observacao;



            db.SaveChanges();

            return Ok();
        }

        // deletar um armario
        [Authorize(Roles = "admin")]
        [HttpDelete("{numeroArmario}")]
        public IActionResult DeletarArmario(int numeroArmario)
        {
            var armario = db.TabelaArmarios.SingleOrDefault(a => a.NumeroArmario == numeroArmario);

            if (armario == null || armario.IsAtivo == false)
            {
                return NotFound("Armário não encontrado ou já desativado.");
            }

            armario.IsAtivo = false;

            db.SaveChanges();
            return Ok();
        }

        // mudar o estado do armario
        [Authorize(Roles = "admin")]
        [HttpPut("estado/{numeroArmario}")]
        public IActionResult MudarEstadoArmario(int numeroArmario, AtualizarEstadoArmarioRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var armarioExiste = db.TabelaArmarios.SingleOrDefault(a => a.NumeroArmario == numeroArmario);

            if (armarioExiste == null)
            {
                return NotFound("Armário não encontrado");
            }

            if (armarioExiste.Estado == dto.Estado.ToString())
            {
                return BadRequest("Tem que mudar para um estado diferente");
            }

            if (armarioExiste.Estado == EstadoArmario.O.ToString())
            {
                return BadRequest("O armário esta ocupado");
            }


            armarioExiste.Estado = dto.Estado.ToString();
            armarioExiste.Observacao = string.IsNullOrWhiteSpace(dto.Observacao) ? null : dto.Observacao;

            db.SaveChanges();

            return Ok("Estado do armário atualizado com sucesso.");
        }

    }
}
