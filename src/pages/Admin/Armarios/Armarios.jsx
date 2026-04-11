import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CardArmario } from "../../../components/CardArmario/CardArmario.jsx";
import { PopupModal } from "../../../components/PopupModal/PopupModal.jsx";

import { API_ROUTES } from "../../../utils/auth.js";
import styles from "./Armarios.module.css";

export default function Armarios() {
  const navigate = useNavigate();

  const [armarios, setArmarios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [popup, setPopup] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState(null);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    async function carregar() {
      const [arm, usr] = await Promise.all([
        fetch(API_ROUTES.armarios.listar, { headers }).then((r) => r.json()),
        fetch(API_ROUTES.armarios.comReserva, { headers }).then((r) => r.json()),
      ]);
      setArmarios(arm);
      setUsuarios(usr);
    }

    carregar().catch(console.error);
  }, []);

  const estadoClasse = {
    O: "ocupado",
    M: "manutencao",
    D: "disponivel",
    P: "pendente",
  };

  const lista = armarios.filter((arm) => {
    const user = usuarios.find((u) => u.numeroArmario === arm.numeroArmario);
    const termo = pesquisa.toLowerCase();

    const matchPesquisa =
      arm.numeroArmario?.toString().includes(termo) ||
      user?.nomeAluno?.toLowerCase().includes(termo) ||
      user?.CPF?.includes(termo) ||
      user?.email?.toLowerCase().includes(termo);

    const matchFiltro = !filtro || estadoClasse[arm.estado] === filtro;

    return matchPesquisa && matchFiltro;
  });

  function handleClick(arm) {
    if (arm.estado === "D") {
      localStorage.setItem("armarioSelecionado", arm.numeroArmario);
      navigate("/admin/armarios/cadastrar-usuario");
    } else if (arm.estado === "O") {
      const usuario = usuarios.find((u) => u.numeroArmario === arm.numeroArmario);
      setPopup({ tipo: "ocupado", armario: arm, usuario });
    }
  }

  function handleContextMenu(arm) {
    const usuario = usuarios.find((u) => u.numeroArmario === arm.numeroArmario);
    setPopup({ tipo: "manutencao-ctx", armario: arm, usuario });
  }

  const filtros = [
    ["filtroOcupado", "ocupado", "OCUPADO"],
    ["filtroManutencao", "manutencao", "MANUTENÇÃO"],
    ["filtroDisponivel", "disponivel", "DISPONÍVEL"],
    ["filtroPendente", "pendente", "PENDENTE"],
  ];

  return (
    <>
      <button
        className={styles.btnMenu}
        onClick={() => navigate("/admin/gestao-admin")}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className={styles.principalBox}>
        <div className="container-lg mb-3">
          <div className={styles.inputPesquisa}>
            <input
              type="text"
              className={styles.formControl}
              placeholder="🔎  Digite o número, nome ou email..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>

          <div className={styles.filtros}>
            {filtros.map(([cssKey, estado, label]) => (
              <button
                key={estado}
                className={`${styles.filtroBtn} ${styles[cssKey]} ${filtro === estado ? styles.ativo : ""}`}
                onClick={() => setFiltro((prev) => (prev === estado ? null : estado))}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.cardsArea}>
            {lista.map((arm) => (
              <CardArmario
                key={arm.numeroArmario}
                armario={arm}
                usuario={usuarios.find((u) => u.numeroArmario === arm.numeroArmario)}
                onClick={() => handleClick(arm)}
                onContextMenu={() => handleContextMenu(arm)}
              />
            ))}
          </div>
        </div>

        {popup && (
          <PopupModal
            popup={popup}
            todosArmarios={armarios}
            onClose={() => setPopup(null)}
            onReload={() => window.location.reload()}
          />
        )}
      </div>
    </>
  );
}