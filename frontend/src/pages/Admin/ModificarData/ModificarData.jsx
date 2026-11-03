import { useState, useEffect } from "react";
import {
  alertAviso,
  alertSucesso,
  alertErro,
  alertConfirmar,
} from "../../../components/Alerts/Alerts";
import { authFetch, API_ROUTES } from "../../../utils/auth"; 
import styles from "./ModificarData.module.css";
import { useDockButton } from "../../../utils/useDockButton";

function formatarDataBR(dataISO) {
  if (!dataISO) return "Carregando...";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function ModificarData() {
  const docked = useDockButton();
  const [dataAtual, setDataAtual] = useState(null);
  const [novaData, setNovaData] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function buscarData() {
      try {
        const res = await authFetch(API_ROUTES.configReserva.obterDataFimSemestre);
        const data = await res.json();
        if (res.ok) setDataAtual(data.dados.dataExpiracaoGlobal);
        else alertErro(data.mensagem || "Erro ao buscar configuração.");
      } catch {
        alertErro("Erro de conexão ao carregar a data atual.");
      }
    }
    buscarData();
  }, []);

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

    try {
      setCarregando(true);

      const res = await authFetch(API_ROUTES.configReserva.alterarDataFimSemestre, {
        method: "PUT",
        body: JSON.stringify({ dataFimSemestre: novaData }),
      });

      const data = await res.json();

      if (!res.ok) {
        alertErro(data.mensagem || "Erro ao atualizar a data.");
        return;
      }

      setDataAtual(novaData);
      setNovaData("");
      alertSucesso(data.mensagem || "Data atualizada com sucesso!");
    } catch {
      alertErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.principalBox}>
        <div className={styles.divHeader}>
          <span className={`material-symbols-outlined ${styles.materialSymbols}`}>
            calendar_month
          </span>
          <h3>Modificar Data Final do Semestre</h3>
        </div>

        <form className={styles.formsDate} onSubmit={handleSubmit}>
          <div className={styles.containerDateView}>
            <span className={styles.labelDate}>Data atual no sistema:</span>
            <span className={styles.currentDate}>{formatarDataBR(dataAtual)}</span>
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
            <button type="submit" className={styles.btnSubmit} disabled={carregando}>
              {carregando ? "Salvando..." : "Editar"}
            </button>
          </div>
        </form>
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
