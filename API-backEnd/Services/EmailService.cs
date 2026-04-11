using API_backEnd.Settings;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace API_backEnd.Services
{
    public class EmailService
    {
        private readonly EmailSettings _settings;


        public EmailService(IOptions<EmailSettings> options)
        {
            _settings = options.Value;
        }

        public void EnviarCodigoRecuperacao(string emailDestino, string codigo) 
        {
            var mensagem = new MailMessage();
            mensagem.From = new MailAddress(_settings.Email);
            mensagem.To.Add(emailDestino);
            mensagem.Subject = "Recuperação de senha";
            // trocar pro html da lopreti
            mensagem.Body = $"Seu código de recuperação é: <b>{codigo}</b>";
            mensagem.IsBodyHtml = true;

            var smtp = new SmtpClient(_settings.Host, _settings.Porta);
            smtp.Credentials = new NetworkCredential(_settings.Email, _settings.Senha);
            smtp.EnableSsl = true;

            smtp.Send(mensagem);
        }
    }
}
