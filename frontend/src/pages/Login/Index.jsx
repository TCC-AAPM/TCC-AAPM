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
            <div className={styles.divisor}>
              <span>ou</span>
            </div>
            <button
              type="button"
              className={styles.btnGoogle}
              onClick={() => (window.location.href = API_ROUTES.loginGoogle)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M43.611 20.083H42V20H24v8h11.303C33.653 32.656 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.049 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"
                />
                <path
                  fill="#34A853"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z"
                />
                <path
                  fill="#FBBC05"
                  d="M12.717 28.054A11.91 11.91 0 0 1 12 24c0-1.383.236-2.711.668-3.946l-6.522-5.025A20 20 0 0 0 4 24c0 3.23.774 6.28 2.141 8.975l6.576-4.921Z"
                />
                <path
                  fill="#EA4335"
                  d="M12.717 19.946C14.381 15.317 18.798 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.049 6.053 29.268 4 24 4 16.227 4 9.505 8.444 6.141 15.025l6.576 4.921Z"
                />
              </svg>
              Entrar com Google
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
