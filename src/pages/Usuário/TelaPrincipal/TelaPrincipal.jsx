import { useEffect, useRef, useState } from "react";
import styles from "./TelaPrincipal.module.css";
import { API_ROUTES, getUsuarioLogado } from "../../../utils/auth.js";
import { useTermoVerification } from "../../../utils/useTermoVerification.js";
import { getNomeExibicao } from "../../../utils/getNomeExibicao.js";
import ModalNovoTermo from "../../../components/ModalNovoTermo/ModalNovoTermo.jsx";
import Planos from "../../../components/Planos/Planos.jsx";
import { useDockButton } from "../../../utils/useDockButton";
import SEO from "../../../components/SEO/SEO.jsx";

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

function getStatusUsuario(aluno) {
  if (aluno?.numeroArmario) return "ATIVA";
  if (aluno?.jaTeveReserva) return "EXPIRADA";
  return "SEM_RESERVA";
}

function AvisoStatus({ texto, botaoTexto, aoClicarBotao }) {
  return (
    <div className={styles.avisoStatus}>
      <div className={styles.avisoIcon}>
        <span className="material-symbols-outlined">info</span>
      </div>
      <div className={styles.avisoConteudo}>
        <p>{texto}</p>
        {botaoTexto && aoClicarBotao && (
          <button type="button" onClick={aoClicarBotao}>
            {botaoTexto}
          </button>
        )}
      </div>
    </div>
  );
}

export default function TelaPrincipal() {
  const docked = useDockButton();
  const { showModal, termosParaAceitar, handleAceitar, handleRecusar } =
    useTermoVerification();

  const [dados, setDados] = useState({
    nome: "",
    nomeSocial: "",
    status: "SEM_RESERVA",
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
        const aluno = data.dados;

        setDados({
          nome: aluno.nome,
          nomeSocial:
            aluno.nomeSocial ??
            aluno.NomeSocial ??
            aluno.nomeSocialAluno ??
            aluno.NomeSocialAluno ??
            "",
          status: getStatusUsuario(aluno),
          numArmario: aluno.numeroArmario ?? "-",
          dataFimISO: aluno.dataExpiracao ?? null,
          dataFim: aluno.dataExpiracao
            ? new Date(aluno.dataExpiracao).toLocaleDateString("pt-BR")
            : "-",
        });
      })
      .catch((err) => console.error("erro:", err));
  }, []);

  useEffect(() => {
    if (dados.status !== "ATIVA" || !dados.dataFimISO) {
      setTempo(null);
      return undefined;
    }

    const atualizar = () => setTempo(calcMesesDiasHoras(dados.dataFimISO));
    atualizar();
    const id = setInterval(atualizar, 60 * 1000);
    return () => clearInterval(id);
  }, [dados.dataFimISO, dados.status]);

  return (
    <div className={styles.conteudoWrapper}>
      <SEO
        title="Área do Aluno - Sistema de Gestão e Controle de Armários da AAPM"
        description="Consulte sua reserva, prazo de locação e informações do armário no sistema da AAPM SENAI Osasco."
        path="/usuario/tela-principal"
      />
      <div className={styles.containerGeral}>
        {showModal && (
          <ModalNovoTermo
            termos={termosParaAceitar}
            onAceitar={handleAceitar}
            onRecusar={handleRecusar}
          />
        )}
        <div
          className={`${styles.principalBox} ${dados.status === "EXPIRADA" ? styles.principalBoxPlanos : ""
            }`}
        >
          <div className={styles.header}>
            <p className={styles.saudacao}>
              Olá, {getNomeExibicao(dados, "Usuário")}!
            </p>
            {tempo?.alerta && (
              <div className={styles.alertaExpiracao}>
                ⚠ Renove em breve para não perder o acesso.
              </div>
            )}
          </div>

          {dados.status === "ATIVA" && tempo && !tempo.expirado && (
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

          {dados.status === "SEM_RESERVA" && (
            <AvisoStatus texto="Vá até a secretaria da AAPM para realizar o pagamento e escolher seu armário." />
          )}

          {dados.status === "EXPIRADA" && (
            <div className={styles.planosExpirados}>
              <p className={styles.textoExpirado}>
                Sua assinatura expirou. Conheça nossos planos e assine novamente!
              </p>
              <Planos mostrarTitulo={false} modoConsulta />
            </div>
          )}

          {dados.status === "ATIVA" && (
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
          )}
        </div>
      </div>
    </div>
  );
}
