import { useState, useEffect } from "react";
import styles from "./SobreNosAAPM.module.css";
import SEO from "../../../components/SEO/SEO.jsx";

import foto1 from "../../../assets/images/foto-aapm1.png";
import foto2 from "../../../assets/images/foto-aapm2.png";

const fotos = [foto1, foto2];

export default function SobreNosAAPM() {
  const [indice, setIndice] = useState(0);

  const anterior = () => setIndice((i) => (i === 0 ? fotos.length - 1 : i - 1));
  const proxima = () => setIndice((i) => (i === fotos.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const timer = setInterval(proxima, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.containerGeral}>
      <SEO
        title="Sobre a AAPM - Sistema de Gestão e Controle de Armários"
        description="Saiba mais sobre a AAPM do SENAI Osasco e sua atuação na gestão de armários e apoio aos alunos."
        path="/sobre-nos-aapm"
      />
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <header className={styles.hero}>
        <h1>
          Sobre a <em>AAPM</em>
        </h1>
        <p className={styles.heroSub}>
          Associacao de Alunos, Ex-Alunos, Pais e Mestres do SENAI Osasco
        </p>
      </header>

      <section className={styles.cards}>
        <div className={styles.cardFoto}>
          <img
            key={indice}
            src={fotos[indice]}
            alt="Foto da AAPM"
            className={styles.fotoCarrossel}
          />
          <div className={styles.overlay} />
          {/* resto igual */}

          <button onClick={anterior} className={styles.setaEsquerda}>
            ‹
          </button>
          <button onClick={proxima} className={styles.setaDireita}>
            ›
          </button>

          <div className={styles.pontos}>
            {fotos.map((_, i) => (
              <span
                key={i}
                className={i === indice ? styles.pontoAtivo : styles.ponto}
                onClick={() => setIndice(i)}
              />
            ))}
          </div>
        </div>

        <div className={styles.cardTexto}>
          <span className={styles.role}>Quem somos</span>
          <h2 className={styles.name}>AAPM</h2>
          <p className={styles.bio}>
            A AAPM (Associacao de Alunos, Ex-Alunos, Pais e Mestres) e a
            entidade representativa da comunidade escolar do SENAI "Nadir Dias
            de Figueiredo", em Osasco. Criada para fortalecer os lacos entre
            escola, familias e profissionais, a associacao atua em prol do
            desenvolvimento educacional e social de todos os seus membros.
          </p>
          <div className={styles.stacks}>
            <span className={styles.stack}>Educacao</span>
            <span className={styles.stack}>Comunidade</span>
            <span className={styles.stack}>SENAI Osasco</span>
          </div>
        </div>

        <div className={styles.cardTexto}>
          <span className={styles.role}>Nossa missao</span>
          <h2 className={styles.name}>O que fazemos</h2>
          <p className={styles.bio}>
            A AAPM oferece servicos como gestao de armarios. Tudo pensado para
            facilitar o dia a dia de alunos, professores e pais dentro do
            ambiente do SENAI.
          </p>
          <div className={styles.stacks}>
            <span className={styles.stack}>Armarios</span>
          </div>
        </div>
      </section>
    </section>
  );
}
