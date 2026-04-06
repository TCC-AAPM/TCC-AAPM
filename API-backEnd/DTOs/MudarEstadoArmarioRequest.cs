using API_backEnd.Enums;
using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs
{
    public class MudarEstadoArmarioRequest
    {
        [Required]
        public EstadoArmario Estado { get; set; }
        public string? Observacao { get; set; }
    }
}
