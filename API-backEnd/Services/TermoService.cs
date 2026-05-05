using API_backEnd.Common;
using API_backEnd.DTOs.Auth;
using API_backEnd.DTOs.Termo;
using API_backEnd.Enums;
using API_backEnd.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Contracts;

namespace API_backEnd.Services
{
    public class TermoService
    {
        private readonly AapmContext db;

        public TermoService(AapmContext context)
        {
            db = context;
        }
        public ResultadoValidacaoTermo ValidarAceiteDeTermo(ReferenciaTermos referencia, int idTermoDto, bool aceitouTermo)
        {
            
            var termoAtivo = db.TabelaTermos.FirstOrDefault(t => t.Referencia == referencia && t.IsAtivo);
            var nome = ObterNomeDoTermo(referencia);
            if (termoAtivo == null)
            {
                return new ResultadoValidacaoTermo
                {
                    Erro = true,
                    Mensagem = $"Termo do {nome} não encontrado",
                    Termo = null
                };

            }
            if (termoAtivo.Id != idTermoDto)
            {
                return new ResultadoValidacaoTermo
                {
                    Erro = true,
                    Mensagem = $"Termo do {nome} inválido",
                    Termo = null
                };
            }
            if (!aceitouTermo)
            {
                return new ResultadoValidacaoTermo
                {
                    Erro = true,
                    Mensagem = $"Precisa aceitar os termos do {nome}",
                    Termo = null
                };
            }

            return new ResultadoValidacaoTermo
            {
                Erro = false,
                Mensagem = null,
                Termo = termoAtivo
            };
        }

        public ResultadoValidacaoTermo AceitarTermo(int idUsuario, int idTermo)
        {
            var termoAtualExiste = db.TabelaTermos.FirstOrDefault(t => t.Id == idTermo && t.IsAtivo);
            if (termoAtualExiste == null)
            {
                return new ResultadoValidacaoTermo { 
                    Erro = true,
                    Mensagem ="Termo não encontrado",
                    Termo = null
                };
            }

            var jaAceito = db.TabelaTermosAceitos.Any(t => t.IdUsuario == idUsuario && t.IdTermos == idTermo && t.IsAtivo);
            if (jaAceito)
            {
                return new ResultadoValidacaoTermo
                {
                    Erro = false,
                    Mensagem = "Termo já aceito",
                    Termo = null
                };
            }

            var termoAntigoAceito = db.TabelaTermosAceitos.FirstOrDefault(t => t.IdUsuario == idUsuario && t.IsAtivo && t.IdTermosNavigation.Referencia == termoAtualExiste.Referencia);
            if (termoAntigoAceito != null)
            {
                termoAntigoAceito.DataAlteracao = DateTime.UtcNow;
                termoAntigoAceito.IsAtivo = false;
            }
            var termoAceito = new TabelaTermosAceito
            {
                IdTermos = idTermo,
                IdUsuario = idUsuario,
                responsavelAceito = true,
                DataAceito = DateTime.UtcNow
            };

            db.TabelaTermosAceitos.Add(termoAceito);
            db.SaveChanges();
            return new ResultadoValidacaoTermo
            {
                Erro = false,
                Mensagem = "Termo aceito",
                Termo = null
            };
        }

        public PendenciaTermosResponse ObterStatusTermos(int id)
        {
            var termosArmario = false;
            var termosEstacionamento = false;

            var termosAceitoIds = db.TabelaTermosAceitos
                .Where(t => t.IdUsuario == id && t.IsAtivo)
                .Select(t => t.IdTermos)
                .ToList();

            var termosSite = db.TabelaTermos.Any(t => !termosAceitoIds.Contains(t.Id) && t.Referencia == ReferenciaTermos.S && t.IsAtivo);

            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.IdUsuario == id && a.IsAtivo);
            if (aluno != null)
            {
                var reservaArmarioAtiva = db.TabelaReservaArmarios.Any(r => r.IdAluno == aluno.Id && r.IsAtivo);

                if (reservaArmarioAtiva)
                {
                    termosArmario = db.TabelaTermos.Any(t => !termosAceitoIds.Contains(t.Id) && t.Referencia == ReferenciaTermos.A && t.IsAtivo);
                }

                var reservaEstacionamentoAtiva = db.TabelaReservaEstacionamentos.Any(r => r.IdAluno == aluno.Id && r.IsAtivo);

                if (reservaEstacionamentoAtiva)
                {
                    termosEstacionamento = db.TabelaTermos.Any(t => !termosAceitoIds.Contains(t.Id) && t.Referencia == ReferenciaTermos.E && t.IsAtivo);
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
       
        public async  Task<ResultadoValidacaoTermo> CriarTermo(CriarTermoRequest dto)
        {
            var termoExistente = db.TabelaTermos.FirstOrDefault(t => t.Referencia == dto.Referencia && t.IsAtivo);
            if (termoExistente != null)
            {
                termoExistente.IsAtivo = false;
                termoExistente.DataAlteracao = DateTime.UtcNow;
            }

            if (dto.Pdf == null || dto.Pdf.Length == 0)
                return new ResultadoValidacaoTermo{ 
                    Erro = true,
                    Mensagem = "Arquivo inválido",
                    Termo = null
                };

            if (dto.Pdf.ContentType != "application/pdf")
            {
                return new ResultadoValidacaoTermo 
                { 
                    Erro = true,
                    Mensagem ="Somente PDF permitido",
                    Termo = null
                };
            }
            var caminhoPdf = await SalvarPdf(dto.Pdf);
            var termos = new TabelaTermo
            {
                CaminhoPdf = caminhoPdf,
                Referencia = dto.Referencia,
                DataCriacao = DateTime.UtcNow,
                IsAtivo = true
            };

            db.TabelaTermos.Add(termos);
            db.SaveChanges();

            return new ResultadoValidacaoTermo
            {
                Erro = false,
                Mensagem = "Termo criado com sucesso",
                Termo = null
            };
        }

        //public ResultadoValidacaoTermo ObterPdf(ReferenciaTermos referencia)
        //{
        //    var termo = db.TabelaTermos
        //        .FirstOrDefault(t => t.Referencia == referencia && t.IsAtivo);

        //    if (termo == null)
        //        return new ResultadoValidacaoTermo
        //        {
        //            Erro = true,
        //            Mensagem = "Termo não encontrado" 
        //        };

        //    var caminhoFisico = Path.Combine(
        //        Directory.GetCurrentDirectory(),
        //        "wwwroot",
        //        termo.CaminhoPdf.TrimStart('/')
        //    );

        //    if (!System.IO.File.Exists(caminhoFisico))
        //        return NotFound("Arquivo não encontrado");

        //    return PhysicalFile(caminhoFisico, "application/pdf");
        //}
        private string ObterNomeDoTermo(ReferenciaTermos referencia)
        {
            string nome;

            switch (referencia) 
            {
                case ReferenciaTermos.S:
                    nome = "site";
                    break;
                case ReferenciaTermos.A:
                    nome = "armário";
                    break;
                default:
                    nome = "termo";
                    break;
            }

            return nome;
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
