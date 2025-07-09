# EMTU Acessível - API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

API para o projeto [EMTU Acessível](https://github.com/UnifespCodeLab/emtu-app), uma iniciativa para fornecer informações de acessibilidade sobre as linhas de ônibus da EMTU.

## 📜 Sobre

Este repositório contém o back-end da aplicação. A API é responsável por gerenciar os dados de linhas de ônibus, veículos, cidades, e fornecer os endpoints necessários para o aplicativo móvel.

## ✨ Tecnologias

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/)

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) (v19.x ou superior)
- [Yarn](https://yarnpkg.com/) (v1.22.x ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (Recomendado)

---

## 🚀 Rodando o Projeto (Recomendado com Docker)

Este é o método mais simples para configurar e rodar o ambiente de desenvolvimento.

### 1. Clone o Repositório

```bash
git clone https://github.com/UnifespCodeLab/emtu-api.git
cd emtu-api
```

### 2. Configure as Variáveis de Ambiente

Crie uma cópia do arquivo de exemplo `.env.sample` e renomeie para `.env`.

```bash
cp .env.sample .env
```
*O arquivo `.env` já vem com os valores padrão para o ambiente Docker.*

### 3. Suba os Containers

Com o Docker em execução, suba o container do banco de dados PostgreSQL.

```bash
docker compose up -d postgres
```

### 4. Instale as Dependências

Instale todas as dependências do projeto com o Yarn.

```bash
yarn install
```

### 5. Rode as Migrations e Seeds

Para criar as tabelas e popular o banco de dados com os dados iniciais, execute os seguintes comandos:

```bash
# Aplica as migrations do Prisma
yarn prisma migrate dev

# Popula o banco com os dados iniciais
sh prisma/seed.sh
```
**Atenção:** O script `seed.sh` não deve ser executado mais de uma vez, pois pode duplicar os dados. Caso precise resetar o banco, use `yarn prisma migrate reset`.

### 6. Execute a Aplicação

Agora, inicie o servidor de desenvolvimento:

```bash
yarn run dev
```

O servidor estará em execução em `http://localhost:3000`. Você pode acessar a documentação da API em `http://localhost:3/api-docs/`.

---

## 🔧 Rodando o Projeto (Manualmente)

Caso não queira usar o Docker, siga os passos abaixo.

### 1. Clone o Repositório e Instale as Dependências

```bash
git clone https://github.com/UnifespCodeLab/emtu-api.git
cd emtu-api
yarn install
```

### 2. Configure o Banco de Dados PostgreSQL

- Instale o [PostgreSQL](https://www.postgresql.org/download/) (versão 13 ou superior).
- Crie um banco de dados.
- Configure as variáveis de ambiente no arquivo `.env` com os dados de conexão do seu banco (usuário, senha, nome do banco, etc.).

### 3. Rode as Migrations e Seeds

Execute os comandos para preparar o banco de dados:

```bash
# Aplica as migrations do Prisma
yarn prisma migrate dev

# Popula o banco com os dados iniciais
sh prisma/seed.sh
```

### 4. Execute a Aplicação

```bash
yarn run dev
```
O servidor estará em execução em `http://localhost:3333`.

---

## ⚙️ Scripts Disponíveis

- `yarn dev`: Inicia o servidor em modo de desenvolvimento.
- `yarn start`: Inicia o servidor em modo de produção (requer build).
- `yarn test`: Executa os testes com Jest.
- `yarn postinstall`: Executa o build do projeto (compila TypeScript para JavaScript).

## 🤝 Fluxo de Contribuição

1.  Dê uma olhada em como funcionam os [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
2.  Vá até o [board do projeto no GitHub](https://github.com/orgs/UnifespCodeLab/projects/5/views/1).
3.  Encontre uma `issue` para trabalhar, atribua a si mesmo e mova para a coluna "In Progress".
4.  Crie uma nova branch a partir da `main`: `git checkout -b feature/nome-da-feature` ou `fix/nome-do-fix`.
5.  Faça commits "atômicos" e com mensagens claras.
6.  Ao finalizar, abra um Pull Request (PR) para a branch `main`.
7.  Marque os revisores e vincule a `issue` ao seu PR.
