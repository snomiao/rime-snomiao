@chcp 65001
@echo off
cd %~dp0\
echo Current directory: %~dp0\

echo [RIME-SNOMIAO] Downloading latest Weasel...
pwsh -ExecutionPolicy Bypass -File "%~dp0download-weasel.ps1"

echo [RIME-SNOMIAO] Copying Rime schemas...
robocopy ./Rime %APPDATA%\Rime /E /XD node_modules
robocopy ./Rime/opencc %APPDATA%\Rime\opencc *.json *.txt *.ocd *.ocd2 /S

echo [RIME-SNOMIAO] Launching Weasel installer...
for %%f in (%~dp0weasel-*-installer.exe) do start "" "%%f"

start "" cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselServer.exe /install"
