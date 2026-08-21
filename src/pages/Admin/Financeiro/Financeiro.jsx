import { useEffect, useState, useMemo, useRef } from "react";
import { Pagination } from "@mui/material";
import {
  Search,
  X,
  DollarSign,
  Package,
  TrendingUp,
  ListFilter,
} from "lucide-react";
import { authFetch, API_ROUTES } from "../../../utils/auth";
import { alertErro } from "../../../components/Alerts/Alerts";
import styles from "./Financeiro.module.css";
import { useDockButton } from "../../../utils/useDockButton";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ITENS_POR_PAGINA = 8;

function normalizarLista(resultado) {
  if (Array.isArray(resultado)) return resultado;
  if (Array.isArray(resultado?.dados)) return resultado.dados;
  if (Array.isArray(resultado?.data)) return resultado.data;
  if (resultado?.dados && typeof resultado.dados === "object")
    return [resultado.dados];
  if (resultado && typeof resultado === "object") return [resultado];
  return [];
}

function formatarMoeda(valor) {
  return Number(valor ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "—" : data.toLocaleDateString("pt-BR");
}

function formatarMetodo(sigla) {
  const metodos = {
    D: "Débito",
    C: "Crédito",
    P: "Pix",
    A: "Dinheiro",
  };
  return metodos[sigla] ?? sigla ?? "—";
}

function useContadorAnimado(valorFinal, duracao = 900) {
  const [valorAtual, setValorAtual] = useState(0);

  useEffect(() => {
    let inicio = null;
    const diferenca = valorFinal - 0;

    function animar(timestamp) {
      if (!inicio) inicio = timestamp;
      const progresso = Math.min((timestamp - inicio) / duracao, 1);
      const facilitado = 1 - Math.pow(1 - progresso, 3);
      setValorAtual(diferenca * facilitado);

      if (progresso < 1) requestAnimationFrame(animar);
      else setValorAtual(valorFinal);
    }

    const frame = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(frame);
  }, [valorFinal, duracao]);

  return valorAtual;
}

export default function Financeiro() {
  const docked = useDockButton();
  const [totalGeral, setTotalGeral] = useState(0);
  const [totalMensal, setTotalMensal] = useState([]);
  const [relatorio, setRelatorio] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [ordenacao, setOrdenacao] = useState("recente");
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const filtroRef = useRef(null);

  useEffect(() => {
    async function carregarTudo() {
      setCarregando(true);
      try {
        const [resTotal, resMensal, resRelatorio] = await Promise.all([
          authFetch(API_ROUTES.financeiro.total),
          authFetch(API_ROUTES.financeiro.totalMensal),
          authFetch(API_ROUTES.financeiro.relatorio),
        ]);

        if (!resTotal.ok || !resMensal.ok || !resRelatorio.ok) {
          throw new Error("Erro ao carregar dados financeiros");
        }

        const dadosTotal = await resTotal.json();
        const dadosMensal = await resMensal.json();
        const dadosRelatorio = await resRelatorio.json();

        setTotalGeral(dadosTotal?.dados?.valor ?? dadosTotal?.valor ?? 0);
        setTotalMensal(normalizarLista(dadosMensal));
        setRelatorio(normalizarLista(dadosRelatorio));
      } catch {
        setTotalGeral(0);
        setTotalMensal([]);
        setRelatorio([]);
        alertErro(
          "Não foi possível carregar os dados financeiros. Tente novamente mais tarde.",
        );
      } finally {
        setCarregando(false);
      }
    }
    carregarTudo();
  }, []);

  useEffect(() => {
    function fecharAoClicarFora(e) {
      if (filtroRef.current && !filtroRef.current.contains(e.target)) {
        setFiltroAberto(false);
      }
    }
    document.addEventListener("mousedown", fecharAoClicarFora);
    return () => document.removeEventListener("mousedown", fecharAoClicarFora);
  }, []);

  const resumoAtual = totalMensal[totalMensal.length - 1] ?? {};
  const totalMesAnimado = useContadorAnimado(resumoAtual.valor ?? 0);
  const totalGeralAnimado = useContadorAnimado(totalGeral);

  const relatorioFiltrado = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    let lista = relatorio;

    if (termo) {
      lista = lista.filter((item) =>
        [item.nome, item.metodo]
          .filter(Boolean)
          .some((valor) => String(valor).toLowerCase().includes(termo)),
      );
    }

    const listaOrdenada = [...lista];

    if (ordenacao === "recente") {
      listaOrdenada.sort((a, b) => new Date(b.data) - new Date(a.data));
    } else if (ordenacao === "antigo") {
      listaOrdenada.sort((a, b) => new Date(a.data) - new Date(b.data));
    } else if (ordenacao === "alfabetica") {
      listaOrdenada.sort((a, b) =>
        (a.nome ?? "").localeCompare(b.nome ?? "", "pt-BR"),
      );
    }

    return listaOrdenada;
  }, [relatorio, pesquisa, ordenacao]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(relatorioFiltrado.length / ITENS_POR_PAGINA),
  );

  const relatorioPagina = useMemo(
    () =>
      relatorioFiltrado.slice(
        (paginaAtual - 1) * ITENS_POR_PAGINA,
        paginaAtual * ITENS_POR_PAGINA,
      ),
    [relatorioFiltrado, paginaAtual],
  );

  useEffect(() => setPaginaAtual(1), [pesquisa, ordenacao]);
  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas);
  }, [paginaAtual, totalPaginas]);

  const colunas = useMemo(
    () => [
      {
        accessorFn: (r) => r.nome ?? "—",
        id: "aluno",
        header: "Aluno",
      },
      {
        accessorFn: (r) => formatarMetodo(r.metodo),
        id: "metodo",
        header: "Método",
      },
      {
        accessorFn: (r) => r.data ?? "-",
        id: "data",
        header: "Data",
        cell: (info) => formatarData(info.getValue()),
      },
      {
        accessorFn: (r) => r.preco ?? "-",
        id: "valor",
        header: "Valor",
        cell: (info) => formatarMoeda(info.getValue()),
      },
    ],
    [],
  );

  const tabela = useReactTable({
    data: relatorioPagina,
    columns: colunas,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.conteudoWrapper}>
      <div className={styles.principalBox}>
        <div className={styles.divHeader}>
          <span className={`material-symbols-outlined ${styles.icon}`}>
            payments
          </span>
          <h3>Financeiro</h3>
        </div>

        <div className={styles.cards}>
          <div className={styles.cartao}>
            <div className={styles.icone}>
              <DollarSign size={22} />
            </div>
            <h3>Total no mês</h3>
            <p>{formatarMoeda(totalMesAnimado)}</p>
          </div>
          <div className={styles.cartao}>
            <div className={styles.icone}>
              <Package size={22} />
            </div>
            <h3>Armários (mês)</h3>
            <p>+ {resumoAtual.qtdArmarios ?? 0}</p>
          </div>
          <div className={styles.cartao}>
            <div className={styles.icone}>
              <TrendingUp size={22} />
            </div>
            <h3>Total acumulado</h3>
            <p>{formatarMoeda(totalGeralAnimado)}</p>
          </div>
        </div>

        <div className={styles.graficos}>
          <div className={styles.graficoBox}>
            <h4>Lucro por mês</h4>
            {totalMensal.length === 0 ? (
              <p className={styles.mensagem}>Nenhum dado disponível ainda</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={totalMensal}>
                  <CartesianGrid stroke="var(--border-glass)" />
                  <XAxis dataKey="mes" stroke="var(--text-white-soft)" />
                  <YAxis stroke="var(--text-white-soft)" />
                  <Tooltip formatter={(v) => formatarMoeda(v)} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="var(--blue)"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className={styles.graficoBox}>
            <h4>Reservas por mês</h4>
            {totalMensal.length === 0 ? (
              <p className={styles.mensagem}>Nenhum dado disponível ainda</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={totalMensal}>
                  <CartesianGrid stroke="var(--border-glass)" />
                  <XAxis dataKey="mes" stroke="var(--text-white-soft)" />
                  <YAxis stroke="var(--text-white-soft)" />
                  <Tooltip />
                  <Bar
                    dataKey="qtdArmarios"
                    fill="var(--blue)"
                    name="Reservas Armários"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={styles.inputPesquisa}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.formControl}
            placeholder="Pesquisar pagamento"
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

        <div className={styles.containerLista}>
          <div className={`${styles.linha} ${styles.titulo}`}>
            {tabela.getHeaderGroups()[0]?.headers.map((header) => (
              <span key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </span>
            ))}

            <div className={styles.filtroWrapper} ref={filtroRef}>
              <button
                type="button"
                className={styles.botaoFiltro}
                onClick={() => setFiltroAberto((v) => !v)}
                aria-label="Ordenar"
              >
                <ListFilter size={18} />
              </button>

              {filtroAberto && (
                <div className={styles.menuFiltro}>
                  <button
                    className={ordenacao === "recente" ? styles.ativo : ""}
                    onClick={() => {
                      setOrdenacao("recente");
                      setFiltroAberto(false);
                    }}
                  >
                    Mais recente
                  </button>
                  <button
                    className={ordenacao === "antigo" ? styles.ativo : ""}
                    onClick={() => {
                      setOrdenacao("antigo");
                      setFiltroAberto(false);
                    }}
                  >
                    Mais antigo
                  </button>
                  <button
                    className={ordenacao === "alfabetica" ? styles.ativo : ""}
                    onClick={() => {
                      setOrdenacao("alfabetica");
                      setFiltroAberto(false);
                    }}
                  >
                    Ordem alfabética
                  </button>
                </div>
              )}
            </div>
          </div>

          {carregando && <p className={styles.mensagem}>Carregando...</p>}
          {!carregando && relatorioFiltrado.length === 0 && (
            <p className={styles.mensagem}>Nenhum pagamento encontrado</p>
          )}

          {!carregando &&
            tabela.getRowModel().rows.map((row) => (
              <div className={styles.linha} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <span key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                ))}
              </div>
            ))}

          {totalPaginas > 1 && (
            <div className={styles.paginacaoWrapper}>
              <Pagination
                count={totalPaginas}
                page={paginaAtual}
                onChange={(_, novaPagina) => setPaginaAtual(novaPagina)}
                shape="rounded"
                size="medium"
                siblingCount={1}
                boundaryCount={1}
                classes={{ ul: "paginacaoLista" }}
              />
            </div>
          )}
        </div>
      </div>

      <a
        href="#"
        onClick={() => history.back()}
        className={`${styles.voltar} ${docked ? styles.voltarDocked : ""}`}
      >
        ← Voltar
      </a>
    </div>
  );
}