using API_backEnd.Common;
using API_backEnd.Enums;
using API_backEnd.Models;
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
            return new ResultadoValidacaoTermo
            {
                Erro = false,
                Mensagem = "Termo aceito",
                Termo = null
            };
        }
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
    }
}
