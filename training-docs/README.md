# FinBox Training Documentation System

This folder contains the core knowledge base for FinBox that powers the AI assistant through AnythingLLM's RAG (Retrieval-Augmented Generation) system.

## Folder Structure

```
training-docs/
├── core/              # Core training documents (synced to all advisors)
│   └── *.pdf         # Place IFA training PDFs here
└── README.md         # This file
```

## How It Works

### Core Training Documents (`training-docs/core/`)

- **Purpose**: Contains foundational IFA training materials shared across all advisors
- **Format**: PDF files only
- **Sync**: Automatically uploaded to AnythingLLM workspace "Finbox-Core"
- **Access**: Read-only for all advisors, available in every AI query
- **Deployment**: This folder travels with the project - when deployed to a new Mac mini, core docs are already present

### What to Put Here

Place the following types of documents in `training-docs/core/`:

1. **IFA Training Materials**:
   - Immediate Financing Arrangement guides
   - CDA/NCPI/ACB technical documentation
   - Tax planning strategies

2. **Product Documentation**:
   - Manulife Par product guides
   - Equitable EquiPar documentation
   - Carrier comparison sheets

3. **Regulatory & Compliance**:
   - BCFSA guidelines
   - Income Tax Act (ITA) relevant sections
   - Compliance checklists

4. **Sales & Discovery**:
   - Best practices guides
   - Discovery question templates
   - Case studies

### Mock vs. Production Documents

- **Mock documents** are clearly labeled with `[MOCK]` prefix (e.g., `[MOCK]_IFA_Guide.pdf`)
- Replace mock documents with real training materials before production deployment
- Mock docs are useful for testing the RAG pipeline during development

## Syncing Documents to AnythingLLM

### Automatic Sync on Deployment

When deploying FinBox to a Mac mini, the setup script automatically:
1. Checks if AnythingLLM is running at localhost:3001
2. Creates "Finbox-Core" workspace if it doesn't exist
3. Uploads all PDFs from `training-docs/core/` to the workspace
4. Indexes documents for RAG queries

### Manual Sync

To manually sync new documents added to `training-docs/core/`:

**Option 1: Admin UI** (Recommended)
1. Log into FinBox as an administrator
2. Navigate to Settings > Training Documents
3. Click "Sync Core Documents"

**Option 2: Command Line**
```bash
cd /Users/bradpalmer/Projects/finbox
npm run sync-training-docs
```

### Re-Sync Behavior

The sync script is **re-runnable**:
- Already uploaded documents are skipped (based on filename)
- New documents are added
- Modified documents (different file size/hash) are re-uploaded
- Deleted documents remain in AnythingLLM (manual cleanup required)

## Per-Advisor Personal Documents

In addition to core training docs, each advisor can upload their own documents through the **Document Manager** in FinBox:

- Personal uploads go to advisor-specific workspaces: `Advisor-[AdvisorName]`
- Not shared with other advisors
- Can include client case studies, personal notes, custom templates
- Managed entirely through the FinBox UI

## Environment Configuration

The training docs folder path is configurable in `.env.local`:

```env
VITE_TRAINING_FOLDER_PATH=./training-docs/core
```

This allows flexibility for different deployment scenarios (e.g., network share, external drive).

## File Naming Best Practices

- Use descriptive names: `Manulife_Par_IFA_Guide_2024.pdf`
- Include version/year if applicable: `BCFSA_Compliance_2024.pdf`
- Avoid spaces: Use underscores or hyphens
- Mark mock files: `[MOCK]_Example_Training_Doc.pdf`

## Adding New Training Documents

### Development
1. Add PDF to `training-docs/core/`
2. Run sync: `npm run sync-training-docs`
3. Verify in AnythingLLM workspace "Finbox-Core"
4. Test queries in FinBox AI assistant

### Production (Mac mini)
1. Copy PDF to `training-docs/core/` on the Mac mini
2. Click "Sync Core Documents" in FinBox Settings
3. Wait for indexing to complete
4. New document is immediately available to all advisors

## Troubleshooting

### Documents Not Appearing in Queries

1. **Check AnythingLLM is running**: `curl http://localhost:3001`
2. **Verify workspace exists**: Open AnythingLLM > Workspaces > "Finbox-Core"
3. **Check document status**: Documents should show "Indexed" not "Processing"
4. **Re-sync**: Click "Sync Core Documents" in Settings
5. **Check logs**: Look for errors in FinBox console

### Sync Script Failing

1. **AnythingLLM API key**: Ensure `.env.local` has valid `VITE_ANYTHINGLLM_API_KEY`
2. **File permissions**: Ensure PDFs in `training-docs/core/` are readable
3. **File size**: Very large PDFs (>100MB) may fail - split into smaller files
4. **Network**: Ensure localhost:3001 is accessible

### Slow Query Responses

1. **Too many documents**: AnythingLLM performance degrades with 50+ large PDFs
2. **Document size**: Break large documents into smaller chapters
3. **Chunk size**: Adjust in AnythingLLM workspace settings (default 1000 tokens)

## Security & Privacy

- **Local only**: All documents stay on the Mac mini, never uploaded to cloud
- **No internet required**: RAG works entirely offline via Ollama
- **Access control**: Core docs are read-only, personal docs are isolated per advisor
- **Data protection**: Follow PIPEDA guidelines - no client PII in training docs

## Version Control

- **DO commit**: Empty `training-docs/core/` folder structure, mock documents, README.md
- **DON'T commit**: Production training PDFs containing proprietary information
- **Use .gitignore**: Add `training-docs/core/*.pdf` to exclude real training docs from git

Add to `.gitignore`:
```
# Training documents - don't commit proprietary PDFs
training-docs/core/*.pdf
!training-docs/core/*[MOCK]*.pdf  # Allow mock files
```

## Support

For questions about the training documentation system:
- **Setup issues**: See README-DEPLOYMENT.md
- **AnythingLLM problems**: See ANYTHINGLLM_TRAINING_GUIDE.md
- **RAG pipeline bugs**: Check FinBox logs and AnythingLLM workspace settings

---

**Last Updated**: 2026-02-18
**Maintained By**: FinBox Development Team
