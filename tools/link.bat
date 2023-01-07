cd %~dp0

taskkill /f /im WeaselServer.exe

move %APPDATA%\Rime %APPDATA%\Rime-bak-snomiao6

mklink /J %APPDATA%\Rime Rime

rm -rf %APPDATA%\Rime
mklink /D %APPDATA%\Rime Rime

cd C:\Program Files (x86)\Rime\weasel-*
WeaselServer.exe
@REM WeaselDeployer.exe /deploy

cd %~dp0
