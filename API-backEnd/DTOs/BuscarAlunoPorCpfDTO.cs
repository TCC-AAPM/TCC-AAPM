using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs
{
    public class BuscarAlunoPorCpfDTO
    {
        [Required(ErrorMessage = "CPF é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve ter 11 dígitos")]
        public string CPF { get; set; }
    }
}
