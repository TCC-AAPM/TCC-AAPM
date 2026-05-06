using API_backEnd.DTOs;
using API_backEnd.DTOs.Admin;
using API_backEnd.DTOs.Auth;
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
    public class AdminController : ControllerBase
    {
        private readonly AapmContext db;
        private static readonly Regex SenhaRegex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$");
        public AdminController(AapmContext context)
        {
            db = context;
        }

        [Authorize(Roles = "admin")]
        [HttpGet("me")]
        public IActionResult GetAdmin()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userId, out int id))
            {
                return BadRequest("ID inválido");
            }

            var admin = db.TabelaAdmins.FirstOrDefault(a => a.IdUsuario == id && a.IsAtivo);

            if (admin == null)
            {
                NotFound("Admin não encontrado");
            }

            var dadosAdmin = new AdminLogadoResponse
            {
                Nome = admin.Nome,
                Email = admin.Email,
                Telefone = admin.Telefone,
                CPF = admin.Cpf
            };

            return Ok(dadosAdmin);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarAdmin(CriarAdminRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var adminExiste = db.TabelaAdmins.Any(a => a.Cpf == dto.CPF && a.IsAtivo);

            if (adminExiste)
            {
                return BadRequest("CPF ja cadastrado como admin");
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

                var admin = new TabelaAdmin
                {
                    Nome = dto.Nome,
                    Email = dto.Email,
                    Telefone = dto.Telefone,
                    Cpf = dto.CPF,
                    IdUsuario = usuario.Id
                };

                db.TabelaAdmins.Add(admin);
                db.SaveChanges();

                transaction.Commit();

                return Ok("Admin criado com sucesso");
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return BadRequest(ex.Message);
            }

        }

        [Authorize(Roles = "admin")]
        [HttpPost("{id}/excluir")]
        public IActionResult DeletarAdmin(int id, ConfirmarSenhaRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userId, out int idUsuario))
            {
                return BadRequest("ID inválido");
            }



            var usuarioLogado = db.TabelaUsuarios.FirstOrDefault(u => u.Id == idUsuario);

            if (usuarioLogado == null)
            {
                return Unauthorized("Usuário logado não encontrado");
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Senha, usuarioLogado.Senha))
            {
                return Unauthorized("Senha incorreta");
            }


            var admin = db.TabelaAdmins.FirstOrDefault(a => a.Id == id && a.IsAtivo);
            var usuarioAdmin = db.TabelaUsuarios.FirstOrDefault(u => u.Id == admin.IdUsuario);

            if (admin == null && usuarioAdmin == null)
            {
                return NotFound("Admin não encontrado");
            }

            if (admin.IdUsuario == usuarioLogado.Id)
            {
                return BadRequest("Você não pode excluir a si mesmo");
            }

            usuarioAdmin.IsAtivo = false;
            admin.IsAtivo = false;
            db.SaveChanges();
            return Ok("Admin excluído com sucesso");
        }
    }
}
