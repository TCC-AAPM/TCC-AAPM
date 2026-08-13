import styles from "./SobreNosAAPM.module.css";

export default function SobreNosAAPM() {
  return (
    <div className={styles.containerGeral}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.hero}>
        <h1>
          Sobre a <em>AAPM</em>
        </h1>
        <p className={styles.heroSub}>
          Associacao de Alunos, Ex-Alunos, Pais e Mestres do SENAI Osasco
        </p>
      </div>

      <div className={styles.cards}>
        <div className={styles.cardFoto}>
          <span>* Foto da AAPM em breve *</span>
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
      </div>
    </div>
  );
}
