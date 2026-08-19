import { useState, useMemo } from "react";
import { Search, X, History } from "lucide-react";
import styles from "./GerenciarAvisos.module.css";
import { useDockButton } from "../../../utils/useDockButton";

const CATEGORIAS = [
  {
    titulo: "Reserva de armário",
    tipos: [
      "reserva_criada",
      "reserva_expirando",
      "reserva_expirada",
      "reserva_cancelada",
    ],
  },
  {
    titulo: "Conta do aluno",
    tipos: [
      "cadastro_realizado",
      "senha_alterada",
      "dados_desatualizados",
      "conta_suspensa",
      "termo_atualizado",
    ],
  },
  {
    titulo: "Comunicados gerais",
    tipos: ["aviso_geral", "manutencao", "novo_recurso"],
  },
  {
    titulo: "Alertas/pendências",
    tipos: ["pendencia_financeira"],
  },
];

const NOMES = {
  reserva_criada: "Reserva criada com sucesso",
  reserva_expirando: "Reserva expirando em breve",
  reserva_expirada: "Reserva expirada automaticamente pelo sistema",
  reserva_cancelada: "Reserva cancelada",
  cadastro_realizado: "Cadastro realizado com sucesso",
  senha_alterada: "Senha alterada",
  dados_desatualizados: "Dados cadastrais desatualizados",
  conta_suspensa: "Conta suspensa",
  termo_atualizado: "Termo de uso atualizado",
  aviso_geral: "Aviso geral da AAPM",
  manutencao: "Manutenção programada dos armários",
  novo_recurso: "Novo recurso lançado no sistema",
  pendencia_financeira: "Pendência financeira",
};

const LIMITE_HISTORICO = 20;

// MOCK - trocar por fetch real quando o endpoint existir
const HISTORICO_MOCK = [
  {
    tipo: "reserva_criada",
    destinatario: "Ana Paula Rodrigues",
    dataEnvio: "2026-08-18T14:30:00",
  },
  {
    tipo: "reserva_criada",
    destinatario: "Bruno Silva",
    dataEnvio: "2026-08-17T10:00:00",
  },
  {
    tipo: "reserva_expirando",
    destinatario: "Diego Santos",
    dataEnvio: "2026-08-16T09:00:00",
  },
  {
    tipo: "senha_alterada",
    destinatario: "Ana Paula Rodrigues",
    dataEnvio: "2026-08-14T20:00:00",
  },
  {
    tipo: "manutencao",
    destinatario: "Bruno Silva",
    dataEnvio: "2026-08-10T09:00:00",
  },
  {
    tipo: "pendencia_financeira",
    destinatario: "Diego Santos",
    dataEnvio: "2026-08-05T09:00:00",
  },
];

function formatarData(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? "—"
    : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function GerenciarAvisos() {
  const docked = useDockButton();
  const [historico] = useState(HISTORICO_MOCK);
  const [pesquisa, setPesquisa] = useState("");
  const [tipoAberto, setTipoAberto] = useState(null);

  // useEffect(() => {
  //   authFetch(API_ROUTES.email.listarHistorico)
  //     .then((r) => r.json())
  //     .then((d) => setHistorico(d.dados ?? d ?? []));
  // }, []);

  const linhasPorTipo = useMemo(() => {
    const mapa = {};
    for (const item of historico) {
      if (!mapa[item.tipo]) mapa[item.tipo] = [];
      mapa[item.tipo].push(item);
    }
    return mapa;
  }, [historico]);

  const termo = pesquisa.trim().toLowerCase();

  const enviosDoModal = tipoAberto
    ? (linhasPorTipo[tipoAberto] ?? [])
        .slice()
        .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
        .slice(0, LIMITE_HISTORICO)
    : [];

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

        {CATEGORIAS.map((categoria) => {
          const tiposFiltrados = categoria.tipos.filter(
            (tipo) => !termo || NOMES[tipo].toLowerCase().includes(termo),
          );
          if (tiposFiltrados.length === 0) return null;

          return (
            <div className={styles.containerLista} key={categoria.titulo}>
              <h4>{categoria.titulo}</h4>

              {tiposFiltrados.map((tipo) => {
                const envios = linhasPorTipo[tipo] ?? [];
                const ultimo = envios.sort(
                  (a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio),
                )[0];

                return (
                  <div className={styles.linha} key={tipo}>
                    <span>{NOMES[tipo]}</span>
                    <span>
                      {envios.length > 0
                        ? `${envios.length} envio(s)`
                        : "Nenhum envio ainda"}
                    </span>
                    <button
                      className={styles.btnHistorico}
                      onClick={() => setTipoAberto(tipo)}
                      disabled={envios.length === 0}
                    >
                      <History size={14} /> Histórico
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {tipoAberto && (
        <div className={styles.overlay} onClick={() => setTipoAberto(null)}>
          <div
            className={styles.modalPrevia}
            onClick={(e) => e.stopPropagation()}
          >
            <h4>{NOMES[tipoAberto]}</h4>
            <p className={styles.mensagem}>
              Últimos {enviosDoModal.length} disparo(s)
            </p>

            <div className={styles.tabelaHistorico}>
              <div
                className={`${styles.linhaTabela} ${styles.linhaTabelaTitulo}`}
              >
                <span>Destinatário</span>
                <span>Data</span>
              </div>
              {enviosDoModal.map((envio, i) => (
                <div className={styles.linhaTabela} key={i}>
                  <span>{envio.destinatario}</span>
                  <span>{formatarData(envio.dataEnvio)}</span>
                </div>
              ))}
            </div>

            <div className={styles.modalAcoes}>
              <button
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
        onClick={() => history.back()}
        className={`${styles.voltar} ${docked ? styles.voltarDocked : ""}`}
      >
        ← Voltar
      </a>
    </div>
  );
}
