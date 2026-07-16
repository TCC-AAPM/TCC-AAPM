import { useNavigate } from "react-router-dom";
import styles from "./GestaoAdmin.module.css";
import { alertConfirmar } from "../../../components/Alerts/Alerts.jsx";

const cards = [
  {
    icon: "inventory_2",
    title: "Gerenciar Armários",
    desc: "Cadastre, edite e defina a disponibilidade dos armários do sistema.",
  },
  {
    icon: "school",
    title: "Gerenciar Cursos",
    desc: "Crie cursos e mantenha as informações atualizadas.",
  },
  {
    icon: "groups",
    title: "Gerenciar Turmas",
    desc: "Crie, edite e administre as turmas vinculadas aos cursos.",
  },
  {
    icon: "group_search",
    title: "Gerenciar Administradores",
    desc: "Crie e analise os usuários administrativos do sistema.",
  },
  {
    icon: "description",
    title: "Gerenciar Termos de Uso",
    desc: "Atualize e controle os termos de uso disponibilizados aos usuários.",
  },
  {
    icon: "history",
    title: "Histórico de Alunos",
    desc: "Consulte o registro completo dos alunos já cadastrados no sistema.",
  },
  {
    icon: "calendar_month",
    title: "Modificar Data Final do Semestre",
    desc: "Defina o período de encerramento do semestre letivo.",
  },
  {
    icon: "payments",
    title: "Financeiro",
    desc: "Acompanhe pagamentos, pendências e movimentações financeiras.",
  },
  {
    icon: "notifications",
    title: "Gerenciar E-mails",
    desc: "Envie comunicados e notificações para os alunos por e-mail.",
  },
  {
    icon: "settings",
    title: "Configurações da Conta",
    desc: "Personalize preferências e opções da conta administrativa.",
  },
  {
    icon: "question_mark",
    title: "?",
    desc: "?.",
  },
  {
    icon: "logout",
    title: "Sair",
    desc: "Encerre a sessão e saia do sistema.",
  },
];

export default function PainelAdmin() {
  const navigate = useNavigate();

  async function handleSair() {
    const confirmado = await alertConfirmar("Deseja realmente sair?");
    if (!confirmado) return;

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  }

  function handleCardClick(card) {
    if (card.title === "Sair") {
      handleSair();
      return;
    }

    if (card.title === "Modificar Data Final do Semestre") {
      navigate("/admin/modificar-data-semestre");
      return;
    }

    if (card.title === "Gerenciar Cursos"){
      navigate("/admin/gerenciar-cursos");
      return;
    }

    if (card.title === "Histórico de Alunos") {
      navigate("/admin/historico-reserva");
      return;
      // demais cards ainda não têm navegação definida
    }
  }

  return (
    <>
      <div className={styles.principalBox}>
        <div className={styles.divHeader}>
          <h1>Painel Administrativo</h1>
          <p>
            Acesse, configure e controle todos os recursos do sistema de forma
            rápida
          </p>
        </div>
        <div className={styles.cards}>
          {cards.map((card) => (
            <div
              className={styles.cartao}
              key={card.title}
              onClick={() => handleCardClick(card)}
            >
              <div className={styles.icone}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
        className="voltar"
      >
        ← Voltar
      </a>
    </>
  );
}
