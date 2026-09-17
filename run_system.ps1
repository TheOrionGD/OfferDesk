<#
.SYNOPSIS
    OfferDesk SaaS Ecosystem - Master System Orchestrator Script (run_system.ps1)

.DESCRIPTION
    Launches, manages, and monitors all services in the OfferDesk ecosystem:
    1. Node.js Express Backend Service (Port 5001)
    2. Python ML FastAPI Engine (Port 8000)
    3. React Web App Portal (Port 3000)

.PARAMETER Mode
    Launch mode: "Windowed" (default, opens color-coded individual terminal windows)
    or "Background" (runs processes as PowerShell background jobs).

.PARAMETER Stop
    Stops all running OfferDesk processes listening on ports 5001, 8000, and 3000.

.PARAMETER CheckOnly
    Runs environment and dependency pre-flight checks without starting the services.

.PARAMETER SkipCheck
    Skips pre-flight dependency checks and starts services immediately.

.EXAMPLE
    .\run_system.ps1
    Launches all services in dedicated windowed terminals after pre-flight checks.

.EXAMPLE
    .\run_system.ps1 -Stop
    Terminates all running processes on ports 5001, 8000, and 3000.

.EXAMPLE
    .\run_system.ps1 -CheckOnly
    Performs pre-flight checks and prints environment status report.
#>

[CmdletBinding()]
param(
    [ValidateSet("Windowed", "Background")]
    [string]$Mode = "Windowed",

    [switch]$Stop,
    [switch]$CheckOnly,
    [switch]$SkipCheck
)

$ErrorActionPreference = "Stop"
$ScriptDir = $PSScriptRoot

# Set Window Title
$Host.UI.RawUI.WindowTitle = "OfferDesk SaaS System Orchestrator"

# Helper Functions for Formatted Output
function Write-Header {
    param([string]$Text)
    Write-Host "`n================================================================================" -ForegroundColor DarkCyan
    Write-Host "  $Text" -ForegroundColor Cyan
    Write-Host "================================================================================" -ForegroundColor DarkCyan
}

function Write-Success { param([string]$Text) Write-Host "  [OK] $Text" -ForegroundColor Green }
function Write-Warn { param([string]$Text) Write-Host "  [WARN] $Text" -ForegroundColor Yellow }
function Write-Info { param([string]$Text) Write-Host "  [INFO] $Text" -ForegroundColor White }
function Write-Err { param([string]$Text) Write-Host "  [ERROR] $Text" -ForegroundColor Red }

# Function to get PID listening on a given TCP port
function Get-ProcessByPort {
    param([int]$Port)
    try {
        if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
            $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($conn) { return $conn.OwningProcess }
        }
    } catch {}

    # Fallback to netstat if Get-NetTCPConnection isn't available or fails
    try {
        $netstatOutput = netstat -ano | Select-String ":$Port\s+.*LISTENING\s+(\d+)"
        if ($netstatOutput) {
            $matches = [regex]::Match($netstatOutput, "LISTENING\s+(\d+)")
            if ($matches.Success) {
                return [int]$matches.Groups[1].Value
            }
        }
    } catch {}

    return $null
}

# Function to stop processes on specified ports
function Stop-OfferDeskServices {
    Write-Header "STOPPING ALL OFFERDESK SERVICES"
    $ports = @(
        @{ Name = "Node Express Backend"; Port = 5001 },
        @{ Name = "Python ML Engine"; Port = 8000 },
        @{ Name = "React Web App"; Port = 3000 }
    )

    $stoppedCount = 0
    foreach ($item in $ports) {
        $targetPid = Get-ProcessByPort -Port $item.Port
        if ($targetPid) {
            try {
                $proc = Get-Process -Id $targetPid -ErrorAction SilentlyContinue
                $procName = if ($proc) { $proc.ProcessName } else { "PID $targetPid" }
                Write-Host "  Found $($item.Name) running on Port $($item.Port) (PID $targetPid - $procName). Terminating..." -ForegroundColor Yellow
                Stop-Process -Id $targetPid -Force -ErrorAction SilentlyContinue
                Write-Success "$($item.Name) on Port $($item.Port) stopped successfully."
                $stoppedCount++
            } catch {
                Write-Err "Failed to terminate process PID $targetPid on Port $($item.Port): $_"
            }
        } else {
            Write-Info "$($item.Name) is not currently running on Port $($item.Port)."
        }
    }

    if ($stoppedCount -gt 0) {
        Write-Host "`n  Successfully stopped $stoppedCount active service(s)." -ForegroundColor Green
    } else {
        Write-Host "`n  No active OfferDesk services were found on ports 5001, 8000, or 3000." -ForegroundColor Gray
    }
}

