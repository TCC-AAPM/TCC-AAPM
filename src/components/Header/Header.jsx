import styles from "./Header.module.css";
import logo from "../../assets/images/AAPM-Logo.png";
import { useTheme } from "../../utils/darkMode";
import { Sun, Moon } from "lucide-react";


export default function Header() {
  const { darkMode, setDarkMode } = useTheme();

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
         </div>
       </nav>
  );
}