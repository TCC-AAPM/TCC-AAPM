using API_backEnd.Common;
using API_backEnd.DTOs.Auth;
using API_backEnd.Models;
using API_backEnd.Settings;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace API_backEnd.Services
{
    public class EmailService
    {
        private readonly AapmContext db;
        private readonly EmailSettings _settings;
        private static readonly Regex SenhaRegex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$");

        public EmailService(IOptions<EmailSettings> options, AapmContext db)
        {
            _settings = options.Value;
            this.db = db;
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

        public ResultadoPadrao<object> VerificarEmail(ConfirmarEmailRequest dto)
        {
            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Email == dto.Email && a.IsAtivo);
            var admin = db.TabelaAdmins.FirstOrDefault(a => a.Email == dto.Email && a.IsAtivo);

            if (aluno != null || admin != null)
            {
                var codigo = new Random().Next(100000, 999999).ToString();

                var dados = new TabelaVerificacao
                {
                    Email = dto.Email,
                    Codigo = codigo,
                    Expiracao = DateTime.UtcNow.AddMinutes(15)
                };

                db.TabelaVerificacaos.Add(dados);
                EnviarCodigoRecuperacao(dto.Email, codigo);
                db.SaveChanges();
            }
            return ResultadoPadrao<object>.Ok("Se o email existir, enviaremos instruções...");

        }

        public ResultadoPadrao<object> VerificarCodigo(VerificarCodigoRequest dto)
        {
            var codigo = db.TabelaVerificacaos.FirstOrDefault(v => v.Email == dto.Email && v.Codigo == dto.Codigo && v.Expiracao > DateTime.UtcNow && v.Usado == false);
            if (codigo == null)
            {
                return ResultadoPadrao<object>.Falha("Código invalido", 400);
            }
            return ResultadoPadrao<object>.Ok("Código validado com sucesso");
        }

        public ResultadoPadrao<object> ResetarSenha(ResetarSenhaRequest dto)
        {
            if (dto.SenhaNova != dto.ConfirmarSenha)
            {
                return ResultadoPadrao<object>.Falha("As senhas não coincidem", 400);
            }

            if (!SenhaRegex.IsMatch(dto.SenhaNova))
            {
                return ResultadoPadrao<object>.Falha("A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula e número", 400);
            }

            var codigo = db.TabelaVerificacaos.FirstOrDefault(v => v.Codigo == dto.Codigo && v.Email == dto.Email && v.Usado == false && v.Expiracao > DateTime.UtcNow);
            if (codigo == null)
            {
                return ResultadoPadrao<object>.Falha("Código inválido ou expirado", 400);
            }
            var aluno = db.TabelaAlunos.FirstOrDefault(a => a.Email == codigo.Email);
            var admin = db.TabelaAdmins.FirstOrDefault(a => a.Email == codigo.Email);
            int idUsuario;
            if (aluno != null)
            {
                idUsuario = aluno.IdUsuario;
            }
            else if (admin != null)
            {
                idUsuario = admin.IdUsuario;
            }
            else
            {
                return ResultadoPadrao<object>.Falha("Usuário não encontrado", 404);
            }
            var usuario = db.TabelaUsuarios.FirstOrDefault(u => u.Id == idUsuario);
            if (usuario == null)
            {
                return ResultadoPadrao<object>.Falha("Usuario não encontrado", 404);
            }
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(dto.SenhaNova);
            codigo.Usado = true;
            db.SaveChanges();
            return ResultadoPadrao<object>.Ok("Senha redefinida com sucesso");
        }
    }
}
