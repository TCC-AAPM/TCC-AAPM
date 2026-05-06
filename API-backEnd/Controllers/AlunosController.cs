using API_backEnd.DTOs.Aluno;
using API_backEnd.DTOs.Auth;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlunosController : ControllerBase
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
            var resultado = _alunoService.DadosAlunoLogado();

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Dados);
        }
       
        [Authorize(Roles = "aluno")]
        [HttpPost("deletar-conta")]
        public IActionResult DeletarConta(ConfirmarSenhaRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var resultado = _alunoService.DeletarConta(dto);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
            
        }

        
        [HttpPost("buscar-por-cpf")]
        public IActionResult BuscarPorCPF(BuscarAlunoPorCpfRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var resultado = _alunoService.BuscarAlunoPeloCPF(dto);

            if(!resultado.Sucesso)
                return BadRequest(resultado?.Mensagem);

            return Ok(resultado.Dados);
        }

    }
}
