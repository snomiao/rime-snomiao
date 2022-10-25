cd %~dp0

cd Rime
robocopy . %APPDATA%\Rime\ *.yaml *.json *.txt /S
cd %~dp0

deploy
