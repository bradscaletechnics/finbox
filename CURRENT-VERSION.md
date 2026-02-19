# FinBox - Current Version

**Last Updated:** February 19, 2026
**Status:** ✅ Fully operational with RAG AI system

## 🚀 How to Launch FinBox

**Double-click:** `~/Desktop/Launch FinBox.command`

This will:
1. Start Docker Desktop (if not running)
2. Start AnythingLLM container with Ollama + llama3.1:8b
3. Start FinBox dev server
4. Open FinBox in your browser (http://localhost:8080)

## ✨ Latest Features (Feb 2026)

### RAG-Powered AI Assistant
- ✅ Multi-workspace document search (Core + Personal)
- ✅ 4 IFA training PDFs loaded in Finbox-Core workspace
- ✅ FinBox AI identity with Canadian insurance expertise
- ✅ Source citations from training documents
- ✅ Auto-creates advisor workspaces on first login

### Document Management
- ✅ In-app Document Manager (/documents)
- ✅ Upload personal training PDFs (drag-drop)
- ✅ Add notes to documents
- ✅ Core vs Personal document separation
- ✅ Document metadata in localStorage

### Training Documents (Finbox-Core)
1. Immediate_financing_arrangement_IFAANG.pdf
2. Application EA2266687901.pdf
3. F13_1167A_Balance_Sheet_Strenghtening_With_Permanent_Life_Insurance.pdf
4. IFA- $100k Example 35.pdf

## 🏗️ Technical Architecture

### Backend
- **AnythingLLM:** Local RAG platform (localhost:3001)
- **Ollama:** LLM backend running llama3.1:8b
- **Docker:** Containerized AnythingLLM + dependencies
- **Vector DB:** Built-in with AnythingLLM (LanceDB)

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui components
- **State:** React hooks + localStorage
- **Routing:** React Router v6

### AI Integration
- **Multi-workspace RAG:** Searches Core + Advisor workspaces
- **System Prompt:** FinBox AI with IFA expertise
- **Citations:** Automatic source attribution
- **Query Mode:** Non-streaming for reliability

## 📁 Directory Structure

```
/Users/bradpalmer/Projects/finbox/
├── src/                          # React app source
│   ├── components/               # UI components
│   │   ├── ai-assistant/         # AI chat panel
│   │   └── layout/               # TopBar, navigation
│   ├── pages/                    # Route pages
│   │   ├── DocumentManager.tsx   # Document upload/management
│   │   └── ...
│   ├── services/
│   │   └── anythingllm.ts        # AnythingLLM API client
│   └── lib/
│       └── ai-client.ts          # AI query functions
├── training-docs/                # Training PDFs
│   └── core/                     # Core workspace PDFs (4 files)
├── launch-finbox.sh              # Main launcher script
├── docker-compose.yml            # AnythingLLM container config
└── .env.local                    # API keys + config
```

## 🔧 Node.js Setup

**Location:** `~/.local/node/`
**Version:** Node.js v20.11.0
**Package Manager:** npm 10.9.2

The launcher uses this local Node installation (no nvm/Homebrew required).

## 🗂️ Workspaces in AnythingLLM

1. **Finbox-Core** (slug: `finbox-core`)
   - Contains 4 IFA training PDFs
   - FinBox AI system prompt configured
   - Ollama llama3.1:8b @ temperature 0.7
   - Read by all advisors

2. **Advisor-{Name}** (slug: `advisor-{name}`)
   - Personal workspace per advisor
   - Auto-created on first login
   - Auto-configured with Ollama
   - Private documents + notes

## 🔐 Environment Variables

Located in: `.env.local`

```env
VITE_ANYTHINGLLM_URL=http://localhost:3001
VITE_ANYTHINGLLM_API_KEY=JFAY0VY-RRP4C5F-NWTQWDP-ZRS5Y7G
VITE_ANYTHINGLLM_WORKSPACE=finbox
VITE_ANYTHINGLLM_RESPONSE_STYLE=concise
VITE_ANYTHINGLLM_CITATIONS=true
VITE_TRAINING_FOLDER_PATH=./training-docs/core
```

## 📝 Recent Fixes (Feb 19, 2026)

### AI System Prompt
- ✅ Updated Finbox-Core workspace with FinBox AI identity
- ✅ AI now properly introduces itself as "FinBox AI"
- ✅ Includes IFA expertise, Canadian tax knowledge (CDA, NCPI, ACB, ITA)
- ✅ Professional disclaimers for legal/tax advice

### Error Handling
- ✅ Simplified AIAssistantPanel error handling
- ✅ Clear error messages when AI fails
- ✅ Auto-configure advisor workspaces with Ollama settings
- ✅ Better debugging with error details

### Launcher
- ✅ Uses `~/.local/node/bin` installation
- ✅ Starts Vite directly with node binary
- ✅ More reliable startup without nvm/Homebrew

## 🔍 Testing the AI

1. **Test Identity:**
   - Ask: "Who are you?"
   - Expected: "I am FinBox AI, an expert assistant for Canadian insurance advisors..."

2. **Test RAG:**
   - Ask: "What is an Immediate Financing Arrangement?"
   - Expected: Detailed answer with source citations from training PDFs

3. **Test Sources:**
   - Ask: "How does balance sheet strengthening work?"
   - Expected: Answer citing F13_1167A PDF with specific examples

## 🚫 Outdated/Removed

- ❌ `/Applications/FinBox.app.old-feb11-2026` - Old Electron build (pre-RAG)
- ❌ Desktop symlink to old app - Removed

**Use only:** `Launch FinBox.command`

## 📦 Git Repository

**GitHub:** https://github.com/bradscaletechnics/finbox.git
**Branch:** main
**Last Commit:** a7028de (Feb 19, 2026)

All changes committed and pushed to GitHub.

## 🛠️ Maintenance

### Adding Training Documents
1. Place PDFs in `training-docs/core/`
2. Run: `~/.local/node/bin/node ~/.local/node/lib/node_modules/npm/bin/npm-cli.js run sync-training-docs`
3. Or upload via AnythingLLM UI: http://localhost:3001

### Updating AI Prompt
```bash
curl -X POST "http://localhost:3001/api/v1/workspace/finbox-core/update" \
  -H "Authorization: Bearer JFAY0VY-RRP4C5F-NWTQWDP-ZRS5Y7G" \
  -H "Content-Type: application/json" \
  -d '{"openAiPrompt": "Your new prompt here..."}'
```

### Restarting Services
```bash
# Restart AnythingLLM
docker restart anythingllm

# Restart dev server
pkill -f vite
~/Desktop/Launch\ FinBox.command
```

## ✅ System Requirements

- ✅ macOS (tested on Apple Silicon)
- ✅ Docker Desktop (for AnythingLLM)
- ✅ Node.js v20+ (installed at `~/.local/node`)
- ✅ 8GB+ RAM (for Ollama llama3.1:8b)

---

**Need Help?**
Check the full documentation: `README-DEPLOYMENT.md`
