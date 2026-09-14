export function getLogoDestino(pathname) {
  if (pathname.startsWith("/admin")) return "/admin/armarios";
  if (pathname.startsWith("/usuario")) return "/usuario/tela-principal";

  return "/";
}
