# Controle de Despensa

Aplicação desktop para controle de estoque e validade de produtos em despensas, desenvolvida com React, Electron e Node.js.

*Última atualização: 27/12/2024 15:30*

## 📋 Sobre o Projeto

O Controle de Despensa é uma aplicação desktop que permite gerenciar de forma eficiente o estoque e a validade dos produtos em sua despensa. Com uma interface intuitiva e recursos avançados, você pode manter o controle total dos seus produtos e evitar desperdícios.

## ✨ Funcionalidades

- 📦 Cadastro e gerenciamento de itens
  - Adição, edição e remoção de produtos
  - Categorização de produtos
  - Upload de imagens dos produtos
  - Histórico de alterações
- 📊 Controle de estoque
  - Acompanhamento de quantidade em estoque
  - Alertas de estoque baixo
  - Histórico de movimentações
  - Relatórios de consumo
- ⏰ Monitoramento de validade
  - Alertas de produtos próximos ao vencimento
  - Relatórios de validade
  - Sugestões de consumo
  - Filtros por data de validade
- 📱 Notificações via WhatsApp
  - Alertas personalizados
  - Relatórios periódicos
  - Lembretes de compras
  - Status de envio
- 🎨 Interface intuitiva e responsiva
  - Design moderno e clean
  - Navegação simplificada
  - Tema claro/escuro
  - Layout responsivo

## 🛠️ Tecnologias Utilizadas

- Frontend: React.js 18.x
- Desktop: Electron 28.x
- Backend: Node.js 18.x
- Estilização: CSS Modules + TailwindCSS
- Banco de Dados: MongoDB 6.x
- Autenticação: JWT
- Testes: Jest + React Testing Library
- Gerenciamento de Estado: React Context API
- Formulários: React Hook Form
- Requisições: Axios
- Validação: Yup

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (versão 9 ou superior) ou yarn (versão 1.22 ou superior)
- MongoDB (versão 6 ou superior)
- Git
- WhatsApp Business API (para notificações)

## 🚀 Instalação

### Setup Automatizado (Recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/wilson-roberto/Controle-de-Despensa.git
cd Controle-de-Despensa
```

2. Execute o setup automatizado:

**Para Windows:**
```powershell
npm run setup-windows
```

**Para Linux/macOS:**
```bash
npm run setup
```

3. Verifique se tudo está configurado:

**Para Windows:**
```powershell
npm run check-windows
```

**Para Linux/macOS:**
```bash
npm run check
```

### Setup Manual

1. Clone o repositório:
```bash
git clone https://github.com/wilson-roberto/Controle-de-Despensa.git
cd controle-despensa
```

2. Instale as dependências:
```bash
# Instalar dependências do projeto principal
npm install

# Instalar dependências do frontend
cd frontend
npm install

# Instalar dependências do backend
cd ../backend
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:
```env
MONGODB_URI=sua_uri_do_mongodb
JWT_SECRET=seu_segredo_jwt
PORT=5000
NODE_ENV=development
```

- Crie um arquivo `.env` na pasta `frontend` com as seguintes variáveis:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WHATSAPP_API_KEY=sua_chave_api
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento

**Método Simplificado (Recomendado):**
```bash
npm run dev
```

Este comando inicia automaticamente:
- Backend na porta 5000
- Frontend na porta 3000
- Electron (aplicação desktop)

**Método Individual:**
1. Inicie o backend:
```bash
npm run backend
```

2. Em outro terminal, inicie o frontend:
```bash
npm run frontend
```

3. Em um terceiro terminal, inicie o Electron:
```bash
npm start
```

### Produção

Para criar a versão de produção:

**Para Windows:**
```powershell
npm run build-windows
```

**Para Linux/macOS:**
```bash
npm run build
```

## 🔧 Comandos Úteis

### Verificação e Setup
```bash
npm run check-windows        # Verificar ambiente (Windows)
npm run check               # Verificar ambiente (Linux/macOS)
npm run setup-windows       # Setup completo (Windows)
npm run setup               # Setup completo (Linux/macOS)
```

### Desenvolvimento
```bash
npm run dev                 # Ambiente completo
npm run frontend           # Apenas frontend
npm run backend            # Apenas backend
```

### Build
```bash
npm run build-windows       # Build completo (Windows)
npm run build              # Build completo (Linux/macOS)
npm run build-frontend      # Apenas frontend
npm run build-backend       # Apenas backend
```

### Testes
```bash
npm test                   # Todos os testes
npm run test-frontend      # Testes do frontend
npm run test-backend       # Testes do backend
```

### Limpeza
```bash
npm run clean-windows      # Limpar builds (Windows)
npm run clean              # Limpar builds (Linux/macOS)
```

## 📁 Estrutura do Projeto

```
controle-despensa/
├── scripts/               # Scripts automatizados
│   ├── setup.js          # Setup para Linux/macOS
│   ├── setup-windows.js  # Setup para Windows
│   ├── build.js          # Build para Linux/macOS
│   ├── build-windows.js  # Build para Windows
│   ├── dev.js            # Desenvolvimento
│   └── check.js          # Verificação
├── frontend/             # Aplicação React
│   ├── public/          # Arquivos estáticos
│   └── src/             # Código fonte
│       ├── components/   # Componentes reutilizáveis
│       ├── pages/       # Páginas da aplicação
│       ├── context/     # Contextos do React
│       ├── services/    # Serviços e APIs
│       ├── hooks/       # Custom hooks
│       ├── utils/       # Funções utilitárias
│       ├── styles/      # Estilos globais
│       └── types/       # Definições de tipos
├── backend/             # API Node.js
│   ├── src/            # Código fonte
│   │   ├── controllers/ # Controladores
│   │   ├── models/     # Modelos do MongoDB
│   │   ├── routes/     # Rotas da API
│   │   ├── services/   # Serviços
│   │   └── utils/      # Utilitários
│   └── tests/          # Testes
├── electron/            # Configuração do Electron
├── dist/               # Build de produção
└── README.md
```

## 📚 Documentação

- **[WINDOWS_SETUP.md](WINDOWS_SETUP.md)** - Guia específico para Windows
- **[REBUILD.md](REBUILD.md)** - Guia de rebuild completo
- **[REBUILD_CHECKLIST.md](REBUILD_CHECKLIST.md)** - Checklist detalhado
- **[PRODUCTION.md](PRODUCTION.md)** - Guia de produção
- **[backend/docs/api.md](backend/docs/api.md)** - Documentação da API

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no GitHub. 