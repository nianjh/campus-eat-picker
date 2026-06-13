@echo off
:: 双击运行即可，内部调用 deploy.ps1
powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
