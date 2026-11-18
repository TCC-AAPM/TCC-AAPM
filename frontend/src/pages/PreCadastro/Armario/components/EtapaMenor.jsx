import styles from "../PreCadastroArmario.module.css";

export default function EtapaMenor({ termoArmarioUrl, navigate }) {
  return (
    <div className={styles.pagina}>
      <div className={styles.corpo}>
        <aside className={styles.esquerda}>
          <h1>
            Autorização
            <br />
            <em>necessária</em>
          </h1>

          <p>
            Por exigência do ECA e da LGPD, menores de 18 anos precisam de
            autorização de um responsável legal.
          </p>
        </aside>

        <div className={styles.card}>
          <div className={styles.separador}>O que você precisa fazer</div>

          <div className={styles["caixa-termos"]}>
            <p>
              Como você ainda não tem 18 anos,{" "}
              <strong>não é possível concluir o cadastro online</strong>. Seu
              responsável deverá comparecer presencialmente à secretaria.
            </p>

            <p>
              Você pode imprimir o termo abaixo e levá-lo já assinado para
              agilizar o processo.
            </p>
          </div>

          <div className={styles.separador}>Termo de uso do armário</div>

          <iframe
            src={termoArmarioUrl}
            className={styles["iframe-termo"]}
            title="Termo de uso do armário"
          />

          <a
            href={termoArmarioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["btn-principal"]}
            style={{
              textAlign: "center",
              textDecoration: "none",
              display: "block",
            }}
          >
            Abrir termo para impressão
          </a>

          <div className={styles["rodape-card"]}>
            <button
              className={styles["btn-secundario"]}
              onClick={() => navigate("/")}
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
