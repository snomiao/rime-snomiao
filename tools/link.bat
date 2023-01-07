
cd %~dp0\..

taskkill /f /im WeaselServer.exe
move %APPDATA%\Rime %APPDATA%\Rime-bak-snomiao2
@REM mklink /J %APPDATA%\Rime Rime
mklink /D %APPDATA%\Rime Rime

cd %~dp0\..
