using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Admin
{
    public class CriarAdminRequest
    {
        [DefaultValue("Administrador AAPM")]
        [Required(ErrorMessage = "Nome é obrigatório")]
        public string Nome { get; set; }

        [DefaultValue("Administrador")]
        public string? NomeSocial { get; set; }

        [DefaultValue("administrador@gmail.com")]
        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }

        [DefaultValue("11999999999")]
        [Required]
        [RegularExpression(@"^\d{10,11}$", ErrorMessage = "Telefone deve ter 10 ou 11 dígitos")]
        public string Telefone { get; set; }

        [DefaultValue("12345678900")]
        [Required(ErrorMessage = "CPF é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve ter 11 dígitos")]
        public string CPF { get; set; }

        [DefaultValue("2000-01-01")]
        [Required]
        public DateOnly DataNasc { get; set;  }

        [Required]
        public int idTermoSite { get; set; }

        [Required]
        public bool aceitouTermoSite { get; set; }
        
    }
}
