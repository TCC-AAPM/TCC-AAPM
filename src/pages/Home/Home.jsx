import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../utils/auth.js";

function Icon({ name }) {
  return <span className="material-symbols-outlined">{name}</span>;
}

function Card({ s }) {
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

      <button className={styles.btnContratar} onClick={() => navigate(s.route)}>
        <div className={styles.btnBg} />
        <span className={styles.btnLabel}>Contratar Serviço</span>
        <span className={styles.btnArrow}>
          <svg viewBox="0 0 16 16">
            <line x1="2" y1="8" x2="13" y2="8" />
            <polyline points="9,4 13,8 9,12" />
          </svg>
        </span>
      </button>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [precos, setPrecos] = useState({});

  console.log(precos);

  useEffect(() => {
    fetch(API_ROUTES.produtos.listar)
      .then((r) => r.json())
      .then((data) => {
        const mapa = {};
        data.dados.forEach((p) => (mapa[p.produto] = p.preco));
        setPrecos(mapa);
      });
  }, []);

  const services = [
    {
      badge: "Popular",
      badgeClass: styles.badgePopular,
      icon: <Icon name="inventory_2" />,
      name: "Armário",
      route: "/cadastro-armario",
      produtoKey: "A",
      title: "Seja um associado da AAPM",
      price: precos["A"]
        ? `R$ ${precos["A"].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "---",
      period: "/ semestre",
      desc: "Guarde seus pertences com total segurança durante o período escolar e além disso:",
      features: [
        "Armário individual incluso",
        "Desconto no Curso de Inglês",
        "Wifi Livre",
        "Apoio Assistencial",
        "Ações em datas comemorativas",
        "Localização próxima às salas de aula",
        "Ambiente monitorado por câmeras",
      ],
    },
    {
      badge: "Novo",
      badgeClass: styles.badgeNovo,
      icon: <Icon name="two_wheeler" />,
      name: "Estacionamento",
      route: "/cadastro-estacionamento",
      produtoKey: "E",
      title: "Vaga de Estacionamento",
      price: precos["E"]
        ? `R$ ${precos["E"].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "---",
      period: "/ mês",
      desc: "Disponível nos três turnos, segurança reforçada no período noturno.",
      features: [
        "Vaga garantida",
        "Monitoramento por câmeras",
        "Turnos manhã, tarde e noite",
        "Pagamento por Pix",
      ],
    },
  ];

  return (
    <>
      <div className={styles.containerGeral}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <nav className={styles.nav}>
          <div className={styles.navLogo}>
            <div className={styles.navLogoBox}>
              <img
                src="./src/assets/images/AAPM-Logo.png"
                alt="AAPM"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div className={styles.navBrand}>
              AAPM<small>SENAI Osasco</small>
            </div>
          </div>
          <div className={styles.navActions}>
            <button
              className={styles.btnGhost}
              onClick={() => navigate("/login")}
            >
              Entrar
            </button>
          </div>
        </nav>
        <div className={styles.hero}>
          <div className={styles.heroPill}>
            <span className={styles.pillDot} />
            Serviços por assinatura
          </div>
          <h1>
            Serviços <em>AAPM</em>
            <br />
            Senai Osasco
          </h1>
          <p>
            Assine nossos serviços de armário e estacionamento com praticidade
            total. Sem burocracia, sem complicação.
          </p>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionEyebrow}>Escolha seu plano</div>
          <div className={styles.cards}>
            {services.map((s) => (
              <Card key={s.name} s={s} />
            ))}
          </div>
        </div>{" "}
      </div>
    </>
  );
}
