using API_backEnd.DTOs.Produto;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : BaseController
    {
        private readonly ProdutoService _produtoService;
        public ProdutosController(ProdutoService produtoService)
        {
            _produtoService = produtoService;
        }

        /// <summary>
        /// Retorna todos os produtos disponíveis
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetProdutos()
        {
            return Resultado(_produtoService.BuscarProduto());
        }

        /// <summary>
        /// Atualiza o preço de um produto
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpPut("{idProduto}")]
        public IActionResult AlterarPrecoProduto(int idProduto, ProdutoRequest dto)
        {
            return Resultado(_produtoService.AlterarPrecoProduto(idProduto, dto));
        }
    }
}
