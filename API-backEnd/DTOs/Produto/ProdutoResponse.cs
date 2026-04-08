using API_backEnd.Enums;

namespace API_backEnd.DTOs.Produto
{
    public class ProdutoResponse
    {
        public int Id { get; set; }
        public CategoriaProduto Produto {  get; set; }
        public decimal Preco { get; set; }

    }
}
