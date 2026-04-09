import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TelaPrincipal.module.css";
import Menu from "../../../components/MenuUsuario/Menu.jsx";
import { API_ROUTES, getUsuarioLogado } from "../../../utils/auth.js";

export default function TelaPrincipal() {
  const [temArmario, setTemArmario] = useState(false);

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

    const token = localStorage.getItem("token");
    fetch(API_ROUTES.alunos.telaPrincipal, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setTemArmario(!!data.numeroArmario);
        setDados({
          nome: data.nome,
          numArmario: data.numeroArmario ?? "-",
          dataFim: data.dataExpiracao
            ? new Date(data.dataExpiracao).toLocaleDateString("pt-BR")
            : "-",
        });
      })

      .catch((err) => console.error("erro:", err));
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
        {temArmario ? (
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
        ) : (
          <div className={styles.card}>
            <p>Você não possui armário alugado.</p>
            <button onClick={() => navigate("/usuario/alugar")}>
              Alugar agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
