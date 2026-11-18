import styles from "../PreCadastroArmario.module.css";

export default function EtapaBloqueado({ navigate }) {
  return (
    <div className={styles.pagina}>
      <div className={styles.corpo}>
        <aside className={styles.esquerda}>
          <h1>
            Ops, <em>não</em>
            <br />é possível
          </h1>

          <p>Infelizmente não conseguimos prosseguir com o seu cadastro.</p>
        </aside>

        <div className={styles.card}>
          <div className={styles.separador}>Cadastro não permitido</div>

          <div className={styles["aviso-bloqueio"]}>
            <p>
              Você precisa ter <strong>pelo menos 14 anos</strong> para realizar
              o cadastro.
            </p>
          </div>

          <button
            className={styles["btn-principal"]}
            onClick={() => navigate("/")}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}
