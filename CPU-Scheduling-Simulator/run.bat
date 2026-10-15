@echo off
echo ===================================================
echo   COMPILING CPU SCHEDULING C PROGRAM...
echo ===================================================
gcc -o cpu_scheduling.exe cpu_scheduling.c
if %errorlevel% neq 0 (
    echo.
    echo Compilation failed! Please ensure GCC (MinGW / Code::Blocks / Dev-C++) is installed.
    pause
    exit /b %errorlevel%
)
echo.
echo Compilation successful! Running program...
echo ===================================================
echo.
cpu_scheduling.exe
echo.
pause
