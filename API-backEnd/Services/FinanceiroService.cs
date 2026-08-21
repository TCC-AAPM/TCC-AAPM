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


        public ResultadoPadrao<LucroMensalResponse> TotalMensal()
        {
            var hoje = DateTime.Now;

            var inicioMes = new DateTime(hoje.Year, hoje.Month, 1);
            var inicioProximoMes = inicioMes.AddMonths(1);

            var total = db.TabelaPagamentos.Where(a => a.DataPagamento >= inicioMes && a.DataPagamento <= inicioProximoMes).Sum(a => a.Preco);

            var response = new LucroMensalResponse
            {
                Valor = total
            };
            return ResultadoPadrao<LucroMensalResponse>.Ok(response);
        }

        public ResultadoPadrao<LucroMensalResponse> Total()
        {
            var total = db.TabelaPagamentos.Sum(a => a.Preco);

            var response = new LucroMensalResponse
            {
                Valor = total
            };

            return ResultadoPadrao<LucroMensalResponse>.Ok(response);
        }

        public ResultadoPadrao<List<LucroMensalResponse>> LucroUltimo6Meses()
        {
            var hoje = DateTime.Now;

            var inicio = new DateTime(hoje.Year, hoje.Month, 1).AddMonths(-5);

            var pagamentos = db.TabelaPagamentos.Where(p => p.DataPagamento >= inicio).ToList();

            var resultado = Enumerable.Range(0, 6)
                .Select(i =>
                {
                    var data = inicio.AddMonths(i);

                    var valor = pagamentos.Where(p => p.DataPagamento.Year == data.Year && p.DataPagamento.Month == data.Month).Sum(p => p.Preco);

                    return new LucroMensalResponse
                    {
                        Mes = data.ToString("MM/yyyy"),
                        Valor = valor
                    };
                }).ToList();

            return ResultadoPadrao<List<LucroMensalResponse>>.Ok(resultado);
        }
    }
}
