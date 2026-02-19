# AnythingLLM Training Guide for FinBox
## Canadian IFA-Focused AI Assistant Setup

**Last Updated:** February 18, 2026
**Purpose:** Configure AnythingLLM with Canadian insurance product knowledge focusing on Immediate Financing Arrangements (IFAs)

---

## **OVERVIEW**

FinBox is configured to use a **local AnythingLLM instance** for AI assistance. The AI must be trained on:
1. **Immediate Financing Arrangements (IFAs)** — PRIMARY FOCUS
2. Manulife and Equitable Life Canada products
3. Canadian tax concepts (CDA, NCPI, ACB, ITA)
4. BC/Canadian regulatory framework (BCFSA, CLHIA, CCIR)

---

## **STEP 1: PREPARE TRAINING DOCUMENTS**

### **Documents to Upload**

#### **A. IFA-Specific Documentation** (Priority 1 - CRITICAL)

Located in: `/Users/bradpalmer/Desktop/FinBox Training/`

1. **`Immediate_financing_arrangement_IFAANG.pdf`**
   - Core IFA concepts and mechanics
   - Tax treatment and benefits
   - Corporate ownership structures

2. **`IFA- $100k Example 35.pdf`**
   - Real-world IFA illustration
   - Premium financing examples
   - Cash value and CDA projections

3. **`F13_1167A_Balance_Sheet_Strenghtening_With_Permanent_Life_Insurance.pdf`**
   - Corporate balance sheet strategies
   - Business applications of permanent life insurance
   - IFA integration with corporate tax planning

4. **`Application EA2266687901.pdf`**
   - Equitable Life application forms
   - Required documentation
   - Corporate owner application process

#### **B. FinBox Core Documentation** (Priority 2)

Located in: `/Users/bradpalmer/anythingllm-training-docs/finbox-core/`

1. **`finbox-complete-project-handoff.md`**
   - Complete FinBox technical architecture
   - Feature specifications
   - Workflow documentation

2. **`finbox-brand-and-build.md`**
   - Brand identity and design system
   - UX principles

3. **`finbox-dopamine-design-system.md`**
   - UI/UX polish specifications

4. **`finbox-lovable-prompts-part2.md`**
   - App prompts and features

#### **C. Product Templates** (Priority 3 - TO BE COMPLETED)

Located in: `/Users/bradpalmer/anythingllm-training-docs/`

1. **`TEMPLATE_Equitable_Product_Guide.md`**
   - Template structure for Equitable products
   - Needs to be filled with current 2026 product data

2. **Create:** `Manulife_Product_Guide.md`
   - Follow same template structure
   - Fill with current Manulife product specifications

---

## **STEP 2: ANYTHINGLLM WORKSPACE SETUP**

### **Recommended Workspace Structure**

Create **ONE PRIMARY WORKSPACE** for simplicity, or separate workspaces for specialization:

#### **Option A: Single Workspace (Recommended for Start)**

**Workspace Name:** `finbox`

**Configuration:**
- **LLM Model:** Llama 3.1:8b (or your preferred Ollama model)
- **Temperature:** 0.3 (balanced between accuracy and conversational)
- **Chat Mode:** Enabled
- **Agent Mode:** Enabled for complex queries

**Documents to Upload:**
- All IFA PDFs (Priority 1)
- All FinBox core docs (Priority 2)
- Product guides once completed (Priority 3)

**System Prompt:**
```
You are FinBox AI, an expert assistant for Canadian insurance advisors in British Columbia.

Your PRIMARY FOCUS is Immediate Financing Arrangements (IFAs) — corporate-owned life insurance strategies used for tax-efficient wealth accumulation, estate planning, and balance sheet strengthening in Canadian corporations.

You provide expertise on:
- IFA structures and tax treatment (CDA, NCPI, ACB)
- Manulife and Equitable Life Canada products
- Canadian insurance regulations (BCFSA, CLHIA, CCIR)
- Income Tax Act (ITA) provisions related to corporate-owned life insurance

Always provide factual, grounded responses based on the uploaded documentation. When discussing tax strategies, remind advisors to consult with their client's tax professional.
```

---

#### **Option B: Multiple Workspaces (Advanced)**

If you want specialized workspaces:

**1. Workspace: "finbox-ifa-knowledge"**
- **Purpose:** IFA product knowledge and tax strategies
- **Temperature:** 0.2 (very factual)
- **Documents:** All IFA PDFs, product guides
- **Use for:** Product questions, tax treatment, suitability

**2. Workspace: "finbox-advisor-coach"**
- **Purpose:** Real-time meeting support and conversation coaching
- **Temperature:** 0.5 (more conversational)
- **Documents:** FinBox workflow docs, sales techniques
- **Use for:** Discovery step guidance, objection handling

**3. Workspace: "finbox-tech-support"**
- **Purpose:** App usage and troubleshooting
- **Temperature:** 0.4
- **Documents:** FinBox core technical docs
- **Use for:** How to use features, workflow questions

---

## **STEP 3: UPLOAD DOCUMENTS TO ANYTHINGLLM**

### **Upload Process:**

1. **Open AnythingLLM** at `http://localhost:3001`

