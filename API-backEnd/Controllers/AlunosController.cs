using API_backEnd.DTOs.Aluno;
using API_backEnd.DTOs.Auth;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlunosController : BaseController
    {
        private readonly AlunoService _alunoService;
        public AlunosController(AlunoService alunoService)
        {
            _alunoService = alunoService;
        }

        /// <summary>
        /// Retorna os dados do aluno autenticado
        /// </summary>
        [Authorize(Roles = "aluno")]
        [HttpGet("me")]
        public IActionResult BuscarAlunoLogado()
        {
            return Resultado(_alunoService.DadosAlunoLogado());
        }

        /// <summary>
        /// Exclui a conta do aluno autenticado
        /// </summary>
        [Authorize(Roles = "aluno")]
        [HttpPost("excluir-conta")]
        public IActionResult DeletarConta(ConfirmarSenhaRequest dto)
        {
            return Resultado(_alunoService.DeletarConta(dto));
        }

        /// <summary>
        /// Busca aluno pelo CPF
        /// </summary>
        [AllowAnonymous]
        [HttpPost("buscar-por-cpf")]
        public IActionResult BuscarPorCPF(BuscarAlunoPorCpfRequest dto)
        {
            return Resultado(_alunoService.BuscarAlunoPeloCPF(dto));
        }

    }
}
