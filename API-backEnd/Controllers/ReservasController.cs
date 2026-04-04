using API_backEnd.DTOs;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservasController : ControllerBase
    {
        private readonly AapmContext db;
        public ReservasController(AapmContext context)
        {
            db = context;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CadastroCompleto(CriarReservaDTO dto)
        {
            var ocupado = db.TabelaReservaArmarios.Any(r => r.IdArmario == dto.IdArmario && r.IsAtivo == 1);

            if (ocupado)
            {
                return BadRequest("Armário  já está ocupado");
            }

            var alunoExiste = db.TabelaAlunos.Any(a => a.Cpf == dto.CPF);

            if (alunoExiste)
            {
                return BadRequest("Aluno já cadastrado");
            }
            using var transaction = db.Database.BeginTransaction();

            try
            {
                var usuario = new TabelaUsuario
                {
                    Senha = BCrypt.Net.BCrypt.HashPassword(dto.CPF)
                };

                db.TabelaUsuarios.Add(usuario);
                db.SaveChanges();

                int idUsuario = usuario.Id;

                var aluno = new TabelaAluno
                {
                    Cpf = dto.CPF,
                    Nome = dto.Nome,
                    Matricula = dto.Matricula,
                    Telefone = dto.Telefone,
                    Email = dto.Email,
                    CursoId = dto.IdCurso,
                    TurmaId = dto.IdTurma,
                    IdUsuario = idUsuario
                };

                db.TabelaAlunos.Add(aluno);
                db.SaveChanges();

                var pagamento = new TabelaPagamento
                {
                    IdAluno = aluno.Id,
                    Metodo = dto.MetodoPagamento,
                    //Motivo = "A" //armario
                };

                db.TabelaPagamentos.Add(pagamento);

                var reserva = new TabelaReservaArmario
                {
                    IdAluno = aluno.Id,
                    IdArmario = dto.IdArmario,
                    IsAtivo = 1
                };
                db.TabelaReservaArmarios.Add(reserva);
                db.SaveChanges();
                transaction.Commit();
                return Ok(new
                {
                    mensagem = "Cadastro realizado com sucesso",
                    alunoId = aluno.Id
                });
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return BadRequest(ex.Message);
            }
        }
    }
}
