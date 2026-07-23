using API_backEnd.Enums;

namespace API_backEnd.DTOs.Termo
{
    public class TermosResponse
    {
        public int IdTermo { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAlteracao { get; set; }
        public ReferenciaTermos Referencia { get; set; }

    }
}
