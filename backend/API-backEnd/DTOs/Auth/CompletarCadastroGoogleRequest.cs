using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Auth
{
    public class CompletarCadastroGoogleRequest
    {
        [Required]
        public string Codigo { get; set; } = string.Empty;

        [Required]
        public CadastroGoogleRequest Cadastro { get; set; } = new();

    }
}
