using API_backEnd.DTOs.Auth;
using API_backEnd.Models;
using API_backEnd.Services;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class LoginController : ControllerBase
    {
        private readonly AuthService _authService;

        public LoginController(AuthService authService)
        {
            _authService = authService;
        }
        [HttpPost]
        public IActionResult Login(LoginRequest login)
        {
           var resultado = _authService.Login(login);

            if (!resultado.Sucesso)
                return Unauthorized(resultado.Mensagem);

            return Ok(new { token = resultado.Dados });
        }
    }
}
