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
        /// Retorna os dados do usuário autenticado.
        /// </summary>
        /// <remarks>
        /// Necessário estar autenticado com perfil de admin.
        /// </remarks>
        /// <response code="200">Dados retornados com sucesso</response>
        /// <response code="401">Usuário não autenticado</response>
        /// <response code="404">Administrador  não encontrado</response>
        [Authorize(Roles = "admin")]
        [HttpGet("me")]
        public IActionResult ObterAdminLogado()
        {
            return Resultado(_adminService.ObterAdminLogado());
        }

        /// <summary>
        /// Cria um novo administrador.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar este cadastro.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para criação do administrador.
        /// </param>
        /// <response code="200">Administrador criado com sucesso.</response>
        /// <response code="400">Dados inválidos ou administrador já existente.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CriarAdmin(CriarAdminRequest dto)
        {
            return Resultado(_adminService.CriarAdmin(dto));
        }

        /// <summary>
        /// Remove um administrador.
        /// </summary>
        /// <remarks>
        /// Necessário confirmar a senha do usuário autenticado para concluir a exclusão.
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="id">
        /// Identificador do administrador que será removido.
        /// </param>
        /// <param name="dto">
        /// Dados necessários para confirmação da exclusão.
        /// </param>
        /// <response code="200">Administrador removido com sucesso.</response>
        /// <response code="400">Senha inválida ou solicitação inválida.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Administrador não encontrado.</response>
        [Authorize(Roles = "admin")]
        [HttpPost("{id}/confirmar-exclusao")]
        public IActionResult DeletarAdmin(int id, ConfirmarSenhaRequest dto)
        {
            return Resultado(_adminService.DeletarAdmin(id, dto));
        }
    }
}
