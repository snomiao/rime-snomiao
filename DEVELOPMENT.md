# Development

## Dev on windows

1. backup your %APPDATA%

2. Link Rime data into this repo into

```
rimraf -rf ./build
taskkill /f /im WeaselDeployer.exe
taskkill /f /im WeaselServer.exe
cp -r %APPDATA%/Rime/build ./Rime
cp -r %APPDATA%/Rime/*.userdb ./Rime
rimraf -rf %APPDATA%\Rime
move ./Rime %APPDATA%/Rime
mklink /J .\Rime %APPDATA%\Rime
cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselDeployer.exe /deploy"
cmd /c "cd C:\Program Files (x86)\Rime\weasel-* && WeaselServer.exe /install"
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

4. Before Publish

mv -r ./Rime ./Rime-tmp
cp -r ./Rime-tmp ./Rime
