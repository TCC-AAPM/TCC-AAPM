using API_backEnd.Common;

namespace API_backEnd.Services
{
    public class IdadeService
    {
        public ResultadoValidacaoIdade ValidarIdade(DateOnly dataNasc, int idadeMin)
        {
            DateOnly hoje = DateOnly.FromDateTime(DateTime.Today);
            int idade = hoje.Year - dataNasc.Year;

            if (hoje < dataNasc.AddYears(idade))
            {
                idade--;
            }

            if (idade < idadeMin)
            {
                return new ResultadoValidacaoIdade
                {
                    Erro = true,
                    Mensagem = $"Idade mínima de {idadeMin} anos.",
                    Idade = null,
                };
            }

            return new ResultadoValidacaoIdade
            {
                Erro = false,
                Mensagem = null,
                Idade = idade,
            }; 
        }
    }
}
