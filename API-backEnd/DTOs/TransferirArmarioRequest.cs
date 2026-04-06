using API_backEnd.Enums;
using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs
{
    public class TransferirArmarioRequest
    {
        [Required]
        public int NumeroArmarioAtual { get; set; }
        [Required]
        public int NumeroArmarioNovo { get; set; }
        [Required]
        public string? Observacao { get; set; }
    }
}
