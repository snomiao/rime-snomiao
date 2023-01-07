cd %~dp0

taskkill /f /im WeaselServer.exe

move %APPDATA%\Rime %APPDATA%\Rime-bak-snomiao
npx junction-move Rime %APPDATA%\Rime

cd C:\Program Files (x86)\Rime\weasel-*
WeaselServer.exe
WeaselDeployer.exe /deploy

cd %~dp0
