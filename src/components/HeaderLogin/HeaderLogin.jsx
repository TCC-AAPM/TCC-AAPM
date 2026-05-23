import styles from "./HeaderLogin.module.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/darkMode";
import { Sun, Moon } from "lucide-react";
import logo from "../../assets/images/AAPM-Logo.png";

export default function HeaderLogin() {
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <img src={logo} alt="AAPM" className={styles.imgLogo} />
      <div className={styles.navActions}>
        <button
          className={styles.toggleDark}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className={styles.btnGhost} onClick={() => navigate("/login")}>
          Entrar
        </button>
      </div>
    </nav>
  );
}
