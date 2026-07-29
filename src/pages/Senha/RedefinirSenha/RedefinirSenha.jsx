import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  alertConfirmar,
  alertErro,
  alertSucessoModal,
} from "../../../components/Alerts/Alerts.jsx";
import { authFetch, API_ROUTES } from "../../../utils/auth.js";
import { useSenhaFlow } from "../SenhaFlowContext.jsx";
import styles from "./RedefinirSenha.module.css";

async function lerResultadoPadrao(resposta) {
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : {};
}

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const { emailValidado, codigoValidado, limparFluxo } = useSenhaFlow();
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha1, setMostrarSenha1] = useState(false);
  const [mostrarSenha2, setMostrarSenha2] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!emailValidado || !codigoValidado) {
      alertErro("Valide o email e o código antes de redefinir a senha.");
      navigate("/senha/esqueci", { replace: true });
    }
  }, [codigoValidado, emailValidado, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!senha || !confirmarSenha) {
      alertErro("Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      alertErro("As senhas não coincidem.");
      return;
    }

    const confirmado = await alertConfirmar("Deseja redefinir sua senha?");
    if (!confirmado) return;

    try {
      setCarregando(true);

      const resposta = await authFetch(API_ROUTES.senha.resetarSenha, {
        method: "POST",
        body: JSON.stringify({
          email: emailValidado,
          codigo: codigoValidado,
          senhaNova: senha,
          confirmarSenha,
        }),
      });

      const dados = await lerResultadoPadrao(resposta);

      if (!resposta.ok || dados.sucesso === false) {
        alertErro(dados.mensagem || "Erro ao redefinir senha.");
        return;
      }

      await alertSucessoModal(
        "Sucesso!",
        dados.mensagem || "Senha redefinida com sucesso.",
      );
      navigate("/login", { replace: true });
    } catch (erro) {
      alertErro(erro.message || "Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.principalBox}>
      <section className={styles.entreAqui}>
        <h2>Redefina a sua senha:</h2>
      </section>

      <form className={styles.formNovaSenha} onSubmit={handleSubmit}>
        <div className={`${styles.inputBox} ${styles.inputIcon}`}>
          <input
            type={mostrarSenha1 ? "text" : "password"}
            className="form-control"
            id="password1"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <label htmlFor="password1">Nova Senha</label>
          <span
            className={mostrarSenha1 ? styles.iconHide : styles.icon}
            onClick={() => setMostrarSenha1(!mostrarSenha1)}
          />
        </div>

        <div className={`${styles.inputBox} ${styles.inputIcon}`}>
          <input
            type={mostrarSenha2 ? "text" : "password"}
            className="form-control"
            id="password2"
            required
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <label htmlFor="password2">Confirmar Nova Senha</label>
          <span
            className={mostrarSenha2 ? styles.iconHide : styles.icon}
            onClick={() => setMostrarSenha2(!mostrarSenha2)}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${styles.btnPrimary}`}
          disabled={carregando}
        >
          {carregando ? "Redefinindo..." : "Redefinir"}
        </button>
      </form>

      <button className={styles.voltar} onClick={() => navigate(-1)}>
        Voltar
      </button>
    </main>
  );
}
