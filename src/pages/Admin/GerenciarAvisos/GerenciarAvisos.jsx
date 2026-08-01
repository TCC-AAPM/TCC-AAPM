import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { Search, X, Eye, Send } from "lucide-react";
import { authFetch, API_ROUTES } from "../../../utils/auth";
import {
  alertConfirmar,
  alertSucesso,
  alertErro,
} from "../../../components/Alerts/Alerts";
import styles from "./GerenciarAvisos.module.css";
import { useDockButton } from "../../../utils/useDockButton";

const ITENS_POR_PAGINA = 10;

const ASSUNTOS = {
  aviso_geral: "Aviso importante",
  manutencao: "Manutenção programada",
};

// Mesmo layout usado pelo backend em EmailTemplates/Base.cs, só pra a prévia bater com o email real
function baseLayout(titulo, corpoHtml) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f5f7;padding:24px;">
      <div style="max-width:420px;margin:0 auto;background:#fff;border-radius:8px;border:1px solid #e5e5e5;">
        <div style="padding:24px 28px 8px;">
          <p style="font-size:12px;color:#888;letter-spacing:1px;margin:0 0 4px;text-transform:uppercase;">AAPM</p>
          <h1 style="font-size:19px;color:#111;margin:0 0 18px;font-weight:600;">${titulo}</h1>
        </div>
        <div style="padding:0 28px 22px;font-size:14px;color:#333;line-height:1.6;">
          ${corpoHtml}
        </div>
        <div style="padding:14px 28px;border-top:1px solid #eee;">
          <p style="font-size:11px;color:#aaa;margin:0;">Equipe AAPM · não responda este e-mail</p>
        </div>
      </div>
    </div>`;
}

function corpoPorAssunto(chave, mensagem) {
  const corpos = {
    aviso_geral: `<p>${mensagem?.trim() || "Escreva a mensagem do aviso..."}</p>`,
    manutencao:
      "<p>Os armários ficarão temporariamente indisponíveis para manutenção.</p><p style='font-size:12px;color:#777;'>Avisaremos assim que o sistema voltar ao normal.</p>",
  };
  return corpos[chave] ?? "";
}

// MOCK de alunos - tenh que trocar pelo fetch real quando o endpoint existir.
const USUARIOS_MOCK = [
  {
    idUsuario: 1,
    nome: "Ana Silva",
    email: "ana@email.com",
    numeroArmario: 12,
  },
  {
    idUsuario: 2,
    nome: "Bruno Costa",
    email: "bruno@email.com",
    numeroArmario: 34,
  },
  {
    idUsuario: 4,
    nome: "Diego Rocha",
    email: "diego@email.com",
    numeroArmario: 7,
  },
];

export default function GerenciarAvisos() {
  const docked = useDockButton();

  const [usuarios] = useState(USUARIOS_MOCK);
  const [carregando] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [assuntoSelecionado, setAssuntoSelecionado] = useState("");
  const [mensagemLivre, setMensagemLivre] = useState("");
  const [selecionados, setSelecionados] = useState([]);
  const [modalPreviaAberto, setModalPreviaAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // useEffect(() => {
  //   authFetch(API_ROUTES.usuario.listar).then((r) => r.json()).then((d) => setUsuarios(d.dados ?? d));
  // }, []);

  const ehAvisoGeral = assuntoSelecionado === "aviso_geral";

  const listaFiltrada = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      u.email.toLowerCase().includes(pesquisa.toLowerCase()) ||
      u.numeroArmario?.toString().includes(pesquisa),
  );

  const totalPaginas = Math.max(
    1,
    Math.ceil(listaFiltrada.length / ITENS_POR_PAGINA),
  );

  const usuariosPagina = listaFiltrada.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA,
  );

  useEffect(() => {
    setPaginaAtual(1);
  }, [pesquisa]);

  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas);
  }, [paginaAtual, totalPaginas]);

  function toggleSelecionado(idUsuario) {
    setSelecionados((prev) =>
      prev.includes(idUsuario)
        ? prev.filter((id) => id !== idUsuario)
        : [...prev, idUsuario],
    );
  }

  function toggleTodosDaPagina() {
    const idsPagina = usuariosPagina.map((u) => u.idUsuario);
    const todosSelecionados = idsPagina.every((id) =>
      selecionados.includes(id),
    );
    setSelecionados((prev) =>
      todosSelecionados
        ? prev.filter((id) => !idsPagina.includes(id))
        : [...new Set([...prev, ...idsPagina])],
    );
  }

  function abrirPrevia() {
    if (!assuntoSelecionado) {
      alertErro("Selecione um assunto");
      return;
    }
    if (ehAvisoGeral && !mensagemLivre.trim()) {
      alertErro("Escreva a mensagem do aviso");
      return;
    }
    if (selecionados.length === 0) {
      alertErro("Selecione ao menos um destinatário");
      return;
    }
    setModalPreviaAberto(true);
  }

  async function confirmarEnvio() {
    const confirmado = await alertConfirmar(
      `Enviar "${ASSUNTOS[assuntoSelecionado]}" para ${selecionados.length} pessoa(s)?`,
    );
    if (!confirmado) return;

    setEnviando(true);
    try {
      const res = await authFetch(API_ROUTES.email.enviarAviso, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assuntoChave: assuntoSelecionado,
          mensagem: ehAvisoGeral ? mensagemLivre : undefined,
          idsUsuarios: selecionados,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alertErro(data.mensagem ?? "Erro ao enviar avisos");
        return;
      }

      alertSucesso(data.mensagem ?? "Avisos enviados com sucesso!");
      setSelecionados([]);
      setAssuntoSelecionado("");
      setMensagemLivre("");
      setModalPreviaAberto(false);
    } catch {
      alertErro("Erro ao enviar avisos");
    } finally {
      setEnviando(false);
    }
  }

  const htmlPrevia = assuntoSelecionado
    ? baseLayout(
        ASSUNTOS[assuntoSelecionado],
        corpoPorAssunto(assuntoSelecionado, mensagemLivre),
      )
    : "";

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.principalBox}>
        <div className={styles.divHeader}>
          <span className={`material-symbols-outlined ${styles.icon}`}>
            notifications
          </span>
          <h3>Gerenciar Avisos e Comunicados</h3>
        </div>

        <div className={styles.topo}>
          <select
            className={`${styles.select} ${styles.selectFiltro}`}
            value={assuntoSelecionado}
            onChange={(e) => setAssuntoSelecionado(e.target.value)}
          >
            <option value="">Selecione um assunto</option>
            {Object.entries(ASSUNTOS).map(([chave, texto]) => (
              <option key={chave} value={chave}>
                {texto}
              </option>
            ))}
          </select>

          <div className={styles.inputPesquisa}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.formControl}
              placeholder="Nome, email ou número do armário"
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

          <button className={styles.btnNovo} onClick={abrirPrevia}>
            <Eye size={18} /> Pré-visualizar
          </button>
        </div>

        {ehAvisoGeral && (
          <div className={styles.topo}>
            <textarea
              className={styles.campoMensagem}
              placeholder="Escreva o conteúdo do aviso..."
              value={mensagemLivre}
              onChange={(e) => setMensagemLivre(e.target.value)}
              rows={3}
            />
          </div>
        )}

        <div className={styles.containerLista}>
          {carregando && <p className={styles.mensagem}>Carregando...</p>}

          {!carregando && listaFiltrada.length === 0 && (
            <p className={styles.mensagem}>Nenhum usuário encontrado.</p>
          )}

          {usuariosPagina.length > 0 && (
            <div className={`${styles.linha} ${styles.titulo}`}>
              <span>
                <input
                  type="checkbox"
                  checked={usuariosPagina.every((u) =>
                    selecionados.includes(u.idUsuario),
                  )}
                  onChange={toggleTodosDaPagina}
                />
              </span>
              <span>Nome</span>
              <span>Email</span>
              <span>Armário</span>
            </div>
          )}

          {usuariosPagina.map((u) => (
            <div
              className={`${styles.linha} ${
                selecionados.includes(u.idUsuario) ? styles.selecionada : ""
              }`}
              key={u.idUsuario}
              onClick={() => toggleSelecionado(u.idUsuario)}
            >
              <span onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selecionados.includes(u.idUsuario)}
                  onChange={() => toggleSelecionado(u.idUsuario)}
                />
              </span>
              <span>{u.nome}</span>
              <span>{u.email}</span>
              <span>Armário {u.numeroArmario}</span>
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
            />
          </div>
        )}

        {modalPreviaAberto && (
          <div
            className={styles.overlay}
            onClick={() => setModalPreviaAberto(false)}
          >
            <div
              className={styles.modalPrevia}
              onClick={(e) => e.stopPropagation()}
            >
              <h4>Prévia do email</h4>

              <iframe
                title="Prévia do email"
                srcDoc={htmlPrevia}
                className={styles.previewFrame}
              />

              <p className={styles.mensagem}>
                Será enviado para {selecionados.length} destinatário(s).
              </p>

              <div className={styles.modalAcoes}>
                <button
                  className={styles.btnCancelar}
                  onClick={() => setModalPreviaAberto(false)}
                >
                  Cancelar
                </button>
                <button
                  className={styles.btnSalvar}
                  onClick={confirmarEnvio}
                  disabled={enviando}
                >
                  <Send size={14} /> {enviando ? "Enviando..." : "Enviar"}
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
