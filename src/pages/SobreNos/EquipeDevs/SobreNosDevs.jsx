import styles from "./SobreNosDevs.module.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

import isabellaFoto from "../../../assets/images/isabella.jpeg";
import gabrielFoto from "../../../assets/images/gabriel.jpg"
import rhuanFoto from "../../../assets/images/rhuan.jpg"

export default function SobreNosDevs() {
  return (
    <div className={styles.containerGeral}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.hero}>
        <h1>
          Quem desenvolveu <em>tudo</em>
        </h1>
      </div>

      <div className={styles.cards}>

        <a className={styles.card} href="https://lopreti.github.io/meu-portfolio/" target="_blank" rel="noreferrer">
          <div className={styles.photo}>
            <img src={isabellaFoto} alt="Isabella Lopreti" />
          </div>
          <div className={styles.info}>
            <span className={styles.role}>Frontend · UI/UX</span>
            <h2 className={styles.name}>Isabella Lopreti</h2>
            <p className={styles.bio}>
              Criou toda a interface do sistema, dos wireframes no Figma aos
              componentes em React. Definiu a identidade visual da AAPM e
              garantiu uma experiência fluida.
            </p>
            <div className={styles.stacks}>
              <span className={styles.stack}>React</span>
              <span className={styles.stack}>Figma</span>
              <span className={styles.stack}>MUI</span>
            </div>
            <div className={styles.links}>
              <a className={styles.link} href="https://github.com/lopreti" target="_blank" rel="noreferrer">
                <GitHubIcon fontSize="small" /> GitHub
              </a>
              <a className={styles.link} href="https://www.linkedin.com/in/isabella-lopreti-541619305" target="_blank" rel="noreferrer">
                <LinkedInIcon fontSize="small" /> LinkedIn
              </a>
              <a className={styles.link} href="mailto:lopretiisabella@gmail.com">
                <EmailIcon fontSize="small" /> E-mail
              </a>
            </div>
          </div>
        </a>

        <a className={`${styles.card} ${styles.cardRight}`} href="https://devgabrielduarte07.github.io/Portfolio-Gabriel/" target="_blank" rel="noreferrer">
          <div className={styles.info}>
            <span className={styles.role}>Backend · API</span>
            <h2 className={styles.name}>Gabriel Duarte</h2>
            <p className={styles.bio}>
              Arquitetou toda a camada de servidor — banco de dados, regras de
              negócio e a API REST que sustenta assinaturas, autenticação e
              gestão de vagas e armários.
            </p>
            <div className={styles.stacks}>
              <span className={styles.stack}>C#</span>
              <span className={styles.stack}>Asp.Net</span>
              <span className={styles.stack}>MariaDB</span>
              <span className={styles.stack}>JWT</span>
            </div>
            <div className={styles.links}>
              <a className={styles.link} href="https://github.com/devGabrielDuarte07" target="_blank" rel="noreferrer">
                <GitHubIcon fontSize="small" /> GitHub
              </a>
              <a className={styles.link} href="https://www.linkedin.com/in/gabriel-duarte-bb25542b7/" target="_blank" rel="noreferrer">
                <LinkedInIcon fontSize="small" /> LinkedIn
              </a>
              <a className={styles.link} href="mailto:dev.gabrielduarte07@gmail.com">
                <EmailIcon fontSize="small" /> E-mail
              </a>
            </div>
          </div>
          <div className={styles.photo}>
            <img src={gabrielFoto} alt="Gabriel Duarte" />
          </div>
        </a>

        <a className={styles.card} href="https://rhuanvieira.github.io/portfolio/" target="_blank" rel="noreferrer">
          <div className={styles.photo}>
            <img src={rhuanFoto} alt="Rhuan Vieira" />
          </div>
          <div className={styles.info}>
            <span className={styles.role}>Mobile · Full Stack</span>
            <h2 className={styles.name}>Rhuan Vieira</h2>
            <p className={styles.bio}>
              Desenvolveu a versão mobile da plataforma AAPM — um aplicativo em
              Flutter que replica as funcionalidades do site e está atualmente
              em beta.
            </p>
            <div className={styles.stacks}>
              <span className={styles.stack}>Flutter</span>
              <span className={styles.stack}>Android Studio</span>
            </div>
            <div className={styles.links}>
              <a className={styles.link} href="https://github.com/RhuanVieira" target="_blank" rel="noreferrer">
                <GitHubIcon fontSize="small" /> GitHub
              </a>
              <a className={styles.link} href="https://www.linkedin.com/in/rhuanvieira79bb0b35b/" target="_blank" rel="noreferrer">
                <LinkedInIcon fontSize="small" /> LinkedIn
              </a>
              <a className={styles.link} href="mailto:@email.com">
                <EmailIcon fontSize="small" /> E-mail
              </a>
            </div>
          </div>
        </a>

      </div>
    </div>
  );
}
