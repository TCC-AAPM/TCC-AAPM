export function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigito = (base) => {
    let soma = 0;
    let peso = base.length + 1;

    for (const num of base) {
      soma += Number(num) * peso--;
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const base = cpf.slice(0, 9);
  const digito1 = calcularDigito(base);
  const digito2 = calcularDigito(base + digito1);

  return cpf === base + digito1.toString() + digito2.toString();
}