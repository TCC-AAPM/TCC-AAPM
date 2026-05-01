using API_backEnd.Enums;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using API_backEnd.DTOs.Reserva;

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
        public IActionResult CadastroCompleto(CriarCadastroArmarioRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            DateOnly hoje = DateOnly.FromDateTime(DateTime.Today);
            int idade = hoje.Year - dto.DataNasc.Year;

            if (hoje < dto.DataNasc.AddYears(idade))
            {
                idade--;
            }

            if (idade < 14)
            {
                return BadRequest("Idade mínima de 14 anos.");
            }

            var termoSiteAtivo = db.TabelaTermos.FirstOrDefault(t => t.Referencia == ReferenciaTermos.S.ToString() && t.IsAtivo);

            if (termoSiteAtivo == null)
            {
                return BadRequest("Termo do site não encontrado");
            }
            if(termoSiteAtivo.Id != dto.IdTermoSite)
            {
                return BadRequest("Termo inválido");
            }
            if (dto.AceitouTermoSite == false)
            {
                return BadRequest("Precisa aceitar os termos do site");
            }

            var termoArmarioAtivo = db.TabelaTermos.FirstOrDefault(t => t.Referencia == ReferenciaTermos.A.ToString() && t.IsAtivo);
            if (termoArmarioAtivo == null)
            {
                return BadRequest("Termo do armário não encontrado");
            }
            if (termoArmarioAtivo.Id != dto.IdTermoArmario)
            {
                return BadRequest("Termo inválido");
            }
            if (dto.AceitouTermoArmario == false)
            {
                return BadRequest("Precisa aceitar os termos da reserva de armario");
            }

            var ocupado = db.TabelaReservaArmarios.Any(r => r.IdArmario == dto.IdArmario && r.IsAtivo);

            if (ocupado)
            {
                return BadRequest("Armário  já está ocupado");
            }

            var alunoExiste = db.TabelaAlunos.Any(a => a.Cpf == dto.CPF && a.IsAtivo);

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
                var termosSite = new TabelaTermosAceito
                {
                    IdTermos = termoSiteAtivo.Id,
                    IdUsuario = idUsuario,
                    DataAceito = DateTime.UtcNow,
                };

                var termosArmario = new TabelaTermosAceito
                {
                    IdTermos = termoArmarioAtivo.Id,
                    IdUsuario = idUsuario,
                    DataAceito = DateTime.UtcNow,
                };

                db.TabelaTermosAceitos.Add(termosSite);
                db.TabelaTermosAceitos.Add(termosArmario);
                var aluno = new TabelaAluno
                {
                    Cpf = dto.CPF,
                    Nome = dto.Nome,
                    NomeSocial = dto.NomeSocial,
                    DataNasc = dto.DataNasc,
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

        // d

    }
}
