import { useNavigate, useLocation } from "react-router-dom";
import SEO from "../../components/SEO/SEO.jsx";
import styles from "./Pagamento.module.css";

function gerarPix() {
  // TODO: integrar API Pix
}

export default function Pagamento() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const modo = pathname.endsWith("/pix")
    ? "pix"
    : pathname.endsWith("/presencial")
      ? "presencial"
      : "escolha";

  const titulo =
    modo === "pix"
      ? "Pagamento via Pix"
      : modo === "presencial"
        ? "Pagar pessoalmente"
        : "Escolha a forma de pagamento";

  return (
    <main className={styles.pagina}>
      <SEO title={titulo} description="Escolha como deseja pagar a renovação do armário." noIndex />
      <section className={styles.card}>
        <span className={`${styles.icone} material-symbols-outlined`} aria-hidden="true">
          {modo === "presencial" ? "storefront" : "payments"}
        </span>
        <h1>{titulo}</h1>

        {modo === "escolha" && (
          <>
            <p>Selecione como deseja realizar o pagamento da renovação.</p>
            <div className={styles.opcoes}>
              <button type="button" className={styles.botao} onClick={() => navigate("/pagamento/pix")}>
                <span className="material-symbols-outlined" aria-hidden="true">qr_code_2</span>
                Pagar via Pix
              </button>
              <button type="button" className={styles.botaoSecundario} onClick={() => navigate("/pagamento/presencial")}>
                <span className="material-symbols-outlined" aria-hidden="true">storefront</span>
                Pagar pessoalmente
              </button>
            </div>
          </>
        )}

        {modo === "pix" && (
          <div className={styles.conteudo}>
            <p>Pagamento via Pix em breve.</p>
            <div className={styles.qrPlaceholder} aria-label="Espaço reservado para o QR Code Pix">
              QR Code Pix
            </div>
            <label className={styles.rotulo} htmlFor="codigo-pix">Código Pix copia e cola</label>
            <div id="codigo-pix" className={styles.codigoPlaceholder}>
              O código Pix será exibido aqui.
            </div>
          </div>
        )}

        {modo === "presencial" && (
          <div className={styles.conteudo}>
            <p>Faça o pagamento diretamente na secretaria da AAPM.</p>
            <div className={styles.instrucao}>
              <strong>Onde pagar</strong>
              <span>Bloco B, 2º andar, corredor de salas de informática.</span>
            </div>
            <p>Informe que deseja renovar seu armário. A equipe da secretaria orientará você sobre o pagamento e a confirmação da renovação.</p>
          </div>
        )}

        <button
          type="button"
          className={styles.voltar}
          onClick={() => navigate(modo === "escolha" ? "/usuario/tela-principal" : "/pagamento")}
        >
          {modo === "escolha" ? "Voltar para minha área" : "Voltar às formas de pagamento"}
        </button>
      </section>
    </main>
  );
}
