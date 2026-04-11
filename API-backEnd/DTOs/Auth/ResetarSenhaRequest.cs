using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Auth
{
    public class ResetarSenhaRequest
    {
        [Required]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email {  get; set; }
        [Required]
        public string Codigo { get; set; }
        [Required]
        public string SenhaNova { get; set; }
        [Required]
        public string ConfirmarSenha { get; set; }
    }
}
