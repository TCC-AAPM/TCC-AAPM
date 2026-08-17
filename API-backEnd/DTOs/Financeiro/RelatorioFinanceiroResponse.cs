using API_backEnd.Enums;

namespace API_backEnd.DTOs.Financeiro
{
    public class RelatorioFinanceiroResponse
    {
        public string Nome { get; set; }
        public CategoriaProduto Produto { get; set; }
        public string Pagamento { get; set; }
        public DateTime Data {  get; set; }
        public double Valor { get; set; }
    }
}
