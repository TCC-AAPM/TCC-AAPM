using API_backEnd.Enums;
using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Armario
{
    public class CriarArmarioRequest
    {
        [Required]
        public int NumeroArmario { get; set; }
        [Required]
        public EstadoArmario Estado { get; set; }
        public string? Observacao { get; set; }
    }
}
