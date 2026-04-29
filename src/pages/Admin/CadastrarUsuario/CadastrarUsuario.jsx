import { useState, useEffect, useRef } from "react";
import styles from "./CadastrarUsuario.module.css";
// import { validarCPF } from "../../../utils/validarCPF";
import { API_ROUTES } from "../../../utils/auth.js";

function mascaraCPF(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 11);

  if (valor.length <= 3) return valor;
  if (valor.length <= 6) return valor.replace(/(\d{3})(\d+)/, "$1.$2");
  if (valor.length <= 9) return valor.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");

  return valor.replace(
    /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
    "$1.$2.$3-$4"
  );
}

function mascaraTelefone(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 11);

  if (valor.length <= 2) return valor;
  if (valor.length <= 6) return valor.replace(/(\d{2})(\d+)/, "($1) $2");
  if (valor.length <= 10)
    return valor.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");

  return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
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

  const alunoEncontrado = useRef(null);

  /* ===========================
     CARREGAR CURSOS
  =========================== */
  useEffect(() => {
    async function carregarCursos() {
      try {
        const res = await fetch(API_ROUTES.cursos);
        if (!res.ok) throw new Error();

        const dados = await res.json();
        setCursos(dados);
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    }

    carregarCursos();
  }, []);

  /* ===========================
     CARREGAR TURMAS
  =========================== */
  useEffect(() => {
    if (cursoId === "default") return;

    async function carregarTurmas() {
      try {
        const url = API_ROUTES.admin.turmasPorCurso.replace(
          "{idCurso}",
          cursoId
        );

        const res = await fetch(url);
        if (!res.ok) throw new Error();

        const dados = await res.json();

        setTurmas(dados);
        setTurmaId("default");
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
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
  }

  function preencherFormulario(usuario) {
    setNome(usuario.nome);
    setTelefone(mascaraTelefone(usuario.telefone));
    setEmail(usuario.email);
    setMatricula(usuario.matricula);
    setCursoId(String(usuario.curso_id));
    setPagamento(usuario.metodo);
    setBtnLabel("Recadastrar Usuário");

    setTimeout(() => {
      setTurmaId(String(usuario.turma_id));
    }, 300);
  }

  function handleCpfChange(e) {
    const valor = mascaraCPF(e.target.value);

    setCpf(valor);

    const limpo = valor.replace(/\D/g, "");

    if (limpo.length < 11) {
      resetFormulario(false);
    }
  }

  async function handleCpfBlur() {
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) return;

    if (!validarCPF(cpfLimpo)) {
      Toast?.fire({
        icon: "error",
        title: "CPF inválido",
      });

      return;
    }

    try {
      const res = await fetch(API_ROUTES.admin.buscarCpf, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CPF: cpfLimpo,
        }),
      });

      if (!res.ok) throw new Error();

      const dados = await res.json();

      if (dados.existe) {
        alunoEncontrado.current = dados.usuario;
        preencherFormulario(dados.usuario);
      } else {
        alunoEncontrado.current = null;
        resetFormulario(false);

        Toast?.fire({
          icon: "info",
          title: "CPF não encontrado",
        });
      }
    } catch {
      resetFormulario(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const telefoneLimpo = telefone.replace(/\D/g, "");

    if (
      !nome ||
      !cpf ||
      !telefone ||
      !email ||
      !matricula ||
      cursoId === "default" ||
      turmaId === "default" ||
      pagamento === "default"
    ) {
      Toast?.fire({
        icon: "warning",
        title: "Preencha todos os campos",
      });

      return;
    }

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
        ? API_ROUTES.admin.recadastrarAluno
        : API_ROUTES.admin.cadastrarAluno;

      const res = await fetch(rota, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      window.Swal?.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Usuário salvo com sucesso.",
        timer: 1500,
        showConfirmButton: false,
      });

      resetFormulario();
    } catch {
      Toast?.fire({
        icon: "error",
        title: "Erro ao salvar usuário",
      });
    }
  }

  return (
    <>
      <div className={styles.principalBox}>
        <form id="formsCadastro" className={styles.form} onSubmit={handleSubmit}>

          {/* Dados Pessoais */}
          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>badge</span>
            <span>Dados Pessoais</span>
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan1}`}>
            <label>CPF*</label>
            <input
              type="text"
              className={styles.formControl}
              id="CPF"
              name="CPF"
              placeholder="Digite o CPF"
              value={cpf}
              onChange={handleCpfChange}
              onBlur={handleCpfBlur}
            />
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan3}`}>
            <label>Nome*</label>
            <input
              type="text"
              className={styles.formControl}
              id="nome"
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          {/* Contato */}
          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>contact_phone</span>
            <span>Contato</span>
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan2}`}>
            <label>Telefone*</label>
            <input
              type="tel"
              className={styles.formControl}
              id="telefone"
              name="telefone"
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
              id="email"
              name="email"
              placeholder="Digite o email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Dados Acadêmicos */}
          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>school</span>
            <span>Dados Acadêmicos</span>
          </div>

          <div className={`${styles.inputBox} ${styles.colSpan1}`}>
            <label>Matrícula</label>
            <input
              type="text"
              className={styles.formControl}
              id="matricula"
              name="matricula"
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
              id="select-curso"
              name="curso_id"
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              required
            >
              <option disabled value="default">Selecione o curso</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.selectBox} ${styles.colSpan1}`}>
            <label>Turma</label>
            <select
              className={styles.formSelect}
              id="select-turma"
              name="turma_id"
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
              required
            >
              <option disabled value="default">Selecione a turma</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>{t.turma}</option>
              ))}
            </select>
          </div>

          {/* Contrato */}
          <div className={styles.sectionDivider}>
            <span className={`material-symbols-outlined ${styles.icon}`}>payments</span>
            <span>Contrato</span>
          </div>

          <div className={`${styles.selectBox} ${styles.colSpan4}`}>
            <label>Forma de Pagamento</label>
            <select
              className={styles.formSelect}
              id="select-pagamento"
              name="pagamento"
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
            <button type="submit" className={styles.btnPrimary} id="btnCadastrar">
              {btnLabel}
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