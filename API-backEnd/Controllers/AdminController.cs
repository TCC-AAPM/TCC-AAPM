using API_backEnd.DTOs.Admin;
using API_backEnd.DTOs.Auth;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : BaseController
    {
        private readonly AdminService _adminService;
        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        /// <summary>
        ///  Retorna os dados do administrador autenticado
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpGet("me")]
        public IActionResult GetAdmin()
        {
            return Resultado(_adminService.BuscarAdminLogado());
        }

        /// <summary>
        /// Cria um novo administrador
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarAdmin(CriarAdminRequest dto)
        {
            return Resultado(_adminService.CriarAdmin(dto));
        }

        /// <summary>
        /// Remove um administrador
        /// </summary>
        [Authorize(Roles = "admin")]
        [HttpPost("{id}/confirmar-exclusao")]
        public IActionResult DeletarAdmin(int id, ConfirmarSenhaRequest dto)
        {
            return Resultado(_adminService.DeletarAdmin(id, dto));
        }
    }
}
