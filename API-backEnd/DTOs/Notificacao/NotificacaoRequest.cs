namespace API_backEnd.DTOs.Notificacao
{
    public class NotificacaoRequest
    {
        public string Titulo { get; set; } = string.Empty;

        public string Mensagem { get; set; } = string.Empty;

        public string Tipo { get; set; } = string.Empty;
    }
}
