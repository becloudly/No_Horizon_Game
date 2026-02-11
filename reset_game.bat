@echo off
echo Resetting Game Storage...
taskkill /f /im electron.exe 2>nul
rmdir /s /q "%APPDATA%\no-horizon-game" 2>nul
rmdir /s /q "%APPDATA%\Electron" 2>nul
echo Storage cleared.
