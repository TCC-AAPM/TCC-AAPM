using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Curso
{
    public class CursoRequest
    {
        [Required(ErrorMessage = "Digite o nome do curso")]
        public string Nome { get; set; }
    }
}
