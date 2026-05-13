import { useState, useEffect } from "react";
import styles from "./PreCadastroArmario.module.css";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "/src/routes/config/api.js";

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

// "nascimento" | "bloqueado" | "menor" | "formulario" | "termos"
export default function CadastroArmario() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState("nascimento");
  const [erro, setErro] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [turmas, setTurmas] = useState([]);
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

  useEffect(() => {
    fetch(API_ROUTES.cursos.carregarCursos)
      .then((r) => r.json())
      .then((data) => {
        console.log("cursos recebidos:", data);
        setCursos(data.dados ?? []);
      })
      .catch((err) => {
        console.error("erro ao carregar cursos:", err);
        setCursos([]);
      });
  }, []);

  const [precos, setPrecos] = useState({});

  useEffect(() => {
    fetch(API_ROUTES.produtos.listar)
      .then((r) => r.json())
      .then((data) => {
        const mapa = {};
        data.forEach((p) => (mapa[p.produto] = p.preco));
        setPrecos(mapa);
      })
      .catch(() => {});
  }, []);

  const atualizar = (campo) => (e) => {
    let val = e.target.value;
    if (campo === "cpf") val = formatarCPF(val);
    if (campo === "telefone") val = formatarTel(val);
    setForm((p) => ({ ...p, [campo]: val }));
  };

  function handleCurso(e) {
    const id = e.target.value;
    setForm((p) => ({ ...p, idCurso: id, idTurma: "" }));
    if (!id) {
      setTurmas([]);
      return;
    }

    fetch(API_ROUTES.turmas.porCurso(id))
      .then((r) => r.json())
      .then((data) => {
        console.log("turmas recebidas:", data);
        setTurmas(data.dados ?? []);
      })
      .catch((err) => {
        console.error("erro ao carregar turmas:", err);
        setTurmas([]);
      });
  }

  function handleNascimento(e) {
    const val = e.target.value;
    if (!val) return;
    const idade = calcularIdade(val);
    if (idade < 14) setEtapa("bloqueado");
    else if (idade < 18) setEtapa("menor");
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

    console.log("payload enviado:", payload);

    try {
      const res = await fetch(API_ROUTES.cadastro.preCadastro, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Erro do back:", data);
        setErro(data.mensagem || data.message || "Erro ao cadastrar.");
        return;
      }

      navigate("/pagamento");
    } catch (err) {
      console.error("Erro de rede:", err);
      setErro("Erro de conexão com o servidor.");
    }
  }

  // ── Etapa 1: nascimento ──────────────────────────────────────────────────
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

  // ── Etapa: menor (14–17 anos) ─────────────────────────────────────────────
  if (etapa === "menor") {
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
              Por exigência do ECA e da LGPD, menores de 18 anos precisam da
              autorização de um responsável legal para utilizar nossos serviços.
            </p>
          </aside>

          <div className={styles.card}>
            <div className={styles.separador}>O que você precisa fazer</div>

            <div className={styles["caixa-termos"]}>
              <p>
                Como você ainda não tem 18 anos,{" "}
                <strong>não é possível concluir o cadastro online</strong>. Seu
                responsável legal deverá comparecer presencialmente à secretaria
                e assinar o termo de uso do armário.
              </p>
              <p>
                Você pode imprimir o termo abaixo, preencher os dados e levá-lo
                já assinado na secretaria da AAPM (localizada perto da
                biblioteca do Senai) para agilizar o processo.
              </p>
            </div>

            <div className={styles.separador}>Termo de uso do armário</div>

            <iframe
              src="/termo-armario.pdf"
              className={styles["iframe-termo"]}
              title="Termo de uso do armário"
            />

            <a
              href="/termo-armario.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles["btn-principal"]}
              style={{
                textAlign: "center",
                textDecoration: "none",
                display: "block",
              }}
            >
              🖨️ Abrir termo para impressão
            </a>

            <div className={styles["rodape-card"]}>
              <button
                className={styles["btn-secundario"]}
                onClick={() => {
                  setForm((p) => ({ ...p, nascimento: "" }));
                  setEtapa("nascimento");
                }}
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Etapa: formulário (18+) ───────────────────────────────────────────────
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
                <select value={form.idCurso} onChange={handleCurso}>
                  <option value="" />
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
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
                  {turmas.map((t) => (
                    <option key={t.nomeTurma} value={t.nomeTurma}>
                      {t.nomeTurma}
                    </option>
                  ))}
                </select>
                <label>Turma</label>
              </div>
            </div>

            {erro && <p className={styles["erro-msg"]}>{erro}</p>}

            <div className={styles.separador}>Termos</div>

            <a
              href="/termo-armario.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles["btn-link"]}
            >
              📄 Termo de uso do armário
            </a>
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
              Li e concordo com os termos de uso do armário
            </label>

            <a
              href="/termos-site.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles["btn-link"]}
            >
              📄 Termos de uso do site e LGPD
            </a>
            <label className={styles["check-termo"]}>
              <input
                type="checkbox"
                checked={form.aceitouTermoSite}
                onChange={(e) =>
                  setForm((p) => ({ ...p, aceitouTermoSite: e.target.checked }))
                }
              />
              Li e autorizo o uso dos meus dados conforme a LGPD
            </label>

            {erro && <p className={styles["erro-msg"]}>{erro}</p>}

            <button
              className={styles["btn-principal"]}
              onClick={() => {
                if (!form.aceitouTermoArmario || !form.aceitouTermoSite) {
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
  // ── Etapa: pagamenti ─────────────────────────────────────────────
  if (etapa === "pagamento") {
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
              Voce precisa realizar o pagamento presencialmente na secretaria da
              AAPM para finalizar sua contratação.
            </p>
          </aside>

          <div className={styles.card}>
            <div className={styles.separador}>O que você precisa fazer</div>

            <div className={styles["caixa-termos"]}>
              <p>
                Como atualemente não temos uma solução de pagamento online, o
                próximo passo é realizar o pagamento presencialmente na
                secretaria da AAPM. Leve um documento de identificação e o
                comprovante de pré-cadastro para finalizar sua contratação.
              </p>
              <p>
                Mas não se preocupe, o processo é rápido e simples! A equipe da
                AAPM está pronta para te atender e garantir que tudo seja
                concluído sem complicações.
              </p>
            </div>

            <div className={styles.separador}>Pagamento</div>

            <div className={styles["aviso-pagamento"]}>
              <p>
                O valor do aluguel do armário é de{" "}
                <strong>R$ 20,00 por mês</strong>. O pagamento deve ser
                realizado na secretaria da AAPM, localizada perto da biblioteca
                do Senai.
              </p>
            </div>

            <div className={styles["rodape-card"]}>
              <button
                className={styles["btn-secundario"]}
                onClick={() => {
                  setForm((p) => ({ ...p, nascimento: "" }));
                  setEtapa("nascimento");
                }}
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
