using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs
{
    public class RecadastrarReservaDTO
    {
        [Required(ErrorMessage = "CPF é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve ter 11 dígitos")]
        public string CPF { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Telefone é obrigatório")]
        [RegularExpression(@"^\d{10,11}$", ErrorMessage = "Telefone deve ter 10 ou 11 dígitos")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }
        public string? Matricula { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Curso inválido")]
        public int IdCurso { get; set; }
        public int IdTurma { get; set; }    
        [Required]
        public string MetodoPagamento { get; set; }
        [Required]
        public int IdArmario { get; set; }
    }
}
