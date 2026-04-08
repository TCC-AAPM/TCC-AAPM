import { useState, useEffect } from "react";
import styles from "./ModificarSenha.module.css";
import {
  alertErro,
  alertSucesso,
  alertConfirmar,
} from "../../../components/Alerts/Alerts.jsx";
import { useNavigate } from "react-router-dom";
import Menu from "../../../components/MenuUsuario/Menu.jsx";

const TOKEN = localStorage.getItem("token") || sessionStorage.getItem("token");

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
  const [menuAberto, setMenuAberto] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  useEffect(() => {
    const handler = (e) => {
      const menu = document.getElementById("menuFlutuante");
      const btn = document.getElementById("btnMenu");
      if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

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

    const response = await fetch("http://localhost:3000/alunos/senha", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ senha: senhaAtual, novaSenha }),
    });

    const data = await response.json();
    if (!response.ok) {
      alertErro(data.erro);
      return;
    }
    alertSucesso(data.mensagem);
  }
  function sair() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      <div className={styles.principalBox}>
        <div className={styles.topBar}>
          <Menu aberto={menuAberto} setAberto={setMenuAberto} onSair={sair} />
        </div>
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

      <a onClick={() => navigate(-1)} className={styles.voltar}>
        ← Voltar
      </a>
    </>
  );
}