# If -Stop parameter was passed, run stop routine and exit
if ($Stop) {
    Stop-OfferDeskServices
    exit 0
}

# Display Banner
Write-Host @"

  ==============================================================================
   ____   ______ ______  ______ _____  _____  ______  _____  _  __
  / __ \ / ||  /| ||  / / ||  /_   _|/ ____|/ ||  / / ____|| |/ /
 / /  / /  || / | || / /  || /  | | | |  __/  || / | (___  | ' / 
| |  | |   ||/  | ||/ |   ||/   | | | | |_ |  ||/   \___ \ |  <  
| |__| |   ||   | ||  |   ||   _| |_| |__| |  ||    ____) || . \ 
 \____/   |_||  |_||  |_  ||  |_____|\_____| |_||   |_____/ |_|\_\
  ==============================================================================
                    OFFERDESK SYSTEM LAUNCHER
  ==============================================================================
"@ -ForegroundColor DarkCyan

# Pre-flight Check Section
if (-not $SkipCheck) {
    Write-Header "RUNNING PRE-FLIGHT ENVIRONMENT & DEPENDENCY CHECKS"

    # 1. Node.js check
    try {
        $nodeVersion = node --version 2>&1
        Write-Success "Node.js detected: $nodeVersion"
    } catch {
        Write-Err "Node.js is not installed or not in PATH! Please install Node.js (v18+ recommended)."
        exit 1
    }

    # 2. Python check
    try {
        $pythonVersion = python --version 2>&1
        Write-Success "Python detected: $pythonVersion"
    } catch {
        Write-Warn "Python command not found directly in PATH."
    }

    # 3. Check Environment Files (.env)
    $envFiles = @(
        @{ Target = "$ScriptDir\.env"; Example = "$ScriptDir\.env.example"; Name = "Root System .env" },
        @{ Target = "$ScriptDir\services\js-services\.env"; Example = "$ScriptDir\services\js-services\.env.example"; Name = "Express Backend .env" },
        @{ Target = "$ScriptDir\services\ml-services\.env"; Example = "$ScriptDir\services\ml-services\.env.example"; Name = "Python ML Engine .env" },
        @{ Target = "$ScriptDir\app\.env"; Example = "$ScriptDir\app\.env.example"; Name = "React Web App .env" }
    )

    foreach ($item in $envFiles) {
        if (Test-Path $item.Target) {
            Write-Success "Found $($item.Name)"
        } elseif (Test-Path $item.Example) {
            Write-Warn "$($item.Name) missing! Auto-copying from $($item.Example)..."
            Copy-Item -Path $item.Example -Destination $item.Target
            Write-Success "Created $($item.Name) from template."
        } else {
            Write-Warn "$($item.Name) missing and no example file found."
        }
    }

    # 4. Check Node Dependencies
    if (Test-Path "$ScriptDir\services\js-services\node_modules") {
        Write-Success "JS Services dependencies (node_modules) found."
    } else {
        Write-Warn "JS Services node_modules missing. Run 'cd services/js-services && npm install' if startup fails."
    }

    if (Test-Path "$ScriptDir\app\node_modules") {
        Write-Success "React App dependencies (node_modules) found."
    } else {
        Write-Warn "React App node_modules missing. Run 'cd app && npm install' if startup fails."
    }

    # 5. Check Python Virtualenv
    $venvPath = "$ScriptDir\services\ml-services\.venv"
    if (Test-Path $venvPath) {
        Write-Success "Python virtual environment (.venv) found in services/ml-services."
    } else {
        Write-Warn "Python virtual environment (.venv) not found in services/ml-services."
    }

    # 6. Check Port Conflicts
    $portsToCheck = @(
        @{ Name = "Express Backend API"; Port = 5001 },
        @{ Name = "Python ML Engine"; Port = 8000 },
        @{ Name = "React Web App"; Port = 3000 }
    )

    foreach ($item in $portsToCheck) {
        $targetPid = Get-ProcessByPort -Port $item.Port
        if ($targetPid) {
            Write-Warn "Port $($item.Port) ($($item.Name)) is currently occupied by process PID $targetPid."
            Write-Host "       (Run '.\run_system.ps1 -Stop' to clear occupied ports before starting)" -ForegroundColor Yellow
        } else {
            Write-Success "Port $($item.Port) ($($item.Name)) is clear and available."
        }
    }
}

