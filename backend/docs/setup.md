# Configuração do Backend

Este documento descreve como configurar o ambiente de desenvolvimento para o projeto Controle de Despensa.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB (versão 4.4 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/controle-despensa.git
cd controle-despensa/backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto backend com as seguintes variáveis:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/controle-despensa
NODE_ENV=development
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Estrutura do Projeto

```
backend/
├── config/         # Configurações da aplicação
├── controllers/    # Controladores da aplicação
├── docs/           # Documentação
├── middleware/     # Middlewares
├── models/         # Modelos de dados
├── routes/         # Rotas da API
├── src/            # Código fonte principal
├── tests/          # Testes
├── utils/          # Funções utilitárias
├── .env            # Variáveis de ambiente
├── .gitignore      # Arquivos ignorados pelo Git
└── package.json    # Dependências e scripts
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm run start`: Inicia o servidor em modo de produção
- `npm run test`: Executa os testes
- `npm run lint`: Executa o linter
- `npm run seed`: Popula o banco de dados com dados iniciais

## Banco de Dados

O projeto utiliza MongoDB como banco de dados. Certifique-se de que o MongoDB está instalado e em execução antes de iniciar a aplicação.

Para instalar o MongoDB:

- **Windows**: Baixe e instale o [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **macOS**: Use o Homebrew: `brew install mongodb-community`
- **Linux**: Siga as [instruções oficiais](https://docs.mongodb.com/manual/administration/install-on-linux/)

## Desenvolvimento

### Padrões de Código

- Utilizamos ESLint e Prettier para padronização de código
- Seguimos o padrão de código do Airbnb
- Utilizamos JSDoc para documentação de funções

### Commits

Seguimos o padrão de commits do [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alteração em documentação
- `style`: Alteração que não afeta o significado do código
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Alteração em arquivos de build, ferramentas, etc.

## Testes

Para executar os testes:

```bash
npm test
```

Para executar os testes com cobertura:

```bash
npm run test:coverage
```

## Deploy

Para fazer o deploy da aplicação:

1. Configure as variáveis de ambiente para produção
2. Execute o build:

```bash
npm run build
```

3. Inicie o servidor:

```bash
npm start
```

## Suporte

Em caso de dúvidas ou problemas, abra uma issue no repositório do projeto. 