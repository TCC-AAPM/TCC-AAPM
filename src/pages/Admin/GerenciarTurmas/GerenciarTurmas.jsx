import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { Search, X, Plus, Pencil, Trash2 } from "lucide-react";
import { authFetch, API_ROUTES } from "../../../utils/auth";
import {
    alertConfirmar,
    alertSucesso,
    alertErro,
} from "../../../components/Alerts/Alerts";
import styles from "./GerenciarTurmas.module.css";

const ITENS_POR_PAGINA = 10;

const PERIODOS = [
    { valor: "M", label: "Matutino" },
    { valor: "V", label: "Vespertino" },
    { valor: "N", label: "Noturno" },
    { valor: "I", label: "Integral" },
];

const SEMESTRES = [
    { valor: "P", label: "1º Semestre" },
    { valor: "S", label: "2º Semestre" },
];

export default function GerenciarTurmas() {
    const [turmas, setTurmas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroCurso, setFiltroCurso] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    const [modalAberto, setModalAberto] = useState(false);
    const [turmaEditando, setTurmaEditando] = useState(null); // null = criando

    const [nomeTurma, setNomeTurma] = useState("");
    const [idCurso, setIdCurso] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [semestreInicio, setSemestreInicio] = useState("");
    const [erroNome, setErroNome] = useState("");
    const [salvando, setSalvando] = useState(false);

    async function carregar() {
        setCarregando(true);
        try {
            const [resTurmas, resCursos] = await Promise.all([
                authFetch(API_ROUTES.turmas.listar),
                authFetch(API_ROUTES.cursos.carregarCursos),
            ]);
            const turmasData = await resTurmas.json();
            const cursosData = await resCursos.json();
            setTurmas(turmasData.dados ?? turmasData ?? []);
            setCursos(cursosData.dados ?? cursosData ?? []);
        } catch {
            setTurmas([]);
            setCursos([]);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    function nomeCurso(id) {
        return cursos.find((c) => c.id === id)?.nome ?? "—";
    }

    const listaFiltrada = turmas
        .filter(
            (t) =>
                (t.nomeTurma?.toLowerCase().includes(pesquisa.toLowerCase()) ||
                    nomeCurso(t.idCurso).toLowerCase().includes(pesquisa.toLowerCase())) &&
                (filtroCurso === "" || t.idCurso === Number(filtroCurso)),
        )
        .sort((a, b) => {
            const cursoA = nomeCurso(a.idCurso);
            const cursoB = nomeCurso(b.idCurso);
            if (cursoA !== cursoB) return cursoA.localeCompare(cursoB);
            return a.nomeTurma.localeCompare(b.nomeTurma);
        });

    const totalPaginas = Math.max(
        1,
        Math.ceil(listaFiltrada.length / ITENS_POR_PAGINA),
    );

    const turmasPagina = listaFiltrada.slice(
        (paginaAtual - 1) * ITENS_POR_PAGINA,
        paginaAtual * ITENS_POR_PAGINA,
    );

    useEffect(() => {
        setPaginaAtual(1);
    }, [pesquisa, filtroCurso]);

    useEffect(() => {
        if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas);
    }, [paginaAtual, totalPaginas]);

    function validarNome(valor) {
        const nome = valor.trim();
        if (nome.length < 2) return "Nome deve ter no mínimo 2 caracteres";
        return "";
    }

    function abrirCriar() {
        setTurmaEditando(null);
        setNomeTurma("");
        setIdCurso("");
        setPeriodo("");
        setSemestreInicio("");
        setErroNome("");
        setModalAberto(true);
    }

    function abrirEditar(turma) {
        setTurmaEditando(turma);
        setNomeTurma(turma.nomeTurma);
        setIdCurso(turma.idCurso);
        setPeriodo(turma.periodo);
        setSemestreInicio(turma.semestreInicio);
        setErroNome("");
        setModalAberto(true);
    }

    function handleNomeChange(e) {
        const valor = e.target.value;
        setNomeTurma(valor);
        setErroNome(validarNome(valor));
    }

    const formValido =
        !validarNome(nomeTurma) && idCurso !== "" && periodo !== "" && semestreInicio !== "";

    async function salvar() {
        const erro = validarNome(nomeTurma);
        if (erro || !formValido) {
            setErroNome(erro || "Preencha todos os campos");
            return;
        }

        setSalvando(true);
        try {
            const editando = !!turmaEditando;
            const url = editando
                ? API_ROUTES.turmas.editar(turmaEditando.idTurma)
                : API_ROUTES.turmas.criar;

            const res = await authFetch(url, {
                method: editando ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomeTurma: nomeTurma.trim(),
                    idCurso: Number(idCurso),
                    periodo,
                    semestreInicio,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                alertErro(data.mensagem ?? "Erro ao salvar turma");
                return;
            }

            alertSucesso(data.mensagem);
            setModalAberto(false);
            carregar();
        } catch {
            alertErro("Erro ao salvar turma");
        } finally {
            setSalvando(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (formValido && !salvando) salvar();
        }
    }

    async function deletar(turma) {
        const confirmado = await alertConfirmar(
            `Deletar a turma "${turma.nomeTurma}"?`,
        );
        if (!confirmado) return;

        try {
            const res = await authFetch(API_ROUTES.turmas.deletar(turma.idTurma), {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok) {
                alertErro(data.mensagem ?? "Erro ao deletar turma");
                return;
            }

            alertSucesso(data.mensagem);
            carregar();
        } catch {
            alertErro("Erro ao deletar turma");
        }
    }

    return (
        <div className={styles.principalBox}>
            <div className={styles.divHeader}>
                <span className={`material-symbols-outlined ${styles.icon}`}>
                    groups
                </span>
                <h3>Gerenciar Turmas</h3>
            </div>

            <div className={styles.topo}>
                <div className={styles.inputPesquisa}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.formControl}
                        placeholder="Nome da turma ou curso"
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

                <select
                    className={`${styles.select} ${styles.selectFiltro}`}
                    value={filtroCurso}
                    onChange={(e) => setFiltroCurso(e.target.value)}
                >
                    <option value="">Todos os cursos</option>
                    {cursos.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nome}
                        </option>
                    ))}
                </select>

                <button className={styles.btnNovo} onClick={abrirCriar}>
                    <Plus size={18} /> Nova Turma
                </button>
            </div>

            <div className={styles.containerLista}>
                {carregando && <p className={styles.mensagem}>Carregando...</p>}

                {!carregando && listaFiltrada.length === 0 && (
                    <p className={styles.mensagem}>Nenhuma turma encontrada.</p>
                )}

                {turmasPagina.map((turma) => (
                    <div className={styles.linha} key={turma.idTurma}>
                        <button
                            className={styles.btnEditar}
                            onClick={() => abrirEditar(turma)}
                        >
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                        <div className={styles.infoTurma}>
                            <span className={styles.nomeTurma}>{turma.nomeTurma}</span>
                            <span className={styles.detalhes}>
                                {nomeCurso(turma.idCurso)} ·{" "}
                                {PERIODOS.find((p) => p.valor === turma.periodo)?.label} ·{" "}
                                {SEMESTRES.find((s) => s.valor === turma.semestreInicio)?.label}
                            </span>
                        </div>
                        <button className={styles.btnDeletar} onClick={() => deletar(turma)}>
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
                        <h4>{turmaEditando ? "Editar Turma" : "Nova Turma"}</h4>

                        <div>
                            <input
                                type="text"
                                className={styles.formControl}
                                placeholder="Nome da turma"
                                value={nomeTurma}
                                onChange={handleNomeChange}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                            {erroNome && <p className={styles.erroTexto}>{erroNome}</p>}
                        </div>

                        <select
                            className={styles.formControl}
                            value={idCurso}
                            onChange={(e) => setIdCurso(e.target.value)}
                            onKeyDown={handleKeyDown}
                        >
                            <option value="">Selecione o curso</option>
                            {cursos.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nome}
                                </option>
                            ))}
                        </select>

                        <select
                            className={styles.formControl}
                            value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            onKeyDown={handleKeyDown}
                        >
                            <option value="">Selecione o período</option>
                            {PERIODOS.map((p) => (
                                <option key={p.valor} value={p.valor}>
                                    {p.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className={styles.formControl}
                            value={semestreInicio}
                            onChange={(e) => setSemestreInicio(e.target.value)}
                            onKeyDown={handleKeyDown}
                        >
                            <option value="">Selecione o semestre de início</option>
                            {SEMESTRES.map((s) => (
                                <option key={s.valor} value={s.valor}>
                                    {s.label}
                                </option>
                            ))}
                        </select>

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
                                disabled={salvando || !formValido}
                            >
                                {salvando ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}