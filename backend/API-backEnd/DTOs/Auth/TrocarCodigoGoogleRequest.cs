using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Auth
{
    public class TrocarCodigoGoogleRequest
    {
        [Required(ErrorMessage = "O código é obrigatório.")]
        public string Codigo { get; set; } = string.Empty;
    }
}
