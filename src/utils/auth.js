export { API_ROUTES } from "../routes/config/api.js";

export function getUsuarioLogado() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp && Date.now() / 1000 > payload.exp) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return null;
    }

    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const id =
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    return { perfil: role, id };
  } catch {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    return null;
  }
}

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  }

  return res;
}
