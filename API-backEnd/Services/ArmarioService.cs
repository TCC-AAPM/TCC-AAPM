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
        static readonly HashSet<string> estadosIndisponiveis = new HashSet<string>
            {
                EstadoArmario.O.ToString(),
                EstadoArmario.M.ToString(),
                EstadoArmario.P.ToString()
            };
        public bool ArmarioIndisponivel(int idArmario)
        {
            
            return db.TabelaArmarios.Any(r => r.NumeroArmario == idArmario && estadosIndisponiveis.Contains(r.Estado) && r.IsAtivo);
        }
    }
}
