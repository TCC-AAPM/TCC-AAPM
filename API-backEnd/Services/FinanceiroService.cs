using API_backEnd.Models;

namespace API_backEnd.Services
{
    public class FinanceiroService
    {
        private readonly AapmContext db;

        public FinanceiroService(AapmContext db)
        {
            this.db = db;
        }


    }
}
