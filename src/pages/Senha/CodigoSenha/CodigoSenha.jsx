import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertErro, alertSucesso } from "../../../components/Alerts/Alerts.jsx";
import { authFetch, API_ROUTES } from "../../../utils/auth.js";
import { useSenhaFlow } from "../SenhaFlowContext.jsx";
import styles from "./CodigoSenha.module.css";

async function lerResultadoPadrao(resposta) {
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : {};
}

export default function CodigoSenha() {
  const navigate = useNavigate();
  const { emailValidado, validarCodigo } = useSenhaFlow();
  const [digitos, setDigitos] = useState(["", "", "", "", "", ""]);
  const [carregando, setCarregando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(600);

  useEffect(() => {
    if (!emailValidado) {
      alertErro("Informe seu email antes de validar o código.");
      navigate("/senha/esqueci", { replace: true });
      return;
    }

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [emailValidado, navigate]);

  function formatarTempo() {
    if (tempoRestante <= 0) return "Código expirado";
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    return `${minutos}:${segundos.toString().padStart(2, "0")}`;
  }

  function atualizarDigito(index, valor) {
    const digito = valor.replace(/\D/g, "").slice(-1);
    setDigitos((atual) =>
      atual.map((item, itemIndex) => (itemIndex === index ? digito : item))
    );

    if (digito && index < 5) {
      document.getElementById(`codigo-${index + 1}`)?.focus();
    }
  }

  function voltarNoBackspace(e, index) {
    if (e.key !== "Backspace") return;

    setDigitos((atual) =>
      atual.map((item, itemIndex) => (itemIndex === index ? "" : item))
    );

    if (!digitos[index] && index > 0) {
      document.getElementById(`codigo-${index - 1}`)?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const codigoDigitado = digitos.join("");

    if (!codigoDigitado) {
      alertErro("Por favor, insira o código.");
      return;
    }

    if (codigoDigitado.length < 6) {
      alertErro("Por favor, insira o código completo.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await authFetch(API_ROUTES.senha.verificarCodigo, {
        method: "POST",
        body: JSON.stringify({ email: emailValidado, codigo: codigoDigitado }),
      });

      const dados = await lerResultadoPadrao(resposta);

      if (!resposta.ok || dados.sucesso === false) {
        alertErro(dados.mensagem || "Erro ao verificar código.");
        return;
      }

      validarCodigo(codigoDigitado);
      alertSucesso(dados.mensagem || "Código validado com sucesso.");
      navigate("/senha/redefinir");
    } catch (erro) {
      alertErro(erro.message || "Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.principalBox}>
      <section className={styles.entreAqui}>
        <h2>Digite o código</h2>
        <p style={{ color: "white", marginTop: "1rem", textAlign: "center" }}>
          Enviamos um código de 6 dígitos para <strong>{emailValidado}</strong>
        </p>
      </section>

      <div className={styles.containerDateView}>
        <span className={styles.labelDate}>Código expira em:</span>
        <span className={styles.currentDate}>{formatarTempo()}</span>
      </div>

      <form className={styles.codigoInput} onSubmit={handleSubmit}>
        <div className={styles.inputBox}>
          {digitos.map((digito, index) => (
            <input
              key={index}
              id={`codigo-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="form-control"
              value={digito}
              onChange={(e) => atualizarDigito(index, e.target.value)}
              onKeyDown={(e) => voltarNoBackspace(e, index)}
            />
          ))}
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${styles.btnPrimary}`}
          disabled={carregando}
        >
          {carregando ? "Verificando..." : "Enviar"}
        </button>
      </form>

      <button className={styles.voltar} onClick={() => navigate(-1)}>
        Voltar
      </button>
    </main>
  );
}
