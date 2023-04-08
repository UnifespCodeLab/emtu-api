# emtu-api

Back-end da aplicação EMTU Acessível

## Clonando o repositório

```
https://github.com/UnifespCodeLab/emtu-api.git
```

## Requisitos

### 1 - Obrigatórios

- [yarn](https://yarnpkg.com/)

### 2 - Opcionais

- [docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/)
- [postgres](https://www.postgresql.org/) (caso não for usar o docker)

## Setup

### Ambiente

- Crie um novo arquivo `.env`
- Copie o conteúdo do arquivo `.env.sample` para o `.env`

### Subindo o banco de dados

#### Com docker

- Abra o terminal na pasta do projeto e execute os seguintes comandos :

  - `docker compose up postgres`

#### Sem docker

- instale o postgres13 em sua máquina e crie um banco com nome `postgres` e senha `1234`

### Instalando dependências

- Abra outro terminal e execute:

  - `yarn install`

- <b>Atenção</b>: No momento que estou escrevendo essa doc o yarn está nessa versão: `1.22.19` e o node `19.8.1`

## Executando o projeto

- Em um terminal aberto na pasta do projeto execute:
  - `yarn run dev`
- Após o console deve imprimir na tela a seguinte mensagem:
  - `server is running on port 3333`
- Para acessar um rota de testes é possível acessar:
  - `http://localhost:3333/api-docs/`
