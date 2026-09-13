@echo off
TITLE StartIQ Launcher
echo ===================================================================
echo             STARTIQ — 6-AGENT STARTUP EVALUATION PLATFORM
echo ===================================================================
echo.
echo [1/3] Starting Python FastAPI AI Engine on Port 8000...
start "StartIQ AI Engine (Port 8000)" cmd /k "python -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo [2/3] Starting Node.js Orchestrator & DB on Port 5000...
start "StartIQ Node Orchestrator (Port 5000)" cmd /k "cd backend && npm start"

echo [3/3] Starting React Frontend on Port 3000...
start "StartIQ React Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"

echo.
echo All 3 local services launched!
echo Opening http://localhost:3000 in your browser...
timeout /t 3 >nul
start http://localhost:3000
echo.
echo Press any key to exit this launcher window (services keep running)...
pause >nul
