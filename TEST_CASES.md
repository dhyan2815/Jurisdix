## 🧪 STEP-BY-STEP TESTING GUIDE

### Prerequisites

Before testing, ensure:
- ✅ Dev server is running (`npm run dev`)
- ✅ n8n workflow is **ACTIVE** in test environment
- ✅ You have a PDF document ready (contract or case law)
- ✅ Browser console is open (F12) for monitoring

---

### 🎬 TEST SCENARIO 1: Contract Analysis (Full Demo)

#### Step 1: Activate n8n Workflow
1. Open n8n dashboard: `https://n8n.srv1241696.hstgr.cloud`
2. Navigate to "Law Firm Main Version" workflow
3. Click **"Active"** toggle to enable the workflow
4. Verify webhook URL is: `/webhook-test/b8d7c66f-a581-43cd-b77f-5f4e03b10bf4`

#### Step 2: Open the UI
1. Open browser and navigate to: `http://localhost:8081`
2. You should see "Legal Research Analysis" heading
3. Open browser DevTools (F12) → Console tab

#### Step 3: Fill Out the Form
Fill in the following test data:

| Field | Value | Notes |
|-------|-------|-------|
| **Document ID** | `TEST-CONTRACT-001` | Required |
| **Document Type** | Select `Contract` | Will be sent as "Contract" |
| **Client Name** | `Acme Corporation` | Required |
| **Client Email** | `test@acmecorp.com` | Required (changed from attorney_email) |
| **Case ID** | `CASE-2026-001` | Optional |
| **Jurisdiction** | `India` | Optional but recommended |
| **Urgency Level** | Select `high` | Required |
| **Analysis Types** | Check `Risk Assessment` and `Clause Extraction` | At least one required |

#### Step 4: Upload Document
**Option A - File Upload:**
1. Click "Browse Files" or drag & drop
2. Select a PDF contract document
3. Wait for file to be selected

**Option B - URL Upload:**
1. Paste a publicly accessible PDF URL
2. Example: `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`

#### Step 5: Submit and Monitor
1. Click **"Submit for Analysis"** button
2. **Watch the UI status changes:**
   - Status: "Queued" (brief)
   - Status: "Extracting Text" (10-20 seconds)
   - Status: "Analyzing" (30-60 seconds)
   
3. **Monitor Browser Console:**
   ```
   Sending request to n8n webhook: https://n8n.srv1241696.hstgr.cloud/webhook-test/...
   ```

4. **Monitor n8n Dashboard:**
   - Go to n8n → Executions
   - Watch the workflow execution in real-time
   - Each node should turn green as it completes

#### Step 6: Verify n8n Workflow Execution
In n8n dashboard, verify each phase:

**Phase 1 - Document Intake:**
- ✅ `Webhook_TriggerFormEvent` - Receives data
- ✅ `GoogleDrive_UploadDocument` - Uploads PDF
- ✅ `Set_NormalizeInput` - Normalizes data

**Phase 2 - Text Extraction:**
- ✅ `PDFCo_ExtractText` - Extracts text from PDF
- ✅ `Function_NormalizeExtractedText` - Cleans text
- ✅ `Function_PreprocessDocument` - Chunks text

**Phase 3A - Contract Analysis:**
- ✅ `IF_RouteByDocumentType` - Routes to Contract branch
- ✅ `Aggregate_MergeChunks1` - Merges chunks
- ✅ `ClassifyDocument` - Classifies document
- ✅ `AIAgent_AssessContractRisk` - AI risk assessment
- ✅ `Agent_CheckCompliance` - Compliance check
- ✅ `Agent_GenerateContractReport` - Generate report

**Phase 4 - Output:**
- ✅ `Contract_Supabase_InsertAnalysis` - Save to DB
- ✅ `Contract_Sheets_AppendLogs` - Log to Sheets
- ✅ `Contract_Webhook_RespondToUI` - Send response

#### Step 7: Verify UI Response
1. **Check Browser Console:**
   ```javascript
   n8n workflow response: {
     output: {
       analysis_summary: "...",
       risk_score: 6.2,
       extracted_clauses: [...],
       compliance_flags: [...],
       confidence_score: 0.87,
       recommended_action: "..."
     }
   }
   ```

