using API_backEnd.DTOs;
using API_backEnd.Enums;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;

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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var ocupado = db.TabelaReservaArmarios.Any(r => r.IdArmario == dto.IdArmario && r.IsAtivo == true);

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
                    Telefone = Regex.Replace(dto.Telefone, @"\D", ""),
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
                    IdProduto = (int)TipoProduto.Armario,
                    Metodo = dto.MetodoPagamento,
                    
                };

                db.TabelaPagamentos.Add(pagamento);

                var reserva = new TabelaReservaArmario
                {
                    IdAluno = aluno.Id,
                    IdArmario = dto.IdArmario,
                    IsAtivo = true
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

        [Authorize(Roles = "admin")]
        [HttpPost("recadastrar")]
        public IActionResult RecadastroReserva(RecadastrarReservaRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            using var transaction = db.Database.BeginTransaction();
            try
            {               
                var aluno = db.TabelaAlunos.SingleOrDefault(a => a.Cpf == dto.CPF);

                if (aluno == null)
                {
                    return NotFound("Aluno não encontrado");
                }
                var reservaAtiva = db.TabelaReservaArmarios.FirstOrDefault(r => r.IdAluno == aluno.Id && r.IsAtivo);
                if (reservaAtiva != null)
                {
                    return BadRequest("Reserva já existe");
                }


                aluno.Nome = dto.Nome;
                aluno.Telefone = Regex.Replace(dto.Telefone, @"\D", "");
                aluno.Email = dto.Email;
                aluno.Matricula = dto.Matricula;
                aluno.CursoId = dto.IdCurso;
                aluno.TurmaId = dto.IdTurma;

                var ocupado = db.TabelaReservaArmarios.Any(r => r.IdArmario == dto.IdArmario && r.IsAtivo);

                if (ocupado)
                {
                    return BadRequest("Armário já está ocupado");
                }

                var reserva = new TabelaReservaArmario
                {
                    IdAluno = aluno.Id,
                    IdArmario = dto.IdArmario,
                    IsAtivo = true
                };

                db.TabelaReservaArmarios.Add(reserva);

                var pagamento = new TabelaPagamento
                {
                    IdAluno = aluno.Id,
                    IdProduto = (int)TipoProduto.Armario,
                    Metodo = dto.MetodoPagamento,
                };

                db.TabelaPagamentos.Add(pagamento);


                db.SaveChanges();
                transaction.Commit();
                return Ok("Recadastro feito");
            }
            catch (Exception ex) 
            {
                transaction.Rollback();
                return BadRequest(ex.Message);
            }
        }

        
    }
}
