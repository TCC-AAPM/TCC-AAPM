using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Termo
{
    public class AceitarTermoRequest
    {
        [Required]
        public int IdTermo { get; set; }
    }
}
