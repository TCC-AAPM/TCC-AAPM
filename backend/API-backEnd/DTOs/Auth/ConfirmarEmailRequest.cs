using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Auth
{
    public class ConfirmarEmailRequest
    {
        [Required]
        [EmailAddress(ErrorMessage = "Email inválido")]

        public string Email { get; set;  }
    }
}
