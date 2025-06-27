# Guia de Setup para Windows - Controle de Despensa

Este guia é específico para configurar o projeto Controle de Despensa no Windows.

## 📋 Pré-requisitos

### Software Necessário
- **Node.js**: Versão 18.0.0 ou superior
- **npm**: Versão 9.0.0 ou superior
- **MongoDB**: Versão 6.0 ou superior
- **Git**: Para controle de versão
- **PowerShell**: Já incluído no Windows 10/11

### Verificação de Versões
Abra o PowerShell como administrador e execute:
```powershell
node --version    # Deve ser >= 18.0.0
npm --version     # Deve ser >= 9.0.0
git --version     # Qualquer versão recente
```

## 🚀 Setup Automatizado (Recomendado)

### 1. Clone o Repositório
```powershell
git clone https://github.com/wilson-roberto/Controle-de-Despensa.git
cd Controle-de-Despensa
```

### 2. Execute o Setup Automatizado
```powershell
npm run setup-windows
```

Este comando irá:
- ✅ Verificar versões do Node.js e npm
- ✅ Criar arquivos de ambiente (.env)
- ✅ Instalar todas as dependências
- ✅ Verificar MongoDB
- ✅ Criar diretórios necessários
- ✅ Configurar permissões do PowerShell

### 3. Verificar o Ambiente
```powershell
npm run check-windows
```

## 🔧 Setup Manual (Se necessário)

### 1. Instalar Node.js
1. Baixe o Node.js em: https://nodejs.org/
2. Execute o instalador como administrador
3. Marque a opção "Add to PATH"
4. Reinicie o PowerShell após a instalação

### 2. Instalar MongoDB
1. Baixe o MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Execute o instalador como administrador
3. Escolha "Complete" installation
4. Adicione MongoDB ao PATH do sistema
5. Crie o diretório de dados:
   ```powershell
   mkdir C:\data\db
   ```

### 3. Configurar PowerShell
Execute como administrador:
```powershell
Set-ExecutionPolicy RemoteSigned
```

### 4. Instalar Dependências
```powershell
# Projeto principal
npm install

# Frontend
cd frontend
npm install
cd ..

# Backend
cd backend
npm install
cd ..
```

### 5. Criar Arquivos de Ambiente
Copie os arquivos de exemplo:
```powershell
copy env.example .env
copy backend\env.example backend\.env
copy frontend\env.example frontend\.env
```

## 🗄️ Configurar MongoDB

### 1. Iniciar MongoDB
```powershell
mongod --dbpath C:\data\db
```

### 2. Verificar Conexão
Em outro terminal:
```powershell
mongosh
```

## 🚀 Executar o Projeto

### Desenvolvimento
```powershell
npm run dev
```

### Build para Produção
```powershell
npm run build-windows
```

### Verificar Ambiente
```powershell
npm run check-windows
```

## 🔧 Troubleshooting

### Problema: Erro de Permissão
**Solução**: Execute o PowerShell como administrador

### Problema: Porta em Uso
**Verificar**:
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

**Matar processo**:
```powershell
taskkill /PID <PID> /F
```

### Problema: MongoDB não inicia
**Verificar**:
1. MongoDB está instalado corretamente
2. Diretório C:\data\db existe
3. Execute como administrador

### Problema: Dependências não instalam
**Soluções**:
```powershell
# Limpar cache
npm cache clean --force

# Reinstalar
npm run install-all

# Se persistir, instalar Visual Studio Build Tools
npm install --global windows-build-tools
```

### Problema: Python não encontrado
**Instalar Python**:
1. Baixe em: https://www.python.org/downloads/
2. Marque "Add Python to PATH"
3. Reinicie o PowerShell

### Problema: Antivírus bloqueando
**Soluções**:
1. Adicione a pasta do projeto às exceções
2. Desative temporariamente o antivírus
3. Execute como administrador

## 📁 Estrutura de Arquivos

```
Controle-de-Despensa/
├── scripts/
│   ├── setup-windows.js      # Setup específico para Windows
│   ├── build-windows.js      # Build específico para Windows
│   └── check-windows.js      # Verificação específica para Windows
├── frontend/                 # Aplicação React
├── backend/                  # API Node.js
├── electron/                 # Configuração Electron
├── dist/                     # Build de produção
└── package.json             # Scripts e dependências
```

## 🔍 Comandos Úteis

### Verificação
```powershell
npm run check-windows        # Verificar ambiente
npm run setup-windows        # Setup completo
```

### Desenvolvimento
```powershell
npm run dev                  # Ambiente completo
npm run frontend            # Apenas frontend
npm run backend             # Apenas backend
```

### Build
```powershell
npm run build-windows        # Build completo
npm run build-frontend       # Apenas frontend
npm run build-backend        # Apenas backend
```

### Limpeza
```powershell
npm run clean-windows        # Limpar builds
```

### Testes
```powershell
npm test                     # Todos os testes
npm run test-frontend        # Testes do frontend
npm run test-backend         # Testes do backend
```

## 📚 Documentação Adicional

- **README.md** - Visão geral do projeto
- **REBUILD.md** - Guia de rebuild completo
- **REBUILD_CHECKLIST.md** - Checklist detalhado
- **PRODUCTION.md** - Guia de produção
- **backend/docs/api.md** - Documentação da API

## 🆘 Suporte

Se encontrar problemas:
1. Execute `npm run check-windows` para diagnóstico
2. Verifique os logs de erro
3. Consulte a documentação
4. Abra uma issue no GitHub

---

**Versão**: 1.2.0  
**Última atualização**: Dezembro 2024 