if ($CheckOnly) {
    Write-Header "PRE-FLIGHT CHECKS COMPLETED"
    Write-Host "  System state verified. Exiting (-CheckOnly specified).`n" -ForegroundColor Green
    exit 0
}

# Determine Uvicorn Command for ML Engine
$mlVenvPython = "$ScriptDir\services\ml-services\.venv\Scripts\python.exe"
if (Test-Path $mlVenvPython) {
    $mlCmd = "& '$mlVenvPython' -m uvicorn main:app --reload --port 8000 --host 127.0.0.1"
} else {
    $mlCmd = "python -m uvicorn main:app --reload --port 8000 --host 127.0.0.1"
}

Write-Header "LAUNCHING OFFERDESK MICROSERVICES (Mode: $Mode)"

if ($Mode -eq "Windowed") {
    # 1. Express Backend
    Write-Info "Spawning Node.js Express Backend Service Window (Port 5001)..."
    $expressScript = "Set-Location '$ScriptDir\services\js-services'; `$Host.UI.RawUI.WindowTitle = '⚡ OfferDesk - Express Backend API (5001)'; Write-Host '==================================================' -ForegroundColor Cyan; Write-Host '⚡ STARTING EXPRESS API BACKEND (Port 5001)...' -ForegroundColor Green; Write-Host '==================================================' -ForegroundColor Cyan; npm start"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $expressScript

    # 2. Python ML Engine
    Write-Info "Spawning Python ML FastAPI Engine Window (Port 8000)..."
    $mlScript = "Set-Location '$ScriptDir\services\ml-services'; `$Host.UI.RawUI.WindowTitle = '🧠 OfferDesk - Python ML Engine (8000)'; Write-Host '==================================================' -ForegroundColor Magenta; Write-Host '🧠 STARTING PYTHON ML FASTAPI ENGINE (Port 8000)...' -ForegroundColor Green; Write-Host '==================================================' -ForegroundColor Magenta; $mlCmd"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $mlScript

    # 3. React Web App
    Write-Info "Spawning React Web App Portal Window (Port 3000)..."
    $appScript = "Set-Location '$ScriptDir\app'; `$Host.UI.RawUI.WindowTitle = '🚀 OfferDesk - React Web App (3000)'; Write-Host '==================================================' -ForegroundColor Yellow; Write-Host '🚀 STARTING REACT WEB APP PORTAL (Port 3000)...' -ForegroundColor Green; Write-Host '==================================================' -ForegroundColor Yellow; npm start"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $appScript

} elseif ($Mode -eq "Background") {
    Write-Info "Starting Express Backend in background job..."
    Start-Job -Name "OfferDesk-ExpressBackend" -ScriptBlock {
        param($path)
        Set-Location $path
        npm start
    } -ArgumentList "$ScriptDir\services\js-services"

    Write-Info "Starting Python ML Engine in background job..."
    Start-Job -Name "OfferDesk-MLEngine" -ScriptBlock {
        param($path, $cmd)
        Set-Location $path
        Invoke-Expression $cmd
    } -ArgumentList "$ScriptDir\services\ml-services", $mlCmd

    Write-Info "Starting React Web App in background job..."
    Start-Job -Name "OfferDesk-WebApp" -ScriptBlock {
        param($path)
        Set-Location $path
        npm start
    } -ArgumentList "$ScriptDir\app"

    Write-Success "Background jobs initialized. Use Get-Job to inspect status."
}

# Display Status Dashboard & Links
Write-Header "OFFERDESK ECOSYSTEM RUNNING"

Write-Host @"

  ==============================================================================
   SERVICE ENDPOINTS & PORT DASHBOARD
  ==============================================================================

   🚀 React Web Portal:         http://localhost:3000
   ⚡ Express REST API:          http://localhost:5001
   🧠 ML Engine & API Docs:      http://localhost:8000/docs

  ==============================================================================
   CONTROL COMMANDS & USEFUL TIPS
  ==============================================================================

   * To stop all running services:   .\run_system.ps1 -Stop
   * To re-verify system health:     .\run_system.ps1 -CheckOnly
   * MongoDB Atlas URI:               Configured in root .env

  ==============================================================================
"@ -ForegroundColor Green
