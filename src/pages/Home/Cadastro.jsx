import { useState, useEffect } from "react";
import styles from "./Cadastro.module.css";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../routes/config/api.js";

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

function calcularIdade(dataNasc) {
  const hoje = new Date();
  const nasc = new Date(dataNasc);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

// "nascimento" | "bloqueado" | "formulario" | "termos"
export default function Cadastro() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState("nascimento");
  const [erro, setErro] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    nomeSocial: "",
    cpf: "",
    nascimento: "",
    email: "",
    telefone: "",
    matricula: "",
    idCurso: "",
    idTurma: "",
    idTermoSite: 1,
    aceitouTermoSite: false,
    idTermoArmario: 1,
    aceitouTermoArmario: false,
  });

  // Carrega cursos da API
  useEffect(() => {
    fetch(API_ROUTES.cursos.carregarCursos)
      .then((r) => r.json())
      .then((data) => {
        console.log("cursos recebidos:", data);
        setCursos(data.dados ?? []);
      });
  }, []);

  const atualizar = (campo) => (e) => {
    let val = e.target.value;
    if (campo === "cpf") val = formatarCPF(val);
    if (campo === "telefone") val = formatarTel(val);
    setForm((p) => ({ ...p, [campo]: val }));
  };

  function handleNascimento(e) {
    const val = e.target.value;
    if (!val) return;
    const idade = calcularIdade(val);
    if (idade < 14) setEtapa("bloqueado");
    else if (idade < 18) setEtapa("termos");
    else setEtapa("formulario");
  }

  async function handleSubmit() {
    const payload = {
      cpf: form.cpf.replace(/\D/g, ""),
      nome: form.nome,
      nomeSocial: form.nomeSocial || null,
      telefone: form.telefone.replace(/\D/g, ""),
      email: form.email,
      matricula: form.matricula || null,
      dataNasc: form.nascimento,
      idCurso: Number(form.idCurso),
      idTurma: Number(form.idTurma) || 0,
      idTermoSite: form.idTermoSite,
      aceitouTermoSite: form.aceitouTermoSite,
      idTermoArmario: form.idTermoArmario,
      aceitouTermoArmario: form.aceitouTermoArmario,
    };

    console.log("payload:", payload);

    try {
      const res = await fetch(API_ROUTES.cadastro.preCadastro, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Erro do back:", data);
        setErro(data.message || "Erro ao cadastrar.");
        return;
      }

      navigate("/sucesso");
    } catch (err) {
      console.error("Erro de rede:", err);
      setErro("Erro de conexão com o servidor.");
    }
  }

  // ── Etapa 1: data de nascimento ──────────────────────────────────────────
  if (etapa === "nascimento") {
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
              className={`${styles.campo} ${form.nascimento ? styles.filled : ""}`}
            >
              <input
                type="date"
                value={form.nascimento}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nascimento: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleNascimento(e)}
                onBlur={handleNascimento}
                max={
                  new Date(Date.now() - 86400000).toISOString().split("T")[0]
                }
              />
              <label>Data de nascimento</label>
            </div>

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

  // ── Etapa: bloqueado (< 14 anos) ─────────────────────────────────────────
  if (etapa === "bloqueado") {
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
                Você precisa ter <strong>pelo menos 14 anos</strong> para
                realizar o cadastro na plataforma.
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

  // ── Etapa: formulário completo (18+) ─────────────────────────────────────
  if (etapa === "formulario") {
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
                <div className={`${styles["passo-num"]} ${styles.ativo}`}>
                  1
                </div>
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
              <div className={styles.campo}>
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
                <input
                  type="date"
                  value={form.nascimento}
                  onChange={atualizar("nascimento")}
                  max={
                    new Date(Date.now() - 86400000).toISOString().split("T")[0]
                  }
                />
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
                <select value={form.idCurso} onChange={atualizar("idCurso")}>
                  <option value="" />
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                <label>Curso</label>
              </div>

              <div className={styles.campo}>
                <input
                  type="text"
                  placeholder=" "
                  value={form.idTurma}
                  onChange={atualizar("idTurma")}
                />
                <label>Turma (ex: DS3A)</label>
              </div>
            </div>

            {erro && <p className={styles["erro-msg"]}>{erro}</p>}

            <button
              className={styles["btn-principal"]}
              onClick={() => setEtapa("termos")}
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

  // ── Etapa: termos e pagamento ─────────────────────────────────────────────
  if (etapa === "termos") {
    return (
      <div className={styles.pagina}>
        <div className={styles.corpo}>
          <aside className={styles.esquerda}>
            <h1>
              Termos e<br />
              <em>Pagamento</em>
            </h1>
            <p>Leia os termos e finalize seu cadastro presencialmente.</p>
            <div className={styles.passos}>
              <div className={styles.passo}>
                <div className={`${styles["passo-num"]} ${styles.concluido}`}>
                  ✓
                </div>
                <div className={styles["passo-info"]}>
                  <strong>Dados pessoais</strong>
                  <span>Concluído</span>
                </div>
              </div>
              <div className={styles.passo}>
                <div className={`${styles["passo-num"]} ${styles.ativo}`}>
                  2
                </div>
                <div className={styles["passo-info"]}>
                  <strong>Termos e Pagamento</strong>
                  <span>Você está aqui</span>
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.card}>
            <div className={styles.separador}>Termos de uso</div>

            <div className={styles["caixa-termos"]}>
              <p>
                Ao realizar o cadastro, você concorda com as normas da AAPM
                SENAI Osasco. O pagamento da mensalidade é realizado de forma
                presencial na secretaria. O aluno responsabiliza-se pelo uso
                correto dos serviços contratados.
              </p>
              <p>
                Para alunos menores de 18 anos, é necessária a assinatura de um
                responsável legal no momento do pagamento presencial.
              </p>
            </div>

            <label className={styles["check-termo"]}>
              <input
                type="checkbox"
                checked={form.aceitouTermoSite}
                onChange={(e) =>
                  setForm((p) => ({ ...p, aceitouTermoSite: e.target.checked }))
                }
              />
              Aceito os termos de uso do site
            </label>

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
              Aceito os termos de uso do armário
            </label>

            <div className={styles.separador}>Pagamento</div>

            <div className={`${styles.campo} ${styles.filled}`}>
              <select disabled>
                <option>Pagamento presencial — secretaria</option>
              </select>
              <label>Forma de pagamento</label>
            </div>

            {erro && <p className={styles["erro-msg"]}>{erro}</p>}

            <button
              className={styles["btn-principal"]}
              onClick={() => {
                if (!form.aceitouTermoSite || !form.aceitouTermoArmario) {
                  setErro(
                    "Você precisa aceitar os dois termos para continuar.",
                  );
                  return;
                }
                setErro(null);
                handleSubmit();
              }}
            >
              Confirmar cadastro
            </button>

            <div className={styles["rodape-card"]}>
              <button
                className={styles["btn-secundario"]}
                onClick={() =>
                  setEtapa(
                    calcularIdade(form.nascimento) >= 18
                      ? "formulario"
                      : "nascimento",
                  )
                }
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
