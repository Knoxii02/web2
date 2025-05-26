# PowerShell Script for Project Restructuring (Windows)
#
# IMPORTANT:
# 1. Save this script as restructure_project.ps1 in the root of your repository.
# 2. Run it from PowerShell in that root directory.
# 3. This script performs file operations. REVIEW IT CAREFULLY BEFORE RUNNING.
# 4. Some steps (editing JSON, creating new JS file content) will still require manual intervention.
#    This script will guide you at those points.
# 5. It's recommended to have a backup of your 'Website' folder before running.

# --- Configuration ---
$WebsiteFolder = "Website" # Name of the main project folder
$BaseDir = Get-Location    # Assumes script is run from the repository root

Write-Host "Starting project restructuring for folder: $($BaseDir)\$WebsiteFolder"
Write-Host "--------------------------------------------------------"

# --- Step 1: Create New Directory Structure ---
Write-Host "Step 1: Creating new directory structure..."

$FrontendDir = Join-Path $BaseDir -ChildPath "$WebsiteFolder\frontend"
$BackendDir = Join-Path $BaseDir -ChildPath "$WebsiteFolder\backend"
$BackendDbDir = Join-Path $BaseDir -ChildPath "$WebsiteFolder\backend\db"
$BackendScriptsDir = Join-Path $BaseDir -ChildPath "$WebsiteFolder\backend\scripts"

if (-not (Test-Path $FrontendDir)) { New-Item -ItemType Directory -Path $FrontendDir -Force | Out-Null }
if (-not (Test-Path $BackendDir)) { New-Item -ItemType Directory -Path $BackendDir -Force | Out-Null }
if (-not (Test-Path $BackendDbDir)) { New-Item -ItemType Directory -Path $BackendDbDir -Force | Out-Null }
if (-not (Test-Path $BackendScriptsDir)) { New-Item -ItemType Directory -Path $BackendScriptsDir -Force | Out-Null }

Write-Host "Created:"
Write-Host "- $FrontendDir"
Write-Host "- $BackendDir"
Write-Host "- $BackendDbDir"
Write-Host "- $BackendScriptsDir"
Write-Host "Step 1: Complete."
Write-Host "--------------------------------------------------------"

# --- Step 2: Move Existing Files and Folders ---
Write-Host "Step 2: Moving existing files and folders..."

# Frontend Assets
$SourceCss = Join-Path $BaseDir -ChildPath "$WebsiteFolder\css"
$SourceHtml = Join-Path $BaseDir -ChildPath "$WebsiteFolder\html"
$SourceJs = Join-Path $BaseDir -ChildPath "$WebsiteFolder\js" # Client-side JS
$SourcePictures = Join-Path $BaseDir -ChildPath "$WebsiteFolder\pictures"

if (Test-Path $SourceCss) { Move-Item -Path $SourceCss -Destination $FrontendDir -Force; Write-Host "- Moved $SourceCss to $FrontendDir" } else { Write-Warning "- Source $SourceCss not found." }
if (Test-Path $SourceHtml) { Move-Item -Path $SourceHtml -Destination $FrontendDir -Force; Write-Host "- Moved $SourceHtml to $FrontendDir" } else { Write-Warning "- Source $SourceHtml not found." }
if (Test-Path $SourceJs) { Move-Item -Path $SourceJs -Destination $FrontendDir -Force; Write-Host "- Moved $SourceJs to $FrontendDir" } else { Write-Warning "- Source $SourceJs not found." }
if (Test-Path $SourcePictures) { Move-Item -Path $SourcePictures -Destination $FrontendDir -Force; Write-Host "- Moved $SourcePictures to $FrontendDir" } else { Write-Warning "- Source $SourcePictures not found." }

# Backend Assets
$SourceServerJs = Join-Path $BaseDir -ChildPath "$WebsiteFolder\server.js"
$SourceDbSetupSql = Join-Path $BaseDir -ChildPath "$WebsiteFolder\db\database_setup.sql"
$SourceDbSqlite = Join-Path $BaseDir -ChildPath "$WebsiteFolder\db\database.sqlite" # Might not exist if not initialized
$SourceSetupDbJs = Join-Path $BaseDir -ChildPath "$WebsiteFolder\scripts\setup_db.js"

