// src/components/ModalNovoTermo/ModalNovoTermo.jsx
import styles from "./ModalNovoTermo.module.css";
import { API_ROUTES } from "../../routes/config/api.js";

const LABELS = { S: "Termos de Uso do Site e LGPD", A: "Termo de Uso do Armário", E: "Termo de Uso do Estacionamento" };

export default function ModalNovoTermo({ termos, onAceitar, onRecusar }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className="material-symbols-outlined">policy</span>
          <h2>Termos atualizados</h2>
        </div>

        <p className={styles.descricao}>
          Os documentos abaixo foram atualizados. Leia e aceite para continuar.
        </p>

        <div className={styles.lista}>
          {termos.map((t) => {
            const ref = t.referencia ?? t.Referencia;
            return (
              <div key={t.idTermo ?? t.id} className={styles.item}>
                <span className="material-symbols-outlined">description</span>
                <span>{LABELS[ref] ?? "Termo de Uso"}</span>
                <a href={API_ROUTES.termos.obterPdf(ref)} target="_blank" rel="noopener noreferrer">
                  Ver PDF
                </a>
              </div>
            );
          })}
        </div>

        <div className={styles.acoes}>
          <button className={styles.btnRecusar} onClick={onRecusar}>
            Recusar e sair
          </button>
          <button className={styles.btnAceitar} onClick={onAceitar}>
            Aceitar e continuar
          </button>
        </div>
      </div>
    </div>
  );
}