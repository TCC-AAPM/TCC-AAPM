using API_backEnd.Models;

namespace API_backEnd.Common
{
    public class ResultadoValidacaoTermo
    {
        public bool Erro {  get; set; }
        public string? Mensagem { get; set; }
        public TabelaTermo? Termo { get; set; }
    }
}
