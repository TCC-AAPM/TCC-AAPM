import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VerInformacoes.module.css";
import Menu from "../../../components/MenuUsuario/Menu.jsx";
import { API_ROUTES, getUsuarioLogado } from "../../../utils/auth.js";

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

const METODOS = { A: "Dinheiro", P: "Pix", D: "Débito", C: "Crédito" };

export default function VerInformacoes() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

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
      .then((d) => d && setAluno(d));
  }, [navigate]);

  console.log(aluno);
  const campos = aluno
    ? [
        ["Nome de Usuário", aluno.nome],
        ["CPF", maskCPF(aluno.cpf)],
        ["Matrícula", aluno.matricula],
        ["Telefone", maskPhone(aluno.telefone)],
        ["Email", aluno.email],
        ["Data de Nascimento", aluno.dataNascimento],
        ["Curso", aluno.curso],
        ["Turma", aluno.turma],
        ["Pagamento", METODOS[aluno.pagamento]],
      ]
    : [];

  return (
    <>
      <div className={styles.containerGeral}>
        <div className={styles.princiaplBox}>
          <div className={styles.topBar}>
            <Menu aberto={menuAberto} setAberto={setMenuAberto} />
          </div>
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

      <a className={styles.voltar} onClick={() => navigate(-1)}>
        ← Voltar
      </a>
    </>
  );
}
