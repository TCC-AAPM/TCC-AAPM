using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Auth
{
    public class VerificarCodigoRequest
    {
        [Required]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }
        [Required]
        public string Codigo { get; set; }
    }
}
