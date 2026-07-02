const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export const API_ROUTES = {
  alunos: {
    telaPrincipal: `${BASE_URL}/Alunos/me`,
    trocarSenha: `${BASE_URL}/Usuario/trocar-senha`,
    excluirConta: `${BASE_URL}/Alunos/excluir-conta`,
    buscarPorCPF: `${BASE_URL}/Alunos/buscar-por-cpf`,
  },

  admin: {},

  armarios: {
    listar: `${BASE_URL}/Armarios`,
    atualizar: (numeroArmario) => `${BASE_URL}/Armarios/${numeroArmario}`,
    atualizarEstado: (numeroArmario) =>
      `${BASE_URL}/Armarios/estado/${numeroArmario}`,
  },

  cursos: {
    carregarCursos: `${BASE_URL}/Cursos`,
  },

  turmas: {
    porCurso: (idCurso) => `${BASE_URL}/Turmas/por-curso/${idCurso}`,
  },

  reservas: {
    cadastrarArmario: `${BASE_URL}/Reservas/cadastro-armario`,
    recadastrarArmario: `${BASE_URL}/Reservas/recadastrar-armario`,
    comReserva: `${BASE_URL}/Reservas/com-reserva`,
    historico: `${BASE_URL}/Reservas/historico-reserva`,
  },

  produtos: {
    listar: `${BASE_URL}/Produtos`,
  },

  cadastro: {
    preCadastro: `${BASE_URL}/Cadastro/pre-cadastro`,
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