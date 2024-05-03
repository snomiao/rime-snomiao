# Development

## Dev on windows

1. backup your %APPDATA%

2. Link this repo into Rime data directory

```
killall WeaselDeployer
killall WeaselServer
rimraf -rf %APPDATA%\Rime && mklink /J %APPDATA%\Rime .\
```

3. Watch & re-deploy

```
echo [RIME-SNOMIAO] Weasel Deploy


cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselDeployer.exe"

# launch server, wait for compile
cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselServer.exe"

```
