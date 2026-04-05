using API_backEnd.Enums;
using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs
{
    public class TurmaCreateDTO
    {
        [Required(ErrorMessage = "Digite o nome da turma")]
        public string NomeTurma { get; set; }
        [Required(ErrorMessage = "Digite ao id do curso que a turma pertence")]
        public int IdCurso { get; set; }
        [Required(ErrorMessage = "Coloque o periodo da turma")]
        public PeriodoTurma Periodo { get; set; }
        [Required(ErrorMessage = "Coloque o semestre que a curso começou")]
        public Semestre SemestreInicio { get; set; }
        //public short? AnoInicio { get; set; }
    }
}
