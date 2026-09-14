using API_backEnd.DTOs.ConfigReserva;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigReservaController : BaseController
    {

        private readonly ConfigReservaService _configReservaService;

        public ConfigReservaController(ConfigReservaService configReservaService)
        {
            _configReservaService = configReservaService;
        }

        [Authorize(Roles = "admin")]
        [HttpPut("data-fim-semestre")]
        public async Task<IActionResult> AlterarDataFimSemestre([FromBody] AlterarDataFimSemestreRequest dto)
        {
            return Resultado(await _configReservaService.AlterarDataFimSemestre(dto));
        }

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<IActionResult> ObterConfig()
        {
            return Resultado(await _configReservaService.ObterConfig());
        }
    }
}
