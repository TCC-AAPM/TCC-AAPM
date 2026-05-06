using API_backEnd.Common;
using API_backEnd.DTOs.Auth;
using API_backEnd.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API_backEnd.Services
{
    public class AuthService
    {
        private readonly AapmContext db;
        private readonly IConfiguration _config;

        public AuthService(AapmContext context, IConfiguration config)
        {
            db = context;
            _config = config;
        }

        public ResultadoPadrao<string> Login(LoginRequest login)
        {
            var admin = db.TabelaAdmins.FirstOrDefault(a => a.Email == login.Email && a.IsAtivo);

            TabelaUsuario usuario = null;
            string role = null;

            if (admin != null)
            {
                usuario = db.TabelaUsuarios.FirstOrDefault(u => u.Id == admin.IdUsuario && u.IsAtivo);
                role = "admin";
            }
            else
            {
                var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Email == login.Email && a.IsAtivo);

                if (aluno != null)
                {
                    usuario = db.TabelaUsuarios.FirstOrDefault(u => u.Id == aluno.IdUsuario && u.IsAtivo);
                    role = "aluno";
                }
            }

            if (usuario == null)
                return ResultadoPadrao<string>.Falha("Email ou senha inválidos");

            if (!BCrypt.Net.BCrypt.Verify(login.Senha, usuario.Senha))
                return ResultadoPadrao<string>.Falha("Email ou senha inválidos");

            var token = GerarToken(usuario.Id, role);

            return ResultadoPadrao<string>.Ok(token);
        }


        private string GerarToken(int idUsuario, string role) 
        {
            var claims = new List<Claim> {
                        new Claim(ClaimTypes.NameIdentifier, idUsuario.ToString()),
                        new Claim(ClaimTypes.Role, role)
                    };
            var key = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.UtcNow.AddDays(7),
                    signingCredentials: creds
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return tokenString;
        }
    }
}
