import { useState } from "react";
import styles from "./Cadastro.module.css";

function formatarCPF(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarTel(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  let r = d;
  if (r.length > 0) r = r.replace(/^(\d{2})(\d)/, "($1) $2");
  if (r.length > 9) r = r.replace(/(\d{5})(\d)/, "$1-$2");
  return r;
}

const cursos = [
  "Desenvolvimento de Sistemas",
  "Logística",
  "Administração",
  "Eletrotécnica",
  "Mecânica",
  "Outro",
];

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    nomeSocial: "",
    cpf: "",
    nascimento: "",
    email: "",
    telefone: "",
    curso: "",
    turma: "",
  });

  const atualizar = (campo) => (e) => {
    let val = e.target.value;
    if (campo === "cpf") val = formatarCPF(val);
    if (campo === "telefone") val = formatarTel(val);
    setForm((p) => ({ ...p, [campo]: val }));
  };

  return (
    <div className={styles.pagina}>

      <div className={styles.corpo}>
        {/* Esquerda */}
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
                <strong>Termos e Pagamento</strong>
                <span>Pagamento presencial</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Card */}
        <div className={styles.card}>
          <div className={styles.separador}>Identificação</div>

          <div className={styles.campo}>
            <input
              type="text"
              placeholder="Nome completo"
              value={form.nome}
              onChange={atualizar("nome")}
              required
            />
          </div>

          <div className={styles.campo}>
            <input
              type="text"
              placeholder="Nome social (opcional)"
              value={form.nomeSocial}
              onChange={atualizar("nomeSocial")}
            />
          </div>

          <div className={styles.linha}>
            <div className={styles.campo}>
              <input
                type="text"
                placeholder="CPF"
                value={form.cpf}
                onChange={atualizar("cpf")}
                maxLength={14}
                required
              />
            </div>

            <div className={styles.campo}>
              <input
                type="date"
                value={form.nascimento}
                onChange={atualizar("nascimento")}
                required
              />
            </div>
          </div>

          <div className={styles.separador}>Contato</div>

          <div className={styles.campo}>
            <input
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={atualizar("email")}
              required
            />
          </div>

          <div className={styles.campo}>
            <input
              type="tel"
              placeholder="Telefone"
              value={form.telefone}
              onChange={atualizar("telefone")}
              maxLength={15}
              required
            />
          </div>

          <div className={styles.separador}>Escola</div>

          <div className={styles.linha}>
            <div className={styles.campo}>
              <select value={form.curso} onChange={atualizar("curso")} required>
                <option value="">Curso</option>
                {cursos.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className={styles.campo}>
              <input
                type="text"
                placeholder="Turma (ex: DS3A)"
                value={form.turma}
                onChange={atualizar("turma")}
                required
              />
            </div>
          </div>

          <button className={styles["btn-principal"]}>Continuar</button>

          <div className={styles["rodape-card"]}>
            <span>Já possui cadastro?</span>
            <button className={styles["btn-secundario"]}>Entrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
