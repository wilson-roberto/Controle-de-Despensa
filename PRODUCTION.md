# Guia de Produção - Controle de Despensa

## Requisitos do Sistema

- Windows 10 ou superior
- 4GB de RAM mínimo
- 500MB de espaço em disco
- Conexão com internet para atualizações

## Instalação em Produção

1. Execute o instalador gerado na pasta `dist`
2. Siga o assistente de instalação
3. A aplicação será instalada no diretório padrão do programa

## Configuração do Ambiente

### Variáveis de Ambiente Necessárias

- `DATABASE_URL`: URL de conexão com o banco de dados
- `FRONTEND_URL`: URL do frontend em produção
- `PORT`: Porta do servidor backend
- `HOST`: Host do servidor backend

## Manutenção

### Logs
- Os logs são armazenados em `%APPDATA%/Controle de Despensa/logs`
- Logs são rotacionados automaticamente a cada 10MB
- Logs são mantidos por 7 dias

### Backup
- Faça backup regular do banco de dados
- Mantenha cópias dos arquivos de configuração
- Documente todas as alterações de configuração

### Atualizações
- As atualizações são distribuídas automaticamente
- Mantenha o aplicativo atualizado para correções de segurança

## Troubleshooting

### Problemas Comuns

1. **Aplicativo não inicia**
   - Verifique os logs em `%APPDATA%/Controle de Despensa/logs`
   - Confirme se todas as dependências estão instaladas
   - Verifique as permissões do usuário

2. **Erro de conexão com banco de dados**
   - Verifique a conexão com a internet
   - Confirme se as credenciais do banco estão corretas
   - Verifique se o banco de dados está acessível

3. **Problemas de performance**
   - Limpe o cache do aplicativo
   - Verifique o uso de recursos do sistema
   - Confirme se há espaço suficiente em disco

## Suporte

Para suporte técnico:
- Email: suporte@controle-despensa.com
- Telefone: (XX) XXXX-XXXX
- Horário: Segunda a Sexta, 8h às 18h 