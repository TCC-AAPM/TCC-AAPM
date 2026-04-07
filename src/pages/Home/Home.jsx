import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

function Icon({ name, className }) {
  return (
    <span className={`material-symbols-outlined ${className || ""}`}>
      {name}
    </span>
  );
}

const services = [
  {
    badge: "Popular",
    badgeClass: styles.badgePopular,
    icon: <Icon name="inventory_2" />,
    name: "Armário",
    title: "Armário Individual",
    price: "R$ 90,00",
    period: "/ semestre",
    desc: "Guarde seus pertences com total segurança durante o período escolar.",
    features: [
      "Acesso 24 horas por dia",
      "Cadeado individual incluso",
      "Localização próxima às salas de aula",
      "Ambiente monitorado por câmeras",
    ],
  },
  {
    badge: "Novo",
    badgeClass: styles.badgeNovo,
    icon: <Icon name="two_wheeler" />,
    name: "Estacionamento",
    title: "Vaga de Estacionamento",
    price: "R$ 75,00",
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

function Card({ s }) {
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
      <button className={styles.btnContratar}>
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

export default function App() {

  const navigate = useNavigate();
  
  return (
    <>
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
          <button className={styles.btnSolid}>Cadastrar</button>
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
      </div>
    </>
  );
}
