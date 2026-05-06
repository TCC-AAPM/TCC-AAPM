using API_backEnd.DTOs;
using API_backEnd.DTOs.Admin;
using API_backEnd.DTOs.Auth;
using API_backEnd.Models;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.RegularExpressions;

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

        [Authorize(Roles = "admin")]
        [HttpGet("me")]
        public IActionResult GetAdmin()
        {
            return Resultado(_adminService.BuscarAdminLogado());
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarAdmin(CriarAdminRequest dto)
        {
            return Resultado(_adminService.CriarAdmin(dto));
        }

        [Authorize(Roles = "admin")]
        [HttpPost("{id}/excluir")]
        public IActionResult DeletarAdmin(int id, ConfirmarSenhaRequest dto)
        {
            return Resultado(_adminService.DeletarAdmin(id, dto));
        }
    }
}
