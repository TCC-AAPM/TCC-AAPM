import styles from "./HeaderUsuario.module.css";
import logo from "../../assets/images/AAPM-Logo.png";
import { useTheme } from "../../utils/darkMode";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { alertConfirmar } from "../Alerts/Alerts.jsx";

export default function HeaderUsuario() {
  const { darkMode, setDarkMode } = useTheme();
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();
  const btnRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  async function sair() {
    const confirmar = await alertConfirmar("Deseja realmente sair da conta?");
    if (!confirmar) return;
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/", { replace: true });
  }
  return (
    <>
      {/* OVERLAY */}
      <div
        className={`${styles.overlay} ${menuAberto ? styles.visivel : ""}`}
        onClick={() => setMenuAberto(false)}
      />

      <nav className={styles.nav}>
        <div className={styles.left}>
          <button
            ref={btnRef}
            className={styles.btnMenu}
            onClick={(e) => {
              e.stopPropagation();
              setMenuAberto((v) => !v);
            }}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <img src={logo} alt="AAPM" className={styles.imgLogo} />
        </div>
        <button
          className={styles.toggleDark}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>

      {/* MENU LATERAL */}
      <div
        ref={menuRef}
        className={`${styles.menuFlutuante} ${menuAberto ? styles.abrir : ""}`}
      >
        <div className={styles.menuHeader}>
          <img src={logo} alt="AAPM" className={styles.menuLogo} />
          <span className={styles.menuTitle}>MENU</span>
        </div>

        <div className={styles.menu}>
          <button onClick={() => navigate("/usuario/ver-informacoes")}>
           Veja seus dados
          </button>
          <button onClick={() => navigate("/usuario/modificar-senha")}>
           Modificar senha
          </button>
          <button onClick={() => navigate("/usuario/deletar-conta")}>
           Deletar conta
          </button>
        </div>

        <button className={styles.btnSair} onClick={sair}>
         Sair
        </button>
      </div>
    </>
  );
}
