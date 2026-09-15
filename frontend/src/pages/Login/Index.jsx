import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertErro } from "../../components/Alerts/Alerts.jsx";
import styles from "./Login.module.css";
import SEO from "../../components/SEO/SEO.jsx";
import { API_ROUTES } from "../../routes/config/api.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !senha) {
      alertErro("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch(API_ROUTES.login, {
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

      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "aluno") {
        navigate("/usuario/tela-principal");
      } else {
        navigate("/admin/armarios");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alertErro("Erro de conexão com o servidor.");
    }
  }

  return (
    <>
      <section className={styles.containerGeral}>
        <SEO
          title="Login"
          description="Acesse o sistema da AAPM SENAI Osasco para gerenciar armários, reservas e informações de alunos."
          path="/login"
          noIndex
        />
        <div className={styles.principalBox}>
          <header className={styles.entreAqui}>
            <h1 className={styles.title}>
              Já possui armário ou deseja entrar como administrador?
            </h1>

            <p className={styles.subtitle}>
              Entre com seu e-mail cadastrado e senha.
            </p>
          </header>

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
              <button
                className={styles.buttonSecondary}
                onClick={() => navigate("/")}
              >
                Escolher serviço
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
