using API_backEnd.Common;
using API_backEnd.DTOs.Auth;
using API_backEnd.Models;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace API_backEnd.Services
{
    public class UsuarioService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private static readonly Regex SenhaRegex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$");
        private readonly AapmContext db;
        public UsuarioService(IHttpContextAccessor httpContextAccessor, AapmContext db)
        {
            _httpContextAccessor = httpContextAccessor;
            this.db = db;
        }
        public int ObterIdUsuarioLogado()
        {
            
            var user = _httpContextAccessor.HttpContext?.User;

            var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;


            if (!int.TryParse(userId, out int id))
                throw new Exception("Usuário não autenticado ou ID inválido");

            return id;
        }

        public ResultadoPadrao<object> TrocarSenha(TrocarSenhaRequest dto)
        {
            var id = ObterIdUsuarioLogado();

            var usuario = db.TabelaUsuarios.FirstOrDefault(u => u.Id == id && u.IsAtivo);

            if (usuario == null)
            {
                return ResultadoPadrao<object>.Falha("Usuário não encontrado");
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.SenhaAtual, usuario.Senha))
            {
                return ResultadoPadrao<object>.Falha("Senha atual incorreta");
            }

            if (BCrypt.Net.BCrypt.Verify(dto.SenhaNova, usuario.Senha))
            {
                return ResultadoPadrao<object>.Falha("A senha nova tem que ser diferente da antiga");
            }

            if (!SenhaRegex.IsMatch(dto.SenhaNova))
            {
                return ResultadoPadrao<object>.Falha("A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula e número");
            }

            if (dto.SenhaNova != dto.ConfirmarSenha)
            {
                return ResultadoPadrao<object>.Falha("As senhas não coincidem");
            }

            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(dto.SenhaNova);
            db.SaveChanges();

            return ResultadoPadrao<object>.Ok(mensagem: "Senha atualizada com sucesso");
        }
    }
}
