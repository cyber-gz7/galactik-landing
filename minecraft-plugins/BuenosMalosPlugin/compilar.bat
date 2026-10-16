@echo off
TITLE BuenosMalosPlugin — Compilador Maven

cd /d "C:\Users\GZ7\AppData\Local\Programs\minelive\BuenosMalosPlugin"

echo.
echo ============================================
echo  BuenosMalosPlugin — Compilacion Maven
echo ============================================
echo.

:: Verificar Maven
mvn --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven no encontrado en PATH.
    echo [INFO]  Descarga Maven: https://maven.apache.org/download.cgi
    echo [INFO]  O usa el Maven wrapper si tienes IntelliJ / VS Code con Extension Pack for Java.
    echo.
    echo [ALTERNATIVA] Si tienes IntelliJ IDEA:
    echo   1. Abre la carpeta BuenosMalosPlugin como proyecto Maven
    echo   2. Click derecho en pom.xml ^> Maven ^> package
    echo.
    pause
    exit /b 1
)

echo [OK] Maven detectado:
mvn --version

echo.
echo [INFO] Compilando plugin...
mvn clean package -q

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] La compilacion fallo. Revisa los errores arriba.
    pause
    exit /b 1
)

echo.
echo [OK] Plugin compilado exitosamente!
echo [INFO] JAR generado en: target\BuenosMalosPlugin-1.0.0.jar
echo.

SET "JAR_FILE=C:\Users\GZ7\AppData\Local\Programs\minelive\BuenosMalosPlugin\target\BuenosMalosPlugin-1.0.0.jar"
SET "PLUGINS_DIR=C:\Users\GZ7\AppData\Local\Programs\minelive\server\plugins"

IF EXIST "%PLUGINS_DIR%" (
    echo [INFO] Copiando JAR a carpeta plugins del servidor...
    copy /Y "%JAR_FILE%" "%PLUGINS_DIR%\"
    echo [OK] Copiado a: %PLUGINS_DIR%
) ELSE (
    echo [AVISO] No se encontro carpeta de plugins en: %PLUGINS_DIR%
    echo [INFO]  Copia manualmente el JAR desde:
    echo         %JAR_FILE%
    echo         a la carpeta plugins/ de tu servidor Paper.
)

echo.
pause
