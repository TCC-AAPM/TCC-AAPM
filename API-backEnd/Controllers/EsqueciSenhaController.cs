using API_backEnd.DTOs.Auth;
using API_backEnd.Models;
using API_backEnd.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EsqueciSenhaController : ControllerBase
    {
        private readonly EmailService email;
        private readonly AapmContext db;
        private static readonly Regex SenhaRegex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$");


        public EsqueciSenhaController(AapmContext context, EmailService emailService)
        {
            db = context;
            email = emailService;
        }
        [HttpPost]
        public IActionResult VerificarEmail(ConfirmarEmailRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Email == dto.Email);
            var admin = db.TabelaAdmins.FirstOrDefault(a => a.Email == dto.Email);

            if (aluno != null || admin != null)
            {
                var codigo = new Random().Next(100000, 999999).ToString();
                
                var dados = new TabelaVerificacao
                {
                    Email = dto.Email,
                    Codigo = codigo,
                    Expiracao = DateTime.UtcNow.AddMinutes(15)
                };

                db.TabelaVerificacaos.Add(dados);
                email.EnviarCodigoRecuperacao(dto.Email, codigo);
                db.SaveChanges();
            }
                return Ok("Se o email existir, enviaremos instruções...");


        }

        [HttpPost("verificar-codigo")]
        public IActionResult VerificarCodigo(VerificarCodigoRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var codigo = db.TabelaVerificacaos.FirstOrDefault(v => v.Email == dto.Email && v.Codigo == dto.Codigo && v.Expiracao > DateTime.UtcNow && v.Usado == false);
            if(codigo == null)
            {
                return BadRequest("Código invalido");
            }
            return Ok("Rediricionando para outra tela...");
        }


        [HttpPost("resetar-senha")]
        public IActionResult ResetarSenha(ResetarSenhaRequest dto)
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

            var codigo = db.TabelaVerificacaos.FirstOrDefault(v => v.Codigo == dto.Codigo && v.Email == dto.Email && v.Usado == false && v.Expiracao > DateTime.UtcNow);
            if(codigo == null)
            {
                return NotFound("Código inválido ou expirado");
            }
            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Email == codigo.Email);
            var admin = db.TabelaAdmins.FirstOrDefault(a => a.Email == codigo.Email);
            int idUsuario;
            if (aluno != null)
            {
                idUsuario = aluno.IdUsuario;
            }else if(admin != null)
            {
                idUsuario = admin.IdUsuario;
            }
            else
            {
                return NotFound();
            }
            var usuario = db.TabelaUsuarios.FirstOrDefault(u => u.Id ==  idUsuario);
            if(usuario == null)
            {
                return NotFound("Usuario não encontrado");
            }
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(dto.SenhaNova);
            codigo.Usado = true;
            db.SaveChanges();
            return Ok("Senha resetada");
        }

    }
}
