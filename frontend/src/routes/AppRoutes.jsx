import { Routes, Route, Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { SenhaFlowProvider } from "../pages/Senha/SenhaFlowContext.jsx";

import Home from "../pages/Home/Home.jsx";
import Pagamento from "../pages/Pagamento/Pagamento.jsx";
import Login from "../pages/Login/Index.jsx";
import SobreNosDevs from "../pages/SobreNos/EquipeDevs/SobreNosDevs.jsx";
import SobreNosAAPM from "../pages/SobreNos/EquipeAAPM/SobreNosAAPM.jsx";
import CadastroArmario from "../pages/PreCadastro/Armario/PreCadastroArmario.jsx";
import AcessoNegado from "../pages/AcessoNegado/AcessoNegado.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";

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
// Dashboard component removed — admin will use /admin/armarios directly
import CadastrarUsuario from "../pages/Admin/CadastrarUsuario/CadastrarUsuario.jsx";
import EditarUsuario from "../pages/Admin/EditarUsuario/EditarUsuario.jsx";
import ModificarData from "../pages/Admin/ModificarData/ModificarData.jsx";
import HistoricoAlunos from "../pages/Admin/HistoricoAlunos/HistoricoAlunos.jsx";
import GerenciarCursos from "../pages/Admin/GerenciarCursos/GerenciarCursos.jsx";
import GerenciarTurmas from "../pages/Admin/GerenciarTurmas/GerenciarTurmas.jsx";
import GerenciarTermos from "../pages/Admin/GerenciarTermos/GerenciarTermos.jsx";
import GerenciarAvisos from "../pages/Admin/GerenciarAvisos/GerenciarAvisos.jsx";
import Financeiro from "../pages/Admin/Financeiro/Financeiro.jsx";

// Layout que cria a caixinha UMA vez e compartilha com as rotas filhas
function SenhaLayout() {
  return (
    <SenhaFlowProvider>
      <Outlet />
    </SenhaFlowProvider>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sobre-nos-devs" element={<SobreNosDevs />} />
      <Route path="/sobre-nos-aapm" element={<SobreNosAAPM />} />
      <Route path="/cadastro-armario" element={<CadastroArmario />} />
      <Route path="/acesso-negado" element={<AcessoNegado />} />

      <Route
        path="/pagamento"
        element={
          <PrivateRoute perfisPermitidos={["aluno"]}>
            <Pagamento />
          </PrivateRoute>
        }
      />
      <Route
        path="/pagamento/pix"
        element={
          <PrivateRoute perfisPermitidos={["aluno"]}>
            <Pagamento />
          </PrivateRoute>
        }
      />
      <Route
        path="/pagamento/presencial"
        element={
          <PrivateRoute perfisPermitidos={["aluno"]}>
            <Pagamento />
          </PrivateRoute>
        }
      />

      {/* Grupo de rotas de senha, todas compartilhando a mesma caixinha */}
      <Route element={<SenhaLayout />}>
        <Route path="/senha/esqueci" element={<EsqueciSenha />} />
        <Route path="/senha/codigo" element={<CodigoSenha />} />
        <Route path="/senha/redefinir" element={<RedefinirSenha />} />
      </Route>

      {/* removed: /admin/dashboard route */}

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
        path="/admin/modificar-data-semestre"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <ModificarData />
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
        path="/admin/editar-aluno"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <EditarUsuario />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/historico-reserva"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <HistoricoAlunos />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/gerenciar-cursos"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <GerenciarCursos />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/gerenciar-turmas"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <GerenciarTurmas />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/gerenciar-termos"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <GerenciarTermos />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/gerenciar-avisos"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <GerenciarAvisos />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/financeiro"
        element={
          <PrivateRoute perfisPermitidos={["admin"]}>
            <Financeiro />
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
