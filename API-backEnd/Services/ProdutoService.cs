using API_backEnd.Common;
using API_backEnd.DTOs.Produto;
using API_backEnd.Models;

namespace API_backEnd.Services
{
    public class ProdutoService
    {
        private readonly AapmContext db;

        public ProdutoService(AapmContext db)
        {
            this.db = db;
        }

        public ResultadoPadrao<List<ProdutoResponse>> BuscarProduto() 
        {
            var produtos = db.TabelaProdutos
                .Where(p => p.IsAtivo)
                .Select(p => new ProdutoResponse
                {
                    Id = p.Id,
                    Produto = p.Produto,
                    Preco = p.Preco
                })
                .ToList();

            return ResultadoPadrao<List<ProdutoResponse>>.Ok(produtos);
        }

        
    }
}
