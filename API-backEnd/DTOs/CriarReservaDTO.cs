using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs
{
    public class CriarReservaDTO
    {
        [Required]
        public int IdArmario { get; set; }
        [Required(ErrorMessage = "CPF é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve ter 11 dígitos")]
        public string CPF { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required]
        [RegularExpression(@"^\d{10,11}$", ErrorMessage = "Telefone deve ter 10 ou 11 dígitos")]
        public string Telefone { get; set; }
        [Required]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }
        public string? Matricula { get; set; }
        [Required]
        public int IdCurso { get; set; }
        public int IdTurma { get; set; }
        [Required]
        public string MetodoPagamento { get; set; }

    }
}
