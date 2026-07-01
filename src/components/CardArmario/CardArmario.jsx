import styles from "./CardArmario.module.css";
import { getNomeExibicao } from "../../utils/getNomeExibicao.js";

export function CardArmario({
  armario,
  usuario,
  onClick,
  onContextMenu,
  modoSelecao,
  selecionado,
}) {
  const estadoMap = {
    O: styles.ocupado,
    M: styles.manutencao,
    D: styles.disponivel,
    P: styles.pendente,
    A: styles.atrasado,
  };

  const classeEstado = estadoMap[armario.estado] ?? "";

  return (
    <div
      className={`${styles.card} ${classeEstado}`}
      onClick={(e) => onClick?.(e)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.();
      }}
    >
      {modoSelecao && (
        <div className={styles.checkbox}>
          <input type="checkbox" readOnly checked={selecionado} />
        </div>
      )}

      <div className={styles.infos}>
        <p className={styles.info}>
          <strong>Armário:</strong> {armario.numeroArmario}
        </p>
        {armario.estado === "O" && usuario && (
          <p className={styles.info}>
            <strong>Aluno:</strong> {getNomeExibicao(usuario)}
          </p>
        )}
        {(armario.estado === "M" || armario.estado === "D") && (
          <p className={styles.info}>
            <strong>Estado:</strong>{" "}
            {armario.estado === "M" ? "Em manutenção" : "Disponível"}
          </p>
        )}
        {armario.estado === "P" && (
          <p className={styles.info}>
            <strong>Estado:</strong> Pendente
          </p>
        )}
      </div>
    </div>
  );
}
