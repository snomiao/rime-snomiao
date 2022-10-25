rm %TEMP%/rime.weasel.*

@REM deploy
cd C:\Program Files (x86)\Rime\weasel-*
WeaselDeployer.exe /deploy
WeaselDeployer.exe

start "" WeaselServer.exe
sleep 10

cd %~dp0

debug