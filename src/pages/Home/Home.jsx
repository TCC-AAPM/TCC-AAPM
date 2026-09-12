import styles from "./Home.module.css";
import Planos from "../../components/Planos/Planos.jsx";
import SEO from "../../components/SEO/SEO.jsx";

export default function Home() {
  return (
    <section className={styles.containerGeral}>
      <SEO
        title="Sistema de Gestão e Controle de Armários da AAPM"
        description="Conheça os planos e serviços de reserva de armários da AAPM para alunos do SENAI Osasco."
        path="/"
      />
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <header className={styles.hero}>
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
          Assine nosso serviço de armário com praticidade total. Sem burocracia,
          sem complicação.
        </p>
      </header>

      <section className={styles.section}>
        <Planos />
      </section>
    </section>
  );
}
