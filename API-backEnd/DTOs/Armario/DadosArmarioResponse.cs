using API_backEnd.Enums;

namespace API_backEnd.DTOs.Armario
{
    public class DadosArmarioResponse
    {
        public int NumeroArmario { get; set; }
        public EstadoArmario Estado {  get; set; }
        public string? Observacao { get; set; }
    }
}
