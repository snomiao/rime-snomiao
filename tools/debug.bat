
cd %~dp0\..

@REM check logs
mkdir logs || echo mkdir logs
copy %TEMP%\rime.weasel.* logs\

@REM open
move logs\rime.weasel.*.ERROR.* logs\ERROR.log
move logs\rime.weasel.*.INFO.* logs\INFO.log
move logs\rime.weasel.*.WARNING.* logs\WARNING.log

cmd /c code logs\ERROR.log logs\INFO.log logs\WARNING.log

cd %~dp0\..
