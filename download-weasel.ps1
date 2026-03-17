# Download latest Weasel (小狼毫) installer from official GitHub releases
# Usage: pwsh -ExecutionPolicy Bypass -File download-weasel.ps1

$repo = "rime/weasel"
$apiUrl = "https://api.github.com/repos/$repo/releases/latest"

Write-Host "Fetching latest Weasel release info..."
$release = Invoke-RestMethod -Uri $apiUrl -Headers @{ "User-Agent" = "rime-snomiao" }
$version = $release.tag_name -replace '^v', ''
Write-Host "Latest version: $version"

$asset = $release.assets | Where-Object { $_.name -match "weasel.*installer\.exe" } | Select-Object -First 1
if (-not $asset) {
    Write-Error "No installer exe found in release assets"
    exit 1
}

$exeName = $asset.name
$downloadUrl = $asset.browser_download_url
$destPath = Join-Path $PSScriptRoot $exeName

if (Test-Path $destPath) {
    Write-Host "$exeName already exists, skipping download."
} else {
    # Remove old weasel installers
    Get-Item (Join-Path $PSScriptRoot "weasel-*-installer.exe") -ErrorAction SilentlyContinue | Remove-Item
    Write-Host "Downloading $exeName from $downloadUrl ..."
    Invoke-WebRequest -Uri $downloadUrl -OutFile $destPath -UseBasicParsing
    Write-Host "Downloaded: $destPath"
}

# Update install.bat to reference the new exe name
$batPath = Join-Path $PSScriptRoot "install.bat"
$batContent = Get-Content $batPath -Raw
$updated = $batContent -replace 'weasel-[0-9.]+-installer\.exe', $exeName
if ($updated -ne $batContent) {
    Set-Content $batPath $updated -NoNewline
    Write-Host "Updated install.bat -> $exeName"
} else {
    Write-Host "install.bat already references $exeName"
}
