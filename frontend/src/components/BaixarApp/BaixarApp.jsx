import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import styles from "./BaixarApp.module.css";
import telaApp from "../../assets/images/celularAPP.png";

const APK_URL = import.meta.env.VITE_APK_URL || "/app/aapm.apk";

export default function BaixarApp({ compacto = false }) {
  const bannerRef = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (compacto || !bannerRef.current) return undefined;
    if (!("IntersectionObserver" in window)) {
      setVisivel(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisivel(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(bannerRef.current);
    return () => observer.disconnect();
  }, [compacto]);

  if (compacto) {
    return (
      <a className={styles.linkCompacto} href={APK_URL} download>
        <Download size={17} aria-hidden="true" />
        Baixar app
      </a>
    );
  }

  return (
    <section
      ref={bannerRef}
      className={`${styles.banner} ${visivel ? styles.visivel : ""}`}
      aria-labelledby="baixar-app-titulo"
    >
      <div className={styles.conteudo}>
        <h2 id="baixar-app-titulo">Seu armário também no celular</h2>
        <p className={styles.descricao}>
          Consulte sua reserva pelo aplicativo da AAPM.
        </p>
        <div className={styles.acoes}>
          <a className={styles.botao} href={APK_URL} download>
            <Download size={18} aria-hidden="true" />
            Baixar app para Android
          </a>
          <span className={styles.disponibilidade}>Android • APK</span>
        </div>
      </div>

      <div className={styles.mockupArea}>
        <img
          className={styles.mockupCelular}
          src={telaApp}
          alt="Prévia do aplicativo da AAPM com os status dos armários"
        />
      </div>
    </section>
  );
}
