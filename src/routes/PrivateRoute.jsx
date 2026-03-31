// import { Navigate } from "react-router-dom";
// import { getUsuarioLogado } from "../utils/auth";

// // perfisPermitidos = quais perfis podem acessar a rota
// export default function PrivateRoute({ children, perfisPermitidos = [] }) {
//   const usuario = getUsuarioLogado();

//   // não esta logado vai pro login
//   if (!usuario) {
//     return <Navigate to="/" />;
//   }

//   // esta logado mas não tem permissão  acesso negado
//   if (
//     perfisPermitidos.length > 0 &&
//     !perfisPermitidos.includes(usuario.perfil)
//   ) {
//     return <Navigate to="/acesso-negado" />;
//   }
//   return children;
// }
