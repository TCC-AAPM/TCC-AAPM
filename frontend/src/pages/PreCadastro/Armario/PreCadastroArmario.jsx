import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "/src/routes/config/api.js";
import { alertErro, alertSucesso } from "../../../components/Alerts/Alerts.jsx";
import EtapaNascimento from "./components/EtapaNascimento.jsx";
import EtapaBloqueado from "./components/EtapaBloqueado.jsx";
import EtapaMenor from "./components/EtapaMenor.jsx";
import FormularioCadastro from "./components/FormularioCadastro.jsx";
import EtapaPagamento from "./components/EtapaPagamento.jsx";

const TERMO_SITE = "S";
const TERMO_ARMARIO = "A";

function obterIdTurma(turma) {
  return turma.id ?? turma.idTurma ?? turma.Id ?? turma.IdTurma;
}

function obterNomeTurma(turma) {
  return turma.turma ?? turma.nomeTurma ?? turma.NomeTurma ?? turma.nome ?? "";
}

function obterListaDados(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.dados)) return data.dados;
  if (Array.isArray(data?.Dados)) return data.Dados;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.Data)) return data.Data;
  return [];
}

function obterIdCurso(curso) {
  return curso.id ?? curso.idCurso ?? curso.Id ?? curso.IdCurso;
}

function obterNomeCurso(curso) {
  return curso.nome ?? curso.Nome ?? curso.nomeCurso ?? curso.NomeCurso ?? "";
}

