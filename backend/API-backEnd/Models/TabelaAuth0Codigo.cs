
namespace API_backEnd.Models
{
    public class TabelaAuth0Codigo
    {
        public int Id { get; set; }

        public string CodigoHash { get; set; } = string.Empty;

        public string Auth0Id { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public DateTime Expiracao { get; set; }

        public bool Usado { get; set; } = false;

        public DateTime CriadoEm { get; set; }
    }
}
