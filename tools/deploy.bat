@echo off

cd %~dp0
cd ..


@REM clean outdated logs
del /S /Q %TEMP%\rime.weasel.*

@REM depreacted, use junction link to develop
@REM copy files
@REM robocopy Rime %APPDATA%\Rime *.yaml *.json *.txt *.ocd *.ocd2 /S

@REM deploy
cd C:\Program Files (x86)\Rime\weasel-*
WeaselDeployer.exe /deploy
@REM WeaselServer.exe
@REM copy data\default.yaml

cd %~dp0
ping localhost
debug
cd %~dp0\..
