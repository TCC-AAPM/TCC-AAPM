using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs
{
    public class LoginDTO
    {
        [Required]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }
        [Required]
        public string Senha { get; set; }
    }
}
