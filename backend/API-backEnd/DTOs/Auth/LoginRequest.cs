using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Auth
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress(ErrorMessage = "Email inválido")]
        [DefaultValue("admin@gmail.com")]
        public string Email { get; set; }
        [Required]
        [DefaultValue("Aa123456")]
        public string Senha { get; set; }
    }
}
