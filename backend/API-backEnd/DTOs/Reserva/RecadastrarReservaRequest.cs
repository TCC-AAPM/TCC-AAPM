using API_backEnd.DTOs.Aluno;
using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Reserva
{
    public class RecadastrarReservaRequest : DadosAlunoRequest 
    {
        [Required(ErrorMessage = "CPF é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve ter 11 dígitos")]
        public string CPF { get; set; }

        [Required]
        public string MetodoPagamento { get; set; }
        [Required]
        public int IdArmario { get; set; }

        
        [Required]
        public int IdTermoSite { get; set; }

        [Required]
        public bool AceitouTermoSite { get; set; }

        [Required]
        public int IdTermoArmario { get; set; }

        [Required]
        public bool AceitouTermoArmario { get; set; }
    }
}
