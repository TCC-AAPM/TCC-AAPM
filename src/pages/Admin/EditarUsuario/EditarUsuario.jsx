import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CadastrarUsuario/CadastrarUsuario.module.css";
import { validarCPF } from "../../../utils/validarCPF";
import { API_ROUTES, authFetch } from "../../../utils/auth.js";
import {
  alertErro,
  alertSucessoModal,
  alertAviso,
} from "../../../components/Alerts/Alerts.jsx";

function mascaraCPF(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 11);
  if (valor.length <= 3) return valor;
  if (valor.length <= 6) return valor.replace(/(\d{3})(\d+)/, "$1.$2");
  if (valor.length <= 9)
    return valor.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
}

function mascaraTelefone(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 11);
  if (valor.length <= 2) return valor;
  if (valor.length <= 6) return valor.replace(/(\d{2})(\d+)/, "($1) $2");
  if (valor.length <= 10)
    return valor.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
function obterIdCurso(c) {
  return c.id;
}

function obterNomeCurso(c) {
  return c.nome;
}

function obterIdTurma(t) {
  return t.idTurma;
}

function obterNomeTurma(t) {
  return t.nomeTurma;
}

function obterIdAluno(u) {
  return u.id;
}

function obterListaDados(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.dados)) return data.dados;
  return [];
}

