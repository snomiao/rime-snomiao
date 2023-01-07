
cd %~dp0\..

taskkill /f /im WeaselServer.exe
move %APPDATA%\Rime %APPDATA%\Rime-bak-snomiao
mklink /J %APPDATA%\Rime Rime

cd %~dp0\..
