import { useState, useEffect } from "react";
import styles from "./PreCadastroArmario.module.css";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "/src/routes/config/api.js";
import { alertErro, alertSucesso } from "../../../components/Alerts/Alerts.jsx";

const TERMO_SITE = "S";
const TERMO_ARMARIO = "A";

function obterIdTurma(turma) {
  return turma.id ?? turma.idTurma ?? turma.Id ?? turma.IdTurma;
}

function obterNomeTurma(turma) {
  return turma.turma ?? turma.nomeTurma ?? turma.NomeTurma ?? turma.nome ?? "";
}

function obterListaDados(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.dados)) return data.dados;
  if (Array.isArray(data?.Dados)) return data.Dados;
  return [];
}

function obterIdCurso(curso) {
  return curso.id ?? curso.idCurso ?? curso.Id ?? curso.IdCurso;
}

function obterNomeCurso(curso) {
  return curso.nome ?? curso.Nome ?? curso.nomeCurso ?? curso.NomeCurso ?? "";
}

function formatarPreco(valor) {
  return valor
    ? `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "---";
}

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

function validarCPF(cpf) {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(d[i]) * (10 - i);
  let r = (soma * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(d[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(d[i]) * (11 - i);
  r = (soma * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(d[10]);
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarFormulario(form) {
  if (!form.nome.trim()) return "Informe seu nome completo.";
  if (form.nome.trim().split(" ").length < 2)
    return "Informe nome e sobrenome.";
  if (!form.cpf || form.cpf.replace(/\D/g, "").length !== 11)
    return "CPF incompleto.";
  if (!validarCPF(form.cpf)) return "CPF inválido.";
  if (!form.nascimento) return "Informe sua data de nascimento.";
  if (!form.email.trim()) return "Informe seu e-mail.";
  if (!validarEmail(form.email)) return "E-mail inválido.";
  if (!form.telefone || form.telefone.replace(/\D/g, "").length < 10)
    return "Telefone incompleto.";
  if (!form.idCurso) return "Selecione um curso.";
  if (!form.idTurma) return "Selecione uma turma.";
  if (!form.aceitouTermoArmario) return "Aceite o termo de uso do armário.";
  if (!form.aceitouTermoSite) return "Aceite os termos de uso do site e LGPD.";
  return null;
}

export default function CadastroArmario() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState("nascimento");
  const [cursos, setCursos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [precos, setPrecos] = useState({});
  const [loading, setLoading] = useState(false);
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
    idTermoSite: 9,
    aceitouTermoSite: false,
    idTermoArmario: 10,
    aceitouTermoArmario: false,
  });
  const termoArmarioUrl = API_ROUTES.termos.obterPdf(TERMO_ARMARIO);
  const termoSiteUrl = API_ROUTES.termos.obterPdf(TERMO_SITE);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [etapa]);

  useEffect(() => {
    fetch(API_ROUTES.produtos.listar)
      .then((r) => r.json())
      .then((data) => {
        const mapa = {};
        obterListaDados(data).forEach((p) => {
          mapa[p.produto ?? p.Produto] = p.preco ?? p.Preco;
        });
        setPrecos(mapa);
      })
      .catch(() => setPrecos({}));
  }, []);

  // Carrega cursos ativos
  useEffect(() => {
    fetch(API_ROUTES.cursos.carregarCursos)
      .then((r) => r.json())
      .then((data) => setCursos(obterListaDados(data)))
      .catch(() => setCursos([]));
  }, []);

  // Carrega turmas ao trocar de curso
  useEffect(() => {
    if (!form.idCurso) {
      setTurmas([]);
      return;
    }
    fetch(API_ROUTES.turmas.porCurso(form.idCurso))
      .then((r) => r.json())
      .then((data) => setTurmas(obterListaDados(data)))
      .catch(() => setTurmas([]));
  }, [form.idCurso]);

  const atualizar = (campo) => (e) => {
    let val = e.target.value;
    if (campo === "cpf") val = formatarCPF(val);
    if (campo === "telefone") val = formatarTel(val);
    setForm((p) => ({ ...p, [campo]: val }));
  };

  function handleCurso(e) {
    const id = e.target.value;
    setForm((p) => ({ ...p, idCurso: id, idTurma: "" }));
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
    const erroValidacao = validarFormulario(form);
    if (erroValidacao) {
      alertErro(erroValidacao);
      return;
    }

    setLoading(true);

    const payload = {
      CPF: form.cpf.replace(/\D/g, ""),
      Nome: form.nome.trim(),
      NomeSocial: form.nomeSocial.trim() || null,
      Telefone: form.telefone.replace(/\D/g, ""),
      Email: form.email.trim(),
      Matricula: form.matricula.trim() || null,
      DataNasc: form.nascimento,
      IdCurso: Number(form.idCurso),
      IdTurma: Number(form.idTurma),
      IdTermoSite: form.idTermoSite,
      AceitouTermoSite: form.aceitouTermoSite,
      IdTermoArmario: form.idTermoArmario,
      AceitouTermoArmario: form.aceitouTermoArmario,
    };

    try {
      const res = await fetch(API_ROUTES.cadastro.preCadastro, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alertErro(data.mensagem || data.message || "Erro ao cadastrar.");
        return;
      }

      alertSucesso("Pré-cadastro realizado com sucesso!");
      setEtapa("pagamento");
    } catch {
      alertErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  // ── Etapa: nascimento ────────────────────────────────────────────────────
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
                realizar o cadastro.
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
              🖨️ Abrir termo para impressão
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
              <div
                className={`${styles.campo} ${form.cpf ? styles.filled : ""}`}
              >
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
                  setForm((p) => ({ ...p, aceitouTermoSite: e.target.checked }))
                }
              />
              <span>
                Li e autorizo o uso dos meus dados conforme a{" "}
                <a
                  href={termoSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Política de Privacidade e LGPD {""}
                </a> 
                 e com os <a
                  href={termoSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Termos de Uso do Site
                </a> 
              </span>
            </label>

            <button
              className={styles["btn-principal"]}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Confirmar cadastro"}
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

  // ── Etapa: pagamento ──────────────────────────────────────────────────────
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
              Você precisa realizar o pagamento presencialmente na secretaria da
              AAPM para finalizar sua contratação.
            </p>
          </aside>
          <div className={styles.card}>
            <div className={styles.separador}>O que você precisa fazer</div>
            <div className={styles["caixa-termos"]}>
              <p>
                Como atualmente não temos uma solução de pagamento online, o
                próximo passo é realizar o pagamento presencialmente na
                secretaria da AAPM.
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
                <strong>{formatarPreco(precos["A"])}</strong>. Pagamento na secretaria da
                AAPM, perto da biblioteca do Senai.
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
}
