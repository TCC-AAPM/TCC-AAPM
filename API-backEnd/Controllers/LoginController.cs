using API_backEnd.DTOs.Auth;
using API_backEnd.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class LoginController : ControllerBase
    {
        private readonly AapmContext db;
        private readonly IConfiguration _config;

        public LoginController(AapmContext context, IConfiguration config)
        {
            db = context;
            _config = config;
        }
        [HttpPost]
        public IActionResult Login(LoginRequest login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var admin = db.TabelaAdmins.FirstOrDefault(a => a.Email == login.Email && a.IsAtivo);
            var termosSite = db.TabelaTermos.FirstOrDefault(t => t.Referencia == "S" && t.IsAtivo); //Termos site
            if (termosSite == null)
            {
                return BadRequest("Termo do site não encontrado");
            }
            var termosAceito = db.TabelaTermosAceitos.Any(t => t.IdTermos == termosSite.Id && t.IdUsuario == admin.IdUsuario && t.IsAtivo);
            if (!termosAceito)
            {
                return BadRequest("Termos não aceito");
            }
            if (admin != null)
            {
                var usuario = db.TabelaUsuarios.FirstOrDefault(a => a.Id == admin.IdUsuario && a.IsAtivo);
                if (usuario == null)
                {
                    return Unauthorized();
                }

                if (BCrypt.Net.BCrypt.Verify(login.Senha, usuario.Senha))
                {
                    var claims = new List<Claim> {
                        new Claim(ClaimTypes.NameIdentifier, admin.IdUsuario.ToString()),
                        new Claim(ClaimTypes.Role, "admin")
                    };
                    var key = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
                    );
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                            claims: claims,
                            expires: DateTime.Now.AddDays(7),
                            signingCredentials: creds
                    );
                    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                    return Ok(new { token = tokenString });
                }
            }
            else
            {
                var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Email == login.Email && a.IsAtivo);
                if (aluno != null)
                {
                    var usuario = db.TabelaUsuarios.FirstOrDefault(a => a.Id == aluno.IdUsuario && a.IsAtivo);
                    if (usuario == null)
                    {
                        return Unauthorized();
                    }

                    if (BCrypt.Net.BCrypt.Verify(login.Senha, usuario.Senha))
                    {
                        var claims = new List<Claim> {
                        new Claim(ClaimTypes.NameIdentifier, aluno.IdUsuario.ToString()),
                        new Claim(ClaimTypes.Role, "aluno")
                    };
                        var key = new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
                        );
                        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                        var token = new JwtSecurityToken(
                                claims: claims,
                                expires: DateTime.Now.AddDays(7),
                                signingCredentials: creds
                        );
                        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                        return Ok(new { token = tokenString });
                    }
                }
            }
            return Unauthorized();
        }

    }
}
