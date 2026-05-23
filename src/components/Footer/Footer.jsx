import styles from "./Footer.module.css";
import logo from "../../assets/images/AAPM-Logo.png";
import {
  Email,
  Phone,
  Computer,
  WhatsApp,
  LocationOn,
  Map,
} from "@mui/icons-material";
import { useTheme } from "../../utils/darkMode";

export default function Footer() {
  const { darkMode } = useTheme();
  return (
    <footer
      className={styles.footer} data-theme={darkMode ? "dark" : "light"}
    >
      <div className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <img src={logo} alt="Logo AAPM" className={styles.logo} />
            <p className={styles.brandDesc}>
              A AAPM (Associação de Alunos, Ex-Alunos, Pais e Mestres) <br /> do
              SENAI de Osasco atua na Escola SENAI "Nadir Dias de Figueiredo".
            </p>
            <div className={styles.socialRow}>
              <a
                href="mailto:aapmsenaiosasco@gmail.com"
                className={styles.socialBtn}
                aria-label="Email"
              >
                <Email fontSize="small" />
              </a>
            </div>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Quem Somos</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="#" className={styles.link}>
                  Nós AAPM
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Nós Desenvolvedores
                </a>
              </li>
              <li>
                <a
                  href="https://www.sp.senai.br/unidade/metalurgia/"
                  target="_blank"
                  className={styles.link}
                >
                  Senai Osasco
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Termos</h4>
            <ul className={styles.linkList}>
              <li>
                <a
                  href="./public/termo-armario.pdf"
                  target="blank"
                  className={styles.link}
                >
                  Contrato de Armários
                </a>
              </li>
              <li>
                <a
                  href="./public/termo-estacionamento.pdf"
                  target="blank"
                  className={styles.link}
                >
                  Contrato de Estacionamento
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Termos de privacidade
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Termos de uso do site
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Suporte</h4>
            <div className={styles.supportItem}>
              <Email fontSize="small" />
              <a
                href="mailto:aapmsenaiosasco@gmail.com"
                className={styles.link}
              >
                Email
              </a>
            </div>
            <div className={styles.supportItem}>
              <Computer fontSize="small" />
              <a href="#" className={styles.link}>
                Assistência Online
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.locationStrip}>
        <LocationOn className={styles.locationPin} />
        <div className={styles.locationInfo}>
          <h5 className={styles.locationTitle}>
            SENAI Osasco — Escola SENAI "Nadir Dias de Figueiredo"
          </h5>
          <p className={styles.locationAddr}>
            Rua Ari Barroso, 305 - Presidente Altino - Osasco/SP · CEP:
            06216-901
          </p>
        </div>
        <a
          href="https://maps.google.com/?q=SENAI+Osasco+Nadir+Dias+de+Figueiredo+Rua+Ari+Barroso+305"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapBtn}
        >
          <Map fontSize="small" /> Ver no Google Maps
        </a>
      </div>
    </footer>
  );
}
