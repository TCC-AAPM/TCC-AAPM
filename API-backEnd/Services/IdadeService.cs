using API_backEnd.Common;

namespace API_backEnd.Services
{
    public class IdadeService
    {
        public ResultadoPadrao<object> ValidarIdade(DateOnly dataNasc, int idadeMin)
        {
            DateOnly hoje = DateOnly.FromDateTime(DateTime.Today);
            int idade = hoje.Year - dataNasc.Year;

            if (hoje < dataNasc.AddYears(idade))
            {
                idade--;
            }

            if (idade < idadeMin)
            {
                return ResultadoPadrao<object>.Falha($"Idade mínima de {idadeMin} anos.", 400);
               
            }

            return ResultadoPadrao<object>.Ok(idade);
            
        }
    }
}
