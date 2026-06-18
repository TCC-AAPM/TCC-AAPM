const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export const API_ROUTES = {
  alunos: {
    telaPrincipal: `${BASE_URL}/Alunos/me`,
    trocarSenha: `${BASE_URL}/Alunos/trocar-senha`,
    deletarConta: `${BASE_URL}/Alunos/deletar-conta`,
  },

  admin: {},

  armarios: {
    listar: `${BASE_URL}/Armarios`,
  },

  cursos: {
    carregarCursos: `${BASE_URL}/Cursos`,
  },
  
  turmas: {
    porCurso: (idCurso) => `${BASE_URL}/Turmas/por-curso/${idCurso}`,
  },

  reservas: {
    reservas: `${BASE_URL}/Reservas`,
    recadastrarReserva: `${BASE_URL}/Reservas/recadastrar`, //nao usando
    comReserva: "/api/Reservas/com-reserva"
  },

  produtos: {
    listar: `${BASE_URL}/Produtos`,
    idProdutos: `${BASE_URL}/Produtos/{idProduto}`, //nao usando
  },

  cadastro: {
    preCadastro: `${BASE_URL}/Cadastro/pre-cadastro`,
  },

  termos: {
    obterPdf: (referencia, versao = Date.now()) =>
      `${BASE_URL}/Termo/obter-pdf?referencia=${referencia}&v=${versao}`,
    verificarAceitos: `${BASE_URL}/Termo/verificar-termos-aceito`,
    criar: `${BASE_URL}/Termo/criar-termo`,
    aceitarNovos: `${BASE_URL}/Termo/aceitar-novos-termos`,
  },
};
