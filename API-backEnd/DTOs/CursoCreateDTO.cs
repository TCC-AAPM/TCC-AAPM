using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs
{
    public class CursoCreateDTO
    {
        [Required(ErrorMessage = "Digite o nome do curso")]
        public string Nome { get; set; }
    }
}
