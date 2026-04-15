using API_backEnd.Enums;
using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Termo
{
    public class CriarTermoRequest
    {
        [Required]
        public string Termos {  get; set; }
        [Required]
        public ReferenciaTermos Referencia { get; set; }

    }
}
