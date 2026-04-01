import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioLogado } from "../../../utils/auth";
import styles from "./TelaPrincipal.module.css";

export default function TelaPrincipal() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [dados, setDados] = useState({ nome: "", numArmario: "-", dataFim: "-" });
  const menuRef = useRef();

  useEffect(() => {
    // Fecha menu ao clicar fora
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    // Busca dados do aluno pela API
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    fetch(`/api/Aluno/${usuario.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setDados({
          nome: data.nome,
          numArmario: data.numArmario ?? "-",
          dataFim: data.dataFim ? new Date(data.dataFim).toLocaleDateString("pt-BR") : "-",
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
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.btnMenu} onClick={() => setMenuAberto(!menuAberto)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className={styles.logo}>AAPM</span>
        <div style={{ width: 32 }} />

        {menuAberto && (
          <div className={styles.menuFlutuante} ref={menuRef}>
            <a onClick={() => navigate("/usuario/ver-informacoes")}>Veja seus dados</a>
            <a onClick={() => navigate("/usuario/modificar-senha")}>Modificar sua senha</a>
            <a onClick={sair} className={styles.sair}>Sair</a>
          </div>
        )}
      </div>

      <div className={styles.content}>
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

      <footer className={styles.footer}>
        Desenvolvido por <strong>Isabella Lopreti</strong> & <strong>Gabriel Duarte</strong> • © 2026
      </footer>
    </div>
  );
}