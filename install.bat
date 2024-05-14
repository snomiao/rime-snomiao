cd %~dp0\

echo [RIME-SNOMIAO] receipe installing...

robocopy ./Rime %APPDATA%\Rime *.yaml /S /XD node_modules /XF pnpm-lock.yaml
robocopy ./Rime/opencc %APPDATA%\Rime\opencc *.json *.txt *.ocd *.ocd2 /S

echo [RIME-SNOMIAO] Weasel Deploy
cd C:\Program Files (x86)\Rime\weasel-*
taskkill /f /im WeaselServer.exe

cmd /c WeaselDeployer.exe
cmd /c WeaselServer.exe

cd %~dp0\..
