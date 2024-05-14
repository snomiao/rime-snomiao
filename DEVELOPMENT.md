# Development

## Dev on windows

1. backup your %APPDATA%

2. Link Rime data into this repo into

```
rimraf -rf ./build
taskkill /f /im WeaselDeployer
taskkill /f /im WeaselServer
rimraf -rf %APPDATA%\Rime
move ./Rime %APPDATA%/Rime
mklink /J .\Rime %APPDATA%\Rime
```

3. Watch & re-deploy

```bat
echo [RIME-SNOMIAO] Weasel Deploy

cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselServer.exe"
cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselDeployer.exe"
cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselDeployer.exe /deploy"


cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && start ."

REM install
cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselDeployer.exe /install"
```
