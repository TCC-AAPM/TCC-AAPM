using API_backEnd.DTOs;
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
        public IActionResult Login(LoginDTO login)
        {
            var admin = db.TabelaAdmins.FirstOrDefault(a => a.Email == login.Email);

            if (admin != null)
            {
                var usuario = db.TabelaUsuarios.FirstOrDefault(a => a.Id == admin.IdUsuario);
                if (usuario == null)
                {
                    return Unauthorized();
                }

                if (BCrypt.Net.BCrypt.Verify(login.Senha, usuario.Senha))
                {
                    var claims = new List<Claim> {
                        new Claim("Id", admin.IdUsuario.ToString()),
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
                var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Email == login.Email);
                if (aluno != null)
                {
                    var usuario = db.TabelaUsuarios.FirstOrDefault(a => a.Id == aluno.IdUsuario);
                    if(usuario == null)
                    {
                        return Unauthorized(); 
                    }

                    if(BCrypt.Net.BCrypt.Verify(login.Senha, usuario.Senha))
                    {
                        var claims = new List<Claim> {
                        new Claim("Id", aluno.IdUsuario.ToString()),
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

        [Authorize]
        [HttpGet("Teste")]
        public IActionResult Teste()
        {
            return Ok("Acesso Liberado");
        }
    }
}
