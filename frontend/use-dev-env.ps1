# Script para voltar as variáveis de ambiente do frontend para desenvolvimento
$envDevPath = ".env.development"
$envDevBackupPath = ".env.development.backup"

# Verifica se existe backup do .env.development
if (-not (Test-Path $envDevBackupPath)) {
    Write-Host "Erro: Backup do .env.development não encontrado!"
    exit 1
}

# Restaura o .env.development do backup
Copy-Item $envDevBackupPath $envDevPath -Force
Write-Host "Variáveis de ambiente restauradas para desenvolvimento com sucesso!" 