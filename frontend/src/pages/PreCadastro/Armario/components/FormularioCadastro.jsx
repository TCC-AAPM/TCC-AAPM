import styles from "../PreCadastroArmario.module.css";

export default function FormularioCadastro({
  form,
  cursos,
  turmas,
  atualizar,
  handleCurso,
  obterIdCurso,
  obterNomeCurso,
  obterIdTurma,
  obterNomeTurma,
  carregandoTermos,
  erroTermos,
  termoArmarioUrl,
  termoSiteUrl,
  termoPrivacidadeUrl,
  setForm,
  handleSubmit,
  loading,
  navigate,
}) {
  return (
    <div className={styles.pagina}>
      <div className={styles.corpo}>
        <aside className={styles.esquerda}>
          <h1>
            Seus <em>dados</em>
            <br />
            pessoais
          </h1>

          <p>
            Preencha as informações ao lado para contratar o serviço. Rápido e
            sem burocracia.
          </p>

          <div className={styles.passos}>
            <div className={styles.passo}>
              <div className={`${styles["passo-num"]} ${styles.ativo}`}>1</div>

              <div className={styles["passo-info"]}>
                <strong>Dados pessoais</strong>
                <span>Você está aqui</span>
              </div>
            </div>

            <div className={styles.passo}>
              <div className={`${styles["passo-num"]} ${styles.pendente}`}>
                2
              </div>

              <div className={styles["passo-info"]}>
                <strong>Pagamento</strong>
                <span>Secretaria presencial</span>
              </div>
            </div>
          </div>
        </aside>

        <div className={styles.card}>
          <div className={styles.separador}>Identificação</div>

          <div className={styles.campo}>
            <input
              type="text"
              placeholder=" "
              value={form.nome}
              onChange={atualizar("nome")}
            />
            <label>Nome completo</label>
          </div>

          <div className={styles.campo}>
            <input
              type="text"
              placeholder=" "
              value={form.nomeSocial}
              onChange={atualizar("nomeSocial")}
            />
            <label>Nome social (opcional)</label>
          </div>

          <div className={styles.linha}>
            <div className={`${styles.campo} ${form.cpf ? styles.filled : ""}`}>
              <input
                type="text"
                placeholder=" "
                value={form.cpf}
                onChange={atualizar("cpf")}
                maxLength={14}
              />
              <label>CPF</label>
            </div>

            <div className={`${styles.campo} ${styles.filled}`}>
              <input type="date" value={form.nascimento} readOnly />
              <label>Nascimento</label>
            </div>
          </div>

          <div className={styles.separador}>Contato</div>

          <div className={styles.campo}>
            <input
              type="email"
              placeholder=" "
              value={form.email}
              onChange={atualizar("email")}
            />
            <label>E-mail</label>
          </div>

          <div className={styles.campo}>
            <input
              type="tel"
              placeholder=" "
              value={form.telefone}
              onChange={atualizar("telefone")}
              maxLength={15}
            />
            <label>Telefone</label>
          </div>

          <div className={styles.separador}>Dados Escolares</div>

          <div className={styles.campo}>
            <input
              type="text"
              placeholder=" "
              value={form.matricula}
              onChange={atualizar("matricula")}
            />
            <label>Matrícula (opcional)</label>
          </div>

          <div className={styles.linha}>
            <div
              className={`${styles.campo} ${form.idCurso ? styles.filled : ""}`}
            >
              <select value={form.idCurso} onChange={handleCurso}>
                <option value="" />

                {cursos
                  .filter((c) => obterIdCurso(c) !== undefined)
                  .map((c) => {
                    const idCurso = obterIdCurso(c);

                    return (
                      <option key={idCurso} value={idCurso}>
                        {obterNomeCurso(c)}
                      </option>
                    );
                  })}
              </select>

              <label>Curso</label>
            </div>

            <div
              className={`${styles.campo} ${form.idTurma ? styles.filled : ""}`}
            >
              <select
                value={form.idTurma}
                onChange={atualizar("idTurma")}
                disabled={!turmas.length}
              >
                <option value="" />

                {turmas
                  .filter((t) => obterIdTurma(t) !== undefined)
                  .map((t) => {
                    const idTurma = obterIdTurma(t);

                    return (
                      <option key={idTurma} value={idTurma}>
                        {obterNomeTurma(t)}
                      </option>
                    );
                  })}
              </select>

              <label>Turma</label>
            </div>
          </div>

          <div className={styles.separador}>Termos</div>

          {carregandoTermos ? (
            <p>Carregando termos...</p>
          ) : erroTermos ? (
            <div className={styles["caixa-termos"]}>
              <p>Não foi possível carregar os termos. Atualize a página.</p>
            </div>
          ) : (
            <>
              <label className={styles["check-termo"]}>
                <input
                  type="checkbox"
                  checked={form.aceitouTermoArmario}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      aceitouTermoArmario: e.target.checked,
                    }))
                  }
                />

                <span>
                  Li e estou de acordo com o{" "}
                  <a
                    href={termoArmarioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Termo de Uso do Armário
                  </a>
                </span>
              </label>

              <label className={styles["check-termo"]}>
                <input
                  type="checkbox"
                  checked={form.aceitouTermoSite}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      aceitouTermoSite: e.target.checked,
                    }))
                  }
                />

                <span>
                  Li e autorizo o uso dos meus dados conforme a{" "}
                  <a
                    href={termoPrivacidadeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidade e LGPD
                  </a>{" "}
                  e os{" "}
                  <a
                    href={termoSiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Termos de Uso do Site
                  </a>
                </span>
              </label>
            </>
          )}

          <button
            className={styles["btn-principal"]}
            onClick={handleSubmit}
            disabled={loading || carregandoTermos || erroTermos}
          >
            {loading
              ? "Enviando..."
              : carregandoTermos
                ? "Carregando termos..."
                : "Confirmar cadastro"}
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
