import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../pages/Home/Home.module.css";
import { API_ROUTES } from "../../utils/auth.js";

function Icon({ name }) {
  return <span className="material-symbols-outlined">{name}</span>;
}

function formatPrice(valor) {
  return valor
    ? `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "---";
}

function Card({ s, modoConsulta }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.cardGlow} />
      <div className={styles.cardTop}>
        <span className={`${styles.cardBadge} ${s.badgeClass}`}>{s.badge}</span>
        <div className={styles.cardIcon}>{s.icon}</div>
      </div>
      <div className={styles.cardName}>{s.name}</div>
      <div className={styles.cardTitle}>{s.title}</div>
      <div className={styles.cardPrice}>
        <span className={styles.amt}>{s.price}</span>
        <span className={styles.per}>&nbsp;{s.period}</span>
      </div>
      <div className={styles.cardDesc}>{s.desc}</div>
      <div className={styles.cardHr} />
      <div className={styles.cardFeatures}>
        {s.features.map((f) => (
          <div className={styles.feat} key={f}>
            <div className={styles.featCheck}>
              <svg viewBox="0 0 10 10">
                <polyline points="1.5,5 4,7.5 8.5,2" />
              </svg>
            </div>
            {f}
          </div>
        ))}
      </div>
      <button
        className={`${styles.btnContratar} ${
          modoConsulta ? styles.btnConsulta : ""
        }`}
        type="button"
        onClick={() => {
          if (!modoConsulta) navigate(s.route);
        }}
        disabled={modoConsulta}
      >
        <div className={styles.btnBg} />
        <span className={styles.btnLabel}>
          {modoConsulta
            ? "Consulte a secretaria para renovação"
            : "Contratar Serviço"}
        </span>
        {!modoConsulta && (
          <span className={styles.btnArrow}>
            <svg viewBox="0 0 16 16">
              <line x1="2" y1="8" x2="13" y2="8" />
              <polyline points="9,4 13,8 9,12" />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}

export default function Planos({ mostrarTitulo = true, modoConsulta = false }) {
  const [precos, setPrecos] = useState({});

  useEffect(() => {
    fetch(API_ROUTES.produtos.listar)
      .then((r) => r.json())
      .then((data) => {
        const mapa = {};
        data.dados.forEach((p) => (mapa[p.produto] = p.preco));
        setPrecos(mapa);
      });
  }, []);

  return (
    <>
      {mostrarTitulo && (
        <div className={styles.sectionEyebrow}>Escolha seu plano</div>
      )}
      <div className={styles.cards}>
        <Card
          modoConsulta={modoConsulta}
          s={{
            badge: "Popular",
            badgeClass: styles.badgePopular,
            icon: <Icon name="inventory_2" />,
            name: "Armário",
            route: "/cadastro-armario",
            title: "Seja um associado da AAPM",
            price: formatPrice(precos["A"]),
            period: "/ semestre",
            desc: "Guarde seus pertences com total segurança durante o período escolar e além disso:",
            features: [
              "Armário individual incluso",
              "Desconto no Curso de Inglês",
              "Ações em datas comemorativas",
              "Localização próxima às salas de aula",
              "Ambiente monitorado por câmeras",
            ],
          }}
        />
        <Card
          modoConsulta={modoConsulta}
          s={{
            badge: "Novo",
            badgeClass: styles.badgeNovo,
            icon: <Icon name="two_wheeler" />,
            name: "Estacionamento",
            route: "/cadastro-estacionamento",
            title: "Vaga de Estacionamento",
            price: formatPrice(precos["E"]),
            period: "/ mês",
            desc: "Disponível nos três turnos, segurança reforçada no período noturno.",
            features: [
              "Vaga garantida",
              "Empresa parceira de segurança",
              "Monitoramento por câmeras",
              "Turnos manhã, tarde e noite",
              "Pagamento apenas presencialmente",
            ],
          }}
        />
      </div>
    </>
  );
}