if (Test-Path $SourceServerJs) { Move-Item -Path $SourceServerJs -Destination $BackendDir -Force; Write-Host "- Moved $SourceServerJs to $BackendDir" } else { Write-Warning "- Source $SourceServerJs not found." }
if (Test-Path $SourceDbSetupSql) { Move-Item -Path $SourceDbSetupSql -Destination $BackendDbDir -Force; Write-Host "- Moved $SourceDbSetupSql to $BackendDbDir" } else { Write-Warning "- Source $SourceDbSetupSql not found." }
if (Test-Path $SourceDbSqlite) { Move-Item -Path $SourceDbSqlite -Destination $BackendDbDir -Force; Write-Host "- Moved $SourceDbSqlite to $BackendDbDir" } else { Write-Warning "- Source $SourceDbSqlite not found (this is okay if DB wasn't initialized yet)." }
if (Test-Path $SourceSetupDbJs) { Move-Item -Path $SourceSetupDbJs -Destination $BackendScriptsDir -Force; Write-Host "- Moved $SourceSetupDbJs to $BackendScriptsDir" } else { Write-Warning "- Source $SourceSetupDbJs not found." }

# Cleanup empty source 'db' and 'scripts' folders if they exist and are empty
$SourceDbFolder = Join-Path $BaseDir -ChildPath "$WebsiteFolder\db"
$SourceScriptsFolder = Join-Path $BaseDir -ChildPath "$WebsiteFolder\scripts"

if ((Test-Path $SourceDbFolder) -and (-not (Get-ChildItem $SourceDbFolder))) { Remove-Item $SourceDbFolder -Force; Write-Host "- Removed empty source folder $SourceDbFolder" }
if ((Test-Path $SourceScriptsFolder) -and (-not (Get-ChildItem $SourceScriptsFolder))) { Remove-Item $SourceScriptsFolder -Force; Write-Host "- Removed empty source folder $SourceScriptsFolder" }


Write-Host "Step 2: Complete."
Write-Host "--------------------------------------------------------"

# --- Step 3: Update Website/package.json paths ---
Write-Host "Step 3: MANUAL ACTION REQUIRED for 'Website\package.json'"
Write-Host "Please open '$($BaseDir)\$WebsiteFolder\package.json' in a text editor and make the following changes:"
Write-Host '1. In the "scripts" section:'
Write-Host '   Change: "init:db": "node Website/scripts/setup_db.js"'
Write-Host '   To:     "init:db": "node backend/scripts/setup_db.js"'
Write-Host '2. Change the "main" script:'
Write-Host '   From:   "main": "server.js"'
Write-Host '   To:     "main": "backend/server.js"'
Write-Host "(Or adjust 'main' as needed if you run your backend server differently)."
Read-Host -Prompt "Press Enter to acknowledge and continue after making these manual changes to package.json..."
Write-Host "Step 3: Acknowledged."
Write-Host "--------------------------------------------------------"

# --- Step 4: Configure Two Server Instances ---
Write-Host "Step 4: MANUAL ACTION REQUIRED for server configurations."

Write-Host "a. Backend Server (now at '$($BackendDir)\server.js'):"
Write-Host "   - This server should ONLY handle API requests and serve product images."
Write-Host "   - REMOVE all static serving of HTML files."
Write-Host "   - Example: Lines like 'app.get('/shop', ... res.sendFile(...))' should be removed."
Write-Host "   - The general 'app.use(express.static(path.join(__dirname)));' should be REMOVED."
Write-Host "   - ADD a specific static route for images. In '$($BackendDir)\server.js', ensure you have:"
Write-Host "     const path = require('path'); // if not already there"
Write-Host "     app.use('/pictures', express.static(path.join(__dirname, '../frontend/pictures')));"
Write-Host "     (This line assumes 'pictures' folder is inside 'frontend', and 'server.js' is in 'backend')"
Write-Host "   - It should run on one port (e.g., Port 3000, as currently configured)."

