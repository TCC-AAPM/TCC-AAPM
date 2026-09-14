namespace API_backEnd.DTOs.Admin
{
    public class AdminResponse
    {
        public string Nome { get; set; }
        public string? NomeSocial { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string CPF { get; set; }
        public DateOnly DataNasc { get; set; }
    }
}
