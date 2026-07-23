import { useState } from "react";
import styles from "./ModificarSenha.module.css";
import { alertErro, alertSucesso } from "../../../components/Alerts/Alerts.jsx";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../../routes/config/api.js";
import { useDockButton } from "../../../utils/useDockButton";

function verificarSenha(senha) {
  const erros = [];
  if (senha.length < 8) erros.push("Mínimo de 8 caracteres;");
  if (!/[a-z]/.test(senha)) erros.push("Pelo menos uma letra minúscula;");
  if (!/[A-Z]/.test(senha)) erros.push("Pelo menos uma letra maiúscula;");
  if (!/[0-9]/.test(senha)) erros.push("Pelo menos um número;");
  if (!/[^A-Za-z0-9]/.test(senha))
    erros.push("Pelo menos um símbolo especial;");
  return erros;
}

function PasswordInput({ id, label, value, onChange }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={`${styles.inputBox} ${styles.inputIcon}`}>
      <input
        type={visible ? "text" : "password"}
        className={styles.formControl}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <label htmlFor={id}>{label}</label>
      <span
        className={`${styles.icon} ${visible ? styles.iconHide : ""}`}
        onClick={() => setVisible((v) => !v)}
      />
    </div>
  );
}

export default function ModificarSenha() {
  const navigate = useNavigate();
  const docked = useDockButton();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  async function atualizarSenha(e) {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      alertErro("As senhas não coincidem");
      return;
    }

    const erros = verificarSenha(novaSenha);
    if (erros.length > 0) {
      alertErro(erros.join(" "));
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(API_ROUTES.alunos.trocarSenha, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        senhaAtual,
        senhaNova: novaSenha,
        confirmarSenha,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      alertErro(data.mensagem ?? "Erro ao trocar senha");
      return;
    }
    alertSucesso(data.mensagem ?? "Senha alterada com sucesso");
    navigate("/usuario/tela-principal");

    if (!response.ok) {
      alertErro(text);
      return;
    }
    alertSucesso(text);
    navigate("/usuario/tela-principal");
  }

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.containerGeral}>
        <div className={styles.principalBox}>
          <div className={styles.entreAqui}>
            <h1 className="material-symbols-outlined">lock_reset</h1>
            <h3>Modifique sua senha</h3>
          </div>

          <form onSubmit={atualizarSenha} className={styles.form}>
            <PasswordInput
              id="password1"
              label="Senha Atual"
              value={senhaAtual}
              onChange={setSenhaAtual}
            />
            <PasswordInput
              id="password2"
              label="Nova Senha"
              value={novaSenha}
              onChange={setNovaSenha}
            />
            <PasswordInput
              id="password3"
              label="Confirmar Nova Senha"
              value={confirmarSenha}
              onChange={setConfirmarSenha}
            />
            <button type="submit" className={styles.btnPrimary}>
              Modificar
            </button>
          </form>
        </div>
      </div>

      <a
        href="#"
        onClick={() => history.back()}
        className={`${styles.voltar} ${docked ? styles.voltarDocked : ""}`}
      >
        ← Voltar
      </a>
    </div>
  );
}
