@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   SEARCHING FOR C COMPILER (GCC / MinGW)...
echo ===================================================

set "GCC_PATH="

:: Check system PATH first
where gcc >nul 2>nul
if %errorlevel% equ 0 (
    set "GCC_PATH=gcc"
    goto COMPILE
)

:: Check common MinGW / Dev-C++ / CodeBlocks installation paths
if exist "C:\MinGW\bin\gcc.exe" set "GCC_PATH=C:\MinGW\bin\gcc.exe"
if exist "C:\Program Files (x86)\Dev-Cpp\MinGW64\bin\gcc.exe" set "GCC_PATH=C:\Program Files (x86)\Dev-Cpp\MinGW64\bin\gcc.exe"
if exist "C:\Program Files\Dev-Cpp\MinGW64\bin\gcc.exe" set "GCC_PATH=C:\Program Files\Dev-Cpp\MinGW64\bin\gcc.exe"
if exist "C:\Program Files\CodeBlocks\MinGW\bin\gcc.exe" set "GCC_PATH=C:\Program Files\CodeBlocks\MinGW\bin\gcc.exe"
if exist "C:\Program Files (x86)\CodeBlocks\MinGW\bin\gcc.exe" set "GCC_PATH=C:\Program Files (x86)\CodeBlocks\MinGW\bin\gcc.exe"
if exist "C:\TDM-GCC-64\bin\gcc.exe" set "GCC_PATH=C:\TDM-GCC-64\bin\gcc.exe"
if exist "C:\TDM-GCC-32\bin\gcc.exe" set "GCC_PATH=C:\TDM-GCC-32\bin\gcc.exe"
if exist "C:\mingw64\bin\gcc.exe" set "GCC_PATH=C:\mingw64\bin\gcc.exe"
if exist "C:\msys64\ucrt64\bin\gcc.exe" set "GCC_PATH=C:\msys64\ucrt64\bin\gcc.exe"
if exist "C:\msys64\mingw64\bin\gcc.exe" set "GCC_PATH=C:\msys64\mingw64\bin\gcc.exe"

:COMPILE
if "%GCC_PATH%"=="" (
    echo.
    echo [ERROR] GCC Compiler not found on your system PATH!
    echo.
    echo To fix this:
    echo 1. Use an Online C Compiler (e.g., https://www.onlinegdb.com/online_c_compiler)
    echo 2. OR Install Dev-C++, Code::Blocks, or MinGW on Windows.
    echo.
    pause
    exit /b 1
)

echo Found compiler: "!GCC_PATH!"
echo.
echo Compiling cpu_scheduling.c ...
"!GCC_PATH!" -o cpu_scheduling.exe cpu_scheduling.c

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Compilation failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo   COMPILATION SUCCESSFUL! RUNNING PROGRAM...
echo ===================================================
echo.
cpu_scheduling.exe

echo.
pause
