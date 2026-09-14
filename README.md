# Sistema de Gerenciamento AAPM

Sistema desenvolvido como Trabalho de Conclusão de Curso (TCC) para auxiliar no gerenciamento das atividades e recursos da AAPM.

O projeto é dividido em duas partes: uma API responsável pelo back-end e uma aplicação web responsável pelo front-end.

## Sobre o projeto

O sistema tem como objetivo centralizar e facilitar o gerenciamento dos recursos e serviços da AAPM, permitindo que alunos e administradores utilizem as funcionalidades disponíveis de forma organizada.

Entre as funcionalidades desenvolvidas estão:

- Cadastro e gerenciamento de usuários
- Autenticação de usuários
- Gerenciamento de alunos
- Gerenciamento de cursos e turmas
- Gerenciamento de armários
- Reserva de armários
- Gerenciamento de estacionamento
- Gerenciamento de termos
- Área administrativa
- Controle de acesso às funcionalidades

## Tecnologias

### Back-end

- C#
- .NET 10
- ASP.NET Core
- Entity Framework Core
- JWT
- Swagger
- MariaDB
- MySQL

### Front-end

- React
- JavaScript
- Vite
- CSS Modules
- Lucide React
- SweetAlert2

### Ferramentas

- Git
- GitHub
- Visual Studio
- Visual Studio Code
- Postman
- HeidiSQL

## Estrutura do projeto

```text
TCC-AAPM/
│
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── DTOs/
│   ├── Settings/
│   ├── Migrations/
│   ├── Program.cs
│   └── API_backEnd.csproj
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Como executar

### Back-end

Entre na pasta do back-end:

```bash
cd backend
```

Restaure as dependências:

```bash
dotnet restore
```

Configure a conexão com o banco de dados e as demais configurações necessárias usando o arquivo de configuração do projeto, variáveis de ambiente ou User Secrets.

Informações sensíveis, como senhas, chaves JWT e credenciais de e-mail, não devem ser colocadas diretamente no código ou publicadas no repositório.

Depois execute:

```bash
dotnet run
```

### Front-end

Entre na pasta do front-end:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Configure a URL da API através da variável de ambiente utilizada pelo projeto.

Depois execute:

```bash
npm run dev
```

O Vite informará no terminal o endereço para acessar a aplicação.

## Banco de dados

O sistema utiliza MariaDB como banco de dados.

O Entity Framework Core é utilizado no back-end para realizar o mapeamento entre as entidades da aplicação e o banco de dados.

A conexão com o banco deve ser configurada localmente e não deve conter credenciais expostas no repositório.

## Autenticação

A autenticação da aplicação é realizada através de JWT.

O usuário realiza o login e, após a validação das credenciais, recebe um token que é utilizado para acessar as rotas que exigem autenticação.

## API

A API foi desenvolvida utilizando ASP.NET Core e segue o padrão de uma API REST.

O back-end concentra as regras de negócio, validações, autenticação, acesso ao banco de dados e comunicação com o front-end.

Durante o desenvolvimento, o Swagger foi utilizado para facilitar os testes e a documentação dos endpoints.

## Front-end

O front-end foi desenvolvido utilizando React e Vite.

A aplicação é responsável pela interface do sistema e pela interação com os usuários. A comunicação com o back-end é realizada através das rotas disponibilizadas pela API.

## Desenvolvimento

O back-end e o front-end foram desenvolvidos inicialmente em repositórios separados.

Posteriormente, os dois projetos foram reunidos neste repositório para facilitar a organização e manutenção do sistema.

Os repositórios originais continuam separados e preservados.

## Equipe

Projeto desenvolvido como Trabalho de Conclusão de Curso.

### Integrantes

- Gabriel De Sousa Duarte — Product Owner e Desenvolvedor
- Isabella Goncavels Lopreti — Scrum Master e Desenvolvedora

## Status

Projeto em desenvolvimento.
