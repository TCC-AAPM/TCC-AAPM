using API_backEnd.Common;

namespace API_backEnd.Services
{
    public class IdadeService
    {
        public ResultadoPadrao<int> ValidarIdade(DateOnly dataNasc, int idadeMin)
        {
            DateOnly hoje = DateOnly.FromDateTime(DateTime.Today);
            int idade = hoje.Year - dataNasc.Year;

            if (hoje < dataNasc.AddYears(idade))
            {
                idade--;
            }

            if (idade < idadeMin)
            {
                return ResultadoPadrao<int>.Falha($"Idade mínima de {idadeMin} anos.");
                
            }

            return ResultadoPadrao<int>.Ok(idade);
            
        }
    }
}
