import styles from "./Header.module.css";
import logo from "../../assets/images/AAPM-Logo.png";
import { useTheme } from "../../utils/darkMode";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Home,
  KeyRound,
  LogOut,
  Menu,
  Moon,
  Sun,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
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
  const isAdmin = location.pathname.startsWith("/admin");
  const isPainelAdmin = location.pathname === "/admin/gestao-admin";

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

  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  function navegarMenu(path) {
    setMenuAberto(false);
    navigate(path);
  }

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
        title={darkMode ? "Modo claro" : "Modo escuro"}
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
          <img src={logo} alt="AAPM" className={styles.imgLogo} />

          <div className={styles.navActions}>
            <button
              className={styles.btnIconAction}
              type="button"
              onClick={() => navegarMenu("/usuario/tela-principal")}
              aria-label="Ir para tela principal"
              title="Tela principal"
            >
              <Home size={18} />
            </button>
            {renderThemeButton()}
            <button
              className={styles.btnIconAction}
              type="button"
              aria-label="Notificações"
              title="Notificações"
            >
              <Bell size={18} />
            </button>
            <button
              ref={btnRef}
              className={styles.btnIconAction}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuAberto((v) => !v);
              }}
              aria-label="Abrir menu"
              title="Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>

        <div
          ref={menuRef}
          className={`${styles.menuFlutuante} ${menuAberto ? styles.abrir : ""}`}
        >
          <button
            className={styles.btnFecharMenu}
            type="button"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
            title="Fechar"
          >
            <X size={18} />
          </button>

          <div className={styles.menu}>
            <button onClick={() => navegarMenu("/usuario/ver-informacoes")}>
              <UserRound size={18} />
              Veja seus dados
            </button>
            <button onClick={() => navegarMenu("/usuario/modificar-senha")}>
              <KeyRound size={18} />
              Modificar senha
            </button>
            <button onClick={() => navegarMenu("/usuario/deletar-conta")}>
              <Trash2 size={18} />
              Deletar conta
            </button>
          </div>

          <button className={styles.btnSair} onClick={sair}>
            <LogOut size={18} />
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
        {isAdmin && (
          <button
            className={styles.btnIconAction}
            onClick={() =>
              isPainelAdmin
                ? navigate("/admin/armarios")
                : navigate("/admin/gestao-admin")
            }
            aria-label={isPainelAdmin ? "Ir para armários" : "Abrir gestão admin"}
            title={isPainelAdmin ? "Armários" : "Gestão admin"}
          >
            {isPainelAdmin ? <Home size={18} /> : <Menu size={18} />}
          </button>
        )}
        {renderThemeButton()}
        {isAdmin && (
          <button
            className={styles.btnIconAction}
            type="button"
            aria-label="Notificações"
            title="Notificações"
          >
            <Bell size={18} />
          </button>
        )}
        {headerType === "login" && (
          <button className={styles.btnGhost} onClick={() => navigate("/login")}>
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
}
