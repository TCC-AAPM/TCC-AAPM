import { createContext, useContext, useState } from "react";

const SenhaFlowContext = createContext(null);

export function SenhaFlowProvider({ children }) {
  const [emailValidado, setEmailValidado] = useState("");
  const [codigoValidado, setCodigoValidado] = useState("");

  function iniciarFluxo(email) {
    setEmailValidado(email);
    setCodigoValidado("");
  }

  function validarCodigo(codigo) {
    setCodigoValidado(codigo);
  }

  function limparFluxo() {
    setEmailValidado("");
    setCodigoValidado("");
  }

  return (
    <SenhaFlowContext.Provider
      value={{
        emailValidado,
        codigoValidado,
        iniciarFluxo,
        validarCodigo,
        limparFluxo,
      }}
    >
      {children}
    </SenhaFlowContext.Provider>
  );
}

export function useSenhaFlow() {
  const context = useContext(SenhaFlowContext);

  if (!context) {
    throw new Error("useSenhaFlow deve ser usado dentro de SenhaFlowProvider");
  }

  return context;
}
