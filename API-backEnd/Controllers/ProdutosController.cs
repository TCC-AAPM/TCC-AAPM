using API_backEnd.DTOs.Produto;
using API_backEnd.Enums;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private readonly AapmContext db;
        
        public ProdutosController(AapmContext context)
        {
            db = context;
        }

        [HttpGet]
        public IActionResult GetProdutos()
        {
            var produtos = db.TabelaProdutos
                .Where(p => p.IsAtivo == true)
                .Select(p => new ProdutoResponse
                {
                    Id = p.Id,
                    Produto = p.Produto,
                    Preco = p.Preco
                })
                .ToList();

            return Ok(produtos);
        }

        //[Authorize(Roles = "admin")]
        [HttpPut("{idProduto}")]
        public IActionResult AlterarPrecoProduto(int idProduto,ProdutoRequest dto)
        {
            var produto = db.TabelaProdutos.FirstOrDefault(p => p.Id == idProduto);

            if (produto == null) {
                return NotFound("Produto não encontrado");
            }

            produto.Preco = dto.Preco;
            
            db.SaveChanges();
            return Ok("Preço alterado com sucesso");
        }
    }
}
