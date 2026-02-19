#!/bin/bash
# Organize documentation files

echo "=== Organizing Documentation ==="

# Move documentation to docs/
mv ANYTHINGLLM_TRAINING_GUIDE.md docs/ 2>/dev/null
mv README-DEPLOYMENT.md docs/ 2>/dev/null
mv CURRENT-VERSION.md docs/ 2>/dev/null

# Create index in docs
cat > docs/README.md << 'DOC'
# FinBox Documentation

## Quick Start
- **[Current Version](CURRENT-VERSION.md)** - What's installed, how to launch, features
- **[Deployment Guide](README-DEPLOYMENT.md)** - Full deployment instructions
- **[Training Guide](ANYTHINGLLM_TRAINING_GUIDE.md)** - How to add training documents

## Launch FinBox
Double-click: `~/Desktop/Launch FinBox.command`

## Project Structure
```
finbox/
├── docs/                    # Documentation (you are here)
├── src/                     # React app source code
├── training-docs/core/      # IFA training PDFs (4 files)
├── launch-finbox.sh         # Main launcher script
├── health-check.sh          # System health checker
└── docker-compose.yml       # AnythingLLM container
```

## Need Help?
Start with [CURRENT-VERSION.md](CURRENT-VERSION.md)
DOC

echo "✓ Documentation organized in docs/"

# Create clean root README
cat > README.md << 'DOC'
# FinBox - Canadian IFA Advisory Tool

**AI-powered assistant for Canadian insurance advisors specializing in Immediate Financing Arrangements (IFAs)**

## 🚀 Quick Start

**Launch FinBox:**
```bash
# Double-click on Desktop
~/Desktop/Launch FinBox.command
```

This starts:
- Docker Desktop
- AnythingLLM (RAG platform)
- Ollama (LLM backend with llama3.1:8b)
- FinBox dev server (http://localhost:8080)

## ✨ Features

- **RAG-Powered AI Assistant** - Ask questions about IFAs, get answers from training docs
- **Document Manager** - Upload personal training PDFs
- **Multi-Workspace Search** - Searches both Core and Personal documents
- **Source Citations** - Every answer includes source references
- **Training Library** - 4 IFA training PDFs pre-loaded

## 📚 Documentation

All docs are in the [`docs/`](docs/) folder:
- [Current Version](docs/CURRENT-VERSION.md) - System overview
- [Deployment Guide](docs/README-DEPLOYMENT.md) - Full setup instructions  
- [Training Guide](docs/ANYTHINGLLM_TRAINING_GUIDE.md) - Add training docs

## 🏗️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- **AI:** AnythingLLM + Ollama (llama3.1:8b)
- **Backend:** Docker + LanceDB (vector storage)

## 📁 Project Structure

```
finbox/
├── docs/                    # Documentation
├── src/                     # React app
│   ├── components/          # UI components
│   ├── pages/               # Route pages
│   ├── services/            # AnythingLLM API client
│   └── lib/                 # Utilities
├── training-docs/core/      # IFA training PDFs
├── launch-finbox.sh         # Main launcher
└── docker-compose.yml       # AnythingLLM setup
```

## 🔐 Requirements

- macOS (tested on Apple Silicon)
- Docker Desktop
- Node.js v20+ (installed at `~/.local/node`)
- 8GB+ RAM

## 📝 License

Proprietary - For internal use only

---

**GitHub:** https://github.com/bradscaletechnics/finbox
DOC

echo "✓ Updated root README.md"
echo ""
echo "Done!"
