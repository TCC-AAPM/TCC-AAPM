import { useEffect, useRef, useState } from "react";
import styles from "./TelaPrincipal.module.css";
import { API_ROUTES, getUsuarioLogado } from "../../../utils/auth.js";
import { ContagemRegressiva } from "../../../utils/contagemRegressiva.js";
import { useTermoVerification } from "../../../utils/useTermoVerification.js";
import ModalNovoTermo from "../../../components/ModalNovoTermo/ModalNovoTermo.jsx";

function FlipDigit({ value }) {
  const ref = useRef(null);
  const prev = useRef(value);

  useEffect(() => {
    if (value !== prev.current && ref.current) {
      ref.current.classList.remove(styles.flip);
      void ref.current.offsetWidth;
      ref.current.classList.add(styles.flip);
    }
    prev.current = value;
  }, [value]);

  return (
    <div className={styles.clockDigit} ref={ref}>
      {value}
    </div>
  );
}

function FlipUnit({ value, label, wide }) {
  const s = String(value).padStart(wide ? 2 : 2, "0");
  return (
    <div className={styles.clockUnit}>
      <div className={styles.clockDigits}>
        <FlipDigit value={s[0]} />
        <FlipDigit value={s[1]} />
      </div>
      <span className={styles.clockUnitLabel}>{label}</span>
    </div>
  );
}

function calcMesesDiasHoras(dataFimISO) {
  if (!dataFimISO) return null;
  const agora = new Date();
  const fim = new Date(dataFimISO);
  const diffMs = fim - agora;
  if (diffMs <= 0) return { expirado: true, alerta: false };

  const diffTotalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const meses = Math.floor(diffTotalDias / 30);
  const dias = diffTotalDias % 30;
  const horas = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const alerta = diffTotalDias <= 7;

  return { meses, dias, horas, expirado: false, alerta };
}

export default function TelaPrincipal() {
  const { showModal, termosParaAceitar, handleAceitar, handleRecusar } =
    useTermoVerification();

  const [dados, setDados] = useState({
    nome: "",
    numArmario: "-",
    dataFim: "-",
    dataFimISO: null,
  });

  const [tempo, setTempo] = useState(null);

  useEffect(() => {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    const token = localStorage.getItem("token");
    fetch(API_ROUTES.alunos.telaPrincipal, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setDados({
          nome: data.dados.nome,
          numArmario: data.dados.numeroArmario ?? "-",
          dataFimISO: data.dados.dataExpiracao ?? null,
          dataFim: data.dados.dataExpiracao
            ? new Date(data.dados.dataExpiracao).toLocaleDateString("pt-BR")
            : "-",
        });
      })
      .catch((err) => console.error("erro:", err));
  }, []);

  useEffect(() => {
    if (!dados.dataFimISO) return;
    const atualizar = () => setTempo(calcMesesDiasHoras(dados.dataFimISO));
    atualizar();
    const id = setInterval(atualizar, 60 * 1000);
    return () => clearInterval(id);
  }, [dados.dataFimISO]);

  return (
    <div className={styles.containerGeral}>
      {showModal && (
        <ModalNovoTermo
          termos={termosParaAceitar}
          onAceitar={handleAceitar}
          onRecusar={handleRecusar}
        />
      )}
      <div className={styles.principalBox}>
        <div className={styles.header}>
          <p className={styles.saudacao}>Olá, {dados.nome || "Usuário"}!</p>
          {tempo?.alerta && (
            <div className={styles.alertaExpiracao}>
              ⚠ Renove em breve para não perder o acesso.
            </div>
          )}
        </div>

        {tempo && !tempo.expirado && (
          <div className={styles.countdownCard}>
            <p className={styles.countdownDesc}>
              Tempo restante da sua locação. Após o vencimento, você tem 7 dias
              para retirar seus pertences.
            </p>
            <div className={styles.clockGroup}>
              <FlipUnit value={tempo.meses} label="Meses" />
              <span className={styles.clockSep}>:</span>
              <FlipUnit value={tempo.dias} label="Dias" />
              <span className={styles.clockSep}>:</span>
              <FlipUnit value={tempo.horas} label="Horas" />
            </div>
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div className={styles.infos}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Número do armário</div>
              <div className={styles.valor}>{dados.numArmario}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.label}>Encerramento</div>
              <div className={styles.valor}>{dados.dataFim}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
