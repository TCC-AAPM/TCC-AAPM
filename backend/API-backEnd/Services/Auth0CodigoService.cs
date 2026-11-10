
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using API_backEnd.Models;

namespace API_backEnd.Services
{
    public class Auth0CodigoService
    {
        private readonly AapmContext _db;

        public Auth0CodigoService(AapmContext db)
        {
            _db = db;
        }


        public async Task<string> GerarCodigoAsync(string auth0Id, string email)
        {
            if (string.IsNullOrWhiteSpace(auth0Id))
                throw new ArgumentException("Auth0Id não pode ser vazio.");

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("E-mail não pode ser vazio.");

            var codigoBytes = RandomNumberGenerator.GetBytes(32);

            var codigo = Convert.ToBase64String(codigoBytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .Replace("=", "");

            var agora = DateTime.UtcNow;

            var registro = new TabelaAuth0Codigo
            {
                CodigoHash = GerarHash(codigo),
                Auth0Id = auth0Id,
                Email = email,
                Expiracao = agora.AddMinutes(2),
                Usado = false,
                CriadoEm = agora
            };

            _db.TabelaAuth0Codigos.Add(registro);

            await _db.SaveChangesAsync();

            return codigo;
        }


        public async Task<TabelaAuth0Codigo?> ValidarCodigoAsync(string codigo)
        {
            if (string.IsNullOrWhiteSpace(codigo))
                return null;

            var codigoHash = GerarHash(codigo);

            var registro = await _db.TabelaAuth0Codigos
                .FirstOrDefaultAsync(c =>
                    c.CodigoHash == codigoHash &&
                    !c.Usado &&
                    c.Expiracao > DateTime.UtcNow);

            return registro;
        }


        public async Task<bool> MarcarComoUsadoAsync(TabelaAuth0Codigo registro)
        {
            var agora = DateTime.UtcNow;

            var linhasAtualizadas = await _db.TabelaAuth0Codigos
                .Where(c =>
                    c.Id == registro.Id &&
                    !c.Usado &&
                    c.Expiracao > agora)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(c => c.Usado, true));

            return linhasAtualizadas == 1;
        }


        private static string GerarHash(string codigo)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(codigo));
            return Convert.ToHexString(bytes);
        }
    }
}
