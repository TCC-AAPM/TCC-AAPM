import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import { Search, X } from "lucide-react";
import { authFetch, API_ROUTES } from "../../../utils/auth";
import styles from "./HistoricoAlunos.module.css";
import { useDockButton } from "../../../utils/useDockButton";

const ITENS_POR_PAGINA = 10;

function aplicarMascaraCPF(cpf) {
  if (!cpf) return "";
  const valor = cpf.replace(/\D/g, "").slice(0, 11);
  return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export default function HistoricoAlunos() {
  const docked = useDockButton();
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      try {
        const res = await authFetch(API_ROUTES.reservas.historico);
        const resultado = await res.json();
        setAlunos(resultado.dados ?? resultado ?? []);
      } catch {
        setAlunos([]);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const termo = pesquisa.toLowerCase();
  const listaFiltrada = alunos
    .filter(
      (aluno) =>
        aluno.nome?.toLowerCase().includes(termo) ||
        aluno.cpf?.includes(termo) ||
        aluno.numeroArmario?.toString().includes(termo),
    )
    .sort((a, b) => Number(b.isAtivo) - Number(a.isAtivo));
  const totalPaginas = Math.max(
    1,
    Math.ceil(listaFiltrada.length / ITENS_POR_PAGINA),
  );

  const alunosPagina = listaFiltrada.slice(
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

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.principalBox}>
      <div className={styles.divHeader}>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          history
        </span>
        <h3>Histórico de Alunos</h3>
      </div>

      <div className={styles.inputPesquisa}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.formControl}
          placeholder="Nome, CPF ou número do armário"
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

      <div className={styles.containerLista}>
        <div className={`${styles.linha} ${styles.titulo}`}>
          <span></span>
          <span>Nome</span>
          <span>CPF</span>
          <span>Armário</span>
          <span>Status</span>
        </div>

        {carregando && <p className={styles.mensagem}>Carregando...</p>}

        {!carregando && listaFiltrada.length === 0 && (
          <p className={styles.mensagem}>Nenhum registro encontrado.</p>
        )}

        {alunosPagina.map((aluno, index) => (
          <div className={styles.linha} key={index}>
            <button
              className={styles.btnEditar}
              onClick={() => {
                localStorage.setItem(
                  "alunoEditando",
                  JSON.stringify({
                    cpf: aluno.cpf,
                  }),
                );

                navigate("/admin/editar-aluno");
              }}
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
            <span>{aluno.nome}</span>
            <span>{aplicarMascaraCPF(aluno.cpf)}</span>
            <span>Armário {aluno.numeroArmario}</span>
            <span
              className={`${styles.status} ${aluno.isAtivo ? styles.ativo : styles.inativo}`}
            >
              {aluno.isAtivo ? "Ativo" : "Inativo"}
            </span>
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