function formatarPreco(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) return "---";

  return `R$ ${numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatarCPF(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);

  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarTel(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  let r = d;

  if (r.length > 0) {
    r = r.replace(/^(\d{2})(\d)/, "($1) $2");
  }

  if (r.length > 9) {
    r = r.replace(/(\d{5})(\d)/, "$1-$2");
  }

  return r;
}

function formatarDataInput(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function validarCPF(cpf) {
  const d = cpf.replace(/\D/g, "");

  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += parseInt(d[i]) * (10 - i);
  }

  let r = (soma * 10) % 11;

  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(d[9])) return false;

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += parseInt(d[i]) * (11 - i);
  }

  r = (soma * 10) % 11;

  if (r === 10 || r === 11) r = 0;

  return r === parseInt(d[10]);
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarFormulario(form) {
  if (!form.nome.trim()) return "Informe seu nome completo.";

  if (form.nome.trim().split(/\s+/).length < 2) {
    return "Informe nome e sobrenome.";
  }

  if (!form.cpf || form.cpf.replace(/\D/g, "").length !== 11) {
    return "CPF incompleto.";
  }

  if (!validarCPF(form.cpf)) return "CPF inválido.";

  if (!form.nascimento) return "Informe sua data de nascimento.";

  if (!form.email.trim()) return "Informe seu e-mail.";

  if (!validarEmail(form.email)) return "E-mail inválido.";

  if (!form.telefone || form.telefone.replace(/\D/g, "").length < 10) {
    return "Telefone incompleto.";
  }

  if (!form.idCurso) return "Selecione um curso.";

  if (!form.idTurma) return "Selecione uma turma.";

  if (!form.idTermoSite || !form.idTermoArmario) {
    return "Não foi possível carregar os termos. Atualize a página.";
  }

  if (!form.aceitouTermoArmario) {
    return "Aceite o termo de uso do armário.";
  }

  if (!form.aceitouTermoSite) {
    return "Aceite os termos de uso do site e LGPD.";
  }

  return null;
}

export default function CadastroArmario() {
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState("nascimento");
  const [cursos, setCursos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [precos, setPrecos] = useState({});
  const [loading, setLoading] = useState(false);
  const [carregandoTermos, setCarregandoTermos] = useState(true);
  const [erroTermos, setErroTermos] = useState(false);
  const [referenciasTermos, setReferenciasTermos] = useState({
    site: null,
    armario: null,
  });

  const [form, setForm] = useState({
    nome: "",
    nomeSocial: "",
    cpf: "",
    nascimento: "",
    email: "",
    telefone: "",
    matricula: "",
    idCurso: "",
    idTurma: "",
    idTermoSite: null,
    aceitouTermoSite: false,
    idTermoArmario: null,
    aceitouTermoArmario: false,
  });

  const termoArmarioUrl = referenciasTermos.armario
    ? API_ROUTES.termos.obterPdf(referenciasTermos.armario)
    : API_ROUTES.termos.obterPdf(TERMO_ARMARIO);
  const termoSiteUrl = referenciasTermos.site
    ? API_ROUTES.termos.obterPdf(referenciasTermos.site)
    : API_ROUTES.termos.obterPdf(TERMO_SITE);
  const termoPrivacidadeUrl = "/documentos/politica-de-privacidade.pdf";

  // Carregar termos ativos
  useEffect(() => {
    async function carregarTermos() {
      try {
        setCarregandoTermos(true);
        setErroTermos(false);

        const resposta = await fetch(API_ROUTES.termos.termosAtivos);

        if (!resposta.ok) {
          throw new Error("Erro ao buscar os termos ativos.");
        }

        const data = await resposta.json();
        const lista = obterListaDados(data);

        const site = lista.find(
          (t) =>
            String(t.referencia ?? t.Referencia).toUpperCase() === TERMO_SITE,
        );

        const armario = lista.find(
          (t) =>
            String(t.referencia ?? t.Referencia).toUpperCase() ===
            TERMO_ARMARIO,
        );

        const idSite = site?.idTermo ?? site?.IdTermo;
        const idArmario = armario?.idTermo ?? armario?.IdTermo;
        const referenciaSite = site?.referencia ?? site?.Referencia;
        const referenciaArmario = armario?.referencia ?? armario?.Referencia;

        if (!idSite || !idArmario || !referenciaSite || !referenciaArmario) {
          throw new Error(
            "Não foram encontrados os termos ativos do site e do armário.",
          );
        }

        setForm((p) => ({
          ...p,
          idTermoSite: Number(idSite),
          idTermoArmario: Number(idArmario),
        }));
        setReferenciasTermos({
          site: referenciaSite,
          armario: referenciaArmario,
        });
      } catch (error) {
        console.error("Erro ao carregar termos:", error);
        setErroTermos(true);
        alertErro(error.message || "Não foi possível carregar os termos.");
      } finally {
        setCarregandoTermos(false);
      }
    }

    carregarTermos();
  }, []);

  // Voltar para o topo ao trocar de etapa
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [etapa]);

  // Carregar preços
  useEffect(() => {
    fetch(API_ROUTES.produtos.listar)
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar preços.");
        return r.json();
      })
      .then((data) => {
        const mapa = {};

        obterListaDados(data).forEach((p) => {
          mapa[p.produto ?? p.Produto] = p.preco ?? p.Preco;
        });

        setPrecos(mapa);
      })
      .catch(() => setPrecos({}));
  }, []);

  // Carregar cursos
  useEffect(() => {
    fetch(API_ROUTES.cursos.carregarCursos)
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar cursos.");
        return r.json();
      })
      .then((data) => setCursos(obterListaDados(data)))
      .catch(() => setCursos([]));
  }, []);

  // Carregar turmas conforme o curso
  useEffect(() => {
    if (!form.idCurso) {
      setTurmas([]);
      return;
    }

    fetch(API_ROUTES.turmas.porCurso(form.idCurso))
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar turmas.");
        return r.json();
      })
      .then((data) => setTurmas(obterListaDados(data)))
      .catch(() => setTurmas([]));
  }, [form.idCurso]);

  const atualizar = (campo) => (e) => {
    let val = e.target.value;

    if (campo === "cpf") val = formatarCPF(val);
    if (campo === "telefone") val = formatarTel(val);

    setForm((p) => ({ ...p, [campo]: val }));
  };

  function handleCurso(e) {
    const id = e.target.value;

    setForm((p) => ({
      ...p,
      idCurso: id,
      idTurma: "",
    }));
  }

  // Validar nascimento somente ao clicar em Continuar
  function handleNascimento() {
    const val = form.nascimento;

    if (!val) {
      alertErro("Informe sua data de nascimento.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      alertErro("Informe uma data de nascimento completa.");
      return;
    }

    const [ano, mes, dia] = val.split("-").map(Number);

    const nascimento = new Date(ano, mes - 1, dia);

    if (
      nascimento.getFullYear() !== ano ||
      nascimento.getMonth() !== mes - 1 ||
      nascimento.getDate() !== dia
    ) {
      alertErro("Informe uma data de nascimento válida.");
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    nascimento.setHours(0, 0, 0, 0);

    if (nascimento > hoje) {
      alertErro("A data de nascimento não pode ser futura.");
      return;
    }

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    if (
      hoje.getMonth() < nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() &&
        hoje.getDate() < nascimento.getDate())
    ) {
      idade--;
    }

    if (idade > 100) {
      alertErro("A idade máxima permitida é de 100 anos.");
      setForm((p) => ({ ...p, nascimento: "" }));
      return;
    }

    if (idade < 14) {
      setEtapa("bloqueado");
    } else if (idade < 18) {
      setEtapa("menor");
    } else {
      setEtapa("formulario");
    }
  }

  async function handleSubmit() {
    if (loading) return;

    if (carregandoTermos || erroTermos) {
      alertErro("Aguarde o carregamento dos termos antes de continuar.");
      return;
    }

    const erroValidacao = validarFormulario(form);

    if (erroValidacao) {
      alertErro(erroValidacao);
      return;
    }

    setLoading(true);

    const payload = {
      CPF: form.cpf.replace(/\D/g, ""),
      Nome: form.nome.trim(),
      NomeSocial: form.nomeSocial.trim() || null,
      Telefone: form.telefone.replace(/\D/g, ""),
      Email: form.email.trim(),
      Matricula: form.matricula.trim() || null,
      DataNasc: form.nascimento,
      IdCurso: Number(form.idCurso),
      IdTurma: Number(form.idTurma),

      IdTermoSite: Number(form.idTermoSite),
      AceitouTermoSite: form.aceitouTermoSite,

      IdTermoArmario: Number(form.idTermoArmario),
      AceitouTermoArmario: form.aceitouTermoArmario,
    };

    try {
      const res = await fetch(API_ROUTES.cadastro.preCadastro, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alertErro(data.mensagem || data.message || "Erro ao cadastrar.");
        return;
      }

      alertSucesso("Pré-cadastro realizado com sucesso!");
      setEtapa("pagamento");
    } catch (error) {
      console.error("Erro no pré-cadastro:", error);
      alertErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  if (etapa === "nascimento")
    return (
      <EtapaNascimento
        form={form}
        setForm={setForm}
        handleNascimento={handleNascimento}
        navigate={navigate}
        formatarDataInput={formatarDataInput}
      />
    );

  if (etapa === "bloqueado") return <EtapaBloqueado navigate={navigate} />;

  if (etapa === "menor")
    return <EtapaMenor termoArmarioUrl={termoArmarioUrl} navigate={navigate} />;

  if (etapa === "formulario")
    return (
      <FormularioCadastro
        form={form}
        cursos={cursos}
        turmas={turmas}
        atualizar={atualizar}
        handleCurso={handleCurso}
        obterIdCurso={obterIdCurso}
        obterNomeCurso={obterNomeCurso}
        obterIdTurma={obterIdTurma}
        obterNomeTurma={obterNomeTurma}
        carregandoTermos={carregandoTermos}
        erroTermos={erroTermos}
        termoArmarioUrl={termoArmarioUrl}
        termoSiteUrl={termoSiteUrl}
        termoPrivacidadeUrl={termoPrivacidadeUrl}
        setForm={setForm}
        handleSubmit={handleSubmit}
        loading={loading}
        navigate={navigate}
      />
    );

  if (etapa === "pagamento")
    return (
      <EtapaPagamento
        precos={precos}
        navigate={navigate}
        formatarPreco={formatarPreco}
      />
    );

  return null;
}
