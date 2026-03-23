// pega o token do localStorage ou sessionStorage
export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

// decodifica o token e retorna os dados do usuário
export function getUsuarioLogado() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // verifica se o token expirou
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
