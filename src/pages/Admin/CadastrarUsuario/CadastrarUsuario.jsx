import { useState, useEffect, useRef } from "react";
import styles from "./CadastrarUsuario.module.css";
import { validarCPF } from "../../../utils/validarCPF";
import { API_ROUTES } from "../../../utils/auth.js";
import {
  alertErro,
  alertSucessoModal,
  alertAviso,
  alertInfo,
} from "../../../components/Alerts/Alerts.jsx";

function mascaraCPF(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 11);
  if (valor.length <= 3) return valor;
  if (valor.length <= 6) return valor.replace(/(\d{3})(\d+)/, "$1.$2");
  if (valor.length <= 9) return valor.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
}

function mascaraTelefone(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 11);
  if (valor.length <= 2) return valor;
  if (valor.length <= 6) return valor.replace(/(\d{2})(\d+)/, "($1) $2");
  if (valor.length <= 10) return valor.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

function obterIdCurso(c) {
  return c.id ?? c.idCurso ?? c.Id ?? c.IdCurso;
}
function obterNomeCurso(c) {
  return c.nome ?? c.Nome ?? c.nomeCurso ?? c.NomeCurso ?? "";
}
function obterIdTurma(t) {
  return t.id ?? t.idTurma ?? t.Id ?? t.IdTurma;
}
function obterNomeTurma(t) {
  return t.turma ?? t.nomeTurma ?? t.NomeTurma ?? t.nome ?? "";
}
function obterListaDados(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.dados)) return data.dados;
  if (Array.isArray(data?.Dados)) return data.Dados;
  return [];
}

