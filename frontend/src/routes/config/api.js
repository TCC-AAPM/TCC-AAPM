const BASE_URL = "https://tcc-aapm.onrender.com/api";

export const API_ROUTES = {
  login: `${BASE_URL}/Login`,

  alunos: {
    telaPrincipal: `${BASE_URL}/Alunos/me`,
    trocarSenha: `${BASE_URL}/Usuario/trocar-senha`,
    excluirConta: `${BASE_URL}/Alunos/excluir-conta`,
    buscarPorCPF: `${BASE_URL}/Alunos/buscar-por-cpf`,
    editar: (id) => `${BASE_URL}/Alunos/${id}`,
  },

  admin: {},

  armarios: {
    listar: `${BASE_URL}/Armarios`,
    atualizar: (numeroArmario) => `${BASE_URL}/Armarios/${numeroArmario}`,
    atualizarEstado: (numeroArmario) =>
      `${BASE_URL}/Armarios/estado/${numeroArmario}`,
  },

  configReserva: {
    obterDataFimSemestre: `${BASE_URL}/ConfigReserva`,
    alterarDataFimSemestre: `${BASE_URL}/ConfigReserva/data-fim-semestre`,
  },

  cursos: {
    carregarCursos: `${BASE_URL}/Cursos`,
    criar: `${BASE_URL}/Cursos`,
    editar: (id) => `${BASE_URL}/Cursos/${id}`,
    deletar: (id) => `${BASE_URL}/Cursos/${id}`,
  },

  turmas: {
    listar: `${BASE_URL}/Turmas`,
    porCurso: (idCurso) => `${BASE_URL}/Turmas/por-curso/${idCurso}`,
    criar: `${BASE_URL}/Turmas`,
    editar: (id) => `${BASE_URL}/Turmas/${id}`,
    deletar: (id) => `${BASE_URL}/Turmas/${id}`,
  },

  financeiro: {
    total: `${BASE_URL}/Financeiro/total`,
    totalMensal: `${BASE_URL}/Financeiro/total-mensal`,
    relatorio: `${BASE_URL}/Financeiro/relatorio`,
    lucroUltimos6Meses: `${BASE_URL}/Financeiro/lucro-ultimos-6-meses`,
    alterarPreco: (id) => `${BASE_URL}/Financeiro/${id}`,
  },

  reservas: {
    cadastrarArmario: `${BASE_URL}/Reservas/cadastro-armario`,
    recadastrarArmario: `${BASE_URL}/Reservas/recadastrar-armario`,
    comReserva: `${BASE_URL}/Reservas/com-reserva`,
    historico: `${BASE_URL}/Reservas/historico-reserva`,
    transferir: `${BASE_URL}/Reservas/transferir`,
    excluir: (numeroArmario) => `${BASE_URL}/Reservas/${numeroArmario}`,
    reservasUltimos6Meses: `${BASE_URL}/Reservas/reservas-ultimos-6-meses`,
    reservasMesAtual: `${BASE_URL}/Reservas/reservas-mes`,
  },

  produtos: {
    listar: `${BASE_URL}/Produtos`,
  },

  notificacoes: {
    listarNotificacoes: `${BASE_URL}/Notificacao`,
    notificacoesNaoLidas: `${BASE_URL}/Notificacao/nao-lidas`,
    listarHistorico: `${BASE_URL}/Notificacao/lista-notificacoes`,
    notificacoesLer: `${BASE_URL}/Notificacao/ler-notificacao`,
    notificacoesLerTodas: `${BASE_URL}/Notificacao/ler-todas-notificacoes`,
    alterarStatus: (idNotificacao) =>
      `${BASE_URL}/Notificacao/alterar-status/${idNotificacao}`,
    historico: (idNotificacao) =>
      `${BASE_URL}/Notificacao/${idNotificacao}/historico-notificacao`,
  },

  cadastro: {
    preCadastro: `${BASE_URL}/Cadastro/pre-cadastro`,
  },

  senha: {
    esqueciSenha: `${BASE_URL}/EsqueciSenha`,
    verificarCodigo: `${BASE_URL}/EsqueciSenha/verificar-codigo`,
    resetarSenha: `${BASE_URL}/EsqueciSenha/resetar-senha`,
  },

  termos: {
    obterPdf: (referencia, versao = Date.now()) =>
      `${BASE_URL}/Termo/obter-pdf?referencia=${referencia}&v=${versao}`,
    verificarAceitos: `${BASE_URL}/Termo/verificar-termos-aceito`,
    termosAtivos: `${BASE_URL}/Termo/termos-ativos`,
    criar: `${BASE_URL}/Termo/criar-termo`,
    aceitarNovos: `${BASE_URL}/Termo/aceitar-novos-termos`,
  },
};
