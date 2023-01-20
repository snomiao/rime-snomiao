cd %~dp0\..
robocopy Rime %APPDATA%\Rime *.yaml *.json *.txt *.ocd *.ocd2 /S

echo weasel deploy start
cd C:\Program Files (x86)\Rime\weasel-*

WeaselDeployer.exe
start "" WeaselServer.exe

cd %~dp0\..