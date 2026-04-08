import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioLogado } from "../../../utils/auth";
import styles from "./TelaPrincipal.module.css";
import Menu from "../../../components/MenuUsuario/Menu.jsx";

export default function TelaPrincipal() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [dados, setDados] = useState({
    nome: "",
    numArmario: "-",
    dataFim: "-",
  });

  useEffect(() => {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    // Busca dados do aluno pela API
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    fetch(`/api/Aluno/${usuario.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setDados({
          nome: data.nome,
          numArmario: data.numArmario ?? "-",
          dataFim: data.dataFim
            ? new Date(data.dataFim).toLocaleDateString("pt-BR")
            : "-",
        });
      })
      .catch(() => {});
  }, []);

  function sair() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  }
  return (
    <div className={styles.containerGeral}>
      <div className={styles.topBar}>
        <Menu aberto={menuAberto} setAberto={setMenuAberto} onSair={sair} />
      </div>

      <div className={styles.principalBox}>
        <p className={styles.saudacao}>Olá, {dados.nome || "Usuário"}!</p>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div className={styles.infos}>
            <div className={styles.infoItem}>
              <div className={styles.label}>Número do armário</div>
              <div className={styles.valor}>{dados.numArmario}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.label}>Data de encerramento</div>
              <div className={styles.valor}>{dados.dataFim}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
