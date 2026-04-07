using API_backEnd.Enums;
using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Turma
{
    public class EditarTurmaRequest
    {
        [Required]
        public string NomeTurma { get; set; }
        [Required]
        public int IdCurso { get; set; }
        [Required]
        public PeriodoTurma Periodo { get; set; }
        [Required]
        public Semestre SemestreInicio { get; set; }
    }
}
