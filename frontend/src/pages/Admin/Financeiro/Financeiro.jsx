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
import { alertErro, alertSucesso } from "../../../components/Alerts/Alerts";

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

  if (resultado?.dados && typeof resultado.dados === "object") {
    return [resultado.dados];
  }

  if (resultado && typeof resultado === "object") {
    return [resultado];
  }

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

  if (Number.isNaN(data.getTime())) return "—";

  return data.toLocaleDateString("pt-BR");
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

function normalizarDadosGrafico(resultado, camposDeValor) {
  return normalizarLista(resultado).map((item) => {
    const campoDeValor = camposDeValor.find((campo) => item?.[campo] != null);

    return {
      mes: item?.mes ?? item?.nomeMes ?? item?.label ?? "-",
      total: Number(item?.[campoDeValor] ?? 0),
    };
  });
}

function useContadorAnimado(valorFinal, duracao = 900) {
  const [valorAtual, setValorAtual] = useState(0);

  useEffect(() => {
    let inicio = null;

    function animar(timestamp) {
      if (!inicio) inicio = timestamp;

      const progresso = Math.min((timestamp - inicio) / duracao, 1);

      const facilitado = 1 - Math.pow(1 - progresso, 3);

      setValorAtual(Number(valorFinal ?? 0) * facilitado);

      if (progresso < 1) {
        requestAnimationFrame(animar);
      } else {
        setValorAtual(Number(valorFinal ?? 0));
      }
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
  const [lucroMensal, setLucroMensal] = useState([]);
  const [reservasPorMes, setReservasPorMes] = useState([]);
  const [reservasMesAtual, setReservasMesAtual] = useState(0);
  const [relatorio, setRelatorio] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [ordenacao, setOrdenacao] = useState("recente");
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [valoresEdicao, setValoresEdicao] = useState({});
  const [salvandoId, setSalvandoId] = useState(null);

  const filtroRef = useRef(null);

  useEffect(() => {
    async function carregarTudo() {
      setCarregando(true);

      try {
        const buscar = (rota) => authFetch(rota).catch(() => null);

        const [
          resTotal,
          resMensal,
          resLucroMensal,
          resReservasPorMes,
          resReservasMesAtual,
          resRelatorio,
          resProdutos,
        ] = await Promise.all([
          buscar(API_ROUTES.financeiro.total),
          buscar(API_ROUTES.financeiro.totalMensal),
          buscar(API_ROUTES.financeiro.lucroUltimos6Meses),
          buscar(API_ROUTES.reservas.reservasUltimos6Meses),
          buscar(API_ROUTES.reservas.reservasMesAtual),
          buscar(API_ROUTES.financeiro.relatorio),
          buscar(API_ROUTES.produtos.listar),
        ]);

        if (!resTotal?.ok || !resMensal?.ok || !resRelatorio?.ok) {
          throw new Error("Erro ao carregar dados financeiros.");
        }

        const dadosTotal = await resTotal.json();
        const dadosMensal = await resMensal.json();

        const dadosLucroMensal = resLucroMensal?.ok
          ? await resLucroMensal.json()
          : [];

        const dadosReservasPorMes = resReservasPorMes?.ok
          ? await resReservasPorMes.json()
          : [];

        const dadosReservasMesAtual = resReservasMesAtual?.ok
          ? await resReservasMesAtual.json()
          : null;

        const dadosRelatorio = await resRelatorio.json();

        const dadosProdutos = resProdutos?.ok ? await resProdutos.json() : [];

        setTotalGeral(dadosTotal?.dados?.valor ?? dadosTotal?.valor ?? 0);

        setTotalMensal(normalizarLista(dadosMensal));

        setLucroMensal(
          normalizarDadosGrafico(dadosLucroMensal, ["total", "valor", "lucro"]),
        );

        setReservasPorMes(
          normalizarDadosGrafico(dadosReservasPorMes, [
            "reservas",
            "quantidade",
            "total",
          ]),
        );

        const quantidadeReservas = Number(
          dadosReservasMesAtual?.dados?.quantidade ??
            dadosReservasMesAtual?.dados?.total ??
            dadosReservasMesAtual?.dados ??
            dadosReservasMesAtual?.quantidade ??
            dadosReservasMesAtual?.total ??
            0,
        );

        setReservasMesAtual(
          Number.isFinite(quantidadeReservas) ? quantidadeReservas : 0,
        );

        setRelatorio(normalizarLista(dadosRelatorio));

        const listaProdutos = normalizarLista(dadosProdutos);

        setProdutos(listaProdutos);

        const valoresIniciais = Object.fromEntries(
          listaProdutos.map((produto) => [
            produto.id,
            String(produto.preco ?? ""),
          ]),
        );

        setValoresEdicao(valoresIniciais);
      } catch (error) {
        console.error("Erro ao carregar financeiro:", error);

        setTotalGeral(0);
        setTotalMensal([]);
        setLucroMensal([]);
        setReservasPorMes([]);
        setReservasMesAtual(0);
        setRelatorio([]);
        setProdutos([]);

        alertErro("Não foi possível carregar os dados financeiros.");
      } finally {
        setCarregando(false);
      }
    }

    carregarTudo();
  }, []);

  const produtoArmario = produtos.find(
    (produto) =>
      String(produto.produto ?? "")
        .trim()
        .toUpperCase() === "A",
  );

  async function salvarPreco(idProduto) {
    const valorDigitado = valoresEdicao[idProduto] ?? "";

    const preco = Number(String(valorDigitado).replace(",", "."));

    if (!Number.isFinite(preco) || preco <= 0) {
      alertErro("Digite um preço maior que zero.");
      return;
    }

    setSalvandoId(idProduto);

    try {
      const response = await authFetch(
        API_ROUTES.financeiro.alterarPreco(idProduto),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ preco }),
        },
      );

      let resultado = null;

      try {
        resultado = await response.json();
      } catch {
        resultado = null;
      }

      if (!response.ok) {
        throw new Error(
          resultado?.mensagem || "Não foi possível atualizar o preço.",
        );
      }

      setProdutos((prev) =>
        prev.map((produto) =>
          produto.id === idProduto ? { ...produto, preco } : produto,
        ),
      );

      setValoresEdicao((prev) => ({
        ...prev,
        [idProduto]: String(preco),
      }));

      alertSucesso("Preço atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar preço:", error);

      alertErro(error.message || "Não foi possível atualizar o preço.");
    } finally {
      setSalvandoId(null);
    }
  }

  useEffect(() => {
    function fecharAoClicarFora(event) {
      if (filtroRef.current && !filtroRef.current.contains(event.target)) {
        setFiltroAberto(false);
      }
    }

    document.addEventListener("mousedown", fecharAoClicarFora);

    return () => document.removeEventListener("mousedown", fecharAoClicarFora);
  }, []);

  const resumoAtual = totalMensal[totalMensal.length - 1] ?? {};

  const totalMesAnimado = useContadorAnimado(resumoAtual.valor ?? 0);

  const totalGeralAnimado = useContadorAnimado(totalGeral);

  const reservasMesAnimado = useContadorAnimado(reservasMesAtual);

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
    }

    if (ordenacao === "antigo") {
      listaOrdenada.sort((a, b) => new Date(a.data) - new Date(b.data));
    }

    if (ordenacao === "alfabetica") {
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

  const relatorioPagina = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;

    return relatorioFiltrado.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [relatorioFiltrado, paginaAtual]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [pesquisa, ordenacao]);

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
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

        <div className={styles.cardEdicaoPrecos}>
          <h3>Editar preços</h3>

          <div className={styles.gridEdicaoPrecos}>
            {carregando ? (
              <p className={styles.mensagem}>Carregando preços...</p>
            ) : !produtoArmario ? (
              <p className={styles.mensagem}>
                Produto de armários não encontrado.
              </p>
            ) : (
              <div className={styles.itemEdicaoPreco}>
                <div className={styles.infoProduto}>
                  <strong>Armários</strong>

                  <span>
                    Preço atual: {formatarMoeda(produtoArmario.preco)}
                  </span>
                </div>

                <div className={styles.campoValor}>
                  <span className={styles.simboloMoeda} aria-hidden="true">
                    R$
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    className={styles.inputValor}
                    value={valoresEdicao[produtoArmario.id] ?? ""}
                    onChange={(event) =>
                      setValoresEdicao((prev) => ({
                        ...prev,
                        [produtoArmario.id]: event.target.value,
                      }))
                    }
                    aria-label="Novo preço dos armários"
                  />
                </div>

                <button
                  type="button"
                  className={styles.botaoSalvarPreco}
                  disabled={
                    salvandoId === produtoArmario.id ||
                    !(
                      Number(
                        String(valoresEdicao[produtoArmario.id] ?? "").replace(
                          ",",
                          ".",
                        ),
                      ) > 0
                    )
                  }
                  onClick={() => salvarPreco(produtoArmario.id)}
                >
                  {salvandoId === produtoArmario.id ? "Salvando..." : "Salvar"}
                </button>
              </div>
            )}
          </div>
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

            <p>+ {Math.round(reservasMesAnimado)}</p>
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

            {lucroMensal.length === 0 ? (
              <p className={styles.mensagem}>Nenhum dado disponível ainda</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  key={lucroMensal.length}
                  data={lucroMensal}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    stroke="var(--border-glass)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="mes"
                    stroke="var(--text-white-soft)"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    stroke="var(--text-white-soft)"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(valor) =>
                      `R$ ${Number(valor).toLocaleString("pt-BR")}`
                    }
                  />

                  <Tooltip formatter={(valor) => formatarMoeda(valor)} />

                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="var(--blue)"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "var(--blue)",
                    }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                    animationDuration={900}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className={styles.graficoBox}>
            <h4>Reservas por mês</h4>

            {reservasPorMes.length === 0 ? (
              <p className={styles.mensagem}>
                Nenhuma reserva disponível ainda
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  key={reservasPorMes.length}
                  data={reservasPorMes}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    stroke="var(--border-glass)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="mes"
                    stroke="var(--text-white-soft)"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    stroke="var(--text-white-soft)"
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(255,255,255,0.05)",
                    }}
                  />

                  <Bar
                    dataKey="total"
                    name="Reservas"
                    fill="var(--blue)"
                    radius={[5, 5, 0, 0]}
                    barSize={24}
                    isAnimationActive={true}
                    animationDuration={900}
                    animationEasing="ease-out"
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
              type="button"
              className={styles.limparPesquisa}
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
                onClick={() => setFiltroAberto((valor) => !valor)}
                aria-label="Ordenar"
              >
                <ListFilter size={18} />
              </button>

              {filtroAberto && (
                <div className={styles.menuFiltro}>
                  <button
                    type="button"
                    className={ordenacao === "recente" ? styles.ativo : ""}
                    onClick={() => {
                      setOrdenacao("recente");
                      setFiltroAberto(false);
                    }}
                  >
                    Mais recente
                  </button>

                  <button
                    type="button"
                    className={ordenacao === "antigo" ? styles.ativo : ""}
                    onClick={() => {
                      setOrdenacao("antigo");
                      setFiltroAberto(false);
                    }}
                  >
                    Mais antigo
                  </button>

                  <button
                    type="button"
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
                className="paginacaoLista"
                count={totalPaginas}
                page={paginaAtual}
                onChange={(_, novaPagina) => setPaginaAtual(novaPagina)}
                shape="rounded"
                size="medium"
                siblingCount={1}
                boundaryCount={1}
              />
            </div>
          )}
        </div>
      </div>

      <a
        href="#"
        onClick={(event) => {
          event.preventDefault();
          history.back();
        }}
        className={`${styles.voltar} ${docked ? styles.voltarDocked : ""}`}
      >
        ← Voltar
      </a>
    </div>
  );
}
