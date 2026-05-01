using API_backEnd.DTOs.Auth;
using API_backEnd.DTOs.Termo;
using API_backEnd.Enums;
using API_backEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API_backEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TermoController : ControllerBase
    {
        private readonly AapmContext db;
        

        public TermoController(AapmContext context)
        {
            db = context;
        }

        //[Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CriarTermo([FromForm] CriarTermoRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var termoExistente = db.TabelaTermos.FirstOrDefault(t => t.Referencia == dto.Referencia.ToString() && t.IsAtivo);
            if (termoExistente != null) 
            {
                termoExistente.IsAtivo = false;
                termoExistente.DataAlteracao = DateTime.UtcNow;
            }

            if (dto.Pdf == null || dto.Pdf.Length == 0) 
            {
                return BadRequest("Arquivo inválido");
            }
            if (dto.Pdf.ContentType != "application/pdf")
            {
                return BadRequest("Somente PDF permitido");
            }
            var caminhoPdf = await SalvarPdf(dto.Pdf);
            var termos = new TabelaTermo
            {
                CaminhoPdf = caminhoPdf,
                Referencia = dto.Referencia.ToString(),
                DataCriacao = DateTime.UtcNow,
                IsAtivo = true
            };

            db.TabelaTermos.Add(termos);
            db.SaveChanges();

            return Ok("Termo criado com sucesso");
        }

        [HttpGet("termo-pdf")]
        public IActionResult ObterPdf(string referencia)
        {
            var termo = db.TabelaTermos
                .FirstOrDefault(t => t.Referencia == referencia && t.IsAtivo);

            if (termo == null)
                return NotFound("Termo não encontrado");

            var caminhoFisico = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                termo.CaminhoPdf.TrimStart('/')
            );

            if (!System.IO.File.Exists(caminhoFisico))
                return NotFound("Arquivo não encontrado");

            return PhysicalFile(caminhoFisico, "application/pdf");
        }


        [Authorize]
        [HttpGet("verificar-termos-aceito")]
        public IActionResult VerificarTermosAceito()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userId, out int id))
                return BadRequest("ID inválido");

            return Ok(ObterStatusTermos(id));
        }

        [Authorize]
        [HttpPost("aceitar-novos-termos")]
        public IActionResult AceitarTermos(AceitarTermoRequest dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userId, out int id))
            {
                return BadRequest("ID inválido");
            }

            var termoAtualExiste = db.TabelaTermos.FirstOrDefault(t => t.Id == dto.IdTermo && t.IsAtivo);
            if (termoAtualExiste == null)
            {
                return BadRequest("Termo não encontrado");
            }
            
            var jaAceito = db.TabelaTermosAceitos.Any(t => t.IdUsuario == id && t.IdTermos == dto.IdTermo && t.IsAtivo);
            if (jaAceito)
            {
                return BadRequest("Você já aceitou esse termo");
            }

            var termoAntigoAceito = db.TabelaTermosAceitos.FirstOrDefault(t => t.IdUsuario == id && t.IsAtivo && t.IdTermosNavigation.Referencia == termoAtualExiste.Referencia);
            if (termoAntigoAceito != null)
            {
                termoAntigoAceito.DataAlteracao = DateTime.UtcNow;
                termoAntigoAceito.IsAtivo = false;
            }
            var termoAceito = new TabelaTermosAceito
            {
                IdTermos = dto.IdTermo,
                IdUsuario = id,
                DataAceito = DateTime.UtcNow
            };

            db.TabelaTermosAceitos.Add(termoAceito);
            db.SaveChanges();
            return Ok("Termo aceito");
        }

        private PendenciaTermosResponse ObterStatusTermos(int id)
        {
            var termosArmario = false;
            var termosEstacionamento = false;

            var termosAceitoIds = db.TabelaTermosAceitos
                .Where(t => t.IdUsuario == id && t.IsAtivo)
                .Select(t => t.IdTermos)
                .ToList();

            var termosSite = db.TabelaTermos.Any(t => !termosAceitoIds.Contains(t.Id) && t.Referencia == ReferenciaTermos.S.ToString() && t.IsAtivo);

            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.IdUsuario == id && a.IsAtivo);
            if (aluno != null)
            {
                var reservaArmarioAtiva = db.TabelaReservaArmarios.Any(r => r.IdAluno == aluno.Id && r.IsAtivo);

                if (reservaArmarioAtiva)
                {
                    termosArmario = db.TabelaTermos.Any(t => !termosAceitoIds.Contains(t.Id) && t.Referencia == ReferenciaTermos.A.ToString() && t.IsAtivo);
                }

                var reservaEstacionamentoAtiva = db.TabelaReservaEstacionamentos.Any(r => r.IdAluno == aluno.Id && r.IsAtivo);

                if (reservaEstacionamentoAtiva)
                {
                    termosEstacionamento = db.TabelaTermos.Any(t => !termosAceitoIds.Contains(t.Id) && t.Referencia == ReferenciaTermos.E.ToString() && t.IsAtivo);
                }
            }
            // true = precisa aceitar
            // false = já está com o mais atualizado
            return new PendenciaTermosResponse
            {
                TermosPendenteSite = termosSite,
                TermosPendenteArmario = termosArmario,
                TermosPendenteEstacionamento = termosEstacionamento
            };
        }

        private async Task<string> SalvarPdf(IFormFile arquivo)
        {
            // pasta destino
            var pasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "termos");

            // cria a pasta se não existir
            if (!Directory.Exists(pasta))
                Directory.CreateDirectory(pasta);

            var nomeArquivo = $"{Guid.NewGuid()}{Path.GetExtension(arquivo.FileName)}";

            var caminhoCompleto = Path.Combine(pasta, nomeArquivo);

            using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
            {
                await arquivo.CopyToAsync(stream);
            }

            // retornar caminho relativo (pra salvar no banco)
            return $"/uploads/termos/{nomeArquivo}";
        } 
    }   
}