export default function EditarAluno() {
  const navigate = useNavigate();

  const [idAluno, setIdAluno] = useState(null);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [nomeSocial, setNomeSocial] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [cursoId, setCursoId] = useState("default");
  const [turmaId, setTurmaId] = useState("default");
  const [cursos, setCursos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [salvando, setSalvando] = useState(false);

  // busca os dados completos do aluno pelo CPF + carrega cursos
  useEffect(() => {
    let ativo = true; // evita que uma resposta atrasada sobrescreva dados de outro aluno

    const alunoEditando = JSON.parse(
      localStorage.getItem("alunoEditando") || "null",
    );

    if (!alunoEditando?.cpf) {
      alertErro("Nenhum aluno selecionado");
      navigate("/admin/armarios");
      return;
    }

    const cpfSelecionado = alunoEditando.cpf;

    async function carregarAluno() {
      try {
        const res = await authFetch(API_ROUTES.alunos.buscarPorCPF, {
          method: "POST",
          body: JSON.stringify({ CPF: cpfSelecionado }),
        });
        if (!res.ok) throw new Error();

        const json = await res.json();
        console.log(json);
        const dados = json.dados ?? json;

        if (!ativo) return; // efeito antigo, ignora essa resposta

        const id = obterIdAluno(dados);
        if (!id) {
          alertErro("Não foi possível identificar o aluno (id ausente)");
          navigate("/admin/armarios");
          return;
        }

        setIdAluno(id);
        setCpf(mascaraCPF(cpfSelecionado));
        setNome(dados.nome ?? dados.Nome ?? "");
        setNomeSocial(dados.nomeSocial ?? dados.NomeSocial ?? "");
        setTelefone(mascaraTelefone(dados.telefone ?? dados.Telefone ?? ""));
        setEmail(dados.email ?? dados.Email ?? "");
        setMatricula(dados.matricula ?? dados.Matricula ?? "");
        setDataNasc(dados.dataNasc ?? dados.DataNasc ?? "");
        setCursoId(String(dados.idCurso ?? dados.IdCurso ?? "default"));
        setTurmaId(String(dados.idTurma ?? dados.IdTurma ?? "default"));
      } catch {
        if (ativo) {
          alertErro("Erro ao carregar dados do aluno");
          navigate("/admin/armarios");
        }
      }
    }
    carregarAluno();

    async function carregarCursos() {
      try {
        const res = await fetch(API_ROUTES.cursos.carregarCursos);
        if (!res.ok) throw new Error();
        const lista = obterListaDados(await res.json());
        if (ativo) setCursos(lista);
      } catch {
        if (ativo) alertErro("Erro ao carregar cursos");
      }
    }
    carregarCursos();

    return () => {
      ativo = false;
    };
  }, []);

  // recarrega turmas sempre que o curso mudar, mantendo a turma se ainda existir na lista
  useEffect(() => {
    if (cursoId === "default") return;

    async function carregarTurmas() {
      try {
        const res = await fetch(API_ROUTES.turmas.porCurso(cursoId));
        if (!res.ok) throw new Error();
        const lista = obterListaDados(await res.json());
        setTurmas(lista);

        const turmaAindaExiste = lista.some(
          (t) => String(obterIdTurma(t)) === turmaId,
        );
        if (!turmaAindaExiste) setTurmaId("default");
      } catch {
        alertErro("Erro ao carregar turmas");
      }
    }
    carregarTurmas();
  }, [cursoId]);

  async function handleSubmit(e) {
    e.preventDefault();
    const telefoneLimpo = telefone.replace(/\D/g, "");
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (
      !nome ||
      !cpfLimpo ||
      !telefoneLimpo ||
      !email ||
      !dataNasc ||
      cursoId === "default"
    ) {
      alertAviso("Preencha todos os campos obrigatórios");
      return;
    }

    if (!validarCPF(cpfLimpo)) {
      alertErro("CPF inválido");
      return;
    }

    if (turmaId === "default") {
      alertAviso("Selecione uma turma");
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        CPF: cpfLimpo,
        Nome: nome,
        NomeSocial: nomeSocial || null,
        Matricula: matricula || null,
        Telefone: telefoneLimpo,
        Email: email,
        DataNasc: dataNasc,
        IdCurso: Number(cursoId),
        IdTurma: Number(turmaId),
      };

      const res = await authFetch(API_ROUTES.alunos.editar(idAluno), {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const erro = await res.json().catch(() => null);
        throw new Error(erro?.mensagem || "Erro ao salvar");
      }

      await alertSucessoModal("Sucesso!", "Aluno atualizado com sucesso.");
      localStorage.removeItem("alunoEditando");
      navigate("/admin/armarios");
    } catch (erro) {
      alertErro(erro.message || "Erro ao salvar aluno");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.principalBox}>
        <form id="formsEditar" className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>
              badge
            </span>
            <span>Dados Pessoais</span>
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan1}`}>
            <label>CPF*</label>
            <input
              type="text"
              className={styles.formControl}
              value={cpf}
              onChange={(e) => setCpf(mascaraCPF(e.target.value))}
            />
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan2}`}>
            <label>Nome*</label>
            <input
              type="text"
              className={styles.formControl}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan1}`}>
            <label>Nome Social</label>
            <input
              type="text"
              className={styles.formControl}
              value={nomeSocial}
              onChange={(e) => setNomeSocial(e.target.value)}
            />
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan1}`}>
            <label>Data de Nascimento*</label>
            <input
              type="date"
              className={styles.formControl}
              value={dataNasc}
              onChange={(e) => setDataNasc(e.target.value)}
              required
            />
          </div>

          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>
              contact_phone
            </span>
            <span>Contato</span>
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan2}`}>
            <label>Telefone*</label>
            <input
              type="tel"
              className={styles.formControl}
              value={telefone}
              onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
              required
            />
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan2}`}>
            <label>Email*</label>
            <input
              type="email"
              className={styles.formControl}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>
              school
            </span>
            <span>Dados Acadêmicos</span>
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan1}`}>
            <label>Matrícula</label>
            <input
              type="text"
              className={styles.formControl}
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />
          </div>

          <div className={`${styles.selectBox} ${styles.colSpan2}`}>
            <label>Curso*</label>
            <select
              className={styles.formSelect}
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              required
            >
              <option disabled value="default">
                Selecione o curso
              </option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.selectBox} ${styles.colSpan1}`}>
            <label>Turma*</label>
            <select
              className={styles.formSelect}
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
              disabled={cursoId === "default"}
              required
            >
              <option disabled value="default">
                Selecione a turma
              </option>
              {turmas.map((t) => (
                <option key={t.idTurma} value={t.idTurma}>
                  {t.nomeTurma}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.botaoCadastrar}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
      <a href="#" onClick={() => history.back()} className={styles.voltar}>
        ← Voltar
      </a>
    </div>
  );
}
