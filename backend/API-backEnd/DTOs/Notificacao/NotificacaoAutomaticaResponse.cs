namespace API_backEnd.DTOs.Notificacao
{
    public class NotificacaoAutomaticaResponse
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;

        public string Mensagem { get; set; } = string.Empty;

        public string Evento { get; set; } = string.Empty;

        public bool Ativa { get; set; }
    }
}
