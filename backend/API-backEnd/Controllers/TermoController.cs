using API_backEnd.DTOs.Auth;
using API_backEnd.DTOs.Termo;
using API_backEnd.Enums;
using API_backEnd.Models;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TermoController : BaseController
    {
        private readonly TermoService _termoService;
        private readonly UsuarioService _usuarioService;

        public TermoController(TermoService termoService, UsuarioService usuarioService)
        {
            _termoService = termoService;
            _usuarioService = usuarioService;
        }


        /// <summary>
        /// Retorna uma lista dos termos ativos
        /// </summary>
        /// <remarks>
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <response code="200">Lista de termos retornado com sucesso.</response>
        [AllowAnonymous]
        [HttpGet("termos-ativos")]
        public IActionResult TermosAtivos()
        {
            return Resultado(_termoService.BuscarTermosAtivos());
        }

        /// <summary>
        /// Retorna o arquivo PDF de um termo.
        /// </summary>
        /// <remarks>
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <param name="referencia">
        /// Referência do termo que será obtido.
        /// </param>
        /// <response code="200">Arquivo PDF retornado com sucesso.</response>
        /// <response code="404">Termo não encontrado.</response>
        [AllowAnonymous]
        [HttpGet("obter-pdf")]
        public IActionResult ObterPdf(ReferenciaTermos referencia)
        {
            var resultado = _termoService.ObterCaminhoPdf(referencia);

            if (!resultado.Sucesso)
                return NotFound(resultado.Mensagem);

            return PhysicalFile(resultado.Dados, "application/pdf");
        }

        /// <summary>
        /// Verifica os termos aceitos pelo usuário autenticado.
        /// </summary>
        /// <remarks>
        /// Retorna os termos já aceitos e os pendentes de aceite.
        /// </remarks>
        /// <response code="200">Status dos termos retornado com sucesso.</response>
        /// <response code="401">Usuário não autenticado.</response>
        [Authorize]
        [HttpGet("verificar-termos-aceito")]
        public IActionResult VerificarTermosAceito()
        {
            var id = _usuarioService.ObterIdUsuarioLogado();

            return Resultado(_termoService.ObterStatusTermos(id));
        }

        /// <summary>
        /// Cria um novo termo.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="dto">
        /// Dados e arquivo PDF do termo.
        /// </param>
        /// <response code="200">Termo criado com sucesso.</response>
        /// <response code="400">Dados inválidos ou arquivo não informado.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        [Authorize(Roles = "admin")]
        [HttpPost("criar-termo")]
        public async Task<IActionResult> CriarTermo([FromForm] CriarTermoRequest dto)
        {
            return Resultado(await _termoService.CriarTermo(dto));
        }

        /// <summary>
        /// Registra o aceite de um termo pelo usuário autenticado.
        /// </summary>
        /// <remarks>
        /// Necessário estar autenticado para aceitar um termo.
        /// </remarks>
        /// <param name="dto">
        /// Identificador do termo que será aceito.
        /// </param>
        /// <response code="200">Termo aceito com sucesso.</response>
        /// <response code="400">Termo inválido ou já aceito.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="404">Termo não encontrado.</response>
        [Authorize]
        [HttpPost("aceitar-novos-termos")]
        public IActionResult AceitarTermos(AceitarTermoRequest dto)
        {
            var id = _usuarioService.ObterIdUsuarioLogado();

            return Resultado(_termoService.AceitarTermo(id, dto.IdTermo));
        }
    }
}
