import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO/SEO.jsx";
import styles from "./AcessoNegado.module.css";

export default function AcessoNegado() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Acesso negado"
        description="Acesso negado a uma área restrita do sistema da AAPM SENAI Osasco."
        path="/acesso-negado"
        noIndex
      />

      <main className={styles.principalBox}>
        <section className={styles.card} aria-labelledby="titulo-acesso-negado">
          <span className={styles.codigo} aria-hidden="true">
            <LockKeyhole size={58} strokeWidth={1.8} />
          </span>

          <div className={styles.conteudo}>
            <h1 id="titulo-acesso-negado">Acesso negado</h1>
            <p>Seu perfil não possui permissão para acessar esta página.</p>
          </div>

          <button
            type="button"
            className={`btn btn-primary ${styles.btnPrimary}`}
            onClick={() => navigate("/login")}
          >
            Ir para tela de login
          </button>
        </section>
      </main>
    </>
  );
}
