import styles from "./Home.module.css";
import Planos from "../../components/Planos/Planos.jsx";
import SEO from "../../components/SEO/SEO.jsx";
import BaixarApp from "../../components/BaixarApp/BaixarApp.jsx";

const LOCAL = "Bloco B, 2° andar, corredor de salas de informática.";

const infos = [
  { icon: "schedule", titulo: "Duração", texto: "6 meses (1 semestre)" },
  { icon: "payments", titulo: "Pagamento", texto: "Pix, débito e crédito" },
  { icon: "mail", titulo: "Confirmação", texto: "Por e-mail" },
];

const perguntas = [
  {
    pergunta: "Onde ficam os armários?",
    resposta: LOCAL,
  },
  {
    pergunta: "Quanto tempo dura o aluguel do armário?",
    resposta: "6 meses (1 semestre). O aluguel é renovável.",
  },
  {
    pergunta: "Quais são as formas de pagamento?",
    resposta:
      "Pix, cartão de débito e crédito. O pagamento é feito no ato da reserva.",
  },
  {
    pergunta: "Como faço a reserva do meu armário?",
    resposta:
      "Clique no botão 'Reservar armário' e preencha o formulário de reserva e pagamento. Você receberá um e-mail de confirmação com os detalhes do seu armário.",
  },
  {
    pergunta: "Preciso ser associado para alugar?",
    resposta: "Não. Basta reservar e alugar o armário da AAPM.",
  },
  {
    pergunta: "O que acontece se eu perder a chave?",
    resposta:
      "Em caso de perda da chave, entre em contato com a secretaria da AAPM para providenciar a troca do cadeado e a emissão de uma nova chave.",
  },
];

export default function Home() {
  return (
    <section className={styles.containerGeral}>
      <SEO
        title="Aluguel de Armários da AAPM - SENAI Osasco"
        description="Reserve e alugue seu armário da AAPM no SENAI Osasco."
        path="/"
      />
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <header className={styles.hero}>
        <h1>
          Armários <em>AAPM</em>
          <br />
          Senai Osasco
        </h1>
        <p>
          Reserve seu armário com praticidade total. Sem burocracia, sem
          complicação.
        </p>
      </header>

      <section className={styles.section}>
        <Planos />
      </section>

      <BaixarApp />

      <section className={styles.section}>
        <div className={styles.infos}>
          {infos.map((i) => (
            <div className={styles.info} key={i.titulo}>
              <span className="material-symbols-outlined">{i.icon}</span>
              <div>
                <small>{i.titulo}</small>
                <strong>{i.texto}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <header className={styles.faqTopo}>
          <p className={styles.sectionEyebrow}>Perguntas frequentes</p>
          <h2>
            Ficou com alguma <em>dúvida?</em>
          </h2>
          <p>Veja as respostas mais comuns antes de reservar.</p>
        </header>

        <div className={styles.faq}>
          {perguntas.map((item, i) => (
            <details className={styles.faqItem} key={item.pergunta}>
              <summary className={styles.faqPergunta}>
                <span className={styles.faqNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.faqTexto}>{item.pergunta}</span>
                <span className={styles.faqSeta}>
                  <svg viewBox="0 0 16 16">
                    <polyline points="3,6 8,11 13,6" />
                  </svg>
                </span>
              </summary>
              <p className={styles.faqResposta}>{item.resposta}</p>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}
