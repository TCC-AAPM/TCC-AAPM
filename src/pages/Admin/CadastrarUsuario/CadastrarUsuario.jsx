import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CadastrarUsuario.module.css";
import { validarCPF } from "../../../utils/validarCPF";
import { API_ROUTES, authFetch } from "../../../utils/auth.js";
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

// calcula idade a partir da data de nascimento (formato yyyy-mm-dd do input type="date")
function calcularIdade(dataNasc) {
  if (!dataNasc) return null;
  const nascimento = new Date(dataNasc);
  if (Number.isNaN(nascimento.getTime())) return null;

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() &&
      hoje.getDate() < nascimento.getDate());

  if (aindaNaoFezAniversario) idade -= 1;
  return idade;
}

function obterListaDados(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.dados)) return data.dados;
  if (Array.isArray(data?.Dados)) return data.Dados;
  return [];
}

export default function CadastrarUsuario() {
  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [cursoId, setCursoId] = useState("default");
  const [turmaId, setTurmaId] = useState("default");
  const [pagamento, setPagamento] = useState("default");
  const [cursos, setCursos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [btnLabel, setBtnLabel] = useState("Cadastrar Usuário");
  const [salvando, setSalvando] = useState(false);
  const [verificandoCpf, setVerificandoCpf] = useState(false);

  const [termoSite, setTermoSite] = useState(null);
  const [termoArmario, setTermoArmario] = useState(null);

  const [aceitouTermoSite, setAceitouTermoSite] = useState(false);
  const [aceitouTermoArmario, setAceitouTermoArmario] = useState(false);

  const [responsavelPresente, setResponsavelPresente] = useState(false);

  const alunoEncontrado = useRef(null);

  //id do armário clicado no card
  const idArmario = Number(localStorage.getItem("armarioSelecionado"));

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

  // carrega os termos ativos (site "S" e armário "A") para enviar no cadastro
  useEffect(() => {
    async function carregarTermos() {
      try {
        const res = await authFetch(API_ROUTES.termos.termosAtivos);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const lista = data.dados ?? data;

        const site = lista.find((t) => (t.referencia ?? t.Referencia) === "S");
        const armario = lista.find(
          (t) => (t.referencia ?? t.Referencia) === "A",
        );

        setTermoSite(site?.idTermo ?? site?.IdTermo ?? null);
        setTermoArmario(armario?.idTermo ?? armario?.IdTermo ?? null);
      } catch {
        alertErro("Erro ao carregar termos ativos");
      }
    }
    carregarTermos();
  }, []);

  function resetFormulario(limparCpf = true) {
    if (limparCpf) setCpf("");
    setNome("");
    setTelefone("");
    setEmail("");
    setMatricula("");
    setDataNasc("");
    setCursoId("default");
    setTurmaId("default");
    setTurmas([]);
    setPagamento("default");
    setAceitouTermoSite(false);
    setAceitouTermoArmario(false);
    setResponsavelPresente(false);
    setBtnLabel("Cadastrar Usuário");
    alunoEncontrado.current = null;
  }

  function preencherFormulario(usuario) {
    setNome(usuario.nome);
    setTelefone(mascaraTelefone(usuario.telefone));
    setEmail(usuario.email);
    setMatricula(usuario.matricula);
    setDataNasc(usuario.dataNasc ?? usuario.DataNasc ?? "");
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
      const res = await authFetch(API_ROUTES.alunos.buscarPorCPF, {
        method: "POST",
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

    if (
      !nome ||
      !cpf ||
      !telefone ||
      !email ||
      !dataNasc ||
      cursoId === "default" ||
      pagamento === "default"
    ) {
      alertAviso("Preencha todos os campos");
      return;
    }

    if (!idArmario) {
      alertErro(
        "Nenhum armário selecionado. Volte e clique em um armário disponível.",
      );
      return;
    }

    if (!termoSite || !termoArmario) {
      alertErro("Termos vigentes não carregados. Tente novamente.");
      return;
    }

    if (!aceitouTermoSite || !aceitouTermoArmario) {
      alertAviso("Confirme que o aluno aceitou os termos antes de continuar");
      return;
    }

    // se menor de idade, exige confirmação de que um responsável ta presente
    const idade = calcularIdade(dataNasc);
    if (idade !== null && idade < 18 && !responsavelPresente) {
      alertAviso(
        "Aluno é menor de idade. Confirme a presença do responsável legal.",
      );
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        IdArmario: idArmario,
        CPF: cpf.replace(/\D/g, ""),
        Nome: nome,
        Telefone: telefoneLimpo,
        Email: email,
        Matricula: matricula,
        DataNasc: dataNasc,
        IdCurso: Number(cursoId),
        IdTurma: Number(turmaId),
        MetodoPagamento: pagamento,
        IdTermoSite: termoSite,
        AceitouTermoSite: true,
        IdTermoArmario: termoArmario,
        AceitouTermoArmario: true,
      };

      const rota = alunoEncontrado.current
        ? API_ROUTES.reservas.recadastrarArmario
        : API_ROUTES.reservas.cadastrarArmario;

      const res = await authFetch(rota, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();

      await alertSucessoModal("Sucesso!", "Usuário salvo com sucesso.");
      localStorage.removeItem("armarioSelecionado"); // limpa após sucesso
      resetFormulario();
      navigate("/admin/armarios");
    } catch {
      alertErro("Erro ao salvar usuário");
    } finally {
      setSalvando(false);
    }
  }

  const idade = calcularIdade(dataNasc);
  const isMenorDeIdade = idade !== null && idade < 18;

  return (
    <>
      <div className={styles.conteudoWrapper}>
        <div className={styles.principalBox}>
          <form
            id="formsCadastro"
            className={styles.form}
            onSubmit={handleSubmit}
          >
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

            {isMenorDeIdade && (
              <div className={`${styles.avisoMenor} ${styles.colSpan4}`}>
                <span className="material-symbols-outlined">shield_person</span>
                <div className={styles.avisoMenorTexto}>
                  <strong>Aluno menor de idade.</strong>
                  <label>
                    <input
                      type="checkbox"
                      checked={responsavelPresente}
                      onChange={(e) => setResponsavelPresente(e.target.checked)}
                    />
                    Confirmo que um responsável legal está presente e ciente,
                    fornecendo os dados do menor neste cadastro.
                  </label>
                </div>
              </div>
            )}

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
                placeholder="Digite o número de matrícula"
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
                <option disabled value="default">
                  Selecione a turma
                </option>
                {turmas.map((t) => (
                  <option key={obterIdTurma(t)} value={obterIdTurma(t)}>
                    {obterNomeTurma(t)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.sectionDivider}>
              <span className={`material-symbols-outlined ${styles.icon}`}>
                payments
              </span>
              <span>Contrato</span>
            </div>

            <div className={`${styles.selectBox} ${styles.colSpan4}`}>
              <label>Forma de Pagamento*</label>
              <select
                className={styles.formSelect}
                value={pagamento}
                onChange={(e) => setPagamento(e.target.value)}
                required
              >
                <option disabled value="default">
                  Selecione a forma de pagamento
                </option>
                <option value="C">Cartão de crédito</option>
                <option value="D">Cartão de débito</option>
                <option value="A">Dinheiro</option>
                <option value="P">Pix</option>
              </select>
            </div>

            <div className={styles.sectionDivider}>
              <span className={`material-symbols-outlined ${styles.icon}`}>
                gavel
              </span>
              <span>Termos</span>
            </div>

            <div className={`${styles.checkboxBox} ${styles.colSpan4}`}>
              <label>
                <input
                  type="checkbox"
                  checked={aceitouTermoSite}
                  onChange={(e) => setAceitouTermoSite(e.target.checked)}
                />
                Aluno aceitou o Termo de Uso do Site e Política de Privacidade
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={aceitouTermoArmario}
                  onChange={(e) => setAceitouTermoArmario(e.target.checked)}
                />
                Aluno aceitou o Termo de Uso do Armário
              </label>
            </div>

            <div className={styles.botaoCadastrar}>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : btnLabel}
              </button>
            </div>
          </form>
        </div>
        <a href="#" onClick={() => history.back()} className={styles.voltar}>
          ← Voltar
        </a>
      </div>
    </>
  );
}
