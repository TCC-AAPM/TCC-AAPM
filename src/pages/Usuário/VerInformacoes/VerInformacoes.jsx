import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VerInformacoes.module.css";
import { API_ROUTES, getUsuarioLogado } from "../../../utils/auth.js";
import { getNomeExibicao } from "../../../utils/getNomeExibicao.js";
import { useDockButton } from "../../../utils/useDockButton";

const maskCPF = (v) =>
  v
    ?.replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") ?? "";

const maskPhone = (v) =>
  v
    ?.replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)(\d{4})(\d{4})/, "($1) $2 $3-$4") ?? "";


export default function VerInformacoes() {
  const navigate = useNavigate();
  const docked = useDockButton();
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    const token = localStorage.getItem("token");
    fetch(API_ROUTES.alunos.telaPrincipal, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          navigate("/");
          return null;
        }
        return r.json();
      })
      .then((d) =>
        d &&
        setAluno({
          ...d,
          dados: {
            ...d.dados,
            nomeSocial:
              d.dados?.nomeSocial ??
              d.dados?.NomeSocial ??
              d.dados?.nomeSocialAluno ??
              d.dados?.NomeSocialAluno ??
              "",
          },
        }),
      );
  }, [navigate]);

  const campos = aluno
    ? [
        ["Nome de Usuário", getNomeExibicao(aluno.dados)],
        ["CPF", maskCPF(aluno.dados.cpf)],
        ["Matrícula", aluno.dados.matricula],
        ["Telefone", maskPhone(aluno.dados.telefone)],
        ["Email", aluno.dados.email],
        ["Data de Nascimento", aluno.dados.dataNasc],
        ["Curso", aluno.dados.curso],
        ["Turma", aluno.dados.turma],
      ]
    : [];

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.containerGeral}>
        <div className={styles.conteudoInterno}>
          <div className={styles.principalBox}>
            <div className={styles.topBar}></div>
            <div className={styles.entreAqui}>
              <span className="material-symbols-outlined">info</span>
              <h3>Veja seus dados</h3>
            </div>

            <div className={styles.card}>
              {campos.map(([label, valor]) => (
                <div key={label} className={styles.infoSection}>
                  <span className={styles.infoLabel}>{label}</span>
                  <span className={styles.infoValue}>{valor ?? "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <a
          href="#"
          onClick={() => history.back()}
          className={`${styles.voltar} ${docked ? styles.voltarDocked : ""}`}
        >
          ← Voltar
        </a>
      </div>
    </div>
  );
}