Write-Host "b. Frontend Server (New - e.g., '$($BaseDir)\$WebsiteFolder\frontend_server.js'):"
Write-Host "   - Create a new file, for example, '$($BaseDir)\$WebsiteFolder\frontend_server.js'."
Write-Host "   - This server's only job is to statically serve files from '$FrontendDir'."
Write-Host "   - It must run on a DIFFERENT port (e.g., Port 3001)."
Write-Host "   - Here is example content for '$($BaseDir)\$WebsiteFolder\frontend_server.js':"
Write-Host "     ---------------------------------------------------------------------"
Write-Host "     const express = require('express');"
Write-Host "     const path = require('path');"
Write-Host "     const app = express();"
Write-Host "     const PORT = 3001; // Or your desired frontend port"
Write-Host ""
Write-Host "     // Serve static files from the 'frontend' directory"
Write-Host "     app.use(express.static(path.join(__dirname, 'frontend')));"
Write-Host ""
Write-Host "     // Optional: Redirect all non-static file requests to index.html (for SPAs)"
Write-Host "     // app.get('*', (req, res) => {"
Write-Host "     //   res.sendFile(path.join(__dirname, 'frontend', 'html', 'index.html'));"
Write-Host "     // });"
Write-Host ""
Write-Host "     app.listen(PORT, () => {"
Write-Host "       console.log(\`Frontend server running on http://localhost:\${PORT}\`);"
Write-Host "     });"
Write-Host "     ---------------------------------------------------------------------"
Write-Host "   - Add a script to '$($BaseDir)\$WebsiteFolder\package.json' to run this, e.g., in the 'scripts' section:"
Write-Host '     "start:frontend": "node frontend_server.js"'

Read-Host -Prompt "Press Enter to acknowledge and continue after manually configuring server.js and creating frontend_server.js..."
Write-Host "Step 4: Acknowledged."
Write-Host "--------------------------------------------------------"

# --- Step 5: Adjust Paths in Frontend Files (HTML/CSS) ---
Write-Host "Step 5: Review frontend asset paths (MANUAL CHECK RECOMMENDED)."
Write-Host "After moving files, HTML files in '$($FrontendDir)\html\' might try to access CSS/JS using paths like '../css/'."
Write-Host "Depending on how your new frontend_server.js serves static files (e.g., if it serves 'frontend' as the root),"
Write-Host "paths might need to change from relative (e.g., '../css/base.css') to absolute from the frontend root (e.g., '/css/base.css')."
Write-Host "For example, if frontend_server.js has 'app.use(express.static(path.join(__dirname, 'frontend')));'"
Write-Host "and is located in the 'Website' directory, then in your HTML:"
Write-Host "  <link rel=\"stylesheet\" href=\"../css/base.css\"> should become <link rel=\"stylesheet\" href=\"/css/base.css\">"
Write-Host "  <script src=\"../js/product.js\"> should become <script src=\"/js/product.js\">"
Write-Host "Image paths in JavaScript should be okay as they were changed to full paths like '/pictures/book_1/book_1_1.jpg',"
Write-Host "which will be served by the backend server."
Read-Host -Prompt "Press Enter to acknowledge and continue after reviewing/adjusting frontend paths..."
Write-Host "Step 5: Acknowledged."
Write-Host "--------------------------------------------------------"

Write-Host "Restructuring script guidance complete."
Write-Host "After these steps, try running:"
Write-Host "1. (From '$($BaseDir)\$WebsiteFolder') npm run init:db"
Write-Host "2. (From '$($BaseDir)\$WebsiteFolder') npm start (or your backend start script)"
Write-Host "3. (From '$($BaseDir)\$WebsiteFolder') npm run start:frontend"
Write-Host "Then access your application via the frontend server's port (e.g., http://localhost:3001)."
