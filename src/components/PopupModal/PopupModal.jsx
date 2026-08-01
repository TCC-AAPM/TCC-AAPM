import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PopupModal.module.css";
import { getNomeExibicao } from "../../utils/getNomeExibicao.js";
import { API_ROUTES, authFetch } from "../../utils/auth.js";
import {
  alertErro,
  alertConfirmar,
  alertSucessoModal,
} from "../Alerts/Alerts.jsx";

export function PopupModal({
  popup,
  todosArmarios = [],
  onClose,
  onReload,
  onConfirmarLote,
}) {
  const navigate = useNavigate();
  const { usuario, armario, tipo } = popup;

  const metodo = {
    A: "Dinheiro",
    P: "Pix",
    D: "Débito",
    C: "Crédito",
  };

  const mascaraCPF = (cpf) =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const mascaraTelefone = (tel) =>
    tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

  function copiar(texto) {
    navigator.clipboard.writeText(texto);
  }

  async function atualizarEstado(estado, observacao) {
    try {
      const res = await authFetch(
        API_ROUTES.armarios.atualizarEstado(armario.numeroArmario),
        {
          method: "PUT",
          body: JSON.stringify({ estado, observacao: observacao || null }),
        },
      );
      if (!res.ok) throw new Error();
      await alertSucessoModal("Atualizado!", "Estado do armário atualizado.");
      onReload?.();
    } catch {
      alertErro("Erro ao atualizar o armário.");
    }
  }

  async function transferirAluno(numeroArmarioNovo, observacao) {
    const confirmado = await alertConfirmar(
      `Transferir o aluno para o armário ${numeroArmarioNovo} e enviar o armário ${armario.numeroArmario} para manutenção?`,
    );
    if (!confirmado) return;

    try {
      const res = await authFetch(API_ROUTES.reservas.transferir, {
        method: "POST",
        body: JSON.stringify({
          numeroArmarioAtual: armario.numeroArmario,
          numeroArmarioNovo: Number(numeroArmarioNovo),
          observacao: observacao || "",
        }),
      });
      if (!res.ok) throw new Error();
      await alertSucessoModal("Transferido!", "Aluno realocado com sucesso.");
      onReload?.();
    } catch {
      alertErro("Erro ao transferir o aluno.");
    }
  }

  // ---------- Popup de ação em lote (modo seleção) ----------
  if (tipo === "lote") {
    return (
      <LotePopup
        armarios={popup.armarios}
        estadoDestino={popup.estadoDestino}
        onClose={onClose}
        onConfirmar={onConfirmarLote}
      />
    );
  }

  // ---------- Popup de mudança de estado (clique direito) ----------
  if (tipo === "manutencao-ctx") {
    return (
      <ContextMenuPopup
        armario={armario}
        usuario={usuario}
        todosArmarios={todosArmarios}
        onClose={onClose}
        onAtualizarEstado={atualizarEstado}
        onTransferirAluno={transferirAluno}
      />
    );
  }

  // ---------- Popup de detalhes do aluno (clique esquerdo, armário ocupado) ----------
  if (!usuario) return null;

  function handleEditar() {
    sessionStorage.setItem(
      "alunoEditando",
      JSON.stringify({
        cpf: usuario.cpf,
        numeroArmario: armario.numeroArmario,
      }),
    );
    navigate("/admin/editar-aluno");
  }

  function handleExcluirClick() {
    const numeroArmario = armario.numeroArmario;
    const nomeExibicao = getNomeExibicao(usuario);
    onClose();
    excluirReserva(numeroArmario, nomeExibicao);
  }

  async function excluirReserva(numeroArmario, nomeExibicao) {
    const confirmado = await alertConfirmar(
      `Excluir a reserva do armário ${numeroArmario} (${nomeExibicao})?`,
    );
    if (!confirmado) return;

    try {
      const res = await authFetch(API_ROUTES.reservas.excluir(numeroArmario), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();

      await alertSucessoModal("Sucesso!", "Reserva excluída com sucesso.");
      onReload?.();
    } catch {
      alertErro("Erro ao excluir a reserva");
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.pop} onClick={(e) => e.stopPropagation()}>
        <div className={styles["section-divider"]}>
          <h2 className={styles["pop-title"]}>{getNomeExibicao(usuario)}</h2>
        </div>

        <div className={styles["pop-info-group"]}>
          <p className={styles["info-copy"]}>
            <span>CPF:</span>
            <span>{mascaraCPF(usuario.cpf)}</span>
            <button
              className={styles["btn-copy"]}
              onClick={() => copiar(usuario.cpf)}
            >
              <span className="material-symbols-outlined">content_copy</span>
            </button>
          </p>

          <p className={styles["info-copy"]}>
            <span>Telefone:</span>
            <span>{mascaraTelefone(usuario.telefone)}</span>
            <button
              className={styles["btn-copy"]}
              onClick={() => copiar(usuario.telefone)}
            >
              <span className="material-symbols-outlined">content_copy</span>
            </button>
          </p>

          <p className={styles["info-copy"]}>
            <span>Email:</span>
            <span>{usuario.email}</span>
            <button
              className={styles["btn-copy"]}
              onClick={() => copiar(usuario.email)}
            >
              <span className="material-symbols-outlined">content_copy</span>
            </button>
          </p>

          <p>
            <span>Curso:</span>{" "}
            <span className={styles.curso} title={usuario.curso}>
              {usuario.curso}
            </span>
          </p>

          <p>
            <span>Turma:</span>{" "}
            <span className={styles.turma} title={usuario.turma}>
              {usuario.turma}
            </span>
          </p>

          <p>
            <span>Pagamento:</span>{" "}
            <span>{metodo[usuario.pagamento] || usuario.pagamento}</span>
          </p>
        </div>

        <div className={styles["pop-buttons"]}>
          <button className={styles["btn-editar"]} onClick={handleEditar}>
            Editar
          </button>

          <button
            className={styles["btn-excluir"]}
            onClick={handleExcluirClick}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Sub-componente: popup de ação em lote (seleção múltipla) ----------
function LotePopup({ armarios, estadoDestino, onClose, onConfirmar }) {
  const [observacao, setObservacao] = useState("");

  const porEstado = armarios.reduce((acc, a) => {
    acc[a.estado] = (acc[a.estado] || 0) + 1;
    return acc;
  }, {});

  const precisaObservacao = estadoDestino === "M";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.pop} onClick={(e) => e.stopPropagation()}>
        <div className={styles["section-divider"]}>
          <h2 className={styles["pop-title"]}>
            Alterar {armarios.length} armário
            {armarios.length > 1 ? "s" : ""}
          </h2>
        </div>

        <span
          className={`${styles["badge-estado"]} ${styles[`badge-${estadoDestino}`]}`}
        >
          Vão para: {ESTADO_LABEL[estadoDestino]}
        </span>

        <div className={styles["pop-info-group"]}>
          {Object.entries(porEstado).map(([estado, qtd]) => (
            <p key={estado}>
              <span>{ESTADO_LABEL[estado]}:</span>
              <span>
                {qtd} armário{qtd > 1 ? "s" : ""}
              </span>
            </p>
          ))}
        </div>

        {precisaObservacao && (
          <>
            <label className={styles.label}>
              Motivo da manutenção (aplicado a todos):
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Descreva o problema dos armários..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </>
        )}

        <div className={styles["pop-buttons"]}>
          <button
            className={styles["btn-editar"]}
            onClick={() => {
              onClose();
              onConfirmar(
                estadoDestino,
                precisaObservacao ? observacao : null,
                armarios.map((a) => a.numeroArmario),
              );
            }}
          >
            Confirmar para {armarios.length} armário
            {armarios.length > 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Sub-componente: popup de clique direito (mudar estado / transferir) ----------
const ESTADO_LABEL = {
  D: "Disponível",
  M: "Manutenção",
  O: "Ocupado",
  P: "Pendente",
};

// Para cada estado atual, quais estados de destino são permitidos
const DESTINOS_VALIDOS = {
  D: ["M"],
  M: ["D"],
  P: ["D", "M"],
};

function ContextMenuPopup({
  armario,
  usuario,
  todosArmarios,
  onClose,
  onAtualizarEstado,
  onTransferirAluno,
}) {
  const [observacao, setObservacao] = useState(armario.observacao || "");
  const [novoArmario, setNovoArmario] = useState("");
  const [destino, setDestino] = useState("");

  const disponiveis = todosArmarios.filter(
    (a) => a.estado === "D" && a.numeroArmario !== armario.numeroArmario,
  );

  const destinosPermitidos = DESTINOS_VALIDOS[armario.estado] || [];
  const precisaObservacao = destino === "M";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.pop} onClick={(e) => e.stopPropagation()}>
        <div className={styles["section-divider"]}>
          <h2 className={styles["pop-title"]}>
            Armário {armario.numeroArmario}
          </h2>
        </div>

        <span
          className={`${styles["badge-estado"]} ${styles[`badge-${armario.estado}`]}`}
        >
          {ESTADO_LABEL[armario.estado]}
        </span>

        {armario.estado === "O" && usuario && (
          <p className={styles.curso}>
            <span>Aluno atual:</span> {getNomeExibicao(usuario)}
          </p>
        )}

        {armario.observacao && armario.estado !== "O" && (
          <p className={styles.curso}>
            <span>Observação atual:</span> {armario.observacao}
          </p>
        )}

        {/* D, M, P: mudar de estado */}
        {destinosPermitidos.length > 0 && (
          <>
            <label className={styles.label}>Mover para:</label>
            <select
              className={styles.select}
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            >
              <option value="" disabled>
                Selecione o novo estado
              </option>
              {destinosPermitidos.map((estado) => (
                <option key={estado} value={estado}>
                  {ESTADO_LABEL[estado]}
                </option>
              ))}
            </select>

            {precisaObservacao && (
              <>
                <label className={styles.label}>Motivo da manutenção:</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Descreva o problema do armário..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </>
            )}

            <div className={styles["pop-buttons"]}>
              <button
                className={styles["btn-editar"]}
                disabled={!destino}
                onClick={() => {
                  onClose();
                  onAtualizarEstado(
                    destino,
                    destino === "M" ? observacao : null,
                  );
                }}
              >
                Confirmar mudança
              </button>
            </div>
          </>
        )}

        {/* O: transferir aluno para outro armário, este vai para manutenção */}
        {armario.estado === "O" && (
          <>
            <label className={styles.label}>Transferir aluno para:</label>
            <select
              className={styles.select}
              value={novoArmario}
              onChange={(e) => setNovoArmario(e.target.value)}
            >
              <option value="" disabled>
                Selecione o novo armário
              </option>
              {disponiveis.map((a) => (
                <option key={a.numeroArmario} value={a.numeroArmario}>
                  {a.numeroArmario}
                </option>
              ))}
            </select>

            <label className={styles.label}>
              Motivo da manutenção do armário {armario.numeroArmario}:
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Descreva o problema do armário... (obrigatório)"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />

            <div className={styles["pop-buttons"]}>
              <button
                className={styles["btn-editar"]}
                disabled={!novoArmario || !observacao.trim()}
                onClick={() => {
                  onClose();
                  onTransferirAluno(novoArmario, observacao);
                }}
              >
                Transferir aluno
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 