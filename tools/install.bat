cd %~dp0\..

echo [RIME-SNOMIAO] receipe installing...
robocopy ./ %APPDATA%\Rime *.yaml /S
robocopy ./opencc %APPDATA%\Rime\opencc *.json *.txt *.ocd *.ocd2 /S

echo [RIME-SNOMIAO] Weasel Deploy
cd C:\Program Files (x86)\Rime\weasel-*
cmd /c WeaselDeployer.exe
cmd /c WeaselServer.exe

cd %~dp0\..