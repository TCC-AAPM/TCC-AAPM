import { useState } from "react";
import {
  alertAviso,
  alertSucesso,
  alertConfirmar,
} from "../../../components/Alerts/Alerts"; // ajusta o caminho
import styles from "./ModificarData.module.css";

function formatarDataBR(dataISO) {
  if (!dataISO) return "Carregando...";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function ModificarData() {
  // TODO: trocar pelo valor vindo da API quando a rota existir
  const [dataAtual, setDataAtual] = useState("2026-12-15");
  const [novaData, setNovaData] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!novaData) {
      alertAviso("Por favor, selecione uma data!");
      return;
    }

    const dataFormatada = formatarDataBR(novaData);
    const confirmado = await alertConfirmar(
      `Tem certeza que deseja atualizar a data de TODOS os alunos para ${dataFormatada}?`,
    );

    if (!confirmado) return;

    // TODO: chamar a API quando a rota existir
    setDataAtual(novaData);
    setNovaData("");
    alertSucesso("Data atualizada com sucesso!");
  }

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.principalBox}>
        <div className={styles.divHeader}>
          <span
            className={`material-symbols-outlined ${styles.materialSymbols}`}
          >
            calendar_month
          </span>
          <h3>Modificar Data Final do Semestre</h3>
        </div>

        <form className={styles.formsDate} onSubmit={handleSubmit}>
          <div className={styles.containerDateView}>
            <span className={styles.labelDate}>Data atual no sistema:</span>
            <span className={styles.currentDate}>
              {formatarDataBR(dataAtual)}
            </span>
          </div>

          <div className={`mb-3 ${styles.containerDateInput}`}>
            <label className={`form-label ${styles.formLabel}`}>
              Selecione uma nova data:
            </label>
            <input
              type="date"
              className="form-control"
              value={novaData}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setNovaData(e.target.value)}
            />
          </div>

          <div className={styles.btnEditar}>
            <button type="submit" className={styles.btnSubmit}>
              Editar
            </button>
          </div>
        </form>
        <a href="#" onClick={() => history.back()} className={styles.voltar}>
          ← Voltar
        </a>
      </div>
    </div>
  );
}
