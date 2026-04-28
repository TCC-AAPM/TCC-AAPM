import styles from "./DeletarConta.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  alertErro,
  alertSucessoModal,
} from "../../../components/Alerts/Alerts.jsx";
import { API_ROUTES } from "../../../utils/auth";

export default function DeletarConta() {
  const navigate = useNavigate();
  const [aceito, setAceito] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [darkMode, setDarkMode] = useState(
    document.body.classList.contains("dark-mode"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  async function handleDeletar() {
    console.log("rota:", API_ROUTES.alunos.deletarConta);
    setCarregando(true);
    try {
      const token = localStorage.getItem("token");
      console.log("token:", token);
      const res = await fetch(API_ROUTES.alunos.deletarConta, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Senha: senha }),
      });

      if (res.ok || res.status === 500) {
        await alertSucessoModal("Conta excluída com sucesso.");

        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/");
        
      } else if (res.status === 401) {
        alertErro("Senha incorreta. Tente novamente.");
      } else {
        alertErro("Erro ao deletar conta. Tente mais tarde.");
      }
    } catch (err) {
      console.log("erro completo:", err);
      alertErro("Erro de conexão. Tente mais tarde.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} data-theme={darkMode ? "dark" : "light"}>
        {etapa === 1 ? (
          <>
            <h2 className={styles.titulo}>Excluir minha conta</h2>
            <p className={styles.subtitulo}>
              Leia com atenção antes de prosseguir.
            </p>

            <div className={styles.aviso}>
              Atenção: esta ação é permanente e não pode ser desfeita.
            </div>

            <ol className={styles.lista}>
              <li>
                Caso possua um <strong>armário ativo</strong>, você deverá
                retirar todos os seus pertences e devolver a chave/cadeado à
                AAPM antes da exclusão.
              </li>
              <li>
                A exclusão encerra imediatamente o acesso ao armário, mesmo com
                pagamento integral. <strong>Não haverá reembolso</strong>{" "}
                proporcional ao tempo restante.
              </li>
              <li>
                Pertences não retirados em até <strong>7 dias corridos</strong>{" "}
                poderão ser descartados pela AAPM sem responsabilidade por danos
                ou perdas.
              </li>
              <li>
                Todos os seus dados serão{" "}
                <strong>removidos permanentemente</strong> do sistema.
              </li>
              <li>
                Para criar nova conta futuramente, será necessário novo cadastro
                e novo processo de locação.
              </li>
              <li>
                Ao confirmar, você isenta a AAPM de qualquer responsabilidade
                decorrente desta decisão.
              </li>
            </ol>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={aceito}
                onChange={(e) => setAceito(e.target.checked)}
              />
              <span>Li e concordo com todos os termos acima.</span>
            </label>

            <div className={styles.botoes}>
              <button
                className={styles.btnCancelar}
                onClick={() => navigate(-1)}
              >
                Cancelar
              </button>
              <button
                className={styles.btnExcluir}
                disabled={!aceito}
                onClick={() => setEtapa(2)}
              >
                Continuar
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.titulo}>Confirme sua senha</h2>
            <p className={styles.subtitulo}>
              Digite sua senha para confirmar a exclusão.
            </p>

            <input
              className={styles.inputSenha}
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && senha && handleDeletar()}
              autoFocus
            />

            <div className={styles.botoes}>
              <button
                className={styles.btnCancelar}
                onClick={() => setEtapa(1)}
              >
                Voltar
              </button>
              <button
                className={styles.btnExcluir}
                disabled={!senha || carregando}
                onClick={handleDeletar}
              >
                {carregando ? "Aguarde..." : "Excluir minha conta"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
