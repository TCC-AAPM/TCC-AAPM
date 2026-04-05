using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs
{
    public class ConfirmarSenhaDTO
    {
        [Required]
        public string Senha { get; set; }
    }
}
