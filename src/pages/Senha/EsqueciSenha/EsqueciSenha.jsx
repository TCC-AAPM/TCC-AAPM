import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertErro, alertSucesso } from "../../../components/Alerts/Alerts.jsx";
import { authFetch, API_ROUTES } from "../../../utils/auth.js";
import { useSenhaFlow } from "../SenhaFlowContext.jsx";
import styles from "./EsqueciSenha.module.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function lerResultadoPadrao(resposta) {
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : {};
}

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const { iniciarFluxo } = useSenhaFlow();
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviarCodigo(e) {
    e.preventDefault();
    const emailTratado = email.trim();

    if (!emailTratado) {
      alertErro("Por favor, insira seu email.");
      return;
    }

    if (!emailRegex.test(emailTratado)) {
      alertErro("Informe um email válido.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await authFetch(API_ROUTES.senha.esqueciSenha, {
        method: "POST",
        body: JSON.stringify({ email: emailTratado }),
      });

      const dados = await lerResultadoPadrao(resposta);

      if (!resposta.ok || dados.sucesso === false) {
        alertErro(dados.mensagem || "Erro ao enviar código de verificação.");
        return;
      }

      iniciarFluxo(emailTratado);
      alertSucesso(dados.mensagem || "Código enviado para o email!");
      navigate("/senha/codigo");
    } catch (erro) {
      alertErro(erro.message || "Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.principalBox}>
      <section className={styles.entreAqui}>
        <h2>Digite o seu email</h2>
      </section>

      <form className={styles.emailInput} onSubmit={enviarCodigo}>
        <div className={styles.inputBox}>
          <input
            type="email"
            className="form-control"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">Email</label>
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${styles.btnPrimary}`}
          disabled={carregando}
        >
          {carregando ? "Enviando..." : "Enviar"}
        </button>
      </form>

      <button className={styles.voltar} onClick={() => navigate(-1)}>
        Voltar
      </button>
    </main>
  );
}
