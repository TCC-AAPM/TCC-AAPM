using API_backEnd.Common;
using API_backEnd.DTOs.Armario;
using API_backEnd.Enums;
using API_backEnd.Models;

namespace API_backEnd.Services
{
    public class ArmarioService
    {
        private readonly AapmContext db;

        public ArmarioService(AapmContext db)
        {
            this.db = db;
        }

        static readonly HashSet<EstadoArmario> estadosIndisponiveis = new HashSet<EstadoArmario>
        {
            EstadoArmario.O,
            EstadoArmario.M,
            EstadoArmario.P    
        };


        public ResultadoPadrao<List<DadosArmarioResponse>> BuscarArmariosAtivos()
        {
            var armariosAtivo = db.TabelaArmarios.Where(a => a.IsAtivo).Select(a => new DadosArmarioResponse
            { 
                NumeroArmario = a.NumeroArmario,
                Observacao = a.Observacao,
                Estado = a.Estado
            }).ToList();

            if (armariosAtivo.Count == 0)
            {
                return ResultadoPadrao<List<DadosArmarioResponse>>.Falha("Nenhum armário encontrado", 404);
            }

            return ResultadoPadrao<List<DadosArmarioResponse>>.Ok(armariosAtivo);
        }

        public ResultadoPadrao<DadosArmarioResponse> BuscarArmarioPeloNumero(int numeroArmario)
        {
            var armario = db.TabelaArmarios.Where(a => a.NumeroArmario == numeroArmario && a.IsAtivo).Select(a => new DadosArmarioResponse
            {
                NumeroArmario = a.NumeroArmario,
                Observacao = a.Observacao,
                Estado = a.Estado
            }).FirstOrDefault(); 
            
            if (armario == null)
            {
                return ResultadoPadrao<DadosArmarioResponse>.Falha("", 404);
            }

            return ResultadoPadrao<DadosArmarioResponse>.Ok(armario);
        }

        public ResultadoPadrao<List<DadosArmarioResponse>> BuscarArmarioPeloEstado(EstadoArmario estado)
        {
            var armarios = db.TabelaArmarios.Where(a => a.Estado == estado && a.IsAtivo).Select(a => new DadosArmarioResponse
            {
                NumeroArmario = a.NumeroArmario,
                Observacao = a.Observacao,
                Estado = a.Estado
            }).ToList(); ;

            if (armarios.Count == 0)
                return ResultadoPadrao<List<DadosArmarioResponse>>.Falha("Nenhum armário encontrado", 404);

            return ResultadoPadrao<List<DadosArmarioResponse>>.Ok(armarios);
        }

        public ResultadoPadrao<object> CriarArmario(CriarArmarioRequest dto)
        {
            if (dto.NumeroArmario <= 0)
            {
                return ResultadoPadrao<object>.Falha("Número do armário deve ser maior que zero.", 400);
            }

            var armarioExiste = db.TabelaArmarios.SingleOrDefault(a => a.NumeroArmario == dto.NumeroArmario);

            if (armarioExiste != null && armarioExiste.IsAtivo)
            {
                return ResultadoPadrao<object>.Falha("Armario ja existe", 409);
            }

            if (armarioExiste != null && !armarioExiste.IsAtivo)
            {
                armarioExiste.IsAtivo = true;
                armarioExiste.Estado = dto.Estado;
                armarioExiste.Observacao = string.IsNullOrWhiteSpace(dto.Observacao)
                    ? null
                    : dto.Observacao;
            }
            else
            {
                var armario = new TabelaArmario
                {
                    NumeroArmario = dto.NumeroArmario,
                    Estado = dto.Estado,
                    Observacao = string.IsNullOrWhiteSpace(dto.Observacao) ? null : dto.Observacao
                };


                db.TabelaArmarios.Add(armario);
            }
            db.SaveChanges();

            return ResultadoPadrao<object>.Ok(mensagem: "Armário criado com sucesso.");
        }

        public ResultadoPadrao<object> DeletarArmario(int numeroArmario)
        {
            var armario = db.TabelaArmarios.SingleOrDefault(a => a.NumeroArmario == numeroArmario);

            if (armario == null || armario.IsAtivo == false)
            {
                return ResultadoPadrao<object>.Falha("Armário não encontrado ou já desativado.", 404);
            }

            armario.IsAtivo = false;

            db.SaveChanges();
            return ResultadoPadrao<object>.Ok(mensagem: "Armário excluído");
        }

        public ResultadoPadrao<object> MudarEstadoArmario(int numeroArmario, AtualizarEstadoArmarioRequest dto)
        {
            var armarioExiste = db.TabelaArmarios.SingleOrDefault(a => a.NumeroArmario == numeroArmario);

            if (armarioExiste == null)
            {
                return ResultadoPadrao<object>.Falha("Armário não encontrado", 404);
            }

            if (armarioExiste.Estado == dto.Estado)
            {
                return ResultadoPadrao<object>.Falha("Tem que mudar para um estado diferente", 409);
            }

            if (armarioExiste.Estado == EstadoArmario.O)
            {
                return ResultadoPadrao<object>.Falha("O armário esta ocupado", 409);
            }


            armarioExiste.Estado = dto.Estado;
            armarioExiste.Observacao = string.IsNullOrWhiteSpace(dto.Observacao) ? null : dto.Observacao;

            db.SaveChanges();

            return ResultadoPadrao<object>.Ok(mensagem: "Estado do armário atualizado com sucesso.");
        }
        public bool ArmarioIndisponivel(int idArmario)
        {
            return db.TabelaArmarios.Any(r => r.NumeroArmario == idArmario && estadosIndisponiveis.Contains(r.Estado) && r.IsAtivo);
        }
    }
}
