using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinanceiroController : BaseController
    {

        private readonly FinanceiroService _financeiroService;

        public FinanceiroController(FinanceiroService financeiroService)
        {
            _financeiroService = financeiroService;
        }

        [Authorize(Roles = "admin")]
        [HttpGet("relatorio")]
        public IActionResult RelatorioFinanceiro()
        {
            return Resultado(_financeiroService.RelatorioFinanceiro());
        }

        [Authorize(Roles = "admin")]
        [HttpGet("total-mensal")]
        public IActionResult TotalMensal()
        {
            return Resultado(_financeiroService.TotalMensal());
        }

        [Authorize(Roles = "admin")]
        [HttpGet("total")]
        public IActionResult Total()
        {
            return Resultado(_financeiroService.Total());
        }
    }
}
