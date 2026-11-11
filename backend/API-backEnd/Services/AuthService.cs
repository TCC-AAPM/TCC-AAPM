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
        private readonly CadastroService _cadastroService;
        private readonly Auth0CodigoService _auth0CodigoService;
        public AuthService(AapmContext context, IConfiguration config, CadastroService cadastroService, Auth0CodigoService auth0CodigoService)
        {
            db = context;
            _config = config;
            _cadastroService = cadastroService;
            _auth0CodigoService = auth0CodigoService;
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
            var email = user.FindFirst("email")?.Value;
            var emailVerificado = user.FindFirst("email_verified")?.Value;

            if (string.IsNullOrWhiteSpace(auth0Id))
                return ResultadoPadrao<LoginGoogleResponse>.Falha(
                    "Identificador Auth0 não encontrado.", 401);

            if (string.IsNullOrWhiteSpace(email))
                return ResultadoPadrao<LoginGoogleResponse>.Falha(
                    "E-mail não encontrado.", 401);

            if (!bool.TryParse(emailVerificado, out var verificado) || !verificado)
                return ResultadoPadrao<LoginGoogleResponse>.Falha(
                    "É necessário utilizar uma conta Google com e-mail verificado.", 403);

            // Primeiro procura pelo Auth0Id
            var usuario = db.TabelaUsuarios
                .FirstOrDefault(u => u.Auth0Id == auth0Id);


            // Se não encontrar, procura pelo e-mail
            if (usuario == null)
            {
                var alunoEncontrado = db.TabelaAlunos
                    .FirstOrDefault(a => a.Email == email);

                if (alunoEncontrado != null)
                {
                    usuario = db.TabelaUsuarios
                        .FirstOrDefault(u => u.Id == alunoEncontrado.IdUsuario);
                }
            }

            if (usuario == null)
            {
                return ResultadoPadrao<LoginGoogleResponse>.Ok(
                    new LoginGoogleResponse
                    {
                        CadastroCompleto = false,
                        Token = null,
                        Mensagem = "É necessário completar o cadastro."
                    });
            }

            if (!usuario.IsAtivo)
                return ResultadoPadrao<LoginGoogleResponse>.Falha(
                    "Usuário inativo.", 403);

            var aluno = db.TabelaAlunos
                .FirstOrDefault(a => a.IdUsuario == usuario.Id && a.IsAtivo);

            if (aluno == null)
                return ResultadoPadrao<LoginGoogleResponse>.Falha(
                    "Acesso permitido somente para alunos ativos.", 403);

            Console.WriteLine($"Auth0 ID: {auth0Id}");
            Console.WriteLine($"Email Google: {email}");
            Console.WriteLine($"Usuário encontrado: {usuario != null}");
            Console.WriteLine($"Aluno encontrado: {aluno != null}");

            // Vincula o Auth0Id se ainda não existir
            if (string.IsNullOrWhiteSpace(usuario.Auth0Id))
            {
                usuario.Auth0Id = auth0Id;
                db.SaveChanges();
            }
            else if (usuario.Auth0Id != auth0Id)
            {
                return ResultadoPadrao<LoginGoogleResponse>.Falha(
                    "Esta conta já está vinculada a outro login Google.", 409);
            }

            return ResultadoPadrao<LoginGoogleResponse>.Ok(
                new LoginGoogleResponse
                {
                    CadastroCompleto = true,
                    Token = null,
                    Mensagem = "Login validado com sucesso."
                });
        }



        public ResultadoPadrao<string> GerarTokenGoogle(string auth0Id)
        {
            if (string.IsNullOrWhiteSpace(auth0Id))
                return ResultadoPadrao<string>.Falha(
                    "Identificador Auth0 inválido.", 401);

            var usuario = db.TabelaUsuarios
                .FirstOrDefault(u => u.Auth0Id == auth0Id);

            if (usuario == null || !usuario.IsAtivo)
                return ResultadoPadrao<string>.Falha(
                    "Usuário não encontrado ou inativo.", 403);

            var aluno = db.TabelaAlunos
                .FirstOrDefault(a => a.IdUsuario == usuario.Id && a.IsAtivo);

            if (aluno == null)
                return ResultadoPadrao<string>.Falha(
                    "Acesso permitido somente para alunos ativos.", 403);

            var token = GerarToken(usuario.Id, "aluno");

            return ResultadoPadrao<string>.Ok(token);
        }



        public async Task<ResultadoPadrao<string>> CompletarCadastroGoogle(
            CompletarCadastroGoogleRequest request)
        {
            // Validar código temporário
            var registro = await _auth0CodigoService.ValidarCodigoAsync(
                request.Codigo
            );

            if (registro == null)
                return ResultadoPadrao<string>.Falha(
                    "Código inválido ou expirado.", 401);

            // Consumir código
            var consumido = await _auth0CodigoService.MarcarComoUsadoAsync(
                registro
            );

            if (!consumido)
                return ResultadoPadrao<string>.Falha(
                    "Código já utilizado ou expirado.", 401);

            // Realizar cadastro
            var cadastro = await _cadastroService.CadastroAlunoGoogle(
                request.Cadastro,
                registro.Auth0Id,
                registro.Email
            );

            if (!cadastro.Sucesso)
                return ResultadoPadrao<string>.Falha(
                    cadastro.Mensagem,
                    cadastro.StatusCode
                );

            // Gerar JWT
            return GerarTokenGoogle(registro.Auth0Id);
        }
    


    }
}
