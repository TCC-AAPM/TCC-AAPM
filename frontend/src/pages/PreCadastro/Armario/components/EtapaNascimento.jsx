import styles from "../PreCadastroArmario.module.css";

export default function EtapaNascimento({
  form,
  setForm,
  handleNascimento,
  navigate,
  formatarDataInput,
}) {
  const hoje = new Date();
  const dataMaxima = formatarDataInput(hoje);

  const dataMinima = new Date();
  dataMinima.setFullYear(dataMinima.getFullYear() - 100);

  return (
    <div className={styles.pagina}>
      <div className={styles.corpo}>
        <aside className={styles.esquerda}>
          <h1>
            Vamos começar
            <br />
            com sua <em>data de nascimento</em>
          </h1>

          <p>Precisamos saber sua idade para continuar.</p>
        </aside>

        <div className={styles.card}>
          <div className={styles.separador}>
            Qual é a sua data de nascimento?
          </div>

          <div
            className={`${styles.campo} ${
              form.nascimento ? styles.filled : ""
            }`}
          >
            <input
              type="date"
              value={form.nascimento}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  nascimento: e.target.value,
                }))
              }
              min={formatarDataInput(dataMinima)}
              max={dataMaxima}
            />
          </div>

          <button
            type="button"
            className={styles["btn-principal"]}
            onClick={handleNascimento}
          >
            Continuar
          </button>

          <div className={styles["rodape-card"]}>
            <span>Já possui cadastro?</span>

            <button
              className={styles["btn-secundario"]}
              onClick={() => navigate("/login")}
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
