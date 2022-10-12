cd %~dp0

cd Rime
robocopy . %APPDATA%\Rime\ *.yaml *.json *.txt /S

cd C:\Program Files (x86)\Rime\weasel-*
WeaselDeployer.exe /deploy
WeaselDeployer.exe

cd %~dp0
