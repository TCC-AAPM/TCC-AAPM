import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO/SEO.jsx";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Página não encontrada"
        description="A página solicitada não foi encontrada no sistema da AAPM SENAI Osasco."
        path="/404"
        noIndex
      />

      <main className={styles.principalBox}>
        <section className={styles.card} aria-labelledby="titulo-not-found">
          <span className={styles.codigo} aria-hidden="true">
            404
          </span>

          <div className={styles.conteudo}>
            <h1 id="titulo-not-found">Página não encontrada</h1>
            <p>O caminho acessado não existe ou foi movido.</p>
          </div>

          <button
            type="button"
            className={`btn btn-primary ${styles.btnPrimary}`}
            onClick={() => navigate("/")}
          >
            Voltar para a tela principal
          </button>
        </section>
      </main>
    </>
  );
}
