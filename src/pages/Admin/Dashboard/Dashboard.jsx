import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

import { useTermoVerification } from "../../../utils/useTermoVerification.js";
import ModalNovoTermo from "../../../components/ModalNovoTermo/ModalNovoTermo.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { showModal, termosParaAceitar, handleAceitar, handleRecusar } =
    useTermoVerification();

  return (
    <>
      <div className={styles.principalBox}>
        {showModal && (
          <ModalNovoTermo
            termos={termosParaAceitar}
            onAceitar={handleAceitar}
            onRecusar={handleRecusar}
          />
        )}
        <div className={styles.cardsRow}>
          <div className={styles.col}>
            <div
              className={`${styles.containerLG} ${styles.cardArmarios}`}
              id="Armarios"
              onClick={() => navigate("/admin/armarios")}
            >
              <span
                className={`material-symbols-outlined ${styles.materialSymbolsOutlined}`}
              >
                inventory_2
              </span>
              <h3>Controle de Armários</h3>
            </div>
          </div>

          <div className={styles.col}>
            <div
              className={`${styles.containerLG} ${styles.cardEstacionamento}`}
              id="Estacionamento"
            >
              <span
                className={`material-symbols-outlined ${styles.materialSymbolsOutlined}`}
              >
                two_wheeler
              </span>
              <h3>Gestão do Estacionamento</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
