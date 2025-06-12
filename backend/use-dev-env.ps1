# use-dev-env.ps1
# Este script copia o .env.development para .env, sobrescrevendo o existente

$source = ".env.development"
$dest = ".env"

if (Test-Path $source) {
    Copy-Item -Path $source -Destination $dest -Force
    Write-Host "Arquivo .env configurado para DESENVOLVIMENTO." -ForegroundColor Green
} else {
    Write-Host "Arquivo $source não encontrado!" -ForegroundColor Red
}