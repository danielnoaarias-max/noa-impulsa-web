@echo off
title Subir cambios - NOA IMPULSA
color 0A
cd /d "%~dp0"
echo.
echo  ========================================================
echo    SUBIENDO TU WEB A INTERNET
echo  ========================================================
echo.
"C:\Program Files\Git\cmd\git.exe" add -A
"C:\Program Files\Git\cmd\git.exe" commit -m "Cambios en la web"
"C:\Program Files\Git\cmd\git.exe" push
echo.
echo  ========================================================
echo    Listo. En 1 o 2 minutos se vera actualizada en:
echo    https://danielnoaarias-max.github.io/noa-impulsa-web/
echo  ========================================================
echo.
pause
