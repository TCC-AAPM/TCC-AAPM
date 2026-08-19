using API_backEnd.Common;
using API_backEnd.DTOs.Financeiro;
using API_backEnd.Models;

namespace API_backEnd.Services
{
    public class FinanceiroService
    {
        private readonly AapmContext db;

        public FinanceiroService(AapmContext db)
        {
            this.db = db;
        }

        public ResultadoPadrao<List<RelatorioFinanceiroResponse>> RelatorioFinanceiro()
        {

            var relatorio = db.TabelaPagamentos.Select(a => new RelatorioFinanceiroResponse
            {
                Nome = a.IdAlunoNavigation.Nome,
                Metodo = a.Metodo,
                Data = a.DataPagamento,
                Preco = a.Preco
               
            }).OrderByDescending(v => v.Data).ToList();

            return ResultadoPadrao<List<RelatorioFinanceiroResponse>>.Ok(relatorio);
        }


        public ResultadoPadrao<ValorResponse> TotalMensal()
        {
            var hoje = DateTime.Now;

            var inicioMes = new DateTime(hoje.Year, hoje.Month, 1);
            var inicioProximoMes = inicioMes.AddMonths(1);

            var total = db.TabelaPagamentos.Where(a => a.DataPagamento >= inicioMes && a.DataPagamento <= inicioProximoMes).Sum(a => a.Preco);

            var response = new ValorResponse
            {
                Valor = total
            };
            return ResultadoPadrao<ValorResponse>.Ok(response);
        }

        public ResultadoPadrao<ValorResponse> Total()
        {
            var total = db.TabelaPagamentos.Sum(a => a.Preco);

            var response = new ValorResponse
            {
                Valor = total
            };

            return ResultadoPadrao<ValorResponse>.Ok(response);
        }
    }
}
