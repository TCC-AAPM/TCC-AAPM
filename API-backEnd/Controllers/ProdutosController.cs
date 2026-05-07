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

        /// <summary>
        /// Atualiza o preço de um produto.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="idProduto">
        /// Identificador do produto que será atualizado.
        /// </param>
        /// <param name="dto">
        /// Novo valor do produto.
        /// </param>
        /// <response code="200">Preço atualizado com sucesso.</response>
        /// <response code="400">Dados inválidos.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Produto não encontrado.</response>
        [Authorize(Roles = "admin")]
        [HttpPut("{idProduto}")]
        public IActionResult AlterarPrecoProduto(int idProduto, ProdutoRequest dto)
        {
            return Resultado(_produtoService.AlterarPrecoProduto(idProduto, dto));
        }
    }
}