export default function CadastrarUsuario() {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cursoId, setCursoId] = useState("default");
  const [turmaId, setTurmaId] = useState("default");
  const [pagamento, setPagamento] = useState("default");
  const [cursos, setCursos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [btnLabel, setBtnLabel] = useState("Cadastrar Usuário");
  const [salvando, setSalvando] = useState(false);
  const [verificandoCpf, setVerificandoCpf] = useState(false);

  const alunoEncontrado = useRef(null);

  useEffect(() => {
    async function carregarCursos() {
      try {
        const res = await fetch(API_ROUTES.cursos.carregarCursos);
        if (!res.ok) throw new Error();
        setCursos(obterListaDados(await res.json()));
      } catch {
        alertErro("Erro ao carregar cursos");
      }
    }
    carregarCursos();
  }, []);

  useEffect(() => {
    if (cursoId === "default") return;

    async function carregarTurmas() {
      try {
        const res = await fetch(API_ROUTES.turmas.porCurso(cursoId));
        if (!res.ok) throw new Error();
        setTurmas(obterListaDados(await res.json()));
        setTurmaId("default");
      } catch {
        alertErro("Erro ao carregar turmas");
      }
    }
    carregarTurmas();
  }, [cursoId]);

  function resetFormulario(limparCpf = true) {
    if (limparCpf) setCpf("");
    setNome("");
    setTelefone("");
    setEmail("");
    setMatricula("");
    setCursoId("default");
    setTurmaId("default");
    setTurmas([]);
    setPagamento("default");
    setBtnLabel("Cadastrar Usuário");
    alunoEncontrado.current = null;
  }

  function preencherFormulario(usuario) {
    setNome(usuario.nome);
    setTelefone(mascaraTelefone(usuario.telefone));
    setEmail(usuario.email);
    setMatricula(usuario.matricula);
    setCursoId(String(usuario.idCurso));
    setBtnLabel("Recadastrar Usuário");
    setTimeout(() => setTurmaId(String(usuario.idTurma)), 300);
  }

  function handleCpfChange(e) {
    const valor = mascaraCPF(e.target.value);
    setCpf(valor);
    if (valor.replace(/\D/g, "").length < 11) resetFormulario(false);
  }

  async function handleCpfBlur() {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) return;

    if (!validarCPF(cpfLimpo)) {
      alertErro("CPF inválido");
      return;
    }

    setVerificandoCpf(true);
    try {
      const res = await fetch(API_ROUTES.alunos.buscarPorCPF, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CPF: cpfLimpo }),
      });

      const dados = await res.json();

      if (res.status === 404) {
        alunoEncontrado.current = null;
        resetFormulario(false);
        return;
      }

      if (!res.ok) throw new Error();

      alunoEncontrado.current = dados.dados;
      preencherFormulario(dados.dados);
      alertInfo("Dados carregados");
    } catch {
      resetFormulario(false);
      alertErro("Erro ao buscar CPF");
    } finally {
      setVerificandoCpf(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const telefoneLimpo = telefone.replace(/\D/g, "");

    if (!nome || !cpf || !telefone || !email || !matricula ||
        cursoId === "default" || turmaId === "default" || pagamento === "default") {
      alertAviso("Preencha todos os campos");
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        nome,
        cpf: cpf.replace(/\D/g, ""),
        telefone: telefoneLimpo,
        email,
        matricula,
        curso_id: Number(cursoId),
        turma_id: Number(turmaId),
        metodo: pagamento,
      };

      const rota = alunoEncontrado.current
        ? API_ROUTES.reservas.recadastrarArmario
        : API_ROUTES.reservas.cadastrarArmario;

      const res = await fetch(rota, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();

      await alertSucessoModal("Sucesso!", "Usuário salvo com sucesso.");
      resetFormulario();
    } catch {
      alertErro("Erro ao salvar usuário");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <div className={styles.principalBox}>
        <form id="formsCadastro" className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>badge</span>
            <span>Dados Pessoais</span>
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan1}`}>
            <label>CPF*</label>
            <input
              type="text"
              className={styles.formControl}
              placeholder="Digite o CPF"
              value={cpf}
              onChange={handleCpfChange}
              onBlur={handleCpfBlur}
              disabled={verificandoCpf}
            />
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan3}`}>
            <label>Nome*</label>
            <input
              type="text"
              className={styles.formControl}
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>contact_phone</span>
            <span>Contato</span>
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan2}`}>
            <label>Telefone*</label>
            <input
              type="tel"
              className={styles.formControl}
              placeholder="Digite o telefone"
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
              placeholder="Digite o email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>school</span>
            <span>Dados Acadêmicos</span>
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan1}`}>
            <label>Matrícula</label>
            <input
              type="text"
              className={styles.formControl}
              placeholder="Digite o número de matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              required
            />
          </div>

          <div className={`${styles.selectBox} ${styles.colSpan2}`}>
            <label>Curso</label>
            <select
              className={styles.formSelect}
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              required
            >
              <option disabled value="default">Selecione o curso</option>
              {cursos.map((c) => (
                <option key={obterIdCurso(c)} value={obterIdCurso(c)}>
                  {obterNomeCurso(c)}
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.selectBox} ${styles.colSpan1}`}>
            <label>Turma</label>
            <select
              className={styles.formSelect}
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
              disabled={cursoId === "default"}
              required
            >
              <option disabled value="default">Selecione a turma</option>
              {turmas.map((t) => (
                <option key={obterIdTurma(t)} value={obterIdTurma(t)}>
                  {obterNomeTurma(t)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>payments</span>
            <span>Contrato</span>
          </div>

          <div className={`${styles.selectBox} ${styles.colSpan4}`}>
            <label>Forma de Pagamento</label>
            <select
              className={styles.formSelect}
              value={pagamento}
              onChange={(e) => setPagamento(e.target.value)}
              required
            >
              <option disabled value="default">Selecione a forma de pagamento</option>
              <option value="C">Cartão de crédito</option>
              <option value="D">Cartão de débito</option>
              <option value="A">Dinheiro</option>
              <option value="P">Pix</option>
            </select>
          </div>

          <div className={styles.botaoCadastrar}>
            <button type="submit" className={styles.btnPrimary} disabled={salvando}>
              {salvando ? "Salvando..." : btnLabel}
            </button>
          </div>
        </form>
      </div>

      <a href="#" onClick={() => history.back()} className={styles.voltar}>
        ← Voltar
      </a>
    </>
  );
}