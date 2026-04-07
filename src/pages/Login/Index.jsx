import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertErro } from "../../components/Alerts/Alerts.jsx";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const API_LOGIN = "/api/Login";

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !senha) {
      alertErro("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        alertErro("Email ou senha inválidos");
        return;
      }

      const dado = await response.json();
      const token = dado.token;

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      if (lembrar) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "aluno") {
        navigate("/usuario/tela-principal");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log("Erro:", error);
      alertErro("Erro de conexão com o servidor.");
    }
  }

  return (
    <>
      <div className={styles.containerGeral}>
        <div className={styles.principalBox}>
          <div className={styles.entreAqui}>
            <h1 className={styles.title}>
              Já possui armário ou vaga de estacionamento?
            </h1>

            <p className={styles.subtitle}>
              Entre com seu e-mail cadastrado e senha.
            </p>
          </div>

          <form className={styles.formEntrada} onSubmit={handleSubmit}>
            <div className={styles.inputBox}>
              <input
                type="text"
                className="form-control"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className={`${styles.inputBox} ${styles.inputIcon}`}>
              <input
                type={mostrarSenha ? "text" : "password"}
                className="form-control"
                id="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <label htmlFor="password">Senha</label>
              <span
                className={mostrarSenha ? styles.iconHide : styles.icon}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              />
            </div>

            <div className={styles.containerOpcoes}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                <label
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={() => navigate("/senha/esqueci")}
                >
                  Esqueceu a sua senha?
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${styles.btnPrimary}`}
            >
              Entrar
            </button>
            <div className={styles.registerBox}>
              <span>Ainda não possui cadastro?</span>
              <button className={styles.buttonSecondary}>
                Escolher serviço
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
