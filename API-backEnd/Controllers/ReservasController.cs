using API_backEnd.DTOs.Armario;
using API_backEnd.DTOs.Reserva;
using API_backEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservasController : BaseController
    {
        private readonly ReservaService _reservaService;

        public ReservasController(ReservaService reservaService)
        {
            _reservaService = reservaService;
        }

        /// <summary>
        /// Retorna o histórico de reservas de armários.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem acessar esta rota.
        /// </remarks>
        /// <response code="200">Histórico retornado com sucesso.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        [Authorize(Roles = "admin")]
        [HttpGet("historico-reserva")]
        public IActionResult HistoricoReserva()
        {
            return Resultado(_reservaService.HistoricoReserva());
        }

        /// <summary>
        /// Retorna os alunos com reserva ativa de armário.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem acessar esta rota.
        /// </remarks>
        /// <response code="200">Alunos retornados com sucesso.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        [Authorize(Roles = "admin")]
        [HttpGet("com-reserva")]
        public IActionResult BuscarAlunosComReserva()
        {
            return Resultado(_reservaService.AlunosComReservaAtiva());
        }

        /// <summary>
        /// Realiza o cadastro completo de uma reserva de armário.
        /// </summary>
        /// <remarks>
        /// Esta rota realiza o cadastro do aluno e a criação da reserva do armário.
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para cadastro da reserva.
        /// </param>
        /// <response code="200">Reserva criada com sucesso.</response>
        /// <response code="400">Dados inválidos ou armário indisponível.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        [Authorize(Roles = "admin")]
        [HttpPost("cadastro-armario")]
        public IActionResult CadastroReservaArmarioCompleto(CriarCadastroArmarioRequest dto)
        {
            return Resultado(_reservaService.CadastrarReservaArmario(dto));
        }

        /// <summary>
        /// Realiza o recadastro de uma reserva de armário.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para recadastro da reserva.
        /// </param>
        /// <response code="200">Recadastro realizado com sucesso.</response>
        /// <response code="400">Dados inválidos ou reserva inexistente.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        //[Authorize(Roles = "admin")]
        [HttpPost("recadastrar-armario")]
        public IActionResult RecadastroReserva(RecadastrarReservaRequest dto)
        {
            return Resultado(_reservaService.RecadastrarReserva(dto));
        }

        /// <summary>
        /// Transfere um aluno para outro armário.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="dto">
        /// Dados necessários para transferência do aluno.
        /// </param>
        /// <response code="200">Transferência realizada com sucesso.</response>
        /// <response code="400">Dados inválidos ou armário indisponível.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Reserva ou armário não encontrado.</response>
        [Authorize(Roles = "admin")]
        [HttpPost("transferir")]
        public IActionResult TransferirAlunoArmario(TransferirAlunoArmarioRequest dto)
        {
            return Resultado(_reservaService.TransferirAlunoDeArmario(dto));
        }

        /// <summary>
        /// Exclui a reserva de um armário.
        /// </summary>
        /// <remarks>
        /// Apenas administradores autenticados podem realizar esta ação.
        /// </remarks>
        /// <param name="numeroArmario">
        /// Número do armário vinculado à reserva.
        /// </param>
        /// <response code="200">Reserva removida com sucesso.</response>
        /// <response code="401">Usuário não autenticado.</response>
        /// <response code="403">Usuário sem permissão para acessar esta rota.</response>
        /// <response code="404">Reserva não encontrada.</response>
        [Authorize(Roles = "admin")]
        [HttpDelete("{numeroArmario}")]
        public IActionResult ExcluirReserva(int numeroArmario)
        {
            return Resultado(_reservaService.ExcluirReserva(numeroArmario));
        }

        [Authorize(Roles = "admin")]
        [HttpGet("reservas-ultimos-6-meses")]
        public IActionResult ReservasUltimos6Meses()
        {
            return Ok(_reservaService.ReservasUltimos6Meses());
        }

        [Authorize(Roles = "admin")]
        [HttpGet("reservas-mes")]
        public IActionResult TotalReservasMes()
        {
            return Ok(_reservaService.TotalReservasMes());
        }
    }
}