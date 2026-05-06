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

        [Authorize(Roles = "aluno")]
        [HttpGet("me")]
        public IActionResult BuscarAlunoLogado()
        {
            return Resultado(_alunoService.DadosAlunoLogado());
        }
       
        [Authorize(Roles = "aluno")]
        [HttpPost("deletar-conta")]
        public IActionResult DeletarConta(ConfirmarSenhaRequest dto)
        {
            return Resultado(_alunoService.DeletarConta(dto));
        }

        [HttpPost("buscar-por-cpf")]
        public IActionResult BuscarPorCPF(BuscarAlunoPorCpfRequest dto)
        {
            return Resultado(_alunoService.BuscarAlunoPeloCPF(dto));
        }

    }
}
