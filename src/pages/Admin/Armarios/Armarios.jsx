import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Search,
  SlidersHorizontal,
  Wrench,
  X,
  XSquare,
} from "lucide-react";

import { CardArmario } from "../../../components/CardArmario/CardArmario.jsx";
import { PopupModal } from "../../../components/PopupModal/PopupModal.jsx";

import { API_ROUTES } from "../../../utils/auth.js";
import styles from "./Armarios.module.css";

export default function Armarios() {
  const navigate = useNavigate();

  const [armarios, setArmarios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [popup, setPopup] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState(null);
  const [modoSelecao, setModoSelecao] = useState(false);
  const [selecionados, setSelecionados] = useState([]);
  const [ultimoClicado, setUltimoClicado] = useState(null);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    async function carregar() {
      try {
        const respostaArmarios = await fetch(API_ROUTES.armarios.listar, {
          headers,
        });

        const respostaUsuarios = await fetch(API_ROUTES.reservas.comReserva, {
          headers,
        });

        const arm = await respostaArmarios.json();
        const usr = await respostaUsuarios.json();

        setArmarios(Array.isArray(arm.dados) ? arm.dados : []);
        setUsuarios(Array.isArray(usr.dados) ? usr.dados : []);
      } catch (erro) {
        console.error(erro);
        setArmarios([]);
        setUsuarios([]);
      }
    }

    carregar().catch(console.error);
  }, []);

  const estadoClasse = {
    O: "ocupado",
    M: "manutencao",
    D: "disponivel",
    P: "pendente",
  };

  const lista = armarios.filter((arm) => {
    const user = usuarios.find((u) => u.numeroArmario === arm.numeroArmario);
    const termo = pesquisa.toLowerCase();

    const matchPesquisa =
      arm.numeroArmario?.toString().includes(termo) ||
      user?.nomeAluno?.toLowerCase().includes(termo) ||
      user?.CPF?.includes(termo) ||
      user?.email?.toLowerCase().includes(termo);

    const matchFiltro = !filtro || estadoClasse[arm.estado] === filtro;

    return matchPesquisa && matchFiltro;
  });

  function handleClick(arm, e) {
    if (modoSelecao) {
      if (e?.shiftKey && ultimoClicado !== null) {
        const indexAtual = lista.findIndex(
          (a) => a.numeroArmario === arm.numeroArmario,
        );
        const indexUltimo = lista.findIndex(
          (a) => a.numeroArmario === ultimoClicado,
        );

        const [inicio, fim] =
          indexAtual < indexUltimo
            ? [indexAtual, indexUltimo]
            : [indexUltimo, indexAtual];

        const intervalo = lista.slice(inicio, fim + 1).map((a) => a.numeroArmario);

        setSelecionados((prev) => {
          const novos = intervalo.filter((n) => !prev.includes(n));
          return [...prev, ...novos];
        });

        setUltimoClicado(arm.numeroArmario);
      } else {
        setSelecionados((prev) =>
          prev.includes(arm.numeroArmario)
            ? prev.filter((n) => n !== arm.numeroArmario)
            : [...prev, arm.numeroArmario],
        );
        setUltimoClicado(arm.numeroArmario);
      }
      return;
    }

    if (arm.estado === "D") {
      localStorage.setItem("armarioSelecionado", arm.numeroArmario);
      navigate("/admin/cadastrar-aluno");
    } else if (arm.estado === "O") {
      const usuario = usuarios.find(
        (u) => u.numeroArmario === arm.numeroArmario,
      );
      setPopup({ tipo: "ocupado", armario: arm, usuario });
    }
  }

  function handleContextMenu(arm) {
    const usuario = usuarios.find((u) => u.numeroArmario === arm.numeroArmario);
    setPopup({ tipo: "manutencao-ctx", armario: arm, usuario });
  }

  const handleSelecionarTodos = useCallback(() => {
    const todosIds = lista.map((a) => a.numeroArmario);
    const todosSelecionados = todosIds.every((id) => selecionados.includes(id));
    setSelecionados(todosSelecionados ? [] : todosIds);
    setUltimoClicado(
      todosSelecionados ? null : lista[lista.length - 1]?.numeroArmario ?? null,
    );
  }, [lista, selecionados]);

  async function handleAcaoEmLote(novoEstado) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    const numerosValidos = selecionados.filter((numero) => {
      const arm = armarios.find((a) => a.numeroArmario === numero);
      return arm && arm.estado !== novoEstado && arm.estado !== "O";
    });

    if (numerosValidos.length === 0) {
      setModoSelecao(false);
      setSelecionados([]);
      return;
    }

    try {
      await Promise.all(
        numerosValidos.map((numero) =>
          fetch(API_ROUTES.armarios.atualizarEstado(numero), {
            method: "PUT",
            headers,
            body: JSON.stringify({ estado: novoEstado }),
          }),
        ),
      );
    } catch (erro) {
      console.error("Erro ao atualizar armários:", erro);
    } finally {
      setModoSelecao(false);
      setSelecionados([]);
      window.location.reload();
    }
  }

  function handleAcaoManutencao() {
    handleAcaoEmLote("M");
  }

  function handleAcaoDisponivel() {
    handleAcaoEmLote("D");
  }

  const filtros = [
    ["filtroOcupado", "ocupado", "Ocupado"],
    ["filtroManutencao", "manutencao", "Manutenção"],
    ["filtroDisponivel", "disponivel", "Disponível"],
    ["filtroPendente", "pendente", "Pendente"],
  ];

  const filtroLabel = filtros.find(([, estado]) => estado === filtro)?.[2];
  const afetadosManutencao = selecionados.filter((n) => {
    const arm = armarios.find((a) => a.numeroArmario === n);
    return arm && arm.estado !== "M" && arm.estado !== "O";
  }).length;

  const afetadosDisponivel = selecionados.filter((n) => {
    const arm = armarios.find((a) => a.numeroArmario === n);
    return arm && arm.estado !== "D" && arm.estado !== "O";
  }).length;

  const todosVisivelSelecionados =
    lista.length > 0 && lista.every((arm) => selecionados.includes(arm.numeroArmario));

  useEffect(() => {
    function handleKeyDown(e) {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target?.tagName)) return;

      if (e.key === "s" && e.altKey && !modoSelecao) {
        setModoSelecao(true);
        return;
      }

      if (e.key === "Escape" && modoSelecao) {
        setModoSelecao(false);
        setSelecionados([]);
        setUltimoClicado(null);
        return;
      }

      if (e.key === "a" && e.ctrlKey && modoSelecao) {
        e.preventDefault();
        handleSelecionarTodos();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modoSelecao, selecionados, lista, afetadosManutencao, afetadosDisponivel, handleSelecionarTodos]);

  return (
    <div className={styles.principalBox}>
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarHeader}>
            <div>
              <p className={styles.kicker}>Gestão de armários</p>
              <h1 className={styles.titulo}>Armários</h1>
            </div>
            <div className={styles.toolbarActions}>
              <span className={styles.resultado}>
                {lista.length} encontrados
              </span>
              <button
                type="button"
                className={`${styles.btnSelecao} ${
                  modoSelecao ? styles.btnSelecaoAtivo : ""
                }`}
                onClick={() => {
                  setModoSelecao((v) => !v);
                  setSelecionados([]);
                  setUltimoClicado(null);
                }}
              >
                {modoSelecao ? (
                  <>
                    <XSquare size={15} />
                    Cancelar seleção
                  </>
                ) : (
                  "Selecionar"
                )}
              </button>
            </div>
          </div>

          <div className={styles.filtroBar}>
            <div className={styles.inputPesquisa}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.formControl}
                placeholder="Número, nome, CPF ou email"
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

            <div className={styles.filtrosWrap}>
              <div className={styles.filtrosLabel}>
                <SlidersHorizontal size={16} />
                <span>Filtros</span>
              </div>

              <div className={styles.filtros}>
                {filtros.map(([cssKey, estado, label]) => (
                  <button
                    key={estado}
                    type="button"
                    className={`${styles.filtroBtn} ${styles[cssKey]} ${
                      filtro === estado ? styles.ativo : ""
                    }`}
                    onClick={() =>
                      setFiltro((prev) => (prev === estado ? null : estado))
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(filtro || pesquisa) && (
            <button
              className={styles.limparFiltros}
              type="button"
              onClick={() => {
                setFiltro(null);
                setPesquisa("");
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>

        <div className={styles.cardsArea}>
          {lista.length > 0 ? (
            lista.map((arm) => (
              <CardArmario
                key={arm.numeroArmario}
                armario={arm}
                usuario={usuarios.find(
                  (u) => u.numeroArmario === arm.numeroArmario,
                )}
                onClick={(e) => handleClick(arm, e)}
                onContextMenu={() => handleContextMenu(arm)}
                modoSelecao={modoSelecao}
                selecionado={selecionados.includes(arm.numeroArmario)}
              />
            ))
          ) : (
            <div className={styles.estadoVazio}>
              <h2>
                {filtroLabel
                  ? `Não há armários ${filtroLabel.toLowerCase()}s`
                  : "Nenhum armário encontrado"}
              </h2>
              <p>
                {pesquisa
                  ? "Tente buscar por outro número, nome, CPF ou email."
                  : "Altere os filtros para ver outros armários."}
              </p>
            </div>
          )}
        </div>
      </div>

      {popup && (
        <PopupModal
          popup={popup}
          todosArmarios={armarios}
          onClose={() => setPopup(null)}
          onReload={() => window.location.reload()}
        />
      )}

      {selecionados.length > 0 && (
        <div className={styles.barraAcoes}>
          <span>{selecionados.length} armário(s) selecionado(s)</span>
          <button type="button" onClick={handleSelecionarTodos}>
            {todosVisivelSelecionados ? "Desmarcar todos" : "Selecionar todos"}
          </button>
          <button
            type="button"
            className={styles.btnAcaoManutencao}
            onClick={handleAcaoManutencao}
            disabled={afetadosManutencao === 0}
          >
            <Wrench size={15} />
            Manutenção ({afetadosManutencao})
          </button>
          <button
            type="button"
            className={styles.btnAcaoDisponivel}
            onClick={handleAcaoDisponivel}
            disabled={afetadosDisponivel === 0}
          >
            <CheckCircle size={15} />
            Disponível ({afetadosDisponivel})
          </button>
          <span className={styles.dicaTeclado}>Esc cancelar · Ctrl+A todos · Alt+S selecionar</span>
        </div>
      )}
    </div>
  );
}
