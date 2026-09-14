namespace API_backEnd.EmailTemplates
{
    public static class EmailTemplates
    {

        public static string RedefinirSenha(string codigo)
        {
            return $@"
<!doctype html>
<html lang='pt-BR'>
<head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Redefinição de Senha</title>
</head>

<body
    style='
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
    '
>
    <table
      width='100%'
      cellpadding='0'
      cellspacing='0'
      style='background-color: #f3f4f6; padding: 30px 0'
    >
      <tr>
        <td align='center'>
          <table
            width='100%'
            cellpadding='0'
            cellspacing='0'
            style='
              max-width: 540px;
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            '
          >
            <tr>
              <td
                style='
                  background: #3b82f6;
                  padding: 20px 30px;
                  text-align: center;
                '
              >
                <img
                  src='https://SEU-SITE.com/logo.png'
                  alt='AAPM'
                  style='max-width: 120px; margin-bottom: 10px'
                />

                <h1
                  style='
                    color: #ffffff;
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                  '
                >
                  Redefinição de Senha
                </h1>
              </td>
            </tr>

            <tr>
              <td style='padding: 30px'>
                <p style='font-size: 16px; color: #333333; margin: 0 0 15px'>
                  Olá! Recebemos uma solicitação para redefinir sua senha no
                  sistema da
                  <strong>AAPM</strong>.
                </p>

                <p style='font-size: 16px; color: #333333; margin: 0 0 20px'>
                  Use o código abaixo para continuar:
                </p>

                <div style='text-align: center; margin: 30px 0'>
                  <div
                    style='
                      display: inline-block;
                      padding: 14px 28px;
                      font-size: 24px;
                      font-weight: bold;
                      color: #3b82f6;
                      border: 2px dashed #3b82f6;
                      border-radius: 8px;
                      letter-spacing: 6px;
                      background: #f8faff;
                    '
                  >
                    {codigo}
                  </div>
                </div>

                <p
                  style='
                    font-size: 14px;
                    color: #666666;
                    margin: 0 0 25px;
                    line-height: 1.5;
                  '
                >
                  Este código é válido por <strong>10 minutos</strong>.<br />
                  Se você não solicitou essa alteração, basta ignorar este
                  e-mail.
                </p>

                <p style='font-size: 15px; color: #555555; margin: 0 0 25px'>
                  Agradecemos pela sua colaboração.
                </p>

                <p
                  style='
                    font-size: 15px;
                    color: #333333;
                    margin: 0 0 4px;
                    font-weight: 600;
                  '
                >
                  Atenciosamente,
                </p>

                <p style='font-size: 15px; color: #333333; margin: 0 0 25px'>
                  Equipe da AAPM
                </p>

                <p
                  style='
                    font-size: 14px;
                    color: #999999;
                    text-align: center;
                    margin: 0;
                  '
                >
                  Desenvolvido por <strong>Isabella Lopreti</strong> &
                  <strong>Gabriel Duarte</strong> • © 2026
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
</body>
</html>";
        }
    }
}
