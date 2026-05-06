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
    public class ProdutosController : ControllerBase
    {
        private readonly ProdutoService _produtoService;
        public ProdutosController(ProdutoService produtoService)
        {
            _produtoService = produtoService;
        }

        [HttpGet]
        public IActionResult GetProdutos()
        {
            var resultado = _produtoService.BuscarProduto();

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Dados);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{idProduto}")]
        public IActionResult AlterarPrecoProduto(int idProduto, ProdutoRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var resultado = _produtoService.AlterarPrecoProduto(idProduto, dto);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Sucesso);

            return Ok(resultado.Mensagem);
        }
    }
}
