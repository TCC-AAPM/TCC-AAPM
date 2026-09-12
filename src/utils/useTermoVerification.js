import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES, authFetch } from "./auth.js";

export function useTermoVerification() {
  const [showModal, setShowModal] = useState(false);
  const [termosParaAceitar, setTermosParaAceitar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    async function verificar() {
      try {
        const resPendencia = await authFetch(API_ROUTES.termos.verificarAceitos);
        const pendencia = await resPendencia.json();

        const dados = pendencia.dados ?? pendencia;

        const referencias = [];
        if (dados.termosPendenteSite) referencias.push("S");
        if (dados.termosPendenteArmario) referencias.push("A");

        if (referencias.length === 0) return;

        const resAtivos = await authFetch(API_ROUTES.termos.termosAtivos);
        const ativos = await resAtivos.json();

        const listaAtivos = ativos.dados ?? ativos;
        const pendentes = listaAtivos.filter((t) =>
          referencias.includes(t.referencia ?? t.Referencia),
        );

        setTermosParaAceitar(pendentes);
        setShowModal(true);
      } catch (err) {
        console.error("Erro:", err);
      }
    }

    verificar();
  }, []);

  async function handleAceitar() {
    for (const t of termosParaAceitar) {
      const id = t.idTermo ?? t.IdTermo ?? t.id;
      await authFetch(API_ROUTES.termos.aceitarNovos, {
        method: "POST",
        body: JSON.stringify({ idTermo: id }),
      });
    }
    setShowModal(false);
  }

  function handleRecusar() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  }

  return { showModal, termosParaAceitar, handleAceitar, handleRecusar };
}
