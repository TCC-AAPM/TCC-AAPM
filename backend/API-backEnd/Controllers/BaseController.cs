using API_backEnd.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [ApiController]
    public class BaseController : ControllerBase
    {
        //protected IActionResult Resultado<T>(ResultadoPadrao<T> resultado)
        //{
        //    if (!resultado.Sucesso)
        //        return BadRequest(resultado.Mensagem);

        //    return Ok(resultado);
        //}

        protected IActionResult Resultado<T>(ResultadoPadrao<T> resultado)
        {
            return StatusCode(resultado.StatusCode, resultado);
        }
    }
}
