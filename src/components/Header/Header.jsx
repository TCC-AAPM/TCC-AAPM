import styles from "./Header.module.css";
import logo from "../../assets/images/AAPM-Logo.png";
import { useTheme } from "../../utils/darkMode";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { alertConfirmar } from "../Alerts/Alerts.jsx";

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef();
  const btnRef = useRef();

  const headerType = location.pathname.startsWith("/usuario")
    ? "user"
    : location.pathname === "/"
      ? "login"
      : "default";
  const mostrarMenuAdmin = location.pathname === "/admin/armarios";

  useEffect(() => {
    if (headerType !== "user") return undefined;

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
  }, [headerType]);

  async function sair() {
    const confirmar = await alertConfirmar("Deseja realmente sair da conta?");
    if (!confirmar) return;
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/", { replace: true });
  }

  function renderThemeButton() {
    return (
      <button
        className={styles.toggleDark}
        onClick={() => setDarkMode(!darkMode)}
        aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    );
  }

  if (headerType === "user") {
    return (
      <div data-theme={darkMode ? "dark" : "light"}>
        <div
          className={`${styles.overlay} ${menuAberto ? styles.visivel : ""}`}
          onClick={() => setMenuAberto(false)}
        />

        <nav className={styles.nav}>
          <div className={styles.left}>
            <img src={logo} alt="AAPM" className={styles.imgLogo} />
            <button
              ref={btnRef}
              className={styles.btnMenu}
              onClick={(e) => {
                e.stopPropagation();
                setMenuAberto((v) => !v);
              }}
              aria-label="Abrir menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          {renderThemeButton()}
        </nav>

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
      </div>
    );
  }

  return (
    <nav className={styles.nav} data-theme={darkMode ? "dark" : "light"}>
      <img src={logo} alt="AAPM" className={styles.imgLogo} />
      <div className={styles.navActions}>
        {mostrarMenuAdmin && (
          <button
            className={styles.btnIconAction}
            onClick={() => navigate("/admin/gestao-admin")}
            aria-label="Voltar para gestão admin"
            title="Menu admin"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
        {renderThemeButton()}
        {headerType === "login" && (
          <button className={styles.btnGhost} onClick={() => navigate("/login")}>
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
}
