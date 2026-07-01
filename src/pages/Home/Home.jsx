import styles from "./Home.module.css";
import Planos from "../../components/Planos/Planos.jsx";

export default function Home() {
  return (
    <div className={styles.containerGeral}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
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
        <Planos />
      </div>
    </div>
  );
}