2. **Navigate to Workspace:**
   - Click "Workspaces" in sidebar
   - Select your workspace (or create "finbox" if it doesn't exist)

3. **Upload Documents:**
   - Click "Upload Documents" or "Manage Documents"
   - Drag and drop PDF files from `/Users/bradpalmer/Desktop/FinBox Training/`
   - Add markdown files from `/Users/bradpalmer/anythingllm-training-docs/`

4. **Wait for Processing:**
   - AnythingLLM will chunk and embed documents
   - This may take a few minutes for PDFs
   - Check "Embedded" status before proceeding

5. **Test the Knowledge:**
   - Ask test questions like:
     - "What is an Immediate Financing Arrangement?"
     - "How does CDA work in an IFA structure?"
     - "What are the tax benefits of corporate-owned life insurance?"
   - Verify responses are accurate and cite uploaded documents

---

## **STEP 4: GENERATE AND CONFIGURE API KEY**

1. **In AnythingLLM:**
   - Go to **Settings** → **Developer** → **API Keys**
   - Click **"Generate New API Key"**
   - Copy the generated key

2. **Update FinBox `.env.local`:**
   ```env
   VITE_ANYTHINGLLM_API_KEY=YOUR_API_KEY_HERE
   ```

3. **Restart Vite Dev Server:**
   ```bash
   cd /Users/bradpalmer/Projects/finbox
   npm run dev
   ```

4. **Test Connection in FinBox:**
   - Open FinBox at `http://localhost:5173`
   - Go to **Settings** → **AI Assistant**
   - Click **"Test Connection"**
   - Should see: ✅ "Connected to AnythingLLM successfully"

---

## **STEP 5: VERIFY AI FUNCTIONALITY**

### **Test Scenarios:**

1. **IFA Knowledge Test:**
   - Go to Discovery workflow in FinBox
   - Ask AI: "Explain how NCPI deductions work in an IFA"
   - Expected: Detailed explanation citing tax treatment

2. **Product Recommendation Test:**
   - Enter client profile (age 50, business owner, $200k corporate surplus)
   - Ask AI: "What Manulife or Equitable product would be suitable?"
   - Expected: IFA recommendation with reasoning

3. **Suitability Generation Test:**
   - Complete discovery steps with client data
   - Request AI to generate suitability narrative
   - Expected: Compliant narrative connecting client profile to IFA recommendation

4. **Conversation Coaching Test:**
   - During discovery, ask: "How do I explain CDA to a client?"
   - Expected: Simple, client-friendly explanation

---

## **STEP 6: ONGOING MAINTENANCE**

### **Document Updates:**

- **Quarterly:** Update product rate sheets and caps (if carriers change)
- **Annually:** Review and update product guides with latest features
- **As Needed:** Add new IFA case studies and examples

### **Performance Monitoring:**

- **Track Response Accuracy:** Are AI answers factually correct?
- **Monitor Citations:** Is AI properly referencing uploaded documents?
- **Advisor Feedback:** Are advisors finding the AI helpful in real meetings?

### **Re-embedding Documents:**

If you update a document:
1. Delete old version from AnythingLLM workspace
2. Upload new version
3. Wait for re-embedding
4. Test updated knowledge

---

## **TROUBLESHOOTING**

### **Problem: AI doesn't know about IFAs**

**Solution:**
- Check that IFA PDFs are uploaded and embedded
- Verify workspace selected in FinBox matches workspace with documents
- Try more specific questions ("What is the CDA credit in an IFA?")

### **Problem: Connection fails**

**Solution:**
- Verify AnythingLLM is running: `http://localhost:3001`
- Check API key is correct in `.env.local`
- Restart Vite dev server after changing `.env.local`

### **Problem: Responses are generic/not grounded**

**Solution:**
- Check embedding status of documents (should say "Embedded")
- Increase chunk overlap in AnythingLLM settings (try 200 tokens)
- Lower temperature for more factual responses (0.1-0.3)
- Verify system prompt emphasizes document grounding

---

## **KEY SUCCESS FACTORS**

✅ **Focus on IFAs First:** Upload and verify IFA documents before adding other content
✅ **Test Before Launch:** Run through all test scenarios before advisors use
✅ **Monitor Accuracy:** Regularly verify AI responses against source documents
✅ **Keep Updated:** Plan for quarterly product data refreshes
✅ **Advisor Training:** Show advisors how to ask effective questions

---

## **NEXT STEPS**

1. ✅ Upload IFA PDFs from Desktop FinBox Training folder
2. ✅ Configure "finbox" workspace in AnythingLLM
3. ✅ Generate API key and update `.env.local`
4. ✅ Test connection in FinBox Settings
5. ✅ Run through test scenarios
6. ⏳ Obtain current Manulife and Equitable product guides (2026 rates)
7. ⏳ Fill in product guide templates with real data
8. ⏳ Upload completed product guides to AnythingLLM

---

**Questions?** Refer to:
- AnythingLLM Documentation: https://docs.useanything.com
- FinBox Technical Docs: `finbox-core/finbox-complete-project-handoff.md`
- Training Plan: `/Users/bradpalmer/anythingllm-training-docs/FINBOX_TRAINING_PLAN.md`
