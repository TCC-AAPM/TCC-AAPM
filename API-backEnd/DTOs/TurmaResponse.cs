using API_backEnd.Enums;

namespace API_backEnd.DTOs
{
    public class TurmaResponse
    {
        public int IdTurma { get; set; }
        public string? NomeTurma { get; set; }
        public int IdCurso { get; set; }
        public PeriodoTurma Periodo {  get; set; }
        public Semestre SemestreInicio { get; set; }
        //public short? AnoInicio { get; set; }
    }
}
