import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Login/Index.jsx";
import Cadastro from "../pages/Home/Cadastro.jsx";
import AcessoNegado from "../pages/AcessoNegado/AcessoNegado.jsx";

import EsqueciSenha from "../pages/Senha/EsqueciSenha/EsqueciSenha.jsx";
import CodigoSenha from "../pages/Senha/CodigoSenha/CodigoSenha.jsx";
import RedefinirSenha from "../pages/Senha/RedefinirSenha/RedefinirSenha.jsx";

import TelaPrincipal from "../pages/Usuário/TelaPrincipal/TelaPrincipal.jsx";
import ModificarSenha from "../pages/Usuário/ModificarSenha/ModificarSenha.jsx";
import VerInformacoes from "../pages/Usuário/VerInformacoes/VerInformacoes.jsx";
import DeletarConta from "../pages/Usuário/DeletarConta/DeletarConta.jsx";

import Armarios from "../pages/Admin/Armarios/Armarios.jsx";
import PainelAdmin from "../pages/Admin/GestaoAdmin/GestaoAdmin.jsx";

// adm
import Dashboard from "../pages/Admin/Dashboard/Dashboard.jsx";
import CadastrarUsuario from "../pages/Admin/CadastrarUsuario/CadastrarUsuario.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/acesso-negado" element={<AcessoNegado />} />
      <Route path="/senha/esqueci" element={<EsqueciSenha />} />
      <Route path="/senha/codigo" element={<CodigoSenha />} />
      <Route path="/senha/redefinir" element={<RedefinirSenha />} />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/armarios"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <Armarios />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/gestao-admin"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <PainelAdmin />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/cadastrar-aluno"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <CadastrarUsuario />
          </PrivateRoute>
        }
      />

      <Route
        path="/usuario/tela-principal"
        element={
          <PrivateRoute perfisPermitidos={["aluno"]}>
            <TelaPrincipal />
          </PrivateRoute>
        }
      />

      <Route
        path="/usuario/modificar-senha"
        element={
          <PrivateRoute perfisPermitidos={["aluno"]}>
            <ModificarSenha />
          </PrivateRoute>
        }
      />

      <Route
        path="/usuario/ver-informacoes"
        element={
          <PrivateRoute perfisPermitidos={["aluno"]}>
            <VerInformacoes />
          </PrivateRoute>
        }
      />

      <Route
        path="/usuario/deletar-conta"
        element={
          <PrivateRoute perfisPermitidos={["aluno"]}>
            <DeletarConta />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
