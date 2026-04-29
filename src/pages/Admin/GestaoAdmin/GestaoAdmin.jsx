import styles from "./GestaoAdmin.module.css";

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
];

export default function PainelAdmin() {
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
          {cards.map((card) => {
            const inner = (
              <>
                <div className={styles.icone}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </>
            );

            return (
              <div className={styles.cartao} id={card.id} key={card.title}>
                {card.href ? <a href={card.href}>{inner}</a> : inner}
              </div>
            );
          })}
        </div>
      </div>

      <a href="#" onClick={() => history.back()} className="voltar">
        ← Voltar
      </a>
    </>
  );
}
