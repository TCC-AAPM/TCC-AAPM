namespace API_backEnd.DTOs.Auth
{
    public class LoginGoogleResponse
    {
        public bool CadastroCompleto { get; set; }
        public string? Token { get; set; }
        public string Mensagem { get; set; } = string.Empty;
    }
}
