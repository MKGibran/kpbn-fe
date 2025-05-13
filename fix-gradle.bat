@echo off
setlocal enabledelayedexpansion

set "GRADLE_FILE=android\app\build.gradle"
set "VAR_FILE=android\variables.gradle"

if exist "%GRADLE_FILE%" (
    echo 🔧 Memperbaiki JavaVersion di build.gradle...
    
    powershell -Command "(Get-Content -Path '%GRADLE_FILE%') -replace 'JavaVersion\.VERSION_21', 'rootProject.ext.javaVersion' | Set-Content -Path '%GRADLE_FILE%'"
    
    findstr /C:"javaVersion" "%VAR_FILE%" >nul
    if errorlevel 1 (
        echo Menambahkan ext.javaVersion ke variables.gradle...
        echo.>> "%VAR_FILE%"
        echo ext {>> "%VAR_FILE%"
        echo     javaVersion = JavaVersion.VERSION_17>> "%VAR_FILE%"
        echo }>> "%VAR_FILE%"
    )

    echo ✅ Selesai.
) else (
    echo ❌ File build.gradle tidak ditemukan!
)

endlocal
pause
