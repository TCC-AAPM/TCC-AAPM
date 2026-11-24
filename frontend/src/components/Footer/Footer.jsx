import styles from "./Footer.module.css";
import { useEffect, useState } from "react";
import logo from "../../assets/images/AAPM-Logo.png";
import { Email, Computer, LocationOn, Map } from "@mui/icons-material";
import { useTheme } from "../../utils/darkMode";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ROUTES } from "../../routes/config/api.js";

function obterListaTermosAtivos(resposta) {
  const termos = resposta?.dados ?? resposta?.Dados;
  return Array.isArray(termos) ? termos : [];
}

function obterReferencia(termo) {
  return termo?.referencia ?? termo?.Referencia;
}

function encontrarTermoAtivo(termos, referencia, valorEnum) {
  return termos.find((termo) => {
    const valor = String(obterReferencia(termo)).toUpperCase();
    return valor === referencia || valor === String(valorEnum);
  });
}

export default function Footer() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [referenciasTermos, setReferenciasTermos] = useState({
    site: null,
    armario: null,
  });

  useEffect(() => {
    async function carregarTermosAtivos() {
      try {
        const resposta = await fetch(API_ROUTES.termos.termosAtivos);
        if (!resposta.ok) throw new Error("Erro ao buscar termos ativos.");

        const dados = await resposta.json();
        const termos = obterListaTermosAtivos(dados);
        const site = encontrarTermoAtivo(termos, "S", 2);
        const armario = encontrarTermoAtivo(termos, "A", 0);

        setReferenciasTermos({
          site: site ? obterReferencia(site) : null,
          armario: armario ? obterReferencia(armario) : null,
        });
      } catch (error) {
        console.error("Erro ao carregar termos ativos do footer:", error);
      }
    }

    carregarTermosAtivos();
  }, []);

  const termoSiteUrl = referenciasTermos.site
    ? API_ROUTES.termos.obterPdf(referenciasTermos.site)
    : API_ROUTES.termos.obterPdf("S");
  const termoArmarioUrl = referenciasTermos.armario
    ? API_ROUTES.termos.obterPdf(referenciasTermos.armario)
    : API_ROUTES.termos.obterPdf("A");
  const termoPrivacidadeUrl = "/documentos/politica-de-privacidade.pdf";

  const footerType = location.pathname.startsWith("/admin")
    ? "admin"
    : location.pathname.startsWith("/usuario")
      ? "user"
      : "full";

  if (footerType === "admin") {
    return (
      <footer
        className={styles.adminFooter}
        data-theme={darkMode ? "dark" : "light"}
      >
        <p className={styles.adminText}>© 2026 AAPM SENAI Osasco</p>
      </footer>
    );
  }

  if (footerType === "user") {
    return (
      <footer
        className={styles.userFooter}
        data-theme={darkMode ? "dark" : "light"}
      >
        <div className={styles.userContainer}>
          {/* LOGO */}
          <div className={styles.brand}>
            <img src={logo} alt="Logo AAPM" className={styles.logo} loading="lazy" />

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

          {/* QUEM SOMOS */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Quem Somos</h4>

            <ul className={styles.linkList}>
              <li>
                <a
                  onClick={() => navigate("/sobre-nos-aapm")}
                  className={styles.link}
                >
                  Nós AAPM
                </a>
              </li>

              <li>
                <a
                  onClick={() => navigate("/sobre-nos-devs")}
                  className={styles.link}
                >
                  Nós Desenvolvedores
                </a>
              </li>

              <li>
                <a
                  href="https://www.sp.senai.br/unidade/metalurgia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Senai Osasco
                </a>
              </li>
            </ul>
          </div>

          {/* TERMOS */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Termos</h4>

            <ul className={styles.linkList}>
              <li>
                <a
                  href={termoArmarioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Contrato de Armários
                </a>
              </li>

              <li>
                <a
                  href={termoPrivacidadeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Política de Privacidade e LGPD
                </a>
              </li>

              <li>
                <a
                  href={termoSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Termos de Uso do Site
                </a>
              </li>
            </ul>
          </div>

          {/* SUPORTE */}
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
      </footer>
    );
  }

  return (
    <footer className={styles.footer} data-theme={darkMode ? "dark" : "light"}>
      <div className={styles.main}>
        <div className={styles.grid}>
          {/* LOGO */}
          <div className={styles.brand}>
            <img src={logo} alt="Logo AAPM" className={styles.logo} loading="lazy" />

            <p className={styles.brandDesc}>
              A AAPM (Associação de Alunos, Ex-Alunos, Pais e Mestres)
              <br />
              do SENAI de Osasco atua na Escola SENAI "Nadir Dias de
              Figueiredo".
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

          {/* QUEM SOMOS */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Quem Somos</h4>

            <ul className={styles.linkList}>
              <li>
                <a
                  onClick={() => navigate("/sobre-nos-aapm")}
                  className={styles.link}
                >
                  Nós AAPM
                </a>
              </li>

              <li>
                <a
                  onClick={() => navigate("/sobre-nos-devs")}
                  className={styles.link}
                >
                  Nós Desenvolvedores
                </a>
              </li>

              <li>
                <a
                  href="https://www.sp.senai.br/unidade/metalurgia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Senai Osasco
                </a>
              </li>
            </ul>
          </div>

          {/* TERMOS */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Termos</h4>

            <ul className={styles.linkList}>
              <li>
                <a
                  href={termoArmarioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Contrato de Armários
                </a>
              </li>

              <li>
                <a
                  href={termoPrivacidadeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Política de Privacidade e LGPD
                </a>
              </li>

              <li>
                <a
                  href={termoSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Termos de Uso do Site
                </a>
              </li>
            </ul>
          </div>

          {/* SUPORTE */}
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

      {/* LOCALIZAÇÃO */}
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
          <Map fontSize="small" />
          Ver no Google Maps
        </a>
      </div>
    </footer>
  );
}
