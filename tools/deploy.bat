cd %~dp0\..\
@REM copy files
del /S /Q %TEMP%\rime.weasel.*
robocopy Rime %APPDATA%\Rime *.yaml *.json *.txt *.ocd *.ocd2 /S

@REM deploy
cd C:\Program Files (x86)\Rime\weasel-*
WeaselDeployer.exe /deploy

cd %~dp0\..