using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace API_backEnd.Services
{
    public class UsuarioService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UsuarioService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public int ObterIdUsuarioLogado()
        {
            
            var user = _httpContextAccessor.HttpContext?.User;

            var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;


            if (!int.TryParse(userId, out int id))
                throw new Exception("Usuário não autenticado ou ID inválido");

            return id;
        }
    }
}
