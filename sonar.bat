@echo off
call npm run wint -- --fix
if errorlevel 1 (
    echo wint failed with errorlevel %errorlevel%
    goto end
)

set CI=true
call npm run build
if errorlevel 1 (
    echo build failed with errorlevel %errorlevel%
    goto end
)

call npm run --silent mesa:test:ci
if errorlevel 1 (
    echo test failed with errorlevel %errorlevel%
    goto end
)

if "%ComputerName%" == "MESA-MSI" (
    call sonar-scanner.bat -D"project.settings=mesa-sonar-project.properties" -D"sonar.projectKey=local_timeline" -D"sonar.sources=." -D"sonar.host.url=http://localhost:9000" -D"sonar.login=89ee6778293150c16c92e270baf31b7bc33690b8"
)
if "%ComputerName%" == "MECHA-JESUS"(
    call sonar-scanner.bat -D"project.settings=mesa-sonar-project.properties" -D"sonar.projectKey=local_timeline" -D"sonar.sources=." -D"sonar.host.url=http://localhost:9000" -D"sonar.login=6c43e9e34cc7eec27f67f80d57a47cf5772d1306"
)

:end
set CI=