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
        /// Retorna todos os produtos disponíveis.
        /// </summary>
        /// <remarks>
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <response code="200">Produtos retornados com sucesso.</response>
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetProdutos()
        {
            return Resultado(_produtoService.BuscarProduto());
        }

        
    }
}