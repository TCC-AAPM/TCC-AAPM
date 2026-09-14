# 🔷 API — Gerenciamento da AAPM

<p align="center">
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/C%23-10-239120?style=for-the-badge&logo=csharp&logoColor=white" />
  <img src="https://img.shields.io/badge/ASP.NET%20Core-Web%20API-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" />
  <img src="https://img.shields.io/badge/MariaDB-Database-003545?style=for-the-badge&logo=mariadb&logoColor=white" />
  <img src="https://img.shields.io/badge/Entity%20Framework-Core-68217A?style=for-the-badge&logo=.net&logoColor=white" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
</p>

<p align="center">
  API REST desenvolvida para o sistema de <strong>Gerenciamento da AAPM</strong>,
  responsável pelo back-end, autenticação, regras de negócio e comunicação com o banco de dados.
</p>

---

## 📌 Sobre o projeto

O **Gerenciamento da AAPM** é um sistema desenvolvido como parte de um **Trabalho de Conclusão de Curso (TCC)**.

Esta API representa a camada de **Back-end** da aplicação, sendo responsável por disponibilizar os recursos necessários para o funcionamento do sistema.

A API foi desenvolvida utilizando **ASP.NET Core Web API**, com uma estrutura organizada em Controllers, Services, Models e DTOs.

Entre suas principais responsabilidades estão:

- Autenticação e autorização de usuários;
- Gerenciamento de alunos;
- Gerenciamento de armários;
- Controle de reservas;
- Gerenciamento de termos;
- Gerenciamento de cursos e turmas;
- Recuperação de senha por e-mail;
- Comunicação com o banco de dados;
- Aplicação das regras de negócio.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| **C#** | Linguagem principal |
| **.NET 10** | Framework da aplicação |
| **ASP.NET Core** | Desenvolvimento da API REST |
| **Entity Framework Core** | ORM e acesso ao banco |
| **MariaDB** | Banco de dados |
| **Pomelo.EntityFrameworkCore.MySql** | Provedor do Entity Framework para MariaDB/MySQL |
| **JWT** | Autenticação e autorização |
| **Swagger / OpenAPI** | Documentação e testes da API |
| **Git / GitHub** | Versionamento |

---

## 🏗️ Arquitetura

A API utiliza uma arquitetura baseada na separação de responsabilidades:

```text
┌─────────────────────────────┐
│          Front-end          │
│      React + TypeScript     │
└──────────────┬──────────────┘
               │
               │ HTTP / JSON
               ▼
┌─────────────────────────────┐
│           API               │
│       ASP.NET Core          │
├─────────────────────────────┤
│        Controllers          │
├─────────────────────────────┤
│          Services           │
├─────────────────────────────┤
│     Entity Framework Core   │
├─────────────────────────────┤
│           Models            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           MariaDB           │
└─────────────────────────────┘
```

---

## 📂 Estrutura do projeto

```text
API/
│
├── Controllers/
│   ├── AdminController.cs
│   ├── AlunoController.cs
│   ├── ArmarioController.cs
│   ├── AuthController.cs
│   ├── CadastroController.cs
│   ├── CursoController.cs
│   ├── ReservaController.cs
│   ├── TermoController.cs
│   ├── TurmaController.cs
│   └── UsuarioController.cs
│
├── Data/
│   └── AppDbContext.cs
│
├── DTOs/
│   ├── Request/
│   └── Response/
│
├── Models/
│
├── Services/
│   ├── AdminService.cs
│   ├── AlunoService.cs
│   ├── ArmarioService.cs
│   ├── AuthService.cs
│   ├── CadastroService.cs
│   ├── CursoService.cs
│   ├── ReservaService.cs
│   ├── TermoService.cs
│   ├── TurmaService.cs
│   └── UsuarioService.cs
│
├── Settings/
│   └── EmailSettings.cs
│
├── Migrations/
│
├── Properties/
│
├── Program.cs
├── appsettings.json
└── API.csproj
```

---

# 🚀 Funcionalidades

## 👤 Usuários

- Cadastro de usuários;
- Login;
- Autenticação utilizando JWT;
- Autorização;
- Consulta de perfil;
- Atualização de informações;
- Recuperação de senha;
- Validação de dados.

## 🎓 Alunos

- Cadastro de alunos;
- Consulta de alunos;
- Atualização de informações;
- Exclusão de registros;
- Associação com turmas.

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** para proteger os endpoints que necessitam de autenticação.

Após realizar o login, o usuário recebe um token de acesso.

O token deve ser enviado nas requisições protegidas através do cabeçalho:

```http
Authorization: Bearer SEU_TOKEN
```

## 🔒 Armários

O sistema permite o gerenciamento dos armários disponibilizados pela AAPM.

Principais operações:

- Listagem de armários;
- Consulta de disponibilidade;
- Controle de ocupação;
- Reservas;
- Validação de utilização.

## 📅 Reservas

O módulo de reservas é responsável pelo controle das reservas realizadas pelos usuários.

Funcionalidades:

- Criar reserva;
- Consultar reserva;
- Validar disponibilidade;
- Controlar período de utilização;
- Cancelar reservas quando aplicável.

## 📄 Termos

