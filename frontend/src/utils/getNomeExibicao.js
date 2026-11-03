export function getNomeExibicao(pessoa, fallback = "") {
  if (!pessoa) return fallback;

  const nomeSocial =
    pessoa.nomeSocial ??
    pessoa.NomeSocial ??
    pessoa.nomeSocialAluno ??
    pessoa.NomeSocialAluno;

  if (typeof nomeSocial === "string" && nomeSocial.trim()) {
    return nomeSocial.trim();
  }

  const nome =
    pessoa.nome ??
    pessoa.Nome ??
    pessoa.nomeAluno ??
    pessoa.NomeAluno ??
    pessoa.nomeUsuario ??
    pessoa.NomeUsuario;

  if (typeof nome === "string" && nome.trim()) {
    return nome.trim();
  }

  return fallback;
}
