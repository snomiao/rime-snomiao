rm %TEMP%/rime.weasel.*

@REM deploy
cd C:\Program Files (x86)\Rime\weasel-*
WeaselDeployer.exe /deploy
@REM WeaselDeployer.exe

@REM start "" WeaselServer.exe
@REM sleep 10

cd %~dp0

@REM debug