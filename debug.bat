cd %~dp0
rm %~dp0/logs/*

@REM check logs
mkdir logs || echo mkdir logs
cp %TEMP%/rime.weasel.* %~dp0/logs/
@REM code %~dp0/logs/*
