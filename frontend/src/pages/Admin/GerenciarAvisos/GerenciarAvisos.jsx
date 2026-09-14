import { useEffect, useMemo, useState } from "react";
import { History, Search, X } from "lucide-react";
import styles from "./GerenciarAvisos.module.css";
import { useDockButton } from "../../../utils/useDockButton";
import { authFetch } from "../../../utils/auth";
import { API_ROUTES } from "../../../routes/config/api";
import {
  alertConfirmar,
  alertSucesso,
  alertErro,
} from "../../../components/Alerts/Alerts";

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

function formatarData(data) {
  if (!data) return "—";

  const dataFormatada = new Date(data);

  if (Number.isNaN(dataFormatada.getTime())) {
    return "—";
  }

  return dataFormatada.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function GerenciarAvisos() {
  const docked = useDockButton();

  const [notificacoes, setNotificacoes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tipoAberto, setTipoAberto] = useState(null);
  const [alterandoStatus, setAlterandoStatus] = useState(null);

  const [historico, setHistorico] = useState([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);

  useEffect(() => {
    let ativo = true;

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

        if (!resultado?.sucesso) {
          throw new Error(
            resultado?.mensagem || "Erro ao carregar notificações.",
          );
        }

        const dados = Array.isArray(resultado?.dados) ? resultado.dados : [];

        if (ativo) {
          setNotificacoes(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);

        if (ativo) {
          setNotificacoes([]);
          setErro("Não foi possível carregar as notificações.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarNotificacoes();

    return () => {
      ativo = false;
    };
  }, []);

  const abrirHistorico = async (tipo, referencia) => {
    const idNotificacao = referencia?.idNotificacao ?? referencia?.id ?? null;

    if (!idNotificacao) {
      alertErro("Não foi possível identificar este aviso.");
      return;
    }

    try {
      setTipoAberto(tipo);
      setHistorico([]);
      setCarregandoHistorico(true);

      const resposta = await authFetch(
        API_ROUTES.notificacoes.historico(idNotificacao),
      );

      const resultado = await resposta.json();

      if (!resposta.ok || !resultado?.sucesso) {
        throw new Error(
          resultado?.mensagem || "Não foi possível carregar o histórico.",
        );
      }

      setHistorico(Array.isArray(resultado?.dados) ? resultado.dados : []);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);

      alertErro("Não foi possível carregar o histórico.");

      setTipoAberto(null);
      setHistorico([]);
    } finally {
      setCarregandoHistorico(false);
    }
  };

  const termo = pesquisa.trim().toLowerCase();

  const registrosPorTipo = useMemo(() => {
    const mapa = {};

    notificacoes.forEach((notificacao) => {
      const tipo = notificacao?.evento;

      if (!tipo) return;

      if (!mapa[tipo]) {
        mapa[tipo] = [];
      }

      mapa[tipo].push(notificacao);
    });

    return mapa;
  }, [notificacoes]);

  const categoriasFiltradas = useMemo(() => {
    return CATEGORIAS.map((categoria) => {
      const notificacoesDaCategoria = categoria.tipos
        .map((tipo) => {
          const registros = registrosPorTipo[tipo];

          if (!registros?.length) {
            return null;
          }

          return {
            tipo,
            referencia: registros[0],
          };
        })
        .filter(Boolean)
        .filter(({ tipo, referencia }) => {
          if (!termo) return true;

          const titulo = String(referencia?.titulo ?? "").toLowerCase();

          const mensagem = String(referencia?.mensagem ?? "").toLowerCase();

          const evento = String(tipo ?? "").toLowerCase();

          return (
            titulo.includes(termo) ||
            mensagem.includes(termo) ||
            evento.includes(termo)
          );
        })
        .sort(
          (a, b) =>
            Number(b.referencia?.ativa === true) -
            Number(a.referencia?.ativa === true),
        );

      return {
        ...categoria,
        notificacoes: notificacoesDaCategoria,
      };
    }).filter((categoria) => categoria.notificacoes.length > 0);
  }, [registrosPorTipo, termo]);

  const alternarStatus = async (tipo, referencia) => {
    const idNotificacao = referencia?.idNotificacao ?? referencia?.id ?? null;

    if (!idNotificacao) {
      alertErro("Não foi possível identificar este aviso.");
      return;
    }

    const novaAtiva = referencia?.ativa !== true;

    const confirmado = await alertConfirmar(
      novaAtiva
        ? "Deseja ativar este tipo de aviso?"
        : "Deseja desativar este tipo de aviso?",
    );

    if (!confirmado) return;

    try {
      setAlterandoStatus(tipo);

      const resposta = await authFetch(
        API_ROUTES.notificacoes.alterarStatus(idNotificacao),
        {
          method: "PUT",
        },
      );

      const resultado = await resposta.json();

      if (!resposta.ok || !resultado?.sucesso) {
        throw new Error(resultado?.mensagem || `Erro HTTP ${resposta.status}`);
      }

      setNotificacoes((prev) =>
        prev.map((notificacao) =>
          notificacao?.evento === tipo
            ? {
                ...notificacao,
                ativa: novaAtiva,
              }
            : notificacao,
        ),
      );

      alertSucesso(
        novaAtiva
          ? "Aviso ativado com sucesso!"
          : "Aviso desativado com sucesso!",
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);

      alertErro("Não foi possível atualizar o status do aviso.");
    } finally {
      setAlterandoStatus(null);
    }
  };

  const registrosDoModal = historico;

  const tituloModal =
    registrosPorTipo[tipoAberto]?.[0]?.titulo || tipoAberto || "Histórico";

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.principalBox}>
        <div className={styles.divHeader}>
          <span className={`material-symbols-outlined ${styles.icon}`}>
            notifications
          </span>

          <h3>Histórico de Avisos Automáticos</h3>
        </div>

        <div className={styles.inputPesquisa}>
          <Search size={18} className={styles.searchIcon} />

          <input
            type="text"
            className={styles.formControl}
            placeholder="Buscar por tipo de aviso"
            value={pesquisa}
            onChange={(event) => setPesquisa(event.target.value)}
          />

          {pesquisa && (
            <button
              type="button"
              className={styles.limparPesquisa}
              onClick={() => setPesquisa("")}
              aria-label="Limpar pesquisa"
              title="Limpar pesquisa"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {carregando && (
          <p className={styles.mensagem}>Carregando notificações...</p>
        )}

        {!carregando && erro && <p className={styles.mensagem}>{erro}</p>}

        {!carregando && !erro && categoriasFiltradas.length === 0 && (
          <p className={styles.mensagem}>Nenhuma notificação encontrada.</p>
        )}

        {!carregando &&
          !erro &&
          categoriasFiltradas.map((categoria) => (
            <div className={styles.containerLista} key={categoria.titulo}>
              <h4>{categoria.titulo}</h4>

              {categoria.notificacoes.map(({ tipo, referencia }) => {
                const ativa = referencia?.ativa === true;

                const salvando = alterandoStatus === tipo;

                return (
                  <div
                    className={`${styles.linha} ${
                      !ativa ? styles.linhaInativa : ""
                    }`}
                    key={tipo}
                  >
                    <div className={styles.textos}>
                      <span className={styles.tituloAviso}>
                        {referencia?.titulo || "Aviso"}
                      </span>

                      <span
                        className={styles.mensagemAviso}
                        title={referencia?.mensagem || ""}
                      >
                        {referencia?.mensagem || "Sem mensagem disponível."}
                      </span>
                    </div>

                    <div className={styles.acoes}>
                      <button
                        type="button"
                        className={styles.btnHistoricoIcon}
                        onClick={() => abrirHistorico(tipo, referencia)}
                        disabled={salvando}
                        title="Ver histórico"
                      >
                        <History size={16} />
                      </button>

                      <button
                        type="button"
                        className={styles.btnStatus}
                        onClick={() => alternarStatus(tipo, referencia)}
                        disabled={salvando}
                      >
                        {salvando
                          ? "Salvando..."
                          : ativa
                            ? "Desativar"
                            : "Ativar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>

      {tipoAberto && (
        <div className={styles.overlay} onClick={() => setTipoAberto(null)}>
          <div
            className={styles.modalPrevia}
            onClick={(event) => event.stopPropagation()}
          >
            <h4>{tituloModal}</h4>

            <div className={styles.tabelaHistorico}>
              <div
                className={`${styles.linhaTabela} ${styles.linhaTabelaTitulo}`}
              >
                <span>Destinatário</span>
                <span>Data</span>
              </div>

              {carregandoHistorico ? (
                <p className={styles.mensagem}>Carregando histórico...</p>
              ) : registrosDoModal.length > 0 ? (
                registrosDoModal.map((registro, index) => (
                  <div
                    className={styles.linhaTabela}
                    key={registro?.id ?? index}
                  >
                    <span>{registro?.destinario || "—"}</span>

                    <span>{formatarData(registro?.dataEnvio)}</span>
                  </div>
                ))
              ) : (
                <p className={styles.mensagem}>
                  Nenhum envio nos últimos 2 meses.
                </p>
              )}
            </div>

            <div className={styles.modalAcoes}>
              <button
                type="button"
                className={styles.btnCancelar}
                onClick={() => setTipoAberto(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <a
        href="#"
        onClick={(event) => {
          event.preventDefault();
          history.back();
        }}
        className={`${styles.voltar} ${docked ? styles.voltarDocked : ""}`}
      >
        ← Voltar
      </a>
    </div>
  );
}
