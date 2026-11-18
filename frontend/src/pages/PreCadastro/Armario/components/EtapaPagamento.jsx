import styles from "../PreCadastroArmario.module.css";

export default function EtapaPagamento({ precos, navigate, formatarPreco }) {
  return (
    <div className={styles.pagina}>
      <div className={styles.corpo}>
        <aside className={styles.esquerda}>
          <h1>
            Pagamento
            <br />
            <em>presencial</em>
          </h1>

          <p>
            Você precisa realizar o pagamento presencialmente na secretaria da
            AAPM para finalizar sua contratação.
          </p>
        </aside>

        <div className={styles.card}>
          <div className={styles.separador}>O que você precisa fazer</div>

          <div className={styles["caixa-termos"]}>
            <p>
              Como atualmente não temos uma solução de pagamento online, o
              próximo passo é realizar o pagamento presencialmente na secretaria
              da AAPM.
            </p>

            <p>
              Leve um documento de identificação e a equipe da AAPM irá te
              atender.
            </p>
          </div>

          <div className={styles.separador}>Pagamento</div>

          <div className={styles["aviso-pagamento"]}>
            <p>
              O valor do aluguel do armário é de{" "}
              <strong>{formatarPreco(precos["A"])}</strong>. Pagamento na
              secretaria da AAPM, perto da biblioteca do Senai.
            </p>
          </div>

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
