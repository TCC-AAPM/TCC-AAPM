import { useState, useEffect } from "react"; // ← adiciona useEffect
import { useNavigate } from "react-router-dom";
import {
  alertErro,
  alertSucesso,
  alertAviso,
} from "../../../components/Alerts/Alerts.jsx";
import styles from "./CodigoSenha.module.css";

const API_VERIFICAR = "http://localhost:3000/verificacao/verificar";

export default function CodigoSenha() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email_recuperacao");

  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [d3, setD3] = useState("");
  const [d4, setD4] = useState("");
  const [d5, setD5] = useState("");
  const [d6, setD6] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(600); // ← 10 minutos

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          return 0;
        }
        return prev - 1; // diminui 1 segundo
      });
    }, 1000); // executa a cada 1 segundo

    return () => clearInterval(intervalo); 
  }, []); // [] = executa só uma vez quando a página carrega

  function formatarTempo() {
    if (tempoRestante <= 0) return "Código expirado";
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    return `⏳ ${minutos}:${segundos.toString().padStart(2, "0")}`;
  }

  function handleDigito(valor, setter, proximoId) {
    setter(valor);
    if (valor && proximoId) {
      document.getElementById(proximoId).focus();
    }
  }

  function handleBackspace(e, setter, anteriorId) {
    if (e.key === "Backspace") {
      setter("");
      if (anteriorId) {
        document.getElementById(anteriorId).focus();
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const codigoDigitado = d1 + d2 + d3 + d4 + d5 + d6;

    if (codigoDigitado.length < 6) {
      alertAviso("Por favor, insira o código completo.");
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fetch(API_VERIFICAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo: codigoDigitado }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alertErro(dados.erro || "Erro ao verificar código.");
        return;
      }

      alertSucesso(dados.mensagem);
      navigate(`/senha/redefinir?email=${encodeURIComponent(email)}`);
    } catch (erro) {
      alertErro(erro.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.principalBox}>
      <section className={styles.entreAqui}>
        <h2>Digite o código</h2>
        <p style={{ color: "white", marginTop: "1rem", textAlign: "center" }}>
          Enviamos um código de 6 dígitos para <strong>{email}</strong>
        </p>
      </section>

      <div className={styles.containerDateView}>
        <span className={styles.labelDate}>Código expira em:</span>
        <span className={styles.currentDate}>{formatarTempo()}</span>
      </div>

      <form className={styles.codigoInput} onSubmit={handleSubmit}>
        <div className={styles.inputBox}>
          <input
            id="d1"
            type="text"
            maxLength={1}
            className="form-control"
            value={d1}
            onChange={(e) => handleDigito(e.target.value, setD1, "d2")}
            onKeyDown={(e) => handleBackspace(e, setD1, null)}
          />
          <input
            id="d2"
            type="text"
            maxLength={1}
            className="form-control"
            value={d2}
            onChange={(e) => handleDigito(e.target.value, setD2, "d3")}
            onKeyDown={(e) => handleBackspace(e, setD2, "d1")}
          />
          <input
            id="d3"
            type="text"
            maxLength={1}
            className="form-control"
            value={d3}
            onChange={(e) => handleDigito(e.target.value, setD3, "d4")}
            onKeyDown={(e) => handleBackspace(e, setD3, "d2")}
          />
          <input
            id="d4"
            type="text"
            maxLength={1}
            className="form-control"
            value={d4}
            onChange={(e) => handleDigito(e.target.value, setD4, "d5")}
            onKeyDown={(e) => handleBackspace(e, setD4, "d3")}
          />
          <input
            id="d5"
            type="text"
            maxLength={1}
            className="form-control"
            value={d5}
            onChange={(e) => handleDigito(e.target.value, setD5, "d6")}
            onKeyDown={(e) => handleBackspace(e, setD5, "d4")}
          />
          <input
            id="d6"
            type="text"
            maxLength={1}
            className="form-control"
            value={d6}
            onChange={(e) => handleDigito(e.target.value, setD6, null)}
            onKeyDown={(e) => handleBackspace(e, setD6, "d5")}
          />
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
        ← Voltar
      </button>
    </main>
  );
}

/*
  1. useState - cada digito (d1-d6) tem seu proprio estado
     react guarda o valor sozinho, nao precisa mais de getElementById

  2. handleDigito - avanco automatico entre inputs
     quando digita algo, foca o proximo pelo ID
     (no js antigo era querySelectorAll + index)

  3. handleBackspace - volta ao apagar
     escuta o "Backspace" no onKeyDown e foca o anterior
     primeiro input tem anteriorId = null entao nao volta pra nada

  4. useEffect - o timer
     roda uma vez quando a pagina carrega (por causa do [])
     o return limpa o intervalo quando sai da pagina
     
  5. formatarTempo - 600 → "10:00"
     padStart(2, "0") garante 2 digitos nos segundos ("9:07" nao "9:7")

  6. finally - garante que o botao sermpre volta ao normal
     mesmo se der erro na requisicao
*/