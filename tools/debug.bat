cd %~dp0\..
del /S /Q logs\*

@REM check logs
mkdir logs || echo mkdir logs
copy %TEMP%\rime.weasel.* logs\
@REM code %~dp0/logs/*

cd %~dp0\..