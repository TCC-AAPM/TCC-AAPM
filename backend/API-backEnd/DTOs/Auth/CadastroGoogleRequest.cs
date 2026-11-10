using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Auth
{
    public class CadastroGoogleRequest
    {
        [Required]
        [StringLength(11, MinimumLength = 11)]
        public string CPF { get; set; }

        [Required]
        public string Nome { get; set; }

        public string? NomeSocial { get; set; }

        [Required]
        [RegularExpression(@"^\d{10,11}$")]
        public string Telefone { get; set; }

        public string? Matricula { get; set; }

        [Required]
        public DateOnly DataNasc { get; set; }

        [Required]
        public int IdCurso { get; set; }

        public int IdTurma { get; set; }

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
