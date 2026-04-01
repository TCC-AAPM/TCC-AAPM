export function getUsuarioLogado() {
  const token = localStorage.getItem("token") ;
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp && Date.now() / 1000 > payload.exp) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return null;
    }

    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const id = payload["Id"];

    return { perfil: role, id };
  } catch {
    return null;
  }
}