2. **UI Should Show:**
   - Status changes to "Completed"
   - Success toast: "Document analysis completed successfully!"
   - Analysis Results page displays

#### Step 8: Verify Results Display
Check that the dashboard shows:

**Executive Summary Card:**
- ✅ Summary text displayed
- ✅ Risk score shown (0-10 scale)
- ✅ Confidence score shown (0-1 scale)

**Extracted Clauses:**
- ✅ Clause cards displayed
- ✅ Risk levels color-coded (low/medium/high/critical)
- ✅ Clause text visible

**Compliance Flags:**
- ✅ Flags displayed with severity badges
- ✅ Recommendations shown

**Precedent Cases:**
- ✅ Case cards displayed
- ✅ Citations and summaries visible

**Recommended Actions:**
- ✅ Action items listed

---

### 🎬 TEST SCENARIO 2: Legal Research (Case Law)

#### Step 1: Reset the Form
1. Click "Analyze Another Document" (if on results page)
2. Or refresh the page

#### Step 2: Fill Out Form for Legal Research
| Field | Value |
|-------|-------|
| **Document ID** | `TEST-RESEARCH-001` |
| **Document Type** | Select `Case Law` |
| **Client Name** | `TechStart Inc` |
| **Client Email** | `legal@techstart.com` |
| **Case ID** | `RESEARCH-2026-001` |
| **Jurisdiction** | `California` |
| **Urgency Level** | `standard` |
| **Analysis Types** | Check `Precedent Search` and `Legislative Update` |

#### Step 3: Upload Case Law Document
- Upload a legal case document or case brief PDF

#### Step 4: Submit and Monitor
1. Click "Submit for Analysis"
2. **Watch n8n workflow route to Legal Research branch:**
   - `IF_RouteByDocumentType` → Legal Research output
   - `ParseResearchQuery` → Parse query
   - `Pinecone_SearchCaseLaw` → Vector search
   - `AnalyzePrecedents` → AI analysis
   - `CheckLegislativeUpdates` → Web search
   - `Generate_ResearchMemo` → Generate memo

#### Step 5: Verify Legal Research Output
**Expected n8n Response:**
```json
{
  "output": {
    "research_summary": "...",
    "case_analysis": [
      {
        "citation": "...",
        "authority_level": "BINDING",
        "applicability_score": 8.5,
        "holding": "...",
        "applicability_to_our_case": "..."
      }
    ],
    "legislative_alert": {
      "statute": "...",
      "impact": "..."
    },
    "recommendation": "..."
  }
}
```

#### Step 6: Verify Transformation
**Check Console:**
- Legal research output should be transformed to UI format
- `case_analysis` → `precedent_cases`
- `legislative_alert` → `compliance_flags`

---

### 🧪 TEST SCENARIO 3: Error Handling

#### Test 3A: Network Error
1. Stop n8n workflow (make it inactive)
2. Submit a document
3. **Expected:** Error toast with message
4. **Check Console:** Error logged with details

#### Test 3B: Invalid File
1. Try uploading a non-PDF file (e.g., .txt, .docx)
2. **Expected:** Form validation or n8n error

#### Test 3C: Missing Required Fields
1. Leave "Client Email" blank
2. Try to submit
3. **Expected:** Submit button disabled

---

### ✅ VERIFICATION CHECKLIST

After running all tests, verify:

#### UI Verification
- [ ] Form accepts all required fields
- [ ] Document type transforms to Title Case
- [ ] `client_email` field works (not `attorney_email`)
- [ ] File upload works
- [ ] URL upload works
- [ ] Status updates show correctly
- [ ] Error messages display properly
- [ ] Results display for contract analysis
- [ ] Results display for legal research
- [ ] "Analyze Another Document" resets form

#### n8n Workflow Verification
- [ ] Webhook receives correct data format
- [ ] Document type is "Contract" or "Case Law" (Title Case)
- [ ] Google Drive upload succeeds
- [ ] PDF.co text extraction works
- [ ] Contract branch executes for contracts
- [ ] Legal research branch executes for case law
- [ ] AI agents respond correctly
- [ ] Supabase inserts succeed
- [ ] Google Sheets logs created
- [ ] Webhook response sent to UI

