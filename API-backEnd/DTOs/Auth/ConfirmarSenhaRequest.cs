using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Auth
{
    public class ConfirmarSenhaRequest
    {
        [Required]
        public string Senha { get; set; }
    }
}
