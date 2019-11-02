call lint.bat
call npm run --silent mesa:test:ci
call sonar-scanner.bat -D"project.settings=mesa-sonar-project.properties" -D"sonar.projectKey=local_timeline" -D"sonar.sources=." -D"sonar.host.url=http://localhost:9000" -D"sonar.login=6c43e9e34cc7eec27f67f80d57a47cf5772d1306"
