import styles from "./Header.module.css";
import logo from "../../assets/images/AAPM-Logo.png";
import { useTheme } from "../../utils/darkMode";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getLogoDestino } from "../../utils/logoRedirect";
import { authFetch } from "../../utils/auth";
import { API_ROUTES } from "../../routes/config/api.js";
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
  CheckCheck,
} from "lucide-react";
import { alertConfirmar, alertErro } from "../Alerts/Alerts.jsx";

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();
  const [menuAberto, setMenuAberto] = useState(false);
  const [notifAberto, setNotifAberto] = useState(false);
  const [notifExpandido, setNotifExpandido] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregandoNotif, setCarregandoNotif] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef();
  const btnRef = useRef();
  const notifRef = useRef();
  const sinoRef = useRef();

  const naoLidas = (notificacoes ?? []).filter((n) => !n.lida).length;

  const headerType = location.pathname.startsWith("/usuario")
    ? "user"
    : location.pathname === "/"
      ? "login"
      : "default";
  const isAdmin = location.pathname.startsWith("/admin");
  const isPainelAdmin = location.pathname === "/admin/gestao-admin";
  const destinoLogo = getLogoDestino(location.pathname);
  const mostrarNotificacoes = headerType === "user" || isAdmin;

  function formatarData(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
    });
  }

  useEffect(() => {
    if (!mostrarNotificacoes) return;

    async function carregarNotificacoes() {
      setCarregandoNotif(true);
      try {
        const res = await authFetch(API_ROUTES.notificacoes.listarNotificacoes);
        const data = await res.json();
        const lista = (Array.isArray(data) ? data : (data?.dados ?? [])).map(
          (n) => ({
            id: n.id,
            titulo: n.titulo,
            texto: n.mensagem,
            data: formatarData(n.dataCriacao),
            lida: n.lida,
          }),
        );
        setNotificacoes(lista);
        setNotificacoes(lista);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      } finally {
        setCarregandoNotif(false);
      }
    }

    carregarNotificacoes();
  }, [mostrarNotificacoes]);

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

  async function marcarComoLida(id) {
    const notif = notificacoes.find((n) => n.id === id);
    if (notif?.lida) return;

    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n)),
    );

    try {
      await authFetch(`${API_ROUTES.notificacoes.notificacoesLer}?id=${id}`, {
        method: "PUT",
      });
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: false } : n)),
      );
      alertErro("Não foi possível marcar a notificação como lida.");
    }
  }

  async function marcarTodasComoLidas() {
    if (naoLidas === 0) return;

    const anterior = notificacoes;
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));

    try {
      await authFetch(API_ROUTES.notificacoes.notificacoesLerTodas, {
        method: "PUT",
      });
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
      setNotificacoes(anterior);
      alertErro("Não foi possível marcar todas como lidas.");
    }
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
            <div className={styles.notifHeader}>
              <span>Notificações</span>
              {naoLidas > 0 && (
                <button
                  type="button"
                  className={styles.notifMarcarTodas}
                  onClick={(e) => {
                    e.stopPropagation();
                    marcarTodasComoLidas();
                  }}
                  title="Marcar todas como lidas"
                >
                  <CheckCheck size={14} />
                  Marcar todas
                </button>
              )}
            </div>

            {carregandoNotif ? (
              <p className={styles.notifVazio}>Carregando...</p>
            ) : notificacoes.length === 0 ? (
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
      <header data-theme={darkMode ? "dark" : "light"}>
        <div
          className={`${styles.overlay} ${menuAberto ? styles.visivel : ""}`}
          onClick={() => setMenuAberto(false)}
        />

        <nav className={styles.nav}>
          <img
            src={logo}
            alt="AAPM"
            className={styles.imgLogo}
            loading="eager"
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
      </header>
    );
  }

  return (
    <header data-theme={darkMode ? "dark" : "light"}>
      <nav className={styles.nav}>
        <img
          src={logo}
          alt="AAPM"
          className={styles.imgLogo}
          loading="eager"
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
    </header>
  );
}
