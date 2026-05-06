using API_backEnd.DTOs.Reserva;
using API_backEnd.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CadastroController : ControllerBase
    {

        private readonly CadastroService _cadastroService;
        public CadastroController(CadastroService cadastroService)
        {
            _cadastroService = cadastroService;
           
        }

        [HttpPost("pre-cadastro")]
        public IActionResult PreCadastro(PreCadastroRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var resultado = _cadastroService.PreCadastroAluno(dto);

            if (!resultado.Sucesso)
                return BadRequest(resultado.Mensagem);

            return Ok(resultado.Mensagem);
        }
    }
}
