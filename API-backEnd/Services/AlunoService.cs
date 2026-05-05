using API_backEnd.Models;

namespace API_backEnd.Services
{
    public class AlunoService
    {
        private readonly AapmContext db;

        public AlunoService(AapmContext db)
        {
            this.db = db;
        }

        public bool ExisteAlunoPorCpf(string Cpf)
        {
            return db.TabelaAlunos.Any(a => a.Cpf == Cpf && a.IsAtivo);
        }
    }
}
