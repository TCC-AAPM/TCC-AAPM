const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export const API_ROUTES = {
  alunos: {
    telaPrincipal: `${BASE_URL}/Alunos/me`,
    trocarSenha: `${BASE_URL}/Alunos/trocar-senha`,
    deletarConta: `${BASE_URL}/Alunos/deletar-conta`,
  },

  admin: {
  },

  armarios: {
    listar: `${BASE_URL}/Armarios`,
    comReserva: `${BASE_URL}/Armarios/com-reserva`,
  },

  cursos: {
    carregarCursos: `${BASE_URL}/Cursos`,
  },

  reservas : {
    reservas: `${BASE_URL}/Reservas`,
    recadastrarReserva: `${BASE_URL}/Reservas/recadastrar`, //nao usando
  },

  produtos: {
    listar: `${BASE_URL}/Produtos`,
    idProdutos: `${BASE_URL}/Produtos/{idProduto}`, //nao usando
  }
};
