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
                return ResultadoPadrao<string>.Falha("Email ou senha inválidos", 401);

            if (!BCrypt.Net.BCrypt.Verify(login.Senha, usuario.Senha))
                return ResultadoPadrao<string>.Falha("Email ou senha inválidos", 401);

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

        public ResultadoPadrao<LoginGoogleResponse> LoginGoogle(ClaimsPrincipal user)
        {
            var auth0Id = user.FindFirst("sub")?.Value;

            var email = user.FindFirst("https://aapm.dev/claims/email")?.Value;
            var emailVerificado = user.FindFirst("https://aapm.dev/claims/email_verified")?.Value;

            if (string.IsNullOrWhiteSpace(auth0Id))
                return ResultadoPadrao<LoginGoogleResponse>.Falha("Identificador Auth0 não encontrado.", 401);

            if (string.IsNullOrWhiteSpace(email))
                return ResultadoPadrao<LoginGoogleResponse>.Falha("E-mail não encontrado.", 401);

            if (!bool.TryParse(emailVerificado, out var verificado) || !verificado)
                return ResultadoPadrao<LoginGoogleResponse>.Falha("É necessário utilizar uma conta Google com e-mail verificado", 403);


            var usuario = db.TabelaUsuarios.FirstOrDefault(u => u.Auth0Id == auth0Id);

            if(usuario != null)
            {
                if (!usuario.IsAtivo)
                    return ResultadoPadrao<LoginGoogleResponse>.Falha("Usuário inativo.", 403);

                var aluno = db.TabelaAlunos.FirstOrDefault(a => a.IdUsuario == usuario.Id && a.IsAtivo);

                if(aluno == null)
                    return ResultadoPadrao<LoginGoogleResponse>.Falha("Acesso permitido somente para alunos.", 403);

                var token = GerarToken(usuario.Id, "aluno");

                return ResultadoPadrao<LoginGoogleResponse>.Ok(new LoginGoogleResponse
                {
                    CadastroCompleto = true,
                    Token = token,
                    Mensagem = "Login realizado com sucesso."
                });                
            }

            return ResultadoPadrao<LoginGoogleResponse>.Ok(new LoginGoogleResponse 
            {
                CadastroCompleto = false,
                Token = null,
                Mensagem = "É necessário completar o cadastro."
            });
        }
    }
}
