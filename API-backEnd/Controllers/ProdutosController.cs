using API_backEnd.DTOs.Produto;
using API_backEnd.Enums;
using API_backEnd.Models;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

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

        [HttpGet]
        public IActionResult GetProdutos()
        {
            return Resultado(_produtoService.BuscarProduto());
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{idProduto}")]
        public IActionResult AlterarPrecoProduto(int idProduto, ProdutoRequest dto)
        {
            return Resultado(_produtoService.AlterarPrecoProduto(idProduto, dto));
        }
    }
}
