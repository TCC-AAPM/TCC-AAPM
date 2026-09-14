using API_backEnd.DTOs.Reserva;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CadastroController : BaseController
    {
        private readonly CadastroService _cadastroService;

        public CadastroController(CadastroService cadastroService)
        {
            _cadastroService = cadastroService;
        }

        /// <summary>
        /// Realiza o pré-cadastro de um aluno.
        /// </summary>
        /// <remarks>
        /// Esta rota é pública e não requer autenticação.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para realização do pré-cadastro.
        /// </param>
        /// <response code="200">Pré-cadastro realizado com sucesso.</response>
        /// <response code="400">Dados inválidos ou aluno já cadastrado.</response>
        [AllowAnonymous]
        [HttpPost("pre-cadastro")]
        public IActionResult PreCadastro(PreCadastroRequest dto)
        {
            return Resultado(_cadastroService.PreCadastroAluno(dto));
        }
    }
}