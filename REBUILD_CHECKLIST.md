# Checklist de Rebuild - Controle de Despensa

Use este checklist para verificar se o rebuild do projeto foi executado com sucesso.

## ✅ Pré-requisitos

- [ ] Node.js versão 18+ instalado
- [ ] npm versão 9+ instalado
- [ ] MongoDB versão 6+ instalado e rodando
- [ ] Git instalado
- [ ] Espaço em disco suficiente (2GB+)

## 🚀 Setup Inicial

- [ ] Repositório clonado
- [ ] Script de setup executado: `npm run setup`
- [ ] Arquivos .env criados automaticamente
- [ ] Todas as dependências instaladas
- [ ] Diretórios necessários criados

## 🔧 Configuração

### Backend
- [ ] Arquivo `backend/.env` existe
- [ ] Variáveis de ambiente configuradas:
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI` configurado
  - [ ] `JWT_SECRET` definido
  - [ ] `NODE_ENV=development`

### Frontend
- [ ] Arquivo `frontend/.env` existe
- [ ] Variáveis de ambiente configuradas:
  - [ ] `REACT_APP_API_URL=http://localhost:5000`
  - [ ] `REACT_APP_ENVIRONMENT=development`

### Projeto Principal
- [ ] Arquivo `.env` existe
- [ ] Variáveis de ambiente configuradas:
  - [ ] `NODE_ENV=development`
  - [ ] `LOCAL_PROD=false`

## 🧪 Testes de Funcionamento

### Backend
- [ ] Backend inicia sem erros: `npm run backend`
- [ ] API responde em http://localhost:5000
- [ ] Conexão com MongoDB estabelecida
- [ ] Logs aparecem no console
- [ ] Endpoint de teste funciona: `GET /`

### Frontend
- [ ] Frontend inicia sem erros: `npm run frontend`
- [ ] Aplicação carrega em http://localhost:3000
- [ ] Interface React renderiza corretamente
- [ ] Sem erros no console do navegador
- [ ] Hot reload funcionando

### Electron
- [ ] Electron inicia sem erros: `npm start`
- [ ] Janela da aplicação abre
- [ ] Interface carrega corretamente
- [ ] DevTools acessível (Ctrl+Shift+I)
- [ ] Comunicação IPC funcionando

### Integração Completa
- [ ] Todos os serviços iniciam juntos: `npm run dev`
- [ ] Frontend conecta com backend
- [ ] Electron carrega frontend
- [ ] Autenticação funcionando
- [ ] CRUD de itens funcionando
- [ ] Notificações funcionando

## 🏗️ Build de Produção

### Build Frontend
- [ ] Build executado: `npm run build-frontend`
- [ ] Diretório `frontend/build/` criado
- [ ] Arquivo `index.html` existe
- [ ] Assets otimizados gerados
- [ ] Sem erros de build

### Build Backend
- [ ] Build executado: `npm run build-backend`
- [ ] Script de build concluído
- [ ] Sem erros de build

### Build Electron
- [ ] Build executado: `npm run build`
- [ ] Diretório `dist/` criado
- [ ] Executável gerado
- [ ] Instalador criado (Windows: .exe)
- [ ] Tamanho do build aceitável

## 🔍 Verificações de Qualidade

### Código
- [ ] Sem erros de linting
- [ ] Testes passando: `npm test`
- [ ] Cobertura de testes adequada
- [ ] Documentação atualizada

### Performance
- [ ] Tempo de inicialização aceitável
- [ ] Uso de memória adequado
- [ ] Responsividade da interface
- [ ] Carregamento de dados otimizado

### Segurança
- [ ] Variáveis sensíveis em .env
- [ ] CORS configurado corretamente
- [ ] Autenticação JWT funcionando
- [ ] Rate limiting ativo
- [ ] Headers de segurança configurados

## 📊 Funcionalidades Principais

### Autenticação
- [ ] Registro de usuário
- [ ] Login/logout
- [ ] Proteção de rotas
- [ ] Tokens JWT válidos

### Gestão de Itens
- [ ] Adicionar item
- [ ] Editar item
- [ ] Excluir item
- [ ] Listar itens
- [ ] Buscar itens
- [ ] Filtrar itens

### Controle de Estoque
- [ ] Quantidade em estoque
- [ ] Estoque mínimo
- [ ] Alertas de estoque baixo
- [ ] Histórico de movimentações

### Controle de Validade
- [ ] Data de validade
- [ ] Alertas de vencimento
- [ ] Produtos vencidos
- [ ] Produtos próximos ao vencimento

### Notificações
- [ ] Modal de notificações
- [ ] Status de estoque
- [ ] Status de validade
- [ ] Envio de alertas
- [ ] Integração WhatsApp (se configurado)

## 🐛 Troubleshooting

### Problemas Resolvidos
- [ ] Erros de dependências
- [ ] Conflitos de porta
- [ ] Problemas de CORS
- [ ] Erros de build
- [ ] Problemas de conexão com MongoDB

### Logs Verificados
- [ ] Logs do backend limpos
- [ ] Logs do frontend limpos
- [ ] Logs do Electron limpos
- [ ] Sem erros críticos

## 📚 Documentação

- [ ] README.md atualizado
- [ ] REBUILD.md criado
- [ ] CHANGELOG.md atualizado
- [ ] Documentação da API atualizada
- [ ] Guia de produção atualizado

## 🚀 Deploy

### Preparação
- [ ] Build de produção testado
- [ ] Variáveis de produção configuradas
- [ ] Banco de dados de produção configurado
- [ ] SSL/HTTPS configurado (se necessário)

### Distribuição
- [ ] Executável testado
- [ ] Instalador testado
- [ ] Desinstalação funcionando
- [ ] Atualizações automáticas configuradas

## ✅ Conclusão

- [ ] Todos os itens acima verificados
- [ ] Projeto funcionando corretamente
- [ ] Documentação completa
- [ ] Pronto para uso em produção

---

**Data do Rebuild**: _______________  
**Responsável**: _______________  
**Versão**: 1.2.0

### Observações
```
[Espaço para observações e problemas encontrados]
```

### Próximos Passos
```
[Espaço para próximas ações necessárias]
``` 