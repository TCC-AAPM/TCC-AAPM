import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { Search, X, Plus, Pencil, Trash2 } from "lucide-react";
import { authFetch, API_ROUTES } from "../../../utils/auth";
import {
  alertConfirmar,
  alertSucesso,
  alertErro,
} from "../../../components/Alerts/Alerts";
import styles from "./GerenciarCursos.module.css";
import { useDockButton } from "../../../utils/useDockButton";

const ITENS_POR_PAGINA = 10;
const REGEX_NOME_VALIDO = /^[A-Za-zÀ-ÿ\s]+$/;

export default function GerenciarCursos() {
  const docked = useDockButton();
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);
  const [cursoEditando, setCursoEditando] = useState(null); // null = criando
  const [nomeInput, setNomeInput] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      const res = await authFetch(API_ROUTES.cursos.carregarCursos);
      const resultado = await res.json();
      setCursos(resultado.dados ?? resultado ?? []);
    } catch {
      setCursos([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const listaFiltrada = cursos.filter((c) =>
    c.nome?.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  const totalPaginas = Math.max(
    1,
    Math.ceil(listaFiltrada.length / ITENS_POR_PAGINA),
  );

  const cursosPagina = listaFiltrada.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA,
  );

  useEffect(() => {
    setPaginaAtual(1);
  }, [pesquisa]);

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);

  function validarNome(valor) {
    const nome = valor.trim();
    if (nome.length < 3) return "Nome deve ter no mínimo 3 letras";
    if (!REGEX_NOME_VALIDO.test(nome))
      return "Nome não pode conter símbolos ou números";
    return "";
  }

  function abrirCriar() {
    setCursoEditando(null);
    setNomeInput("");
    setErroNome("");
    setModalAberto(true);
  }

  function abrirEditar(curso) {
    setCursoEditando(curso);
    setNomeInput(curso.nome);
    setErroNome("");
    setModalAberto(true);
  }

  function handleNomeChange(e) {
    const valor = e.target.value;
    setNomeInput(valor);
    setErroNome(validarNome(valor));
  }

  async function salvar() {
    const erro = validarNome(nomeInput);
    if (erro) {
      setErroNome(erro);
      return;
    }

    setSalvando(true);
    try {
      const editando = !!cursoEditando;
      const url = editando
        ? API_ROUTES.cursos.editar(cursoEditando.id)
        : API_ROUTES.cursos.criar;

      const res = await authFetch(url, {
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeInput.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        alertErro(data.mensagem ?? "Erro ao salvar curso");
        return;
      }

      alertSucesso(data.mensagem);
      setModalAberto(false);
      carregar();
    } catch {
      alertErro("Erro ao salvar curso");
    } finally {
      setSalvando(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!erroNome && nomeInput.trim() && !salvando) salvar();
    }
  }

  async function deletar(curso) {
    const confirmado = await alertConfirmar(`Deletar o curso "${curso.nome}"?`);
    if (!confirmado) return;

    try {
      const res = await authFetch(API_ROUTES.cursos.deletar(curso.id), {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        alertErro(data.mensagem ?? "Erro ao deletar curso");
        return;
      }

      alertSucesso(data.mensagem);
      carregar();
    } catch {
      alertErro("Erro ao deletar curso");
    }
  }

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.principalBox}>
      <div className={styles.divHeader}>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          school
        </span>
        <h3>Gerenciar Cursos</h3>
      </div>

      <div className={styles.topo}>
        <div className={styles.inputPesquisa}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.formControl}
            placeholder="Pesquisar curso"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
          {pesquisa && (
            <button
              className={styles.limparPesquisa}
              type="button"
              onClick={() => setPesquisa("")}
              aria-label="Limpar pesquisa"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button className={styles.btnNovo} onClick={abrirCriar}>
          <Plus size={18} /> Novo Curso
        </button>
      </div>

      <div className={styles.containerLista}>
        {carregando && <p className={styles.mensagem}>Carregando...</p>}

        {!carregando && listaFiltrada.length === 0 && (
          <p className={styles.mensagem}>Nenhum curso encontrado.</p>
        )}

        {cursosPagina.map((curso) => (
          <div className={styles.linha} key={curso.id}>
            <button
              className={styles.btnEditar}
              onClick={() => abrirEditar(curso)}
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
            <span className={styles.nomeCurso}>{curso.nome}</span>
            <button
              className={styles.btnDeletar}
              onClick={() => deletar(curso)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="paginacao">
          <Pagination
            count={totalPaginas}
            page={paginaAtual}
            onChange={(_, novaPagina) => setPaginaAtual(novaPagina)}
            shape="rounded"
            size="medium"
            siblingCount={1}
            boundaryCount={1}
            classes={{ ul: "paginacaoLista" }}
          />
        </div>
      )}

      {modalAberto && (
        <div className={styles.overlay} onClick={() => setModalAberto(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h4>{cursoEditando ? "Editar Curso" : "Novo Curso"}</h4>
            <div>
              <input
                type="text"
                className={styles.formControl}
                placeholder="Nome do curso"
                value={nomeInput}
                onChange={handleNomeChange}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {erroNome && <p className={styles.erroTexto}>{erroNome}</p>}
            </div>
            <div className={styles.modalAcoes}>
              <button
                className={styles.btnCancelar}
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.btnSalvar}
                onClick={salvar}
                disabled={salvando || !!erroNome || !nomeInput.trim()}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      <a
        href="#"
        onClick={() => history.back()}
        className={`${styles.voltar} ${docked ? styles.voltarDocked : ""}`}
      >
        ← Voltar
      </a>
    </div>
  );
}
