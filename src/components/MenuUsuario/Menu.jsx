import { useEffect, useRef } from "react";
import styles from "./Menu.module.css";
import { useNavigate } from "react-router-dom";

export default function Menu({ aberto, setAberto, onSair }) {
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
          <a onClick={() => navigate("/usuario/ver-informacoes")}>
            <h1>Veja seus dados</h1>
          </a>

          <a onClick={() => navigate("/usuario/modificar-senha")}>
            <h1>Modificar sua senha</h1>
          </a>

          <a onClick={() => navigate("/usuario/deletar-conta")}>
            <h1>Deletar sua conta</h1>
          </a>

          <a onClick={onSair}>
            <h1>Sair</h1>
          </a>
        </div>
      </div>
    </>
  );
}
