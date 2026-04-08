import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Login/Index.jsx";
import AcessoNegado from "../pages/AcessoNegado/AcessoNegado.jsx";
import EsqueciSenha from "../pages/Senha/EsqueciSenha/EsqueciSenha.jsx";
import CodigoSenha from "../pages/Senha/CodigoSenha/CodigoSenha.jsx";
import RedefinirSenha from "../pages/Senha/RedefinirSenha/RedefinirSenha.jsx";
import TelaPrincipal from "../pages/Usuário/TelaPrincipal/TelaPrincipal.jsx";
import ModificarSenha from "../pages/Usuário/ModificarSenha/ModificarSenha.jsx";
// adm
import Dashboard from "../pages/Admin/Dashboard/Dashboard.jsx";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/acesso-negado" element={<AcessoNegado />} />
      <Route path="/senha/esqueci" element={<EsqueciSenha />} />
      <Route path="/senha/codigo" element={<CodigoSenha />} />
      <Route path="/senha/redefinir" element={<RedefinirSenha />} />

      //arrumar isso depois
      <Route path="/usuario/tela-principal" element={<TelaPrincipal />} />
      <Route path="/usuario/modificar-senha" element={<ModificarSenha />} />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/aluno/tela-principal"
        element={
          <PrivateRoute perfisPermitidos={["aluno"]}>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
