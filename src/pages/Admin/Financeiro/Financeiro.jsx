// TODO: ajustar endpoints financeiro.resumoMensal e financeiro.listarPagamentos quando o backend estiver pronto (rotas provisórias).
import { useEffect, useState, useMemo } from "react";
import { Pagination } from "@mui/material";
import {
  Search,
  X,
  DollarSign,
  Package,
  Motorbike,
  TrendingUp,
} from "lucide-react";
import { authFetch, API_ROUTES } from "../../../utils/auth";
import {
  alertConfirmar,
  alertSucesso,
  alertErro,
} from "../../../components/Alerts/Alerts";
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
  return [];
}

function lerIdProduto(produto) {
  return produto.id ?? produto.idProduto ?? produto.produtoId;
}

function lerNomeProduto(produto) {
  return produto.nome ?? produto.produto ?? produto.descricao ?? "Produto";
}

function lerPrecoProduto(produto) {
  return Number(produto.preco ?? produto.valor ?? produto.precoAtual ?? 0);
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

function formatarNomeMensalidade(nome) {
  const nomes = {
    qtdArmarios: "Armário",
    qtdEstacionamento: "Estacionamento",
    A: "Armário",
    E: "Estacionamento",
  };

  return nomes[nome] ?? nome;
}

export default function Financeiro() {
  const docked = useDockButton();
  const [produtos, setProdutos] = useState([]);
  const [precos, setPrecos] = useState({});
  const [salvandoPreco, setSalvandoPreco] = useState(null);
  const [resumoMensal, setResumoMensal] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [carregandoPagamentos, setCarregandoPagamentos] = useState(true);

  async function carregarProdutos() {
    setCarregandoProdutos(true);
    try {
      const res = await authFetch(API_ROUTES.produtos.listar);
      const resultado = await res.json();
      const lista = normalizarLista(resultado);
      setProdutos(lista);
      setPrecos(
        lista.reduce((acc, produto) => {
          acc[lerIdProduto(produto)] = lerPrecoProduto(produto);
          return acc;
        }, {}),
      );
    } catch {
      setProdutos([]);
    } finally {
      setCarregandoProdutos(false);
    }
  }

  async function carregarResumoMensal() {
    try {
      const res = await authFetch(API_ROUTES.financeiro.resumoMensal);
      if (!res.ok) throw new Error("Resumo indisponível");
      const resultado = await res.json();
      setResumoMensal(normalizarLista(resultado));
    } catch {
      setResumoMensal([]);
    }
  }

  async function carregarPagamentos() {
    setCarregandoPagamentos(true);
    try {
      const res = await authFetch(API_ROUTES.financeiro.listarPagamentos);
      if (!res.ok) throw new Error("Pagamentos indisponíveis");
      const resultado = await res.json();
      setPagamentos(normalizarLista(resultado));
    } catch {
      setPagamentos([]);
    } finally {
      setCarregandoPagamentos(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
    carregarResumoMensal();
    carregarPagamentos();
  }, []);

  async function salvarPreco(produto) {
    const id = lerIdProduto(produto);
    const nome = lerNomeProduto(produto);
    const novoPreco = Number(precos[id]);

    if (!id || Number.isNaN(novoPreco) || novoPreco <= 0) {
      alertErro("Informe um preço válido.");
      return;
    }

    const confirmado = await alertConfirmar(
      `Alterar preço de "${nome}" para ${formatarMoeda(novoPreco)}?`,
    );
    if (!confirmado) return;

    setSalvandoPreco(id);
    try {
      const res = await authFetch(API_ROUTES.produtos.alterarPreco(id), {
        method: "PUT",
        body: JSON.stringify({ preco: novoPreco }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.sucesso === false) {
        alertErro(data.mensagem ?? "Erro ao alterar preço.");
        return;
      }

      alertSucesso(data.mensagem ?? "Preço atualizado com sucesso.");
      carregarProdutos();
    } catch {
      alertErro("Erro ao alterar preço.");
    } finally {
      setSalvandoPreco(null);
    }
  }

  function formatarNomeMensalidade(nome) {
    const nomes = {
      qtdArmarios: "Reservas Armários",
      qtdEstacionamento: "Vagas Estacionamento",
      A: "Mensalidade Armários",
      E: "Mensalidade Estacionamento",
    };

    return nomes[nome] ?? nome;
  }

  const resumoAtual = resumoMensal[resumoMensal.length - 1] ?? {};
  const totalPeriodo = resumoMensal.reduce(
    (total, item) => total + Number(item.total ?? 0),
    0,
  );

  const pagamentosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    if (!termo) return pagamentos;

    return pagamentos.filter((pagamento) =>
      [
        pagamento.aluno,
        pagamento.nomeAluno,
        pagamento.produto,
        pagamento.nomeProduto,
        pagamento.metodo,
        pagamento.metodoPagamento,
      ]
        .filter(Boolean)
        .some((valor) => String(valor).toLowerCase().includes(termo)),
    );
  }, [pagamentos, pesquisa]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(pagamentosFiltrados.length / ITENS_POR_PAGINA),
  );

  const pagamentosPagina = useMemo(
    () =>
      pagamentosFiltrados.slice(
        (paginaAtual - 1) * ITENS_POR_PAGINA,
        paginaAtual * ITENS_POR_PAGINA,
      ),
    [pagamentosFiltrados, paginaAtual],
  );

  useEffect(() => {
    setPaginaAtual(1);
  }, [pesquisa]);

  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas);
  }, [paginaAtual, totalPaginas]);

  const colunas = useMemo(
    () => [
      {
        accessorFn: (row) => row.aluno ?? row.nomeAluno ?? "—",
        id: "aluno",
        header: "Aluno",
      },
      {
        accessorFn: (row) => row.produto ?? row.nomeProduto ?? "—",
        id: "produto",
        header: "Produto",
      },
      {
        accessorFn: (row) => row.metodo ?? row.metodoPagamento ?? "—",
        id: "metodo",
        header: "Método",
      },
      {
        accessorFn: (row) => row.data ?? row.dataPagamento ?? row.criadoEm,
        id: "data",
        header: "Data",
        cell: (info) => formatarData(info.getValue()),
      },
      {
        accessorFn: (row) => row.valor ?? row.preco ?? row.total,
        id: "valor",
        header: "Valor",
        cell: (info) => formatarMoeda(info.getValue()),
      },
    ],
    [],
  );

  const tabela = useReactTable({
    data: pagamentosPagina,
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

        <div className={styles.containerLista}>
          <h4>Editar preços</h4>
          {carregandoProdutos && (
            <p className={styles.mensagem}>Carregando...</p>
          )}

          {!carregandoProdutos && produtos.length === 0 && (
            <p className={styles.mensagem}>Nenhum produto encontrado</p>
          )}

          <div className={styles.cardsPrecos}>
            {produtos.map((produto) => {
              const id = lerIdProduto(produto);
              const nome = lerNomeProduto(produto);

              return (
                <div className={styles.cardPreco} key={id}>
                  <div>
                    <strong>{formatarNomeMensalidade(nome)}</strong>
                    <span>
                      Preço atual: {formatarMoeda(lerPrecoProduto(produto))}
                    </span>
                  </div>
                  <input
                    className={styles.formControl}
                    type="number"
                    min="0"
                    step="0.01"
                    value={precos[id] ?? ""}
                    onChange={(e) =>
                      setPrecos((atual) => ({ ...atual, [id]: e.target.value }))
                    }
                  />
                  <button
                    className={styles.btnSalvar}
                    type="button"
                    onClick={() => salvarPreco(produto)}
                    disabled={salvandoPreco === id}
                  >
                    {salvandoPreco === id ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.cards}>
          <div className={styles.cartao}>
            <div className={styles.icone}>
              <DollarSign size={22} />
            </div>
            <h3>Total no mês</h3>
            <p>{formatarMoeda(resumoAtual.total)}</p>
          </div>

          <div className={styles.cartao}>
            <div className={styles.icone}>
              <Package size={22} />
            </div>
            <h3>Armários (mês)</h3>
            <p>{resumoAtual.qtdArmarios ?? 0}</p>
          </div>

          <div className={styles.cartao}>
            <div className={styles.icone}>
              <Motorbike size={22} />
            </div>
            <h3>Estacionamento (mês)</h3>
            <p>{resumoAtual.qtdEstacionamento ?? 0}</p>
          </div>

          <div className={styles.cartao}>
            <div className={styles.icone}>
              <TrendingUp size={22} />
            </div>
            <h3>Acumulado no período</h3>
            <p>{formatarMoeda(totalPeriodo)}</p>
          </div>
        </div>

        <div className={styles.graficos}>
          <div className={styles.graficoBox}>
            <h4>Lucro por mês</h4>
            {resumoMensal.length === 0 ? (
              <p className={styles.mensagem}>Nenhum dado disponível ainda</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={resumoMensal}>
                  <CartesianGrid stroke="var(--border-glass)" />
                  <XAxis dataKey="mes" stroke="var(--text-white-soft)" />
                  <YAxis stroke="var(--text-white-soft)" />
                  <Tooltip formatter={(valor) => formatarMoeda(valor)} />
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
            <h4>Mensalidades por tipo</h4>
            {resumoMensal.length === 0 ? (
              <p className={styles.mensagem}>Nenhum dado disponível ainda</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={resumoMensal}>
                  <CartesianGrid stroke="var(--border-glass)" />
                  <XAxis dataKey="mes" stroke="var(--text-white-soft)" />
                  <YAxis stroke="var(--text-white-soft)" />
                  <Tooltip
                    formatter={(valor, nome) => [
                      valor,
                      formatarNomeMensalidade(nome),
                    ]}
                  />
                  <Bar
                    dataKey="qtdArmarios"
                    fill="var(--blue)"
                    name="Reservas Armários"
                  />
                  <Bar
                    dataKey="qtdEstacionamento"
                    fill="var(--text-footer-support)"
                    name="Vagas Estacionamento"
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
          </div>

          {carregandoPagamentos && (
            <p className={styles.mensagem}>Carregando...</p>
          )}

          {!carregandoPagamentos && pagamentosFiltrados.length === 0 && (
            <p className={styles.mensagem}>Nenhum pagamento encontrado</p>
          )}

          {!carregandoPagamentos &&
            tabela.getRowModel().rows.map((row) => (
              <div className={styles.linha} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <span key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                ))}
              </div>
            ))}
        </div>

        {totalPaginas > 1 && (
          <div className="paginacao">
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
