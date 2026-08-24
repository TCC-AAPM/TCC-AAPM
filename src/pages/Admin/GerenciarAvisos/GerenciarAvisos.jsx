import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";

import styles from "./GerenciarAvisos.module.css";
import { useDockButton } from "../../../utils/useDockButton";
import { authFetch } from "../../../utils/auth";
import { API_ROUTES } from "../../../routes/config/api";

const CATEGORIAS = [
  {
    titulo: "Reserva de armário",
    tipos: [
      "RESERVA_CRIADA",
      "RESERVA_EXPIRANDO",
      "RESERVA_EXPIRADA",
      "RESERVA_CANCELADA",
      "ARMARIO_TRANSFERIDO",
    ],
  },
  {
    titulo: "Conta do aluno",
    tipos: [
      "CADASTRO_REALIZADO",
      "SENHA_ALTERADA",
      "DADOS_ALTERADOS",
      "CONTA_SUSPENSA",
      "TERMO_ATUALIZADO",
    ],
  },
  {
    titulo: "Comunicados gerais",
    tipos: ["AVISO_GERAL", "MANUTENCAO", "NOVO_RECURSO"],
  },
  {
    titulo: "Alertas/pendências",
    tipos: ["PAGAMENTO_FEITO"],
  },
];

export default function GerenciarAvisos() {
  const docked = useDockButton();

  const [notificacoes, setNotificacoes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarNotificacoes() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await authFetch(
          API_ROUTES.notificacoes.listarHistorico,
        );

        if (!resposta.ok) {
          throw new Error(`Erro HTTP ${resposta.status}`);
        }

        const resultado = await resposta.json();

        console.log("Notificações recebidas do backend:", resultado);

        if (!resultado?.sucesso) {
          throw new Error(
            resultado?.mensagem || "Erro ao carregar notificações.",
          );
        }

        const dados = Array.isArray(resultado?.dados) ? resultado.dados : [];

        setNotificacoes(dados);
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);

        setNotificacoes([]);

        setErro("Não foi possível carregar as notificações.");
      } finally {
        setCarregando(false);
      }
    }

    carregarNotificacoes();
  }, []);

  const termo = pesquisa.trim().toLowerCase();

  /*
   * Filtra apenas as notificações que:
   *
   * 1. vieram do backend
   * 2. pertencem aos tipos conhecidos
   * 3. correspondem à pesquisa
   */
  const categoriasFiltradas = useMemo(() => {
    return CATEGORIAS.map((categoria) => {
      const notificacoesDaCategoria = categoria.tipos
        .map((tipo) => {
          return notificacoes.find(
            (notificacao) => notificacao.evento === tipo,
          );
        })
        .filter(Boolean)
        .filter((notificacao) => {
          if (!termo) return true;

          const titulo = (notificacao.titulo || "").toLowerCase();

          const mensagem = (notificacao.mensagem || "").toLowerCase();

          const evento = (notificacao.evento || "").toLowerCase();

          return (
            titulo.includes(termo) ||
            mensagem.includes(termo) ||
            evento.includes(termo)
          );
        });

      return {
        ...categoria,
        notificacoes: notificacoesDaCategoria,
      };
    }).filter((categoria) => categoria.notificacoes.length > 0);
  }, [notificacoes, termo]);

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.principalBox}>
        {/* HEADER */}
        <div className={styles.divHeader}>
          <span className={`material-symbols-outlined ${styles.icon}`}>
            notifications
          </span>

          <h3>Histórico de Avisos Automáticos</h3>
        </div>

        {/* PESQUISA */}
        <div className={styles.inputPesquisa}>
          <Search size={18} className={styles.searchIcon} />

          <input
            type="text"
            className={styles.formControl}
            placeholder="Buscar por tipo de aviso"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />

          {pesquisa && (
            <button
              type="button"
              className={styles.limparPesquisa}
              onClick={() => setPesquisa("")}
              aria-label="Limpar pesquisa"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* CARREGANDO */}
        {carregando && (
          <p className={styles.mensagemEstado}>Carregando notificações...</p>
        )}

        {/* ERRO */}
        {!carregando && erro && (
          <p className={styles.mensagemEstadoErro}>{erro}</p>
        )}

        {/* NENHUM RESULTADO */}
        {!carregando && !erro && categoriasFiltradas.length === 0 && (
          <p className={styles.mensagemEstado}>
            Nenhuma notificação encontrada.
          </p>
        )}

        {/* CATEGORIAS */}
        {!carregando &&
          !erro &&
          categoriasFiltradas.map((categoria) => (
            <div className={styles.containerLista} key={categoria.titulo}>
              <h4>{categoria.titulo}</h4>

              {categoria.notificacoes.map((notificacao) => {
                const ativa = notificacao.ativa === true;

                return (
                  <div
                    className={`${styles.linha} ${
                      !ativa ? styles.linhaInativa : ""
                    }`}
                    key={notificacao.evento}
                  >
                    {/* TEXTO */}
                    <div className={styles.textos}>
                      <span className={styles.tituloAviso}>
                        {notificacao.titulo}
                      </span>

                      <span
                        className={styles.mensagemAviso}
                        title={notificacao.mensagem}
                      >
                        {notificacao.mensagem}
                      </span>
                    </div>

                    {/* STATUS */}
                    <span
                      className={`${styles.badge} ${
                        ativa ? styles.badgeAtiva : styles.badgeInativa
                      }`}
                    >
                      {ativa ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
      </div>

      {/* VOLTAR */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          history.back();
        }}
        className={`${styles.voltar} ${docked ? styles.voltarDocked : ""}`}
      >
        ← Voltar
      </a>
    </div>
  );
}
