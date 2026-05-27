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
    Associação de Alunos, Ex-Alunos, Pais e Mestres do SENAI Osasco
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
            A AAPM (Associação de Alunos, Ex-Alunos, Pais e Mestres) é a
            entidade representativa da comunidade escolar do SENAI "Nadir Dias
            de Figueiredo", em Osasco. Criada para fortalecer os laços entre
            escola, famílias e profissionais, a associação atua em prol do
            desenvolvimento educacional e social de todos os seus membros.
          </p>
          <div className={styles.stacks}>
            <span className={styles.stack}>Educação</span>
            <span className={styles.stack}>Comunidade</span>
            <span className={styles.stack}>SENAI Osasco</span>
          </div>
        </div>

        <div className={styles.cardTexto}>
          <span className={styles.role}>Nossa missão</span>
          <h2 className={styles.name}>O que fazemos</h2>
          <p className={styles.bio}>
            A AAPM oferece serviços como gestão de armários e vagas de
            estacionamento. Tudo pensado para facilitar o dia a dia de alunos,
            professores e pais dentro do ambiente do SENAI.
          </p>
          <div className={styles.stacks}>
            <span className={styles.stack}>Armários</span>
            <span className={styles.stack}>Estacionamento</span>
          </div>
        </div>
      </div>
    </div>
  );
}
