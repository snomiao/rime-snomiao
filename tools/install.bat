cd %~dp0\..
robocopy Rime %APPDATA%\Rime *.yaml *.json *.txt *.ocd *.ocd2 /S
WeaselDeployer.exe
start "" WeaselServer.exe
cd %~dp0\..