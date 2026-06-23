import styles from "./ModalNovoTermo.module.css";
import { API_ROUTES } from "../../routes/config/api.js";

const LABELS = {
  S: "Termos de Uso do Site e LGPD",
  A: "Termo de Uso do Armário",
  E: "Termo de Uso do Estacionamento",
};

export default function ModalNovoTermo({ termos, onAceitar, onRecusar }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h2>Termos atualizados</h2>
        </div>
        
        <div className={styles.divider} />

        <p className={styles.descricao}>
          Os documentos abaixo foram atualizados desde seu último acesso.
          Leia e aceite para continuar.
        </p>

        <div className={styles.lista}>
          {termos.map((t) => {
            const ref = t.referencia ?? t.Referencia;
            return (
              <div key={t.idTermo ?? t.id} className={styles.termoItem}>
                <span className="material-symbols-outlined">description</span>
                <span className={styles.termoLabel}>{LABELS[ref] ?? "Termo de Uso"}</span>
                <a
                  href={API_ROUTES.termos.obterPdf(ref)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnPdf}
                >
                  <span className="material-symbols-outlined">open_in_new</span>
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