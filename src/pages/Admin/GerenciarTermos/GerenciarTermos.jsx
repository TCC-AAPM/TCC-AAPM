import { useEffect, useRef, useState } from "react";
import { FileText, Eye, Pencil, UploadCloud } from "lucide-react";
import { authFetch, API_ROUTES } from "../../../utils/auth";
import {
  alertConfirmar,
  alertSucesso,
  alertErro,
} from "../../../components/Alerts/Alerts";
import styles from "./GerenciarTermos.module.css";
import { useDockButton } from "../../../utils/useDockButton";

// Ajuste os valores conforme o enum ReferenciaTermos do back-end
const TIPOS_TERMOS = [
  { valor: "S", label: "Termo do Site" },
  { valor: "A", label: "Termo do Armário" },
  { valor: "E", label: "Termo do Estacionamento" },
];

function formatarData(data) {
  if (!data) return "";
  return new Date(data).toLocaleDateString("pt-BR");
}

export default function GerenciarTermos() {
  const docked = useDockButton();
  const [termosAtivos, setTermosAtivos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [referenciaSelecionada, setReferenciaSelecionada] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [erroArquivo, setErroArquivo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const inputFileRef = useRef(null);

  async function carregar() {
    setCarregando(true);
    try {
      const res = await authFetch(API_ROUTES.termos.termosAtivos);
      const resultado = await res.json();
      setTermosAtivos(resultado.dados ?? resultado ?? []);
    } catch {
      setTermosAtivos([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function obterTermoAtivo(referencia) {
    return termosAtivos.find((t) => t.referencia === referencia);
  }

  function abrirModal(referenciaPreSelecionada) {
    setReferenciaSelecionada(referenciaPreSelecionada ?? "");
    setModoEdicao(!!referenciaPreSelecionada);
    setArquivo(null);
    setErroArquivo("");
    setModalAberto(true);
  }

  const TAMANHO_MAX_MB = 5;

  function handleSelecionarArquivo(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErroArquivo("Somente arquivos PDF são permitidos");
      setArquivo(null);
      return;
    }

    if (file.size > TAMANHO_MAX_MB * 1024 * 1024) {
      setErroArquivo(`Arquivo excede o limite de ${TAMANHO_MAX_MB}MB`);
      setArquivo(null);
      return;
    }

    setErroArquivo("");
    setArquivo(file);
  }

  function handleVisualizarPdf(referencia) {
    const url = API_ROUTES.termos.obterPdf(referencia);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function salvar() {
    if (!referenciaSelecionada) {
      setErroArquivo("Selecione o tipo de termo");
      return;
    }
    if (!arquivo) {
      setErroArquivo("Selecione um arquivo PDF");
      return;
    }

    const tipoLabel = TIPOS_TERMOS.find(
      (t) => t.valor === referenciaSelecionada,
    )?.label;

    const jaExiste = !!obterTermoAtivo(referenciaSelecionada);
    if (jaExiste) {
      const confirmado = await alertConfirmar(
        `O termo atual do "${tipoLabel}" será desativado e este novo entrará em vigor imediatamente. Continuar?`,
      );
      if (!confirmado) return;
    }

    setSalvando(true);
    try {
      const formData = new FormData();
      formData.append("Pdf", arquivo);
      formData.append("Referencia", referenciaSelecionada);

      const res = await authFetch(API_ROUTES.termos.criar, {
        method: "POST",
        body: formData,
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        // resposta pode não ter corpo JSON
      }

      if (!res.ok) {
        alertErro(data.mensagem ?? "Erro ao salvar termo");
        return;
      }

      alertSucesso(data.mensagem ?? "Termo salvo com sucesso");
      setModalAberto(false);
      carregar();
    } catch {
      alertErro("Erro ao salvar termo");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.principalBox}>
      <div className={styles.divHeader}>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          description
        </span>
        <h3>Gerenciar Termos</h3>
      </div>

      <div className={styles.topo}>
        <button className={styles.btnNovo} onClick={() => abrirModal()}>
          <UploadCloud size={18} /> Novo Termo
        </button>
      </div>

      <div className={styles.containerLista}>
        <div className={`${styles.linha} ${styles.titulo}`}>
          <span>Tipo</span>
          <span>Status</span>
          <span>Modificado em</span>
          <span>Ações</span>
        </div>

        {carregando && <p className={styles.mensagem}>Carregando...</p>}

        {!carregando &&
          TIPOS_TERMOS.map((tipo) => {
            const termoAtivo = obterTermoAtivo(tipo.valor);

            return (
              <div className={styles.linha} key={tipo.valor}>
                <span className={styles.tipoLabel}>
                  <FileText size={16} />
                  {tipo.label}
                </span>

                <span
                  className={`${styles.status} ${
                    termoAtivo ? styles.ativo : styles.inativo
                  }`}
                >
                  {termoAtivo ? "Ativo" : "Sem termo"}
                </span>

                <span className={styles.dataModificacao}>
                  {termoAtivo
                    ? formatarData(
                        termoAtivo.dataAlteracao ?? termoAtivo.dataCriacao,
                      )
                    : "—"}
                </span>

                <span className={styles.acoesLinha}>
                  <button
                    className={styles.btnEditar}
                    disabled={!termoAtivo}
                    onClick={() => handleVisualizarPdf(tipo.valor)}
                    title="Visualizar PDF atual"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                  <button
                    className={styles.btnEditar}
                    onClick={() => abrirModal(tipo.valor)}
                    title={termoAtivo ? "Substituir PDF" : "Cadastrar PDF"}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </span>
              </div>
            );
          })}
      </div>

      {modalAberto && (
        <div className={styles.overlay} onClick={() => setModalAberto(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h4>{modoEdicao ? "Substituir Termo" : "Novo Termo"}</h4>

            <div>
              <select
                className={styles.formControl}
                value={referenciaSelecionada}
                disabled={modoEdicao}
                onChange={(e) => {
                  setReferenciaSelecionada(e.target.value);
                  setErroArquivo("");
                }}
              >
                <option value="">Selecione o tipo de termo</option>
                {TIPOS_TERMOS.map((tipo) => (
                  <option key={tipo.valor} value={tipo.valor}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                ref={inputFileRef}
                type="file"
                accept="application/pdf"
                className={styles.inputFileEscondido}
                onChange={handleSelecionarArquivo}
              />
              <button
                type="button"
                className={styles.dropzone}
                onClick={() => inputFileRef.current?.click()}
              >
                <UploadCloud size={22} />
                <span>{arquivo ? arquivo.name : "Selecionar arquivo PDF"}</span>
              </button>
              {erroArquivo && <p className={styles.erroTexto}>{erroArquivo}</p>}
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
                disabled={salvando || !referenciaSelecionada || !arquivo}
              >
                {salvando ? "Enviando..." : "Salvar"}
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
