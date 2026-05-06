namespace API_backEnd.Common
{
    public class ResultadoPadrao<T>
    {
        public bool Sucesso {  get; set; }
        public string? Mensagem { get; set; }
        public T? Dados { get; set; }

        public static ResultadoPadrao<T> Ok(T? dados = default, string? mensagem = null)
        {
            return new ResultadoPadrao<T>
            {
                Sucesso = true,
                Dados = dados,
                Mensagem = mensagem
            };
        }

        public static ResultadoPadrao<T> Falha(string mensagem)
        {
            return new ResultadoPadrao<T>
            {
                Sucesso = false,
                Mensagem = mensagem
            };
        }
    }
}
