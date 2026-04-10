import styles from "./CardArmario.module.css";

export function CardArmario({ armario, usuario, onClick, onContextMenu }) {
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
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.();
      }}
    >
      <div className={styles.infos}>
        <p className={styles.info}>
          <strong>Armário:</strong> {armario.numeroArmario}
        </p>
        {armario.estado === "O" && usuario && (
          <p className={styles.info}>
            <strong>Usuário:</strong> {usuario.nomeAluno}
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
        {armario.estado === "A" && (
          <p className={styles.info}>
            <strong>Usuário:</strong> {usuario?.nomeAluno || "Desconecido"}
            <br />
            <strong>Estado:</strong> Pagamento atrasado
          </p>
        )}
      </div>
    </div>
  );
}
