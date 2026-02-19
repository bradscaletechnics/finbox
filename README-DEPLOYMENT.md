# FinBox Deployment Guide for Mac mini

Complete step-by-step instructions for deploying FinBox on a Mac mini for offline use by Canadian insurance advisors in British Columbia.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step 1: Mac mini Initial Setup](#step-1-mac-mini-initial-setup)
- [Step 2: Install Homebrew](#step-2-install-homebrew)
- [Step 3: Install Node.js and npm](#step-3-install-nodejs-and-npm)
- [Step 4: Install and Configure Ollama](#step-4-install-and-configure-ollama)
- [Step 5: Install and Configure AnythingLLM](#step-5-install-and-configure-anythingllm)
- [Step 6: Clone and Configure FinBox](#step-6-clone-and-configure-finbox)
- [Step 7: Upload IFA Training Documentation](#step-7-upload-ifa-training-documentation)
- [Step 8: Test the Complete System](#step-8-test-the-complete-system)
- [Step 9: Configure Auto-Start on Login](#step-9-configure-auto-start-on-login)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

---

## Overview

FinBox is a specialized advisory tool for Canadian insurance advisors focusing on:
- **Immediate Financing Arrangements (IFAs)** - Corporate-owned life insurance strategies
- **Participating Whole Life Insurance** - Manulife and Equitable Life Canada products
- **Canadian Tax Planning** - CDA, NCPI, ACB concepts
- **BC Regulatory Compliance** - BCFSA, CLHIA, CCIR framework

This deployment runs **completely offline** using:
- **AnythingLLM** - Local AI platform running on localhost:3001
- **Ollama** - Local LLM inference engine with llama3.1:8b model
- **Vite Dev Server** - FinBox application on localhost:5173

---

## Prerequisites

### Hardware Requirements
- **Mac mini** (2018 or later recommended)
- **8GB RAM minimum** (16GB recommended for better performance)
- **50GB free disk space** (for applications, models, and data)
- **Internet connection** (for initial setup only)

### Software Requirements
- **macOS 12 Monterey or later** (macOS 13 Ventura or 14 Sonoma recommended)
- **Administrator access** to the Mac mini

### Time Estimate
- **Initial setup**: 1-2 hours (including downloads)
- **Ongoing maintenance**: 15 minutes per month

---

## Step 1: Mac mini Initial Setup

### 1.1 Complete macOS Setup
1. Power on the Mac mini
2. Complete the initial macOS setup wizard:
   - Select language and region (Canada/English)
   - Connect to Wi-Fi (needed for initial setup)
   - Create administrator account
   - Skip Apple ID (optional - not required for FinBox)
   - Configure privacy settings

### 1.2 Update macOS
```bash
# Check for system updates
System Preferences > General > Software Update

# Install all available updates
# Restart if required
```

### 1.3 Configure System Preferences
1. **Energy Saver** (prevent sleep during client meetings):
   - System Preferences > Energy Saver
   - Set "Turn display off after: Never"
   - Uncheck "Put hard disks to sleep when possible"
   - Check "Prevent computer from sleeping automatically when the display is off"

2. **Security & Privacy**:
   - System Preferences > Security & Privacy
   - FileVault: Enable disk encryption (recommended)
   - Firewall: Turn on firewall

3. **Network**:
   - If using offline mode, configure Wi-Fi to "Ask to join networks" = OFF
   - For office setup, connect to trusted network

---

## Step 2: Install Homebrew

Homebrew is the package manager for macOS. It simplifies installation of developer tools.

### 2.1 Open Terminal
- Applications > Utilities > Terminal
- Or use Spotlight (⌘+Space) and type "Terminal"

### 2.2 Install Homebrew
```bash
# Run the official Homebrew install script
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Follow the on-screen instructions
# Enter your password when prompted
# Press ENTER to continue when asked
```

### 2.3 Add Homebrew to PATH
```bash
# For Apple Silicon Macs (M1/M2/M3)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# For Intel Macs
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

### 2.4 Verify Installation
```bash
brew --version
# Should output: Homebrew 4.x.x or later
```

---

## Step 3: Install Node.js and npm

Node.js is required to run the FinBox application.

### 3.1 Install Node.js
```bash
# Install Node.js (includes npm)
brew install node

# Verify installation
node --version
# Should output: v18.x.x or later

npm --version
# Should output: 9.x.x or later
```

### 3.2 Configure npm (Optional)
```bash
# Set npm to use faster registry (optional)
npm config set registry https://registry.npmjs.org/
```

---

## Step 4: Install and Configure Ollama

Ollama provides the local LLM inference engine for AnythingLLM.

### 4.1 Install Ollama
```bash
# Install via Homebrew
brew install ollama

# Verify installation
ollama --version
# Should output: ollama version 0.x.x
```

### 4.2 Start Ollama Service
```bash
# Start Ollama server (runs in background)
ollama serve
```

**Note**: Keep this Terminal window open, or run in background:
```bash
# To run in background
nohup ollama serve > /dev/null 2>&1 &
```

### 4.3 Pull the Llama Model
Open a **new Terminal window** and run:

```bash
# Pull the recommended model (this will take 10-20 minutes)
ollama pull llama3.1:8b

# Verify the model is available
ollama list
# Should show: llama3.1:8b
```

### 4.4 Test Ollama
```bash
# Test the model with a simple query
ollama run llama3.1:8b "What is an Immediate Financing Arrangement in Canadian insurance?"

# You should get a response about IFAs
# Press Ctrl+D to exit the chat
```

### 4.5 Verify Ollama is Running
```bash
# Check if Ollama is listening on port 11434
curl http://localhost:11434
# Should return: Ollama is running
```

---

## Step 5: Install and Configure AnythingLLM

AnythingLLM is the local AI platform that powers FinBox's intelligent advisory features.

### 5.1 Download AnythingLLM Desktop

**Option A: Direct Download (Recommended)**
1. Visit: https://anythingllm.com/download
2. Download "AnythingLLM Desktop for macOS"
3. Open the .dmg file
4. Drag AnythingLLM to Applications folder
5. Launch from Applications

**Option B: Homebrew Cask**
```bash
brew install --cask anythingllm
```

### 5.2 Initial AnythingLLM Setup

1. **First Launch**:
   - Open AnythingLLM from Applications
   - Accept privacy policy
   - Choose "Local Installation" (not cloud)

2. **Configure LLM Provider**:
   - Settings > LLM Provider
   - Select: **Ollama**
   - Base URL: `http://localhost:11434`
   - Model: `llama3.1:8b`
   - Click "Save & Test Connection"
   - Should show: ✓ Connected successfully

3. **Configure Server Settings**:
   - Settings > Server
   - Port: `3001` (default)
   - Ensure "Start server on launch" is enabled
   - Click "Save Settings"

4. **Generate API Key**:
   - Settings > API Keys
   - Click "Generate New API Key"
   - **IMPORTANT**: Copy and save this key immediately
   - You'll need it for .env.local configuration
   - Label it: "FinBox Integration"

### 5.3 Create FinBox Workspace

1. **Create Workspace**:
   - Click "New Workspace" (+ button)
   - Name: `finbox`
   - Description: "Canadian IFA Advisory Tool"
   - Click "Create Workspace"

2. **Configure Workspace Settings**:
   - Open `finbox` workspace
   - Click Settings (gear icon)
   - LLM: Ensure Ollama + llama3.1:8b is selected
   - Temperature: `0.7` (balanced creativity)
   - Max Tokens: `2048`
   - Context Window: `8192`
   - Save changes

### 5.4 Verify AnythingLLM is Running
```bash
# Check if AnythingLLM is responding
curl http://localhost:3001/api/v1/auth
# Should return JSON (even if 401 Unauthorized - means it's running)
```

---

## Step 6: Clone and Configure FinBox

### 6.1 Create Projects Directory
```bash
# Navigate to home directory
cd ~

# Create Projects folder
mkdir -p Projects
cd Projects
```

### 6.2 Clone FinBox Repository

**If you have the repository on a USB drive**:
```bash
# Copy from USB to Projects folder
cp -r /Volumes/USB_NAME/finbox ~/Projects/

# Navigate to FinBox
cd ~/Projects/finbox
```

**If cloning from Git** (requires internet):
```bash
# Clone repository
git clone https://github.com/YOUR_ORG/finbox.git

# Navigate to FinBox
cd finbox
```

### 6.3 Install FinBox Dependencies
```bash
# Install all npm packages (this may take 5-10 minutes)
npm install

# Verify installation completed successfully
ls -la node_modules/
# Should show hundreds of packages
```

### 6.4 Configure Environment Variables

```bash
# Create .env.local from template
cp .env.example .env.local

# Edit .env.local with your settings
nano .env.local
```

**Edit the file to contain**:
```env
# AnythingLLM Configuration
VITE_ANYTHINGLLM_URL=http://localhost:3001
VITE_ANYTHINGLLM_API_KEY=YOUR_API_KEY_FROM_STEP_5.2.4
VITE_ANYTHINGLLM_WORKSPACE=finbox

# Response Configuration
VITE_ANYTHINGLLM_RESPONSE_STYLE=concise
VITE_ANYTHINGLLM_CITATIONS=true
```

**Replace `YOUR_API_KEY_FROM_STEP_5.2.4` with the actual API key you generated**.

Save and exit:
- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

### 6.5 Verify Configuration
```bash
# Check that .env.local exists and has API key
cat .env.local | grep "VITE_ANYTHINGLLM_API_KEY"

# Should show: VITE_ANYTHINGLLM_API_KEY=sk-xxxxxxxxxxxxx
# NOT: VITE_ANYTHINGLLM_API_KEY=
```

---

## Step 7: Upload IFA Training Documentation

This step trains AnythingLLM with IFA-specific knowledge for Canadian insurance advisors.

### 7.1 Prepare Training Documents

Ensure you have the IFA training PDFs:
- `Immediate_financing_arrangement_IFAANG.pdf`
- `IFA- $100k Example 35.pdf`
- `F13_1167A_Balance_Sheet_Strenghtening_With_Permanent_Life_Insurance.pdf`
- `Application EA2266687901.pdf`
- Any additional carrier-specific documentation

**Copy these files to the Mac mini** (via USB, AirDrop, or network share).

### 7.2 Upload Documents to AnythingLLM

1. **Open AnythingLLM Application**
2. **Navigate to `finbox` workspace**
3. **Upload Documents**:
   - Click "Upload" or "Add Documents" button
   - Select all IFA training PDFs
   - Click "Open" to start upload

4. **Configure Document Processing**:
   - **Chunk Size**: `1000` tokens (default)
   - **Chunk Overlap**: `200` tokens (default)
   - **Text Splitter**: `Recursive Character`
   - Click "Process Documents"

5. **Wait for Processing**:
   - Processing may take 5-15 minutes depending on document size
   - You'll see progress bars for each document
   - Once complete, documents will show ✓ status

### 7.3 Verify Document Upload

1. **Test a Query**:
   - In the `finbox` workspace, type:
   - "Explain how CDA credits work in an IFA structure"
   - The response should reference the uploaded documentation
   - Look for citation links at the bottom of the response

2. **Check Document List**:
   - Click "Documents" in the workspace
   - All PDFs should be listed with "Processed" status

---

## Step 8: Test the Complete System

### 8.1 Run Health Check
```bash
# Navigate to FinBox directory
cd ~/Projects/finbox

# Run health check
./health-check.sh
```

**Expected Output**:
- ✓ Node.js Environment: PASS
- ✓ AnythingLLM Service: PASS
- ✓ Ollama Service: PASS (or WARNING if optional)
- ✓ Environment Configuration: PASS
- ✓ FinBox Application Files: PASS

**If any checks fail**, review the error messages and follow the recommendations.

### 8.2 Start FinBox Application
```bash
# Run the startup script
./start-finbox.sh
```

**Expected Output**:
```
═══════════════════════════════════════════════════════════
   FinBox - Canadian IFA Advisory Tool
   Mac mini Deployment Startup
═══════════════════════════════════════════════════════════

▶ Checking AnythingLLM at http://localhost:3001...
✓ AnythingLLM is running
▶ Checking Ollama at http://localhost:11434...
✓ Ollama is running
✓ Llama model detected
▶ Checking environment configuration...
✓ Environment configuration found
▶ Checking dependencies...
✓ Dependencies already installed
▶ Checking if port 5173 is available...
✓ Port 5173 is available

✓ All pre-flight checks passed!

▶ Starting FinBox on http://localhost:5173
▶ Press Ctrl+C to stop
═══════════════════════════════════════════════════════════

  VITE v5.x.x  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 8.3 Test in Web Browser

1. **Open Browser**:
   - Safari, Chrome, or Firefox
   - Navigate to: `http://localhost:5173`

2. **Verify FinBox Loads**:
   - You should see the FinBox interface
   - Check the top-right corner for AI connection status
   - Should show: 🟢 **AI Online**

3. **Test AI Assistant**:
   - Click the "AI Assistant" or chat icon
   - Type a test query:
     - "What are the tax advantages of an IFA structure?"
     - "Compare Manulife Par vs Equitable Par for a BC corporation"
   - Verify you get intelligent, Canadian-specific responses

4. **Test Case Management**:
   - Navigate to "Cases" or "Client Management"
   - Open a sample IFA case
   - Verify all data displays correctly

5. **Test Discovery Workflow**:
   - Start a new client discovery
   - Verify Canadian provinces, carriers, and products appear
   - Check that amounts format as CAD currency

### 8.4 Test Offline Functionality

1. **Disconnect from Internet**:
   - Turn off Wi-Fi
   - Or disconnect Ethernet

2. **Verify FinBox Still Works**:
   - Refresh the browser page
   - Test AI queries again
   - All features should work identically

3. **Reconnect Internet** (if needed for later)

---

## Step 9: Configure Auto-Start on Login

This ensures FinBox starts automatically when the Mac mini boots up.

### 9.1 Create LaunchAgent for AnythingLLM

AnythingLLM should be configured to start on login through its settings (see Step 5.2.3).

### 9.2 Create LaunchAgent for Ollama

```bash
# Create LaunchAgents directory if it doesn't exist
mkdir -p ~/Library/LaunchAgents

# Create Ollama LaunchAgent plist file
cat > ~/Library/LaunchAgents/com.ollama.server.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.server</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/ollama.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/ollama.error.log</string>
</dict>
</plist>
EOF

# Load the LaunchAgent
launchctl load ~/Library/LaunchAgents/com.ollama.server.plist

# Verify it's running
launchctl list | grep ollama
```

**For Intel Macs**, edit the path in ProgramArguments:
```xml
<string>/usr/local/bin/ollama</string>
```

### 9.3 Create Login Item for FinBox

**Option A: Using Automator (Recommended)**

1. **Create Automator Application**:
   - Open Automator (Applications > Automator)
   - Choose "Application" as document type
   - Search for "Run Shell Script" action
   - Add this script:
   ```bash
   #!/bin/bash
   cd ~/Projects/finbox
   ./start-finbox.sh
   ```
   - Save as: `FinBox Launcher.app` in Applications folder

2. **Add to Login Items**:
   - System Preferences > Users & Groups
   - Select your user account
   - Click "Login Items" tab
   - Click "+" button
   - Select `FinBox Launcher.app`
   - Check "Hide" to run in background

**Option B: Using Terminal (Alternative)**

Create a simple wrapper script:
```bash
# Create startup wrapper
cat > ~/start-finbox-wrapper.sh << 'EOF'
#!/bin/bash
# Wait for system to fully boot
sleep 10

# Wait for AnythingLLM to start
sleep 5

# Start FinBox
cd ~/Projects/finbox
./start-finbox.sh
EOF

# Make executable
chmod +x ~/start-finbox-wrapper.sh
```

Then add `Terminal` to Login Items with:
- System Preferences > Users & Groups > Login Items
- Add Terminal.app
- Configure Terminal > Preferences > Profiles > Shell:
  - "Run command": `~/start-finbox-wrapper.sh`
  - "Run inside shell"

### 9.4 Test Auto-Start

1. **Restart the Mac mini**:
   ```bash
   sudo shutdown -r now
   ```

2. **After reboot, verify**:
   - AnythingLLM icon appears in menu bar
   - Wait 20-30 seconds for FinBox to start
   - Open Safari and go to `http://localhost:5173`
   - FinBox should load automatically

---

## Troubleshooting

### Issue: AnythingLLM Not Responding

**Symptoms**:
- FinBox shows "AI Offline" or red dot
- `curl http://localhost:3001` fails

**Solutions**:
1. **Check if AnythingLLM is running**:
   ```bash
   pgrep -f AnythingLLM
   ```
   - If no output, launch AnythingLLM from Applications

2. **Check port 3001**:
   ```bash
   lsof -i :3001
   ```
   - Should show AnythingLLM process

3. **Check AnythingLLM logs**:
   - AnythingLLM > Settings > Logs
   - Look for errors or connection issues

4. **Restart AnythingLLM**:
   - Quit completely (⌘+Q)
   - Relaunch from Applications

### Issue: Ollama Model Not Found

**Symptoms**:
- AnythingLLM shows "Model not available"
- Queries fail with model errors

**Solutions**:
1. **Check Ollama is running**:
   ```bash
   curl http://localhost:11434
   ```

2. **List available models**:
   ```bash
   ollama list
   ```

3. **Re-pull the model if missing**:
   ```bash
   ollama pull llama3.1:8b
   ```

4. **Verify model in AnythingLLM**:
   - Settings > LLM Provider
   - Model dropdown should show `llama3.1:8b`

### Issue: FinBox Shows "API Key Invalid"

**Symptoms**:
- AI queries fail with authentication errors
- Connection status shows 🔴 Offline

**Solutions**:
1. **Check .env.local has API key**:
   ```bash
   cd ~/Projects/finbox
   cat .env.local | grep API_KEY
   ```

2. **Regenerate API key in AnythingLLM**:
   - Settings > API Keys
   - Generate new key
   - Update .env.local with new key

3. **Restart FinBox**:
   ```bash
   # Stop current instance (Ctrl+C)
   ./start-finbox.sh
   ```

### Issue: Port 5173 Already in Use

**Symptoms**:
- FinBox won't start
- Error: "Port 5173 is already in use"

**Solutions**:
1. **Find what's using the port**:
   ```bash
   lsof -i :5173
   ```

2. **Kill the process**:
   ```bash
   lsof -ti:5173 | xargs kill
   ```

3. **Restart FinBox**:
   ```bash
   ./start-finbox.sh
   ```

### Issue: Slow AI Responses

**Symptoms**:
- Queries take > 30 seconds
- Typing lag in AI chat

**Solutions**:
1. **Check system resources**:
   - Activity Monitor > CPU tab
   - Ollama should use 50-200% CPU (normal)
   - Available Memory should be > 2GB

2. **Close unnecessary applications**:
   - Quit browsers with many tabs
   - Close unused applications

3. **Consider smaller model** (if 8GB RAM Mac):
   ```bash
   ollama pull llama3.1:3b
   ```
   - Update AnythingLLM to use 3b model

4. **Reduce context window**:
   - AnythingLLM > Workspace Settings
   - Context Window: Reduce to `4096`

### Issue: Documents Not Loading in AnythingLLM

**Symptoms**:
- Uploaded PDFs show "Failed" status
- AI doesn't reference training docs

**Solutions**:
1. **Check document size**:
   - Files > 100MB may fail
   - Split large PDFs into smaller files

2. **Re-upload documents**:
   - Delete failed documents
   - Upload again with smaller chunk size

3. **Check disk space**:
   ```bash
   df -h /
   ```
   - Ensure > 10GB free space

4. **Clear and re-index**:
   - Workspace Settings > Vector Database
   - Click "Reset" (WARNING: Deletes all indexed docs)
   - Re-upload documents

### Run Complete Health Check

When in doubt, run the diagnostic tool:
```bash
cd ~/Projects/finbox
./health-check.sh
```

This will identify most common issues and provide specific solutions.

---

## Maintenance

### Monthly Tasks

**Update Software** (requires internet):
```bash
# Update Homebrew
brew update

# Update installed packages
brew upgrade

# Update Node.js packages
cd ~/Projects/finbox
npm update
```

**Check Disk Space**:
```bash
# Check available space
df -h /

# If low, clear Homebrew cache
brew cleanup
```

**Backup Configuration**:
```bash
# Backup .env.local
cp ~/Projects/finbox/.env.local ~/Desktop/finbox-env-backup.txt

# Backup AnythingLLM data
# AnythingLLM > Settings > Backup
# Click "Create Backup" and save to USB drive
```

### Quarterly Tasks

**Update Ollama Model**:
```bash
# Pull latest llama model
ollama pull llama3.1:8b

# This will download only if newer version exists
```

**Update FinBox Application** (if new version available):
```bash
cd ~/Projects/finbox
git pull origin main  # If using Git
npm install           # Update dependencies
```

**Review Training Documentation**:
- Check for new IFA documents from carriers
- Upload to AnythingLLM workspace
- Test AI knowledge with queries

### Logs and Diagnostics

**View Ollama Logs**:
```bash
tail -f /tmp/ollama.log
tail -f /tmp/ollama.error.log
```

**View AnythingLLM Logs**:
- Open AnythingLLM
- Settings > Logs
- Export if needed for troubleshooting

**View FinBox Logs**:
- Logs appear in Terminal where `start-finbox.sh` runs
- Redirect to file for review:
```bash
./start-finbox.sh 2>&1 | tee finbox.log
```

---

## Support

### Documentation
- **FinBox Training Guide**: See `ANYTHINGLLM_TRAINING_GUIDE.md`
- **API Documentation**: See `README.md` in project root
- **AnythingLLM Docs**: https://docs.anythingllm.com
- **Ollama Docs**: https://ollama.ai/docs

### Getting Help

**Run Diagnostics First**:
```bash
cd ~/Projects/finbox
./health-check.sh > diagnostic-report.txt
```

**Contact Information**:
- Internal Support: [Your support team contact]
- Technical Issues: [Your tech support email]

When reporting issues, include:
- Output from `health-check.sh`
- Steps to reproduce the problem
- Screenshots of error messages
- macOS version: `sw_vers`

---

## Security Notes

### Data Privacy
- All data stays **local** - no cloud services
- Client information never leaves the Mac mini
- AnythingLLM database stored locally at:
  - `~/Library/Application Support/AnythingLLM/`

### Access Control
- **Physical Security**: Keep Mac mini in secure office location
- **User Accounts**: Use strong password for Mac user account
- **FileVault**: Enable disk encryption (recommended in Step 1)
- **Screen Lock**: Configure automatic screen lock after 5 minutes
  - System Preferences > Security & Privacy > General
  - "Require password immediately after sleep or screen saver begins"

### Network Security
- **Firewall**: Enable macOS firewall (configured in Step 1)
- **Offline Mode**: Can run completely offline after initial setup
- **No Incoming Connections**: FinBox only listens on localhost (127.0.0.1)

### Backup Strategy
- **Weekly**: Backup .env.local configuration
- **Monthly**: Backup AnythingLLM database and documents
- **Before Updates**: Full Time Machine backup of Mac mini

---

## Appendix: Quick Reference Commands

```bash
# Check Service Status
curl http://localhost:3001        # AnythingLLM
curl http://localhost:11434       # Ollama
lsof -i :5173                     # FinBox

# Start Services Manually
ollama serve                      # Start Ollama
open -a AnythingLLM              # Start AnythingLLM
cd ~/Projects/finbox && ./start-finbox.sh  # Start FinBox

# Stop Services
pkill -f ollama                  # Stop Ollama
killall AnythingLLM              # Stop AnythingLLM
lsof -ti:5173 | xargs kill       # Stop FinBox

# View Models
ollama list                      # List installed models
ollama pull llama3.1:8b         # Download/update model

# Diagnostics
./health-check.sh               # Run full health check
npm run build                   # Test FinBox build
node --version                  # Check Node version
brew doctor                     # Check Homebrew health

# Maintenance
brew update && brew upgrade     # Update all packages
cd ~/Projects/finbox && npm update  # Update FinBox dependencies
brew cleanup                    # Clear old package versions
```

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-18 | Initial deployment guide for Mac mini |

---

**End of Deployment Guide**

For questions or support, refer to the Contact Information section above.
