using API_backEnd.Enums;
using System.ComponentModel.DataAnnotations;

namespace API_backEnd.DTOs.Produto
{
    public class ProdutoRequest
    {
        [Required]
        public decimal Preco { get; set; }
        
    }
}
