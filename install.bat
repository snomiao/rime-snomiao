@chcp 65001
@echo off

@REM cmd /U /c install.bat
cd %~dp0\
echo Current directorsy: %~dp0\

echo "[RIME-SNOMIAO] 正在安装輸入方案"

robocopy ./Rime %APPDATA%\Rime *.yaml /S /XD node_modules /XF pnpm-lock.yaml
robocopy ./Rime/opencc %APPDATA%\Rime\opencc *.json *.txt *.ocd *.ocd2 /S

echo "[RIME-SNOMIAO] 接下準備啓動輸入法安装程序"

echo "[RIME-SNOMIAO] 正在啓動 weasel 輸入法安装程序"
start "" ./weasel-0.15.0.0-installer.exe

@REM pause
@REM echo "[RIME-SNOMIAO] Weasel Deploy"
@REM cd C:\Program Files (x86)\Rime\weasel-*
@REM taskkill /f /im WeaselServer.exe

@REM cmd /c WeaselDeployer.exe
@REM cmd /c WeaselServer.exe

@REM cd %~dp0\..
