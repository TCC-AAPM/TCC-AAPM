import styles from './GestaoAdmin.module.css';

const cards = [
  {
    href: '../criar-armario/criar-armario.html',
    icon: 'add_box',
    title: 'Criar Armário',
    desc: 'Cadastre um novo armário no sistema',
  },
  {
    href: '../historico-alunos/historico-alunos.html',
    icon: 'history',
    title: 'Histórico de Alunos',
    desc: 'Visualize os dados de todos os alunos já cadastrados',
  },
  {
    href: '../modificar-data/modificar-data.html',
    icon: 'calendar_month',
    title: 'Modificar Data Final do Semestre',
    desc: 'Configure a duração do semestre',
  },
  {
    id: 'financeiro',
    icon: 'payments',
    title: 'Financeiro',
    desc: 'Controle de pagamentos',
  },
  {
    id: 'enviarNotificacoes',
    icon: 'notifications',
    title: 'Enviar Notificações',
    desc: 'Envie avisos para e-mail dos alunos',
  },
  {
    href: '../configuracoes/configuracoes.html',
    icon: 'settings',
    title: 'Configurações da Conta',
    desc: 'Configure as preferências da sua conta',
  },
];

export default function PainelAdmin() {
  return (
    <>
      <div className={styles.principalBox}>
        <div className={styles.divHeader}>
          <h1>Painel Administrativo</h1>
          <p>Acesse, configure e controle todos os recursos do sistema de forma rápida</p>
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