using API_backEnd.DTOs;
using API_backEnd.DTOs.Aluno;
using API_backEnd.DTOs.Auth;
using API_backEnd.DTOs.Reserva;
using API_backEnd.Enums;
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
    public class AlunosController : ControllerBase
    {
        private readonly AlunoService _alunoService;
        private readonly AapmContext db;
        public AlunosController(AapmContext context, AlunoService alunoService)
        {
            db = context;
            _alunoService = alunoService;
        }

        [Authorize(Roles = "aluno")]
        [HttpGet("me")]
        public IActionResult GetUser()
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

        [Authorize(Roles = "admin")]
        [HttpPost("buscar-por-cpf")]
        public IActionResult BuscarPorCPF(BuscarAlunoPorCpfRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Cpf == dto.CPF && a.IsAtivo);

            if (aluno == null)
            {
                return NotFound("Aluno não encontrado");
            }
            var dados = new RecadastroResponse
            {
                Nome = aluno.Nome,
                Telefone = aluno.Telefone,
                Email = aluno.Email,
                Matricula = aluno.Matricula,
                IdCurso = aluno.CursoId,
                IdTurma = aluno.TurmaId
            };

            return Ok(dados);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("historico-reserva")]
        public IActionResult HistoricoReserva()
        {
            var dados =
            (
                from r in db.TabelaReservaArmarios
                join a in db.TabelaAlunos on r.IdAluno equals a.Id
                where a.IsAtivo == true
                select new HistoricoReservaResponse
                {
                    Nome = a.Nome,
                    CPF = a.Cpf,
                    NumeroArmario = r.IdArmario,
                    IsAtivo = r.IsAtivo
                }
            ).ToList();
            return Ok(dados);
        }
    }
}
