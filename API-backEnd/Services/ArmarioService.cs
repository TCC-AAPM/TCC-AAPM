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

        public bool ArmarioEstaOcupado(int idArmario)
        {
            return db.TabelaArmarios.Any(r => r.NumeroArmario == idArmario && r.Estado == EstadoArmario.O.ToString() && r.IsAtivo);

        }
    }
}
