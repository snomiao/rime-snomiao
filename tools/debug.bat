@echo off
cd %~dp0\..

@REM check logs
del /S /Q logs\*
mkdir logs || echo mkdir logs
@REM copy %TEMP%\rime.weasel.* logs\

@REM open
copy %TEMP%\rime.*ERROR* logs\ERROR.log && cmd /c code logs\ERROR.log
@REM copy %TEMP%\rime.*INFO* logs\INFO.log && cmd /c code logs\INFO.log
copy %TEMP%\rime.*WARNING* logs\WARNING.log && cmd /c code logs\WARNING.log

cd %~dp0\..
