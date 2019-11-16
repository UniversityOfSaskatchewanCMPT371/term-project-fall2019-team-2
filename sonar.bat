@echo off
call lint.bat
call npm run --silent mesa:test:ci
if "%ComputerName%" == "MESA-MSI" (
    call sonar-scanner.bat -D"project.settings=mesa-sonar-project.properties" -D"sonar.projectKey=local_timeline" -D"sonar.sources=." -D"sonar.host.url=http://localhost:9000" -D"sonar.login=89ee6778293150c16c92e270baf31b7bc33690b8"
) else (
    call sonar-scanner.bat -D"project.settings=mesa-sonar-project.properties" -D"sonar.projectKey=local_timeline" -D"sonar.sources=." -D"sonar.host.url=http://localhost:9000" -D"sonar.login=6c43e9e34cc7eec27f67f80d57a47cf5772d1306"
)
