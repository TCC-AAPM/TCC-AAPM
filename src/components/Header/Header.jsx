import styles from "./Header.module.css";
import logo from "../../assets/images/AAPM-Logo.png";
import { useTheme } from "../../utils/darkMode";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getLogoDestino } from "../../utils/logoRedirect";
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
  CheckCircle2,
  Info,
  AlertTriangle,
  Bell as BellIcon,
} from "lucide-react";
import { alertConfirmar } from "../Alerts/Alerts.jsx";

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();
  const [menuAberto, setMenuAberto] = useState(false);
  const [notifAberto, setNotifAberto] = useState(false);
  const [notifExpandido, setNotifExpandido] = useState(false);
  const [notificacoes, setNotificacoes] = useState([
    
    {
      id: 1,
      titulo: "Cadastro aprovado",
      texto: "Seu cadastro foi aprovado e já está ativo no sistema.",
      data: "12 de agosto",
      lida: false,
    },
    {
      id: 2,
      titulo: "Novo aviso",
      texto: "Um novo aviso foi publicado pela AAPM.",
      data: "11 de agosto",
      lida: false,
    },
    {
      id: 3,
      titulo: "Pendência próxima do prazo",
      texto: "Sua pendência vence em 3 dias. Regularize o quanto antes.",
      data: "10 de agosto",
      lida: true,
    },
    {
      id: 4,
      titulo: "Solicitação aprovada",
      texto: "Sua solicitação foi analisada e aprovada.",
      data: "08 de agosto",
      lida: true,
    },
    {
      id: 5,
      titulo: "Atualize seus dados",
      texto: "Lembrete para manter seu cadastro sempre atualizado.",
      data: "05 de agosto",
      lida: false,
    },
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef();
  const btnRef = useRef();
  const notifRef = useRef();
  const sinoRef = useRef();

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  const headerType = location.pathname.startsWith("/usuario")
    ? "user"
    : location.pathname === "/"
      ? "login"
      : "default";
  const isAdmin = location.pathname.startsWith("/admin");
  const isPainelAdmin = location.pathname === "/admin/gestao-admin";
  const destinoLogo = getLogoDestino(location.pathname);

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
    const handler = (e) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target) &&
        sinoRef.current &&
        !sinoRef.current.contains(e.target)
      ) {
        setNotifAberto(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    setMenuAberto(false);
    setNotifAberto(false);
    setNotifExpandido(false);
  }, [location.pathname]);

  function navegarMenu(path) {
    setMenuAberto(false);
    navigate(path);
  }

  function marcarComoLida(id) {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n)),
    );
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

  function renderNotificacoes() {
    return (
      <div className={styles.notifWrapper}>
        <button
          ref={sinoRef}
          className={styles.btnIconAction}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setNotifAberto((v) => !v);
            setNotifExpandido(false);
          }}
          aria-label="Notificações"
          title="Notificações"
        >
          <Bell size={18} />
          {naoLidas > 0 && <span className={styles.badge}>{naoLidas}</span>}
        </button>

        {notifAberto && (
          <div ref={notifRef} className={styles.notifDropdown}>
            <div className={styles.notifHeader}>Notificações</div>

            {notificacoes.length === 0 ? (
              <p className={styles.notifVazio}>Nenhuma notificação por aqui.</p>
            ) : (
              <>
                <ul className={styles.notifLista}>
                  {(notifExpandido
                    ? notificacoes
                    : notificacoes.slice(0, 3)
                  ).map((n) => (
                    <li
                      key={n.id}
                      className={`${styles.notifItem} ${n.lida ? styles.notifLida : ""}`}
                      onClick={() => marcarComoLida(n.id)}
                    >
                      <div className={styles.notifLinhaTopo}>
                        <p className={styles.notifTitulo}>{n.titulo}</p>
                        {!n.lida && <span className={styles.notifDot} />}
                      </div>
                      <p className={styles.notifTexto}>{n.texto}</p>
                      <span className={styles.notifData}>{n.data}</span>
                    </li>
                  ))}
                </ul>

                {!notifExpandido && notificacoes.length > 3 && (
                  <button
                    type="button"
                    className={styles.notifVerMais}
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotifExpandido(true);
                    }}
                  >
                    Ver mais
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
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
          <img
            src={logo}
            alt="AAPM"
            className={styles.imgLogo}
            onClick={() => navigate(destinoLogo)}
          />

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
            {renderNotificacoes()}
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
      <img
        src={logo}
        alt="AAPM"
        className={styles.imgLogo}
        onClick={() => navigate(destinoLogo)}
      />
      <div className={styles.navActions}>
        {isAdmin && (
          <button
            className={styles.btnIconAction}
            onClick={() =>
              isPainelAdmin
                ? navigate("/admin/armarios")
                : navigate("/admin/gestao-admin")
            }
            aria-label={
              isPainelAdmin ? "Ir para armários" : "Abrir gestão admin"
            }
            title={isPainelAdmin ? "Armários" : "Gestão admin"}
          >
            {isPainelAdmin ? <Home size={18} /> : <Menu size={18} />}
          </button>
        )}
        {renderThemeButton()}
        {isAdmin && renderNotificacoes()}
        {headerType === "login" && (
          <button
            className={styles.btnGhost}
            onClick={() => navigate("/login")}
          >
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
}
