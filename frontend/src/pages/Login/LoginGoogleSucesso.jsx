import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { alertErro } from "../../components/Alerts/Alerts.jsx";
import { API_ROUTES } from "../../routes/config/api.js";

export default function LoginGoogleSucesso() {
  const navigate = useNavigate();
  const chamadaIniciada = useRef(false);

  useEffect(() => {
    if (chamadaIniciada.current) return;
    chamadaIniciada.current = true;

    async function trocarCodigo() {
      const codigo = new URLSearchParams(window.location.search).get("code");

      if (!codigo) {
        alertErro("Código de autenticação do Google não encontrado.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(API_ROUTES.trocarCodigoGoogle, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigo }),
        });

        if (!response.ok) {
          alertErro("Não foi possível entrar com Google.");
          navigate("/login", { replace: true });
          return;
        }

        const dado = await response.json();
        const token = dado.token;

        if (!token) {
          alertErro("O servidor não retornou um token de acesso.");
          navigate("/login", { replace: true });
          return;
        }

        localStorage.setItem("token", token);

        const payload = JSON.parse(atob(token.split(".")[1]));
        const role =
          payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (role === "aluno") {
          navigate("/usuario/tela-principal", { replace: true });
        } else {
          navigate("/admin/armarios", { replace: true });
        }
      } catch (error) {
        console.error("Erro ao concluir login com Google:", error);
        alertErro("Erro de conexão com o servidor.");
        navigate("/login", { replace: true });
      }
    }

    trocarCodigo();
  }, [navigate]);

  return <p role="status">Concluindo login com Google...</p>;
}
