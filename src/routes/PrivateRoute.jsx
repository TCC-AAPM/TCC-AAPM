import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUsuarioLogado } from "../utils/auth";

export default function PrivateRoute({ children, perfisPermitidos = [] }) {
  const location = useLocation();
  const [usuario, setUsuario] = useState(() => getUsuarioLogado());

  useEffect(() => {
    const verificarAutenticacao = () => {
      setUsuario(getUsuarioLogado());
    };

    verificarAutenticacao();

    window.addEventListener("pageshow", verificarAutenticacao);
    window.addEventListener("focus", verificarAutenticacao);

    return () => {
      window.removeEventListener("pageshow", verificarAutenticacao);
      window.removeEventListener("focus", verificarAutenticacao);
    };
  }, [location.pathname]);

  if (!usuario) return <Navigate to="/login" replace />;

  if (
    perfisPermitidos.length > 0 &&
    !perfisPermitidos.includes(usuario.perfil)
  ) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
}
