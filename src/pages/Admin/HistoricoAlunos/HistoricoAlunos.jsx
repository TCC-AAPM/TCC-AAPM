import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../../utils/auth";
import { API_ROUTES } from "/src/routes/config/api.js";
import styles from "./HistoricoAlunos.module.css";

function aplicarMascaraCPF(cpf) {
  if (!cpf) return "";
  const valor = cpf.replace(/\D/g, "").slice(0, 11);
  return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export default function HistoricoAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      try {
        const res = await authFetch(API_ROUTES.reservas.historico);
        const resultado = await res.json();
        setAlunos(resultado.dados ?? resultado ?? []);
      } catch {
        setAlunos([]);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  return (
    <div className={styles.principalBox}>
      <div className={styles.divHeader}>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          history
        </span>
        <h3>Histórico de Alunos</h3>
      </div>

      <div className={styles.containerLista}>
        <div className={`${styles.linha} ${styles.titulo}`}>
          <span></span>
          <span>Nome</span>
          <span>CPF</span>
          <span>Armário</span>
          <span>Status</span>
        </div>

        {carregando && <p className={styles.mensagem}>Carregando...</p>}

        {!carregando && alunos.length === 0 && (
          <p className={styles.mensagem}>Nenhum registro encontrado.</p>
        )}

        {alunos.map((aluno, index) => (
          <div className={styles.linha} key={index}>
            <button
              className={styles.btnEditar}
              onClick={() =>
                navigate(`/admin/editar-usuario/${aluno.numeroArmario}`)
              }
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
            <span>{aluno.nome}</span>
            <span>{aplicarMascaraCPF(aluno.cpf)}</span>
            <span>Armário {aluno.numeroArmario}</span>
            <span
              className={`${styles.status} ${aluno.isAtivo ? styles.ativo : styles.inativo}`}
            >
              {aluno.isAtivo ? "Ativo" : "Inativo"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
