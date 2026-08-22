using API_backEnd.DTOs.Produto;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinanceiroController : BaseController
    {

        private readonly FinanceiroService _financeiroService;

        public FinanceiroController(FinanceiroService financeiroService)
        {
            _financeiroService = financeiroService;
        }

        [Authorize(Roles = "admin")]
        [HttpGet("relatorio")]
        public IActionResult RelatorioFinanceiro()
        {
            return Resultado(_financeiroService.RelatorioFinanceiro());
        }

        [Authorize(Roles = "admin")]
        [HttpGet("total-mensal")]
        public IActionResult TotalMensal()
        {
            return Resultado(_financeiroService.TotalMensal());
        }

        [Authorize(Roles = "admin")]
        [HttpGet("total")]
        public IActionResult Total()
        {
            return Resultado(_financeiroService.Total());
        }

        [Authorize(Roles = "admin")]
        [HttpGet("lucro-ultimos-6-meses")]
        public IActionResult LucroUltimos6Meses()
        {
            return Ok(_financeiroService.LucroUltimo6Meses());
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
            return Resultado(_financeiroService.AlterarPreco(idProduto, dto));
        }
    }
}
