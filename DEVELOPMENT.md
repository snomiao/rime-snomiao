# Development

## Dev on windows

1. backup your %APPDATA%

2. Link this repo into Rime data directory

```
rimraf -rf ./build
killall WeaselDeployer
killall WeaselServer
rimraf -rf %APPDATA%\Rime
mklink /J .\Rime %APPDATA%\Rime
```

3. Watch & re-deploy

```bat
echo [RIME-SNOMIAO] Weasel Deploy

cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselServer.exe"
cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselDeployer.exe"
cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselDeployer.exe /deploy"

cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && start ."

```
