import { useState } from "react";
import styles from "../PreCadastroArmario.module.css";

function PixIcon() {
  return (
    <svg
      className={styles["icone-pix"]}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Símbolo Pix"
    >
      <path d="M15.6 5.5a6 6 0 0 1 8.5 0l4.2 4.2-5.1 5.1a4.5 4.5 0 0 1-6.4 0l-5.1-5.1 3.9-4.2Z" />
      <path d="m32.4 15.6 4.2-4.2a6 6 0 0 1 0 8.5l-5.1 5.1a4.5 4.5 0 0 1-6.4 0l-1.9-1.9 9.2-7.5Z" />
      <path d="m15.6 42.5-4.2-4.2a6 6 0 0 1 0-8.5l5.1-5.1a4.5 4.5 0 0 1 6.4 0l1.9 1.9-9.2 7.5Z" />
      <path d="m32.4 32.4-4.2 4.2a6 6 0 0 1-8.5 0l-4.2-4.2 5.1-5.1a4.5 4.5 0 0 1 6.4 0l5.4 5.1Z" />
    </svg>
  );
}

function DinheiroIcon() {
  return (
    <svg
      className={styles["icone-dinheiro"]}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="26" height="18" rx="3" />
      <circle cx="16" cy="16" r="4" />
      <path d="M7 12c1.5 0 2.5-1 2.5-2.5M25 20c-1.5 0-2.5 1-2.5 2.5" />
    </svg>
  );
}

export default function EtapaPagamento({ precos, navigate, formatarPreco }) {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);

  return (
    <div className={styles.pagina}>
      <div className={styles.corpo}>
        <aside className={styles.esquerda}>
          <h1>
            Como deseja
            <br />
            realizar o <em>pagamento?</em>
          </h1>
          <p>Escolha uma forma de pagamento para o aluguel do armário.</p>

          <div className={styles.passos}>
            <div className={styles.passo}>
              <div className={`${styles["passo-num"]} ${styles.ativo}`}>✓</div>
              <div className={styles["passo-info"]}>
                <strong>Dados pessoais</strong>
                <span>Concluído</span>
              </div>
            </div>

            <div className={styles.passo}>
              <div className={`${styles["passo-num"]} ${styles.ativo}`}>2</div>
              <div className={styles["passo-info"]}>
                <strong>Pagamento</strong>
                <span>Você está aqui</span>
              </div>
            </div>
          </div>
        </aside>

        <div className={`${styles.card} ${styles["card-pagamento"]}`}>
          <div className={styles.separador}>Formas de pagamento</div>

          <div className={styles["opcoes-pagamento"]}>
            <button
              type="button"
              className={`${styles["opcao-pagamento"]} ${
                opcaoSelecionada === "pix" ? styles["opcao-selecionada"] : ""
              } ${styles["opcao-indisponivel"]}`}
              onClick={() => setOpcaoSelecionada("pix")}
              aria-pressed={opcaoSelecionada === "pix"}
            >
              <span className={styles["icone-opcao"]}>
                <PixIcon />
              </span>
              <span className={styles["texto-opcao"]}>
                <strong>Pagamento via PIX</strong>
                <span>Pagamento digital</span>
              </span>
              <span className={styles["selo-em-breve"]}>Em breve</span>
            </button>

            <button
              type="button"
              className={`${styles["opcao-pagamento"]} ${
                opcaoSelecionada === "dinheiro" ? styles["opcao-selecionada"] : ""
              }`}
              onClick={() => setOpcaoSelecionada("dinheiro")}
              aria-pressed={opcaoSelecionada === "dinheiro"}
            >
              <span className={styles["icone-opcao"]}>
                <DinheiroIcon />
              </span>
              <span className={styles["texto-opcao"]}>
                <strong>Dinheiro</strong>
                <span>Pagamento presencial na secretaria da AAPM, próxima à biblioteca do SENAI</span>
              </span>
              <span className={styles["preco-pagamento"]}>
                {formatarPreco(precos["A"])}
              </span>
            </button>
          </div>

          {opcaoSelecionada === "pix" && (
            <div className={styles["aviso-pagamento"]} role="status">
              <strong>Pagamento via Pix em breve</strong>
              <span>
                Essa forma de pagamento ainda não está disponível. Por enquanto,
                o pagamento deve ser feito presencialmente na secretaria da AAPM.
              </span>
            </div>
          )}

          {opcaoSelecionada === "dinheiro" && (
            <div className={styles["aviso-pagamento"]}>
              <strong>Pagamento somente na secretaria da AAPM</strong>
              <span>
                Faça o pagamento pessoalmente na secretaria da AAPM, próxima à
                biblioteca do SENAI.
              </span>
              <span>
                Você já pode acessar o site antes de pagar. Entre com o e-mail
                cadastrado e use seu CPF como senha inicial; depois, altere a
                senha dentro do site.
              </span>
              <span>
                Após o pagamento presencial, a secretaria registrará a baixa no
                sistema. Quando ela for processada, você poderá visualizar o
                armário alocado e as informações relacionadas na sua conta.
              </span>
            </div>
          )}

          <div className={styles["rodape-card"]}>
            <button
              type="button"
              className={styles["btn-secundario"]}
              onClick={() => navigate("/")}
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
