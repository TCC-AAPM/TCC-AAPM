using API_backEnd.Models;

namespace API_backEnd.Common
{
    public class ResultadoValidacaoIdade
    {
        public bool Erro { get; set; }
        public string? Mensagem { get; set; }
        public int? Idade { get; set; }
    }
}
