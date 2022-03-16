cd %~dp0
robocopy . %APPDATA%\Rime\ *.yaml *.json *.txt /S

cd C:\Program Files (x86)\Rime\weasel-*
WeaselDeployer.exe

cd %~dp0
