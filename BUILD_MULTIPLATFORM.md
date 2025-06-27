# 🚀 Builds Multiplataforma - Controle de Despensa

Este projeto agora suporta builds para múltiplas plataformas usando Electron Builder.

## 📋 Plataformas Suportadas

### 🪟 Windows
- **Arquiteturas:** x64
- **Formatos:** 
  - `.exe` (Instalador NSIS)
  - `portable` (Versão portátil)

### 🍎 macOS
- **Arquiteturas:** x64, arm64 (Apple Silicon)
- **Formatos:**
  - `.dmg` (Instalador DMG)
  - `.zip` (Versão compactada)

### 🐧 Linux
- **Arquiteturas:** x64
- **Formatos:**
  - `.AppImage` (Aplicação portátil)
  - `.deb` (Pacote Debian/Ubuntu)
  - `.rpm` (Pacote Red Hat/Fedora)

## 🛠️ Scripts de Build

### Build para Windows (padrão)
```bash
npm run build
# ou
npm run build-windows
```

### Build para macOS
```bash
npm run build-mac
```

### Build para Linux
```bash
npm run build-linux
```

### Build para todas as plataformas
```bash
npm run build-all
```

## 📁 Arquivos Gerados

Após o build, os arquivos serão criados na pasta `dist/`:

### Windows
- `Controle de Despensa Setup 1.2.0.exe` - Instalador
- `Controle de Despensa 1.2.0.exe` - Versão portátil

### macOS
- `Controle de Despensa-1.2.0.dmg` - Instalador
- `Controle de Despensa-1.2.0-mac.zip` - Versão compactada

### Linux
- `Controle de Despensa-1.2.0.AppImage` - Aplicação portátil
- `controle-despensa_1.2.0_amd64.deb` - Pacote Debian
- `controle-despensa-1.2.0.x86_64.rpm` - Pacote RPM

## 🔧 Requisitos por Plataforma

### Windows
- Node.js 18+
- npm 9+
- Windows 10/11

### macOS
- Node.js 18+
- npm 9+
- macOS 10.14+ (Mojave)
- Xcode Command Line Tools (para builds nativos)

### Linux
- Node.js 18+
- npm 9+
- Ubuntu 18.04+ / Debian 9+ / Fedora 28+
- Dependências adicionais:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install --no-install-recommends -y rpm
  
  # Fedora
  sudo dnf install rpm-build
  ```

## 🚀 Distribuição

### Windows
- **Instalador (.exe):** Distribuir para usuários finais
- **Portátil (.exe):** Para uso sem instalação

### macOS
- **DMG (.dmg):** Instalador padrão do macOS
- **ZIP (.zip):** Para distribuição alternativa

### Linux
- **AppImage (.AppImage):** Funciona na maioria das distribuições
- **DEB (.deb):** Para Ubuntu, Debian e derivados
- **RPM (.rpm):** Para Fedora, Red Hat e derivados

## 🔍 Verificação de Build

Após cada build, verifique:

1. **Arquivos gerados** na pasta `dist/`
2. **Tamanho dos arquivos** (deve ser ~100MB+)
3. **Teste de instalação** em cada plataforma
4. **Funcionalidade básica** da aplicação

## 🐛 Solução de Problemas

### Erro de Build
```bash
# Limpar builds anteriores
npm run clean-windows  # Windows
rm -rf dist frontend/build  # macOS/Linux

# Reinstalar dependências
npm run install-all

# Tentar build novamente
npm run build
```

### Ícones não encontrados
- Windows: `electron/assets/icon.ico`
- macOS: `electron/assets/icon.icns`
- Linux: `electron/assets/icon.png`

### Build lento
- Use `npm run build-[plataforma]` para builds específicos
- Evite `npm run build-all` em desenvolvimento

## 📝 Notas Importantes

1. **Builds cruzados:** Alguns builds podem falhar em plataformas diferentes
2. **Assinatura:** Para distribuição oficial, considere assinar os aplicativos
3. **Notarização:** macOS requer notarização para distribuição fora da App Store
4. **Dependências:** Linux pode precisar de dependências adicionais

## 🔗 Links Úteis

- [Electron Builder Documentation](https://www.electron.build/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Cross-platform Development Guide](https://www.electronjs.org/docs/tutorial/development-environment) 