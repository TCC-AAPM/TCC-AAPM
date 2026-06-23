import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";

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
      try {
        const respostaArmarios = await fetch(API_ROUTES.armarios.listar, {
          headers,
        });

        const respostaUsuarios = await fetch(API_ROUTES.reservas.comReserva, {
          headers,
        });

        const arm = await respostaArmarios.json();
        const usr = await respostaUsuarios.json();

        setArmarios(Array.isArray(arm.dados) ? arm.dados : []);
        setUsuarios(Array.isArray(usr.dados) ? usr.dados : []);
      } catch (erro) {
        console.error(erro);
        setArmarios([]);
        setUsuarios([]);
      }
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
      navigate("/admin/cadastrar-aluno");
    } else if (arm.estado === "O") {
      const usuario = usuarios.find(
        (u) => u.numeroArmario === arm.numeroArmario,
      );
      setPopup({ tipo: "ocupado", armario: arm, usuario });
    }
  }

  function handleContextMenu(arm) {
    const usuario = usuarios.find((u) => u.numeroArmario === arm.numeroArmario);
    setPopup({ tipo: "manutencao-ctx", armario: arm, usuario });
  }

  const filtros = [
    ["filtroOcupado", "ocupado", "Ocupado"],
    ["filtroManutencao", "manutencao", "Manutenção"],
    ["filtroDisponivel", "disponivel", "Disponível"],
    ["filtroPendente", "pendente", "Pendente"],
  ];
  const filtroLabel = filtros.find(([, estado]) => estado === filtro)?.[2];

  return (
    <div className={styles.principalBox}>
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarHeader}>
            <div>
              <p className={styles.kicker}>Gestão de armários</p>
              <h1 className={styles.titulo}>Armários</h1>
            </div>
            <span className={styles.resultado}>{lista.length} encontrados</span>
          </div>

          <div className={styles.filtroBar}>
            <div className={styles.inputPesquisa}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.formControl}
                placeholder="Número, nome, CPF ou email"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
              {pesquisa && (
                <button
                  className={styles.limparPesquisa}
                  type="button"
                  onClick={() => setPesquisa("")}
                  aria-label="Limpar pesquisa"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className={styles.filtrosWrap}>
              <div className={styles.filtrosLabel}>
                <SlidersHorizontal size={16} />
                <span>Filtros</span>
              </div>

              <div className={styles.filtros}>
                {filtros.map(([cssKey, estado, label]) => (
                  <button
                    key={estado}
                    type="button"
                    className={`${styles.filtroBtn} ${styles[cssKey]} ${
                      filtro === estado ? styles.ativo : ""
                    }`}
                    onClick={() =>
                      setFiltro((prev) => (prev === estado ? null : estado))
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(filtro || pesquisa) && (
            <button
              className={styles.limparFiltros}
              type="button"
              onClick={() => {
                setFiltro(null);
                setPesquisa("");
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>

        <div className={styles.cardsArea}>
          {lista.length > 0 ? (
            lista.map((arm) => (
              <CardArmario
                key={arm.numeroArmario}
                armario={arm}
                usuario={usuarios.find(
                  (u) => u.numeroArmario === arm.numeroArmario,
                )}
                onClick={() => handleClick(arm)}
                onContextMenu={() => handleContextMenu(arm)}
              />
            ))
          ) : (
            <div className={styles.estadoVazio}>
              <h2>
                {filtroLabel
                  ? `Não há armários ${filtroLabel.toLowerCase()}s`
                  : "Nenhum armário encontrado"}
              </h2>
              <p>
                {pesquisa
                  ? "Tente buscar por outro número, nome, CPF ou email."
                  : "Altere os filtros para ver outros armários."}
              </p>
            </div>
          )}
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
  );
}
