import { useState } from "react";

const estilos = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pagina {
    min-height: 100vh;
    background: #1a4fd6;
    font-family: 'Outfit', sans-serif;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .onda {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
  }

  /* Navbar */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    position: relative;
    z-index: 2;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav-logo-box {
    width: 38px;
    height: 38px;
    background: rgba(255,255,255,0.15);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.25);
  }

  .nav-logo-texto {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.25;
  }

  .nav-logo-texto span {
    display: block;
    font-size: 11px;
    opacity: 0.6;
    font-weight: 300;
  }

  .nav-btn {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.35);
    color: #fff;
    padding: 8px 22px;
    border-radius: 8px;
    font-size: 13px;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
  }

  .nav-btn:hover { background: rgba(255,255,255,0.1); }

  /* Corpo */
  .corpo {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6rem;
    padding: 2rem 6rem 4rem;
    position: relative;
    z-index: 1;
  }

  /* Esquerda */
  .esquerda { flex: 0 0 220px; }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    font-size: 12px;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 1.4rem;
  }

  .tag-ponto {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #7effc4;
    flex-shrink: 0;
  }

  .esquerda h1 {
    color: #fff;
    font-size: 2.2rem;
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 0.8rem;
  }

  .esquerda h1 em {
    font-style: normal;
    color: rgba(255,255,255,0.45);
  }

  .esquerda p {
    color: rgba(255,255,255,0.55);
    font-size: 13.5px;
    line-height: 1.65;
    margin-bottom: 2rem;
  }

  .passos { display: flex; flex-direction: column; }

  .passo {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 13px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .passo:last-child { border-bottom: none; }

  .passo-num {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .passo-num.ativo    { background: #fff; color: #1848d0; }
  .passo-num.pendente { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.35); }

  .passo-info strong { display: block; color: #fff; font-size: 13px; font-weight: 500; }
  .passo-info span   { font-size: 12px; color: rgba(255,255,255,0.4); }

  /* Card */
  .card {
    background: #1e3fa8;
    border-radius: 16px;
    padding: 2.2rem 2.5rem;
    width: 100%;
    max-width: 460px;
  }

  .separador {
    color: rgba(255,255,255,0.35);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin: 1.2rem 0 0.75rem;
  }

  .separador:first-child { margin-top: 0; }

  .campo { margin-bottom: 0.7rem; }

  .campo input,
  .campo select {
    width: 100%;
    background: #2850c8;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    padding: 12px 15px;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
    -webkit-appearance: none;
  }

  .campo input::placeholder { color: rgba(255,255,255,0.3); }
  .campo input:focus,
  .campo select:focus { border-color: rgba(255,255,255,0.5); }
  .campo select option { background: #1e3fa8; }

  .linha {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.7rem;
  }

  .btn-principal {
    width: 100%;
    margin-top: 1.4rem;
    padding: 13px;
    background: #3b5de8;
    border: none;
    border-radius: 9px;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-principal:hover { opacity: 0.88; }

  .rodape-card {
    margin-top: 1.2rem;
    text-align: center;
  }

  .rodape-card span {
    display: block;
    color: rgba(255,255,255,0.4);
    font-size: 13px;
    margin-bottom: 0.6rem;
  }

  .btn-secundario {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 8px;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    padding: 8px 20px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-secundario:hover { background: rgba(255,255,255,0.08); }

  .footer-texto {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.3);
    font-size: 12px;
    white-space: nowrap;
    z-index: 1;
  }
`;

function formatarCPF(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarTel(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  let r = d;
  if (r.length > 0) r = r.replace(/^(\d{2})(\d)/, "($1) $2");
  if (r.length > 9) r = r.replace(/(\d{5})(\d)/, "$1-$2");
  return r;
}

const cursos = [
  "Desenvolvimento de Sistemas",
  "Logística",
  "Administração",
  "Eletrotécnica",
  "Mecânica",
  "Outro",
];

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "", nomeSocial: "", cpf: "",
    nascimento: "", email: "", telefone: "",
    curso: "", turma: "",
  });

  const atualizar = (campo) => (e) => {
    let val = e.target.value;
    if (campo === "cpf") val = formatarCPF(val);
    if (campo === "telefone") val = formatarTel(val);
    setForm((p) => ({ ...p, [campo]: val }));
  };

  return (
    <>
      <style>{estilos}</style>
      <div className="pagina">

        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-logo">
            <div className="nav-logo-box">AA</div>
            <div className="nav-logo-texto">
              AAPM
              <span>SENAI Osasco</span>
            </div>
          </div>
        </nav>

        <div className="corpo">

          {/* Esquerda */}
          <aside className="esquerda">
            <div className="tag">
              <div className="tag-ponto" />
              Cadastro de associado
            </div>
            <h1>Seus <em>dados</em><br />pessoais</h1>
            <p>Preencha as informações ao lado para contratar o serviço. Rápido e sem burocracia.</p>

            <div className="passos">
              <div className="passo">
                <div className="passo-num ativo">1</div>
                <div className="passo-info">
                  <strong>Dados pessoais</strong>
                  <span>Você está aqui</span>
                </div>
              </div>
              <div className="passo">
                <div className="passo-num pendente">2</div>
                <div className="passo-info">
                  <strong>Escolha do plano</strong>
                  <span>Armário ou estacionamento</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Card */}
          <div className="card">

            <div className="separador">Identificação</div>

            <div className="campo">
              <input type="text" placeholder="Nome completo"
                value={form.nome} onChange={atualizar("nome")} required />
            </div>
            <div className="campo">
              <input type="text" placeholder="Nome social (opcional)"
                value={form.nomeSocial} onChange={atualizar("nomeSocial")} />
            </div>
            <div className="linha">
              <div className="campo">
                <input type="text" placeholder="CPF"
                  value={form.cpf} onChange={atualizar("cpf")} maxLength={14} required />
              </div>
              <div className="campo">
                <input type="date"
                  value={form.nascimento} onChange={atualizar("nascimento")} required />
              </div>
            </div>

            <div className="separador">Contato</div>

            <div className="campo">
              <input type="email" placeholder="E-mail"
                value={form.email} onChange={atualizar("email")} required />
            </div>
            <div className="campo">
              <input type="tel" placeholder="Telefone"
                value={form.telefone} onChange={atualizar("telefone")} maxLength={15} required />
            </div>

            <div className="separador">Escola</div>

            <div className="linha">
              <div className="campo">
                <select value={form.curso} onChange={atualizar("curso")} required>
                  <option value="">Curso</option>
                  {cursos.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="campo">
                <input type="text" placeholder="Turma (ex: DS3A)"
                  value={form.turma} onChange={atualizar("turma")} required />
              </div>
            </div>

            <button className="btn-principal">Continuar →</button>

            <div className="rodape-card">
              <span>Já possui cadastro?</span>
              <button className="btn-secundario">Entrar</button>
            </div>
          </div>
        </div>

        <svg className="onda" viewBox="0 0 1440 180" xmlns="http://www.w3.org/2000/svg">
          <path fill="rgba(255,255,255,0.06)" d="M0,100 C360,180 1080,20 1440,100 L1440,180 L0,180 Z"/>
          <path fill="rgba(255,255,255,0.04)" d="M0,130 C400,60 1100,160 1440,80 L1440,180 L0,180 Z"/>
        </svg>

        <p className="footer-texto">Desenvolvido por Isabella Lopreti & Gabriel Duarte • © 2026</p>
      </div>
    </>
  );
}