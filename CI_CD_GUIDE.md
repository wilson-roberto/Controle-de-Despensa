# 🚀 CI/CD Guide - Controle de Despensa

Este projeto está configurado com **GitHub Actions** para **Continuous Integration/Continuous Deployment** (CI/CD).

## 📋 **O que está configurado:**

### **🔄 Workflows Automáticos:**

#### **1. Build Development (`build-dev.yml`)**
- **Quando roda:** A cada push/PR para `main`, `master`, `develop`
- **O que faz:**
  - ✅ Executa testes
  - ✅ Build para Windows
  - ✅ Build para macOS
  - ✅ Build para Linux
  - ✅ Salva artifacts por 7 dias

#### **2. Build Release (`build.yml`)**
- **Quando roda:** Quando você cria um release no GitHub
- **O que faz:**
  - ✅ Build para todas as plataformas
  - ✅ Cria release automático
  - ✅ Anexa arquivos de download
  - ✅ Gera changelog automático

#### **3. Dependabot (`dependabot.yml`)**
- **Quando roda:** Semanalmente
- **O que faz:**
  - ✅ Atualiza dependências npm
  - ✅ Atualiza GitHub Actions
  - ✅ Cria PRs automáticos

## 🎯 **Como usar:**

### **Para Desenvolvimento:**
```bash
# 1. Faça suas mudanças
git add .
git commit -m "Nova funcionalidade"
git push origin main

# 2. GitHub Actions roda automaticamente
# 3. Veja os resultados em: https://github.com/seu-usuario/seu-repo/actions
```

### **Para Release:**
```bash
# 1. Crie um release no GitHub
# 2. GitHub Actions gera builds automaticamente
# 3. Release é criado com downloads
```

## 📊 **Monitoramento:**

### **GitHub Actions Dashboard:**
- **URL:** `https://github.com/seu-usuario/seu-repo/actions`
- **O que ver:**
  - ✅ Status dos builds
  - ✅ Logs de erro
  - ✅ Downloads de artifacts
  - ✅ Tempo de execução

### **Releases:**
- **URL:** `https://github.com/seu-usuario/seu-repo/releases`
- **O que ver:**
  - ✅ Downloads para cada plataforma
  - ✅ Changelog automático
  - ✅ Versões publicadas

## 🔧 **Configuração:**

### **Arquivos criados:**
```
.github/
├── workflows/
│   ├── build.yml          # Build de release
│   └── build-dev.yml      # Build de desenvolvimento
└── dependabot.yml         # Atualizações automáticas
```

### **Variáveis de ambiente necessárias:**
- `GITHUB_TOKEN` - Automático (não precisa configurar)

## 🚀 **Fluxo de trabalho:**

### **Desenvolvimento:**
```
1. Desenvolver código
2. Push para GitHub
3. CI/CD roda automaticamente
4. Builds são gerados
5. Artifacts ficam disponíveis
```

### **Release:**
```
1. Criar release no GitHub
2. CI/CD detecta release
3. Builds para todas as plataformas
4. Release é criado com downloads
5. Usuários podem baixar
```

## 📦 **Artefatos gerados:**

### **Desenvolvimento (7 dias):**
- `windows-dev-build/` - Builds Windows
- `macos-dev-build/` - Builds macOS
- `linux-dev-build/` - Builds Linux

### **Release (permanente):**
- `.exe` - Windows installer
- `.dmg` - macOS installer
- `.AppImage` - Linux portable
- `.deb` - Linux Debian package
- `.rpm` - Linux RPM package

## 🐛 **Solução de problemas:**

### **Build falhou:**
1. **Verifique logs:** GitHub Actions → Workflow → Job → Step
2. **Erro comum:** Dependências faltando
3. **Solução:** `npm run install-all` localmente

### **Release não foi criado:**
1. **Verifique:** Release foi publicado no GitHub?
2. **Verifique:** Workflow `build.yml` rodou?
3. **Verifique:** Todos os jobs passaram?

### **Dependabot não funciona:**
1. **Verifique:** Repositório é público ou tem GitHub Pro?
2. **Verifique:** Dependabot está habilitado?
3. **Verifique:** Configuração em `.github/dependabot.yml`

## 🔒 **Segurança:**

### **Secrets necessários:**
- `GITHUB_TOKEN` - Automático
- `NPM_TOKEN` - Se publicar no npm (opcional)

### **Permissões:**
- **Contents:** Read
- **Actions:** Read
- **Releases:** Write (para releases)

## 📈 **Métricas:**

### **Tempo médio de build:**
- **Windows:** ~5-10 minutos
- **macOS:** ~8-15 minutos
- **Linux:** ~6-12 minutos

### **Custo:**
- **GitHub Actions:** Gratuito para repositórios públicos
- **Limite:** 2000 minutos/mês para repositórios privados

## 🎉 **Benefícios:**

### **✅ Automatização:**
- Builds automáticos
- Testes automáticos
- Releases automáticos

### **✅ Qualidade:**
- Testes consistentes
- Builds limpos
- Deploy seguro

### **✅ Produtividade:**
- Menos trabalho manual
- Menos erros
- Entrega mais rápida

### **✅ Distribuição:**
- Downloads automáticos
- Multiplataforma
- Versionamento

## 🔗 **Links úteis:**

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Electron Builder CI/CD](https://www.electron.build/configuration/publish)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [GitHub Releases API](https://docs.github.com/en/rest/releases)

---

**🎯 Resultado:** Seu projeto agora tem CI/CD completo e automatizado! 🚀 