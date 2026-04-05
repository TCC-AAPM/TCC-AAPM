using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs
{
    public class TrocarSenhaDTO
    {
        [Required]
        public string SenhaAtual { get; set; }
        [Required]
        public string SenhaNova { get; set; }
        [Required]
        public string ConfirmarSenha { get; set; }
    }
}
