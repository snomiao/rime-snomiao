
cd %~dp0
cd ..


@REM clean logs
del /S /Q logs\*
del /S /Q %TEMP%\rime.weasel.*

@REM copy files
robocopy Rime %APPDATA%\Rime *.yaml *.json *.txt *.ocd *.ocd2 /S

@REM deploy
cd C:\Program Files (x86)\Rime\weasel-*
WeaselDeployer.exe /deploy

cd %~dp0
debug
cd %~dp0\..
