import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../routes/config/api.js";

const BASE = import.meta.env.VITE_API_URL ?? "/api";

export function useTermoVerification() {
  const [showModal, setShowModal] = useState(false);
  const [termosParaAceitar, setTermosParaAceitar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    async function verificar() {
      try {
        const resPendencia = await fetch(API_ROUTES.termos.verificarAceitos, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendencia = await resPendencia.json();
        console.log("1. pendencia:", pendencia);

        const dados = pendencia.dados ?? pendencia;
        console.log("2. dados:", dados);

        const referencias = [];
        if (dados.termosPendenteSite)           referencias.push("S");
        if (dados.termosPendenteArmario)        referencias.push("A");
        if (dados.termosPendenteEstacionamento) referencias.push("E");
        console.log("3. referencias:", referencias);

        if (referencias.length === 0) return;

        const resAtivos = await fetch(`${BASE}/Termo/termos-ativos`);
        const ativos = await resAtivos.json();
        console.log("4. ativos:", ativos);

        const listaAtivos = ativos.dados ?? ativos;
        const pendentes = listaAtivos.filter((t) =>
          referencias.includes(t.referencia ?? t.Referencia)
        );
        console.log("5. pendentes:", pendentes);

        setTermosParaAceitar(pendentes);
        setShowModal(true);
      } catch (err) {
        console.error("Erro:", err);
      }
    }

    verificar();
  }, []);

  async function handleAceitar() {
    const token = localStorage.getItem("token");
    for (const t of termosParaAceitar) {
      const id = t.idTermo ?? t.IdTermo ?? t.id;
      await fetch(API_ROUTES.termos.aceitarNovos, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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