# Guia de Rebuild - Controle de Despensa

Este documento descreve como preparar e executar o rebuild completo do projeto Controle de Despensa.

## 📋 Pré-requisitos

### Sistema
- **Sistema Operacional**: Windows 10/11, macOS 10.15+, ou Linux
- **RAM**: Mínimo 4GB (recomendado 8GB)
- **Espaço em Disco**: Mínimo 2GB livre
- **Processador**: Dual-core ou superior

### Software
- **Node.js**: Versão 18.0.0 ou superior
- **npm**: Versão 9.0.0 ou superior
- **MongoDB**: Versão 6.0 ou superior
- **Git**: Para controle de versão

### Verificação de Versões
```bash
node --version    # Deve ser >= 18.0.0
npm --version     # Deve ser >= 9.0.0
mongod --version  # Deve ser >= 6.0.0
```

## 🚀 Setup Automatizado

### 1. Setup Inicial
```bash
# Clone o repositório (se necessário)
git clone https://github.com/wilson-roberto/Controle-de-Despensa.git
cd Controle-de-Despensa

# Execute o setup automatizado
npm run setup
```

O script de setup irá:
- ✅ Verificar versões do Node.js e npm
- ✅ Criar arquivos de ambiente (.env)
- ✅ Instalar todas as dependências
- ✅ Verificar MongoDB
- ✅ Criar diretórios necessários

### 2. Configuração Manual (Opcional)

Se precisar configurar manualmente:

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/controle-despensa
JWT_SECRET=sua_chave_secreta_jwt_aqui
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

## 🔧 Desenvolvimento

### Iniciar Ambiente de Desenvolvimento
```bash
npm run dev
```

Este comando irá:
- 🔧 Iniciar o backend na porta 5000
- 🎨 Iniciar o frontend na porta 3000
- ⚡ Iniciar o Electron (aplicação desktop)

### Comandos Individuais
```bash
# Apenas backend
npm run backend

# Apenas frontend
npm run frontend

# Apenas Electron
npm start
```

## 🏗️ Build para Produção

### Build Automatizado
```bash
npm run build
```

O script de build irá:
- 🧹 Limpar builds anteriores
- 🏗️ Buildar o frontend (React)
- 🔧 Buildar o backend (Node.js)
- ⚡ Buildar o Electron
- 🔍 Verificar se o build foi bem-sucedido

### Build Manual
```bash
npm run build-manual
```

### Limpar Builds
```bash
npm run clean
```

## 🧪 Testes

### Executar Todos os Testes
```bash
npm test
```

### Testes Específicos
```bash
# Testes do frontend
npm run test-frontend

# Testes do backend
npm run test-backend
```

## 📁 Estrutura do Projeto

```
controle-despensa/
├── scripts/              # Scripts automatizados
│   ├── setup.js         # Setup inicial
│   ├── build.js         # Build automatizado
│   └── dev.js           # Desenvolvimento
├── frontend/            # Aplicação React
│   ├── src/            # Código fonte
│   ├── public/         # Arquivos estáticos
│   └── package.json    # Dependências React
├── backend/            # API Node.js
│   ├── config/         # Configurações
│   ├── controllers/    # Controladores
│   ├── models/         # Modelos MongoDB
│   ├── routes/         # Rotas da API
│   └── package.json    # Dependências Node.js
├── electron/           # Configuração Electron
│   ├── main.js         # Processo principal
│   └── preload.js      # Preload script
├── dist/               # Build de produção
├── env.example         # Exemplo de variáveis
└── package.json        # Configuração principal
```

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Erro de Porta em Uso
```bash
# Verificar processos nas portas
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# Matar processo
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # macOS/Linux
```

#### 2. Erro de Dependências
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
npm run install-all
```

#### 3. Erro de MongoDB
```bash
# Verificar se MongoDB está rodando
mongod --version

# Iniciar MongoDB
mongod --dbpath /path/to/data/db
```

#### 4. Erro de Build
```bash
# Limpar builds
npm run clean

# Reinstalar dependências
npm run install-all

# Tentar build novamente
npm run build
```

### Logs de Erro

#### Backend
- Logs em: `backend/logs/`
- Console: Terminal onde o backend foi iniciado

#### Frontend
- Console do navegador (F12)
- Terminal onde o frontend foi iniciado

#### Electron
- Console do Electron (Ctrl+Shift+I)
- Terminal onde o Electron foi iniciado

## 📊 Monitoramento

### URLs de Acesso
- **Backend API**: http://localhost:5000
- **Frontend Web**: http://localhost:3000
- **Electron**: Aplicação desktop

### Endpoints de Status
- **Backend**: `GET /` - Status da API
- **Frontend**: Página inicial do React

## 🔄 Atualizações

### Atualizar Dependências
```bash
# Atualizar dependências principais
npm update

# Atualizar dependências do frontend
cd frontend && npm update

# Atualizar dependências do backend
cd backend && npm update
```

### Atualizar Código
```bash
# Pull das últimas alterações
git pull origin main

# Reinstalar dependências (se necessário)
npm run install-all
```

## 📚 Documentação Adicional

- **README.md**: Visão geral do projeto
- **backend/docs/setup.md**: Configuração detalhada do backend
- **backend/docs/api.md**: Documentação da API
- **PRODUCTION.md**: Guia de produção
- **CHANGELOG.md**: Histórico de versões

## 🆘 Suporte

### Comandos de Ajuda
```bash
# Verificar status do projeto
npm run setup

# Verificar se tudo está funcionando
npm run dev

# Build de teste
npm run build
```

### Contatos
- **Issues**: GitHub Issues
- **Documentação**: Arquivos .md no projeto
- **Logs**: Diretório `backend/logs/`

---

**Versão**: 1.2.0  
**Última Atualização**: 2025-01-27  
**Autor**: Wilson Roberto 