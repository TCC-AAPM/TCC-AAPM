import { useState, useEffect } from "react";

export function ContagemRegressiva(dataFimISO) {
  const [tempo, setTempo] = useState(null);

  useEffect(() => {
    if (!dataFimISO) return;
    const calcular = () => {
      const diff = new Date(dataFimISO) - new Date();
      if (diff <= 0) return setTempo({ expirado: true });
      setTempo({
        dias: Math.floor(diff / 86400000),
        horas: Math.floor((diff % 86400000) / 3600000),
        minutos: Math.floor((diff % 3600000) / 60000),
        segundos: Math.floor((diff % 60000) / 1000),
        alerta: diff < 7 * 86400000,
        expirado: false,
      });
    };
    calcular();
    const id = setInterval(calcular, 1000);
    return () => clearInterval(id);
  }, [dataFimISO]);

  return tempo;
}