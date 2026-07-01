import styles from "./PopupModal.module.css";
import { getNomeExibicao } from "../../utils/getNomeExibicao.js";

export function PopupModal({ popup, onClose }) {
  const { usuario, armario } = popup;

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
  if (!usuario) return null;

  function copiar(texto) {
    navigator.clipboard.writeText(texto);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.pop} onClick={(e) => e.stopPropagation()}>
        {/* TÍTULO */}
        <div className={styles["section-divider"]}>
          <h2 className={styles["pop-title"]}>{getNomeExibicao(usuario)}</h2>
        </div>

        {/* INFOS */}
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
          <button
            className={styles["btn-editar"]}
            onClick={() => alert("Editar depois")}
          >
            Editar
          </button>

          <button
            className={styles["btn-excluir"]}
            onClick={() => alert("Excluir depois")}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
