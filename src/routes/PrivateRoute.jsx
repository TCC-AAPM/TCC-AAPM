import { Navigate } from "react-router-dom";
import { getUsuarioLogado } from "../utils/auth";

export default function PrivateRoute({ children, perfisPermitidos = [] }) {
  const usuario = getUsuarioLogado();

  if (!usuario) return <Navigate to="/" />;

  if (
    perfisPermitidos.length > 0 &&
    !perfisPermitidos.includes(usuario.perfil)
  ) {
    return <Navigate to="/acesso-negado" />;
  }

  return children;
}
