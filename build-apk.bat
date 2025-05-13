@echo off
echo [1/4] Syncing Capacitor...
npx cap sync android

echo [2/4] Applying Gradle fix...
echo.
gradlew.bat clean

echo [3/4] Building APK...
gradlew.bat assembleRelease

echo [4/4] APK Build Completed!
echo APK path:
echo android\app\build\outputs\apk\release\app-release.apk
pause
