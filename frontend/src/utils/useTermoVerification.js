import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES, authFetch } from "./auth.js";

const TERMO_VERIFICATION_KEY_PREFIX = "termoVerification:";

function getTermoVerificationKey() {
  const token = localStorage.getItem("token");
  return token ? `${TERMO_VERIFICATION_KEY_PREFIX}${token}` : null;
}

function readSessionVerification(key) {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
}

function writeSessionVerification(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function resetTermoVerificationSession() {
  Object.keys(sessionStorage)
    .filter((key) => key.startsWith(TERMO_VERIFICATION_KEY_PREFIX))
    .forEach((key) => sessionStorage.removeItem(key));
}

export function useTermoVerification() {
  const [showModal, setShowModal] = useState(false);
  const [termosParaAceitar, setTermosParaAceitar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storageKey = getTermoVerificationKey();
    if (!storageKey) return;

    const sessionVerification = readSessionVerification(storageKey);
    if (sessionVerification?.status === "clear") return;

    if (sessionVerification?.status === "pending") {
      setTermosParaAceitar(sessionVerification.termos ?? []);
      setShowModal(true);
      return;
    }

    async function verificar() {
      try {
        const resPendencia = await authFetch(API_ROUTES.termos.verificarAceitos);
        const pendencia = await resPendencia.json();

        const dados = pendencia.dados ?? pendencia;

        const referencias = [];
        if (dados.termosPendenteSite) referencias.push("S");
        if (dados.termosPendenteArmario) referencias.push("A");

        if (referencias.length === 0) {
          writeSessionVerification(storageKey, { status: "clear" });
          return;
        }

        const resAtivos = await authFetch(API_ROUTES.termos.termosAtivos);
        const ativos = await resAtivos.json();

        const listaAtivos = ativos.dados ?? ativos;
        const pendentes = listaAtivos.filter((t) =>
          referencias.includes(t.referencia ?? t.Referencia),
        );

        setTermosParaAceitar(pendentes);
        writeSessionVerification(storageKey, {
          status: "pending",
          termos: pendentes,
        });
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
    resetTermoVerificationSession();
    setShowModal(false);
  }

  function handleRecusar() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    resetTermoVerificationSession();
    navigate("/login");
  }

  return { showModal, termosParaAceitar, handleAceitar, handleRecusar };
}