#### Data Transformation Verification
- [ ] Contract output transforms correctly
- [ ] Legal research output transforms correctly
- [ ] Compliance flags parse from strings
- [ ] Extracted clauses format correctly
- [ ] Precedent cases display properly
- [ ] Risk scores display (0-10 scale)
- [ ] Confidence scores display (0-1 scale)

---

### 📊 EXPECTED TIMING

**Contract Analysis:**
- Document Upload: 2-5 seconds
- Text Extraction: 10-20 seconds
- AI Analysis: 30-60 seconds
- **Total: ~45-85 seconds**

**Legal Research:**
- Document Upload: 2-5 seconds
- Text Extraction: 10-20 seconds
- Vector Search: 5-10 seconds
- AI Analysis: 20-40 seconds
- Web Search: 10-20 seconds
- **Total: ~47-95 seconds**

---

### 🐛 DEBUGGING TIPS

#### If Workflow Fails:
1. Check n8n execution logs for error node
2. Check browser console for request/response
3. Verify webhook URL is correct
4. Ensure workflow is active
5. Check PDF.co API credits
6. Verify Google Drive permissions
7. Check Supabase connection

#### If UI Doesn't Update:
1. Check browser console for errors
2. Verify response format matches expected
3. Check transformation logic in console
4. Ensure status state is updating

#### If Results Don't Display:
1. Console log the transformed results
2. Verify `AnalysisDashboard` component
3. Check if results object has data
4. Verify result type detection

---

### 📝 TEST DATA EXAMPLES

#### Sample Contract Document IDs:
- `CONTRACT-2026-001`
- `LEASE-AGREEMENT-001`
- `NDA-2026-ACME`

#### Sample Case Law Document IDs:
- `RESEARCH-2026-001`
- `CASE-BRIEF-CA-001`
- `PRECEDENT-SEARCH-001`

#### Sample Client Names:
- Acme Corporation
- TechStart Inc
- Global Logistics Ltd
- HealthCare Plus

#### Sample Jurisdictions:
- India
- California
- Delaware
- New York
- Texas

---

**Ready to Test!** 🚀

Follow these steps in order, and you'll have a complete understanding of how the UI and n8n workflow work together synchronously.

---

## 🚀 Deployment Steps

### 1. Update Environment
```bash
# Update webhook URL for production
# Edit src/pages/Index.tsx line 11
const WEBHOOK_URL = 'https://n8n.srv1241696.hstgr.cloud/webhook/[production-id]';
```

### 2. Build Application
```bash
npm run build
```

### 3. Deploy
```bash
# Deploy to your hosting platform
# Ensure environment variables are set
```

### 4. Verify Integration
- Test with sample documents
- Monitor n8n workflow executions
- Check error logs

---

## 📝 Maintenance Notes

### When to Update

**If n8n workflow output changes:**
1. Update type definitions in `src/types/legal.ts`
2. Update transformation logic in `src/lib/n8n-transformer.ts`
3. Test both contract and legal research branches
4. Update documentation

**If new document types are added:**
1. Add to `DocumentType` in `src/types/legal.ts`
2. Add to form dropdown in `DocumentForm.tsx`
3. Add transformation in `transformDocumentTypeForN8N()`
4. Update n8n workflow routing logic

**If new analysis types are added:**
1. Add to `AnalysisType` in `src/types/legal.ts`
2. Add to `analysisOptions` in `DocumentForm.tsx`
3. Update n8n workflow to handle new type

---

## 🔍 Troubleshooting

### Issue: "Failed to analyze document"
**Check:**
1. Is n8n workflow active?
2. Is webhook URL correct?
3. Check browser console for error details
4. Check n8n workflow execution logs

### Issue: Results not displaying correctly
**Check:**
1. Console log the n8n response
2. Verify response structure matches expected format
3. Check transformation logic in `n8n-transformer.ts`
4. Verify AnalysisDashboard component

### Issue: Form submission fails
**Check:**
1. All required fields filled?
2. File or URL provided?
3. Network connectivity?
4. CORS issues?

---

## 📞 Support

For issues or questions:
1. Check `N8N_INTEGRATION.md` for detailed documentation
2. Review console logs for error messages
3. Check n8n workflow execution history
4. Verify all changes from this summary are applied

---

**Integration Completed**: January 17, 2026
**Status**: ✅ Ready for Testing
**Next Steps**: Test with real documents, then deploy to production
