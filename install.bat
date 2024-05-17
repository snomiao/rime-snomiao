@chcp 65001
@echo off

@REM cmd /U /c install.bat
cd %~dp0\

echo "[RIME-SNOMIAO] 接下準備啓動輸入法安装程序"
pause

echo "[RIME-SNOMIAO] 正在啓動 weasel 輸入法安装程序，請手動完成安装，然後回到这里"
start "" weasel-0.15.0.0-installer.exe


echo "[RIME-SNOMIAO] 接下来準備安装輸入方案"
pause

echo "[RIME-SNOMIAO] 正在安装輸入方案"

robocopy ./Rime %APPDATA%\Rime *.yaml /S /XD node_modules /XF pnpm-lock.yaml
robocopy ./Rime/opencc %APPDATA%\Rime\opencc *.json *.txt *.ocd *.ocd2 /S

echo "[RIME-SNOMIAO] Weasel Deploy"
cd C:\Program Files (x86)\Rime\weasel-*
taskkill /f /im WeaselServer.exe

cmd /c WeaselDeployer.exe
cmd /c WeaselServer.exe

cd %~dp0\..
