# Supabase Integration Debugging Guide

## 🔍 **Debugging Steps**

### **Step 1: Check Browser Console**

1. Open browser console (F12)
2. Go to History page
3. Look for these logs:

**Expected logs:**
```
Fetching documents from Supabase...
Contract documents: [...]
Research documents: [...]
Total documents: X
```

**If you see errors:**
- Share the exact error message
- Check if Supabase URL/Key are correct

---

### **Step 2: Check Supabase Dashboard**

1. Go to https://mgpnpmmkceumyfltboea.supabase.co
2. Click "Table Editor"
3. Check both tables:
   - `contract_analysis`
   - `legal_research`

**Questions:**
- ✅ Do you see the new row in the table?
- ✅ What's the document_type value?
- ✅ Is there data in the columns?

---

### **Step 3: Check n8n Execution**

In n8n execution logs, check:
- ✅ Did it reach the Supabase node?
- ✅ Did Supabase insert succeed?
- ✅ What table did it insert into?

---

### **Step 4: Manual Supabase Query**

Run this in Supabase SQL Editor:

```sql
-- Check contract_analysis table
SELECT * FROM contract_analysis ORDER BY created_at DESC LIMIT 5;

-- Check legal_research table
SELECT * FROM legal_research ORDER BY created_at DESC LIMIT 5;
```

**Share the results!**

---

## 🐛 **Common Issues:**

### **Issue 1: Data in wrong table**
- Check if document_type matches table
- Contract → contract_analysis
- Case Law → legal_research

### **Issue 2: Column name mismatch**
- n8n might be using different column names
- Check n8n Supabase node field mappings

### **Issue 3: RLS (Row Level Security)**
- Supabase might be blocking reads
- Check if RLS is enabled
- Disable RLS for testing

### **Issue 4: Real-time not enabled**
- Go to Supabase → Database → Replication
- Enable replication for both tables

---

## 🔧 **Quick Fixes:**

### **Fix 1: Add Debug Logging**

I'll update the code to show more debug info.

### **Fix 2: Check Environment Variables**

Make sure `.env` is loaded:
```bash
# Restart dev server
Ctrl+C
npm run dev
```

### **Fix 3: Manual Refresh**

Click the "Refresh" button in History page.

---

## 📋 **What I Need From You:**

Please provide:

1. **Browser Console Output:**
   - Open F12 → Console tab
   - Go to History page
   - Copy all logs

2. **Supabase Table Check:**
   - Go to Table Editor
   - Check if row exists
   - Screenshot or describe what you see

3. **n8n Execution:**
   - Which Supabase node executed?
   - What data did it send?
   - Any errors?

---

Share these 3 things and I'll fix it immediately!
