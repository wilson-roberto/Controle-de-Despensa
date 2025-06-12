# Frontend - Controle de Despensa

Este é o frontend do projeto Controle de Despensa, desenvolvido com React.js e Electron.

## 📋 Sobre

O frontend do Controle de Despensa é uma aplicação React moderna que oferece uma interface intuitiva e responsiva para gerenciamento de produtos em despensas. A aplicação é empacotada com Electron para funcionar como um aplicativo desktop.

## 🎯 Funcionalidades do Frontend

- Interface moderna e responsiva
  - Design clean e minimalista
  - Tema claro/escuro
  - Layout adaptativo
  - Animações suaves
- Navegação intuitiva
  - Menu lateral retrátil
  - Breadcrumbs
  - Atalhos de teclado
  - Histórico de navegação
- Formulários dinâmicos
  - Validação em tempo real
  - Máscaras de input
  - Upload de imagens
  - Autocomplete
- Gráficos e relatórios
  - Dashboard interativo
  - Gráficos de consumo
  - Relatórios exportáveis
  - Filtros avançados
- Integração com WhatsApp
  - Envio de notificações
  - Templates personalizados
  - Status de entrega
  - Histórico de envios
- Notificações em tempo real
  - Alertas de estoque
  - Avisos de validade
  - Confirmações de ações
  - Sistema de notificações push

## 🛠️ Tecnologias

- React.js 18.x
- Electron 28.x
- TailwindCSS
- React Router DOM v6
- Axios
- React Query
- React Hook Form + Yup
- Jest + React Testing Library
- ESLint + Prettier
- React Context API
- React Icons
- React Toastify

## 📁 Estrutura do Projeto

```
frontend/
├── public/           # Arquivos estáticos
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/             # Código fonte da aplicação
│   ├── components/  # Componentes reutilizáveis
│   │   ├── common/  # Componentes comuns
│   │   ├── forms/   # Componentes de formulário
│   │   └── layout/  # Componentes de layout
│   ├── pages/      # Páginas da aplicação
│   ├── context/    # Contextos do React
│   ├── services/   # Serviços e APIs
│   ├── hooks/      # Custom hooks
│   ├── utils/      # Funções utilitárias
│   ├── styles/     # Estilos globais
│   └── types/      # Definições de tipos
├── package.json    # Dependências e scripts
└── README.md       # Este arquivo
```

## 📋 Requisitos

- Node.js (versão 18 ou superior)
- NPM (versão 9 ou superior)
- Git
- WhatsApp Business API (para notificações)

## 🚀 Instalação

1. Certifique-se de ter o Node.js instalado
2. Navegue até a pasta do projeto: `cd controle-despensa/frontend`
3. Instale as dependências: `npm install`
4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do frontend com:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_WHATSAPP_API_KEY=sua_chave_api
   ```
5. Inicie o servidor de desenvolvimento: `npm start`

## 📜 Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria a versão de produção
- `npm test`: Executa os testes
- `npm run lint`: Executa o linter
- `npm run format`: Formata o código
- `npm run electron-dev`: Inicia o Electron em modo desenvolvimento
- `npm run electron-build`: Cria a versão de produção do Electron
- `npm run test:coverage`: Gera relatório de cobertura de testes
- `npm run type-check`: Verifica tipos TypeScript

## 🎨 Desenvolvimento

A aplicação estará disponível em:
- Web: http://localhost:3000
- Electron: Aplicativo desktop

## 🔒 Segurança

- Implementação de autenticação JWT
- Proteção contra XSS
- Validação de formulários
- Sanitização de dados
- Configuração de CORS
- Proteção de rotas
- Rate limiting
- Sanitização de inputs
- Proteção contra CSRF

## 🧪 Testes

- Testes unitários com Jest
- Testes de componentes com React Testing Library
- Testes de integração
- Cobertura de código
- Testes E2E com Cypress
- Mocks e stubs
- Testes de acessibilidade

## 📦 Build e Deploy

1. Execute `npm run build` para criar a versão de produção
2. Os arquivos serão gerados na pasta `build`
3. Para criar o executável do Electron:
   ```bash
   npm run electron-build
   ```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.
