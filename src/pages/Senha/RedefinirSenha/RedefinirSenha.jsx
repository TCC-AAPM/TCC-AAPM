import { useEffect, useRef, useState } from "react";
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

function calcularForca(senha) {
  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) pontos++;
  if (/\d/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;
  return pontos;
}

function nivelForca(pontos) {
  if (pontos <= 1) return { classe: "fraca", label: "Senha fraca" };
  if (pontos <= 3) return { classe: "media", label: "Senha média" };
  return { classe: "forte", label: "Senha forte" };
}

const REQUISITOS = [
  { texto: "Mínimo de 8 caracteres", teste: (s) => s.length >= 8 },
  {
    texto: "Uma letra maiúscula e uma minúscula",
    teste: (s) => /[A-Z]/.test(s) && /[a-z]/.test(s),
  },
  { texto: "Pelo menos 1 número", teste: (s) => /\d/.test(s) },
  {
    texto: "Pelo menos 1 caractere especial (ex: !@#$%)",
    teste: (s) => /[^A-Za-z0-9]/.test(s),
  },
];

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const { emailValidado, codigoValidado, limparFluxo } = useSenhaFlow();
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha1, setMostrarSenha1] = useState(false);
  const [mostrarSenha2, setMostrarSenha2] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const senhaRedefinidaRef = useRef(false);

  const pontosForca = calcularForca(senha);
  const { classe, label } = nivelForca(pontosForca);

  useEffect(() => {
    if (senhaRedefinidaRef.current) return;

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
      senhaRedefinidaRef.current = true;
      limparFluxo();
      navigate("/login", { replace: true });
    } catch (erro) {
      alertErro(erro.message || "Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.principalBox}>
      <div className={styles.card}>
        <section className={styles.entreAqui}>
          <h2>Crie sua nova senha</h2>
          <p>
            Use pelo menos 8 caracteres, com maiúscula, minúscula, número e
            caractere especial.
          </p>
        </section>

        <ul className={styles.requisitos}>
          {REQUISITOS.map((req) => (
            <li key={req.texto} className={req.teste(senha) ? styles.ok : ""}>
              {req.texto}
            </li>
          ))}
        </ul>

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

          {senha && (
            <div className={styles.forcaSenha}>
              <div className={styles.barrasForca}>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={
                      i < pontosForca
                        ? `${styles.barraAtiva} ${styles[classe]}`
                        : ""
                    }
                  />
                ))}
              </div>
              <span className={styles.textoForca}>{label}</span>
            </div>
          )}

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
          ← Voltar
        </button>
      </div>
    </main>
  );
}