A API realiza o gerenciamento dos termos de utilização do sistema.

São contemplados termos relacionados a:

- 🌐 Sistema / site;
- 🔒 Armários;
- 🚗 Estacionamento.

Também existe o controle de aceite dos termos pelos usuários.

## 📚 Cursos e turmas

A API possui recursos relacionados ao gerenciamento acadêmico, permitindo o controle de:

- Cursos;
- Turmas;
- Alunos;
- Relacionamentos entre alunos e turmas.

---

# 📖 Documentação da API

A API utiliza **Swagger / OpenAPI** para disponibilizar sua documentação.

Após executar o projeto localmente, acesse:

```text
http://localhost:XXXX/swagger
```

O Swagger permite:

- Visualizar os endpoints;
- Consultar parâmetros;
- Visualizar modelos de requisição;
- Visualizar modelos de resposta;
- Testar requisições;
- Realizar autenticação utilizando JWT.

---

# ⚙️ Como executar o projeto

## 1. Pré-requisitos

Antes de executar o projeto, certifique-se de possuir instalado:

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0);
- MariaDB;
- Git.

---

## 2. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd API
```

---

## 3. Restaure as dependências

```bash
dotnet restore
```

---

## 4. Configure o banco de dados

A aplicação utiliza **MariaDB**.

A connection string deve ser configurada de forma segura, utilizando **User Secrets** ou variáveis de ambiente.

Exemplo:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=nome_do_banco;User=root;Password=SUA_SENHA;"
  }
}
```

> ⚠️ Não publique credenciais reais no GitHub.

---

## 5. Configure o JWT

Exemplo:

```json
{
  "Jwt": {
    "Key": "SUA_CHAVE_SECRETA"
  }
}
```

A chave real deve permanecer protegida através de User Secrets ou variáveis de ambiente.

---

## 6. Configure o serviço de e-mail

O sistema utiliza um serviço de e-mail para funcionalidades como recuperação de senha.

As credenciais devem ser configuradas através de variáveis de ambiente ou User Secrets.

Exemplo:

```text
EmailSettings__Email
EmailSettings__Password
```

---

## 7. Aplicar as migrations

Para atualizar a estrutura do banco de dados:

```bash
dotnet ef database update
```

---

## 8. Executar a API

```bash
dotnet run
```

Depois, acesse o Swagger:

```text
http://localhost:XXXX/swagger
```

---

# 🔑 Segurança

A API possui mecanismos para proteger os recursos do sistema.

Entre eles:

- Autenticação baseada em JWT;
- Autorização de usuários;
- Proteção de endpoints;
- Validação das requisições;
- Separação entre DTOs e entidades;
- Armazenamento seguro de credenciais;
- Controle de acesso aos recursos.

### ⚠️ Informações que nunca devem ser publicadas

```text
❌ Senha do banco de dados
❌ Connection String real
❌ Chave JWT
❌ Senha de e-mail
❌ Tokens
❌ API Keys
❌ Outras credenciais privadas
```

---

# 🗄️ Banco de dados

O projeto utiliza **MariaDB** como banco de dados.

```text
ASP.NET Core
      │
      │ Entity Framework Core
      ▼
   MariaDB
```

O acesso ao banco é realizado utilizando **Entity Framework Core** e o provedor compatível com MariaDB/MySQL.

As migrations são utilizadas para controlar a evolução da estrutura do banco de dados.

---

# 🔄 Comunicação com o Front-end

A API foi desenvolvida para ser consumida pelo front-end do sistema.

```text
┌───────────────┐
│   Front-end   │
│ React + TS    │
└───────┬───────┘
        │
        │ HTTP / JSON
        ▼
┌───────────────┐
│    API AAPM   │
│ ASP.NET Core  │
└───────┬───────┘
        │
        │ Entity Framework Core
        ▼
┌───────────────┐
│    MariaDB    │
└───────────────┘
```

Os dados são enviados e recebidos principalmente no formato **JSON**.

Exemplo de resposta padrão:

```json
{
  "sucesso": true,
  "mensagem": null,
  "dados": {},
  "statusCode": 200
}
```

---

# 📡 Principais módulos

```text
/api/auth
/api/usuarios
/api/alunos
/api/armarios
/api/reservas
/api/termos
/api/cursos
/api/turmas
/api/admin
```

> Os endpoints podem sofrer alterações conforme a evolução do projeto.

---

# 📊 Status do projeto

<p align="center">
  🚧 <strong>Em desenvolvimento</strong>
</p>

O projeto está sendo desenvolvido como parte de um **Trabalho de Conclusão de Curso (TCC)**.

Este repositório contém exclusivamente o **Back-end / API** do sistema de Gerenciamento da AAPM.

O front-end está mantido em um repositório separado.

---

# 👨‍💻 Desenvolvedor

**Gabriel Duarte**

Desenvolvedor responsável pelo desenvolvimento do Back-end e da API do sistema.

---

# 🎓 Projeto acadêmico

Projeto desenvolvido para fins acadêmicos como parte do **Trabalho de Conclusão de Curso (TCC)**.

---

<p align="center">
  Desenvolvido com 💻 e ☕ utilizando C# e .NET
</p>
