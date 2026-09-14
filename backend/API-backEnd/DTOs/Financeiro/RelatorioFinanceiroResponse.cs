using API_backEnd.Enums;

namespace API_backEnd.DTOs.Financeiro
{
    public class RelatorioFinanceiroResponse
    {
        public string Nome { get; set; }
        public string Metodo { get; set; }
        public DateTime Data {  get; set; }
        public decimal Preco { get; set; }
    }
}
