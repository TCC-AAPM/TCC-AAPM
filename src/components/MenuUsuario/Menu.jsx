import { useEffect, useRef } from "react";
import styles from "./Menu.module.css";
import { useNavigate } from "react-router-dom";
import { alertConfirmar } from "../Alerts/Alerts.jsx";

export default function Menu({ aberto, setAberto }) {
  const navigate = useNavigate();
  const menuRef = useRef();
  const btnRef = useRef();

  async function sair() {
    const confirmar = await alertConfirmar("Deseja realmente sair da conta?");
    if (!confirmar) return;

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/", { replace: true });
  }

  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setAberto(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [setAberto]);

  return (
    <>
      {/* BOTÃO */}
      <button
        ref={btnRef}
        className={styles.btnMenu}
        onClick={(e) => {
          e.stopPropagation();
          setAberto((v) => !v);
        }}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* MENU */}
      <div
        ref={menuRef}
        className={`${styles.menuFlutuante} ${aberto ? styles.abrir : ""}`}
      >
        <div className={styles.menu}>
          <button onClick={() => navigate("/usuario/ver-informacoes")}>
            <h1>Veja seus dados</h1>
          </button>

          <button onClick={() => navigate("/usuario/modificar-senha")}>
            <h1>Modificar sua senha</h1>
          </button>

          <button onClick={() => navigate("/usuario/deletar-conta")}>
            <h1>Deletar sua conta</h1>
          </button>

          <button onClick={sair}>
            <h1>Sair</h1>
          </button>
        </div>
      </div>
    </>
  );
}
