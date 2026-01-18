# Supabase Integration - Requirements & Implementation Plan

## 🎯 **Overview**

Instead of using localStorage, we'll:
1. ✅ n8n workflow stores analysis results in Supabase (already done)
2. ✅ Frontend reads from Supabase to display results
3. ✅ Real-time sync - no more localStorage mess
4. ✅ Proper data persistence and querying

---

## 📋 **What I Need From You:**

### **1. Supabase Project Details**

Please provide:

```
✅ Supabase Project URL: https://[your-project].supabase.co
✅ Supabase Anon/Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon/public key** (starts with `eyJhbGci...`)

---

### **2. Database Table Structure**

I need to know the **exact table name** and **column names** that n8n is using.

**Please provide:**

```sql
-- What is the table name?
Table name: _____________ (e.g., "contract_analysis", "legal_documents", etc.)

-- What are the column names?
-- Please share the table schema or a sample row
```

**How to get this:**

**Option A - From Supabase Dashboard:**
1. Go to Supabase → "Table Editor"
2. Find the table n8n writes to
3. Click "..." → "View table definition"
4. Share the column names

**Option B - From n8n Workflow:**
1. Open your n8n workflow
2. Find the "Supabase" node
3. Look at what fields it's inserting
4. Share the field mapping

**Option C - Query a Sample Row:**
Run this in Supabase SQL Editor:
```sql
SELECT * FROM your_table_name LIMIT 1;
```
Share the result (with sensitive data removed)

---

### **3. Expected Table Structure**

Based on your n8n response, I'm guessing the table looks like this:

```sql
CREATE TABLE legal_analysis (
  id TEXT PRIMARY KEY,
  "Client Name" TEXT,
  "Client Email" TEXT,
  "Document Type" TEXT,
  "Case ID" TEXT,
  "Jurisdiction" TEXT,
  "Applicability Score" INTEGER,
  "Research Summary" TEXT,
  "Recommendations" TEXT,
  "Case Analysis" JSONB,  -- or TEXT
  "Legislative Alert" JSONB,  -- or TEXT
  created_at TIMESTAMP DEFAULT NOW(),
  -- ... other fields
);
```

**Please confirm:**
- ✅ Table name
- ✅ Column names (especially if they have spaces or special characters)
- ✅ Data types (TEXT, JSONB, INTEGER, etc.)
- ✅ Primary key field name

---

## 🔧 **What I'll Implement:**

Once you provide the above, I'll:

### **1. Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

### **2. Create Supabase Client**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### **3. Update DocumentContext**
Replace localStorage with Supabase:
```typescript
// Fetch documents from Supabase
const { data } = await supabase
  .from('your_table_name')
  .select('*')
  .order('created_at', { ascending: false });
```

### **4. Update Index.tsx**
Remove the background processing - just submit to n8n and let it handle Supabase:
```typescript
// Submit to n8n
await fetch(WEBHOOK_URL, { method: 'POST', body: formData });

// Redirect to History
navigate('/history');

// History page will auto-fetch from Supabase
```

### **5. Update History Page**
Fetch real-time data from Supabase:
```typescript
useEffect(() => {
  fetchDocuments();
  
  // Optional: Real-time subscription
  const subscription = supabase
    .channel('legal_analysis')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'your_table_name' }, 
      (payload) => {
        // Auto-refresh when data changes
        fetchDocuments();
      }
    )
    .subscribe();
    
  return () => subscription.unsubscribe();
}, []);
```

### **6. Add Real-Time Status Updates**
Poll Supabase every few seconds to check status:
```typescript
// Check if document is still processing
const checkStatus = async (documentId) => {
  const { data } = await supabase
    .from('your_table_name')
    .select('status')
    .eq('id', documentId)
    .single();
    
  return data?.status;
};
```

---

## 📊 **Benefits of Supabase Integration:**

### ✅ **Real-Time Sync**
- Submit document → n8n processes → Saves to Supabase
- Frontend auto-refreshes from Supabase
- See results immediately when processing completes

### ✅ **No More localStorage Issues**
- Data persists across devices
- No browser storage limits
- Proper database queries and filtering

### ✅ **Better Performance**
- Efficient queries with indexes
- Pagination support
- Real-time subscriptions

### ✅ **Data Integrity**
- Single source of truth (Supabase)
- No sync issues between n8n and frontend
- Proper data validation

---

## 🎯 **Implementation Steps:**

### **Step 1: You Provide** (5 minutes)
1. ✅ Supabase Project URL
2. ✅ Supabase Anon Key
3. ✅ Table name
4. ✅ Column names/schema

### **Step 2: I Implement** (30 minutes)
1. ✅ Install Supabase client
2. ✅ Create Supabase service
3. ✅ Update DocumentContext to use Supabase
4. ✅ Update History page with real-time fetching
5. ✅ Remove localStorage completely
6. ✅ Add real-time subscriptions

### **Step 3: Testing** (10 minutes)
1. ✅ Submit document
2. ✅ n8n processes and saves to Supabase
3. ✅ Frontend auto-fetches from Supabase
4. ✅ See results in real-time

---

## 📝 **Quick Checklist:**

Please provide these 4 things:

```
[ ] 1. Supabase Project URL: _______________________
[ ] 2. Supabase Anon Key: _________________________
[ ] 3. Table Name: ________________________________
[ ] 4. Table Schema/Columns: ______________________
```

---

## 🔍 **How to Get Table Schema:**

**Method 1 - Supabase Dashboard:**
```
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Find your table
4. Click "..." → "View table definition"
5. Copy and share
```

**Method 2 - SQL Query:**
```sql
-- Run this in Supabase SQL Editor
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'your_table_name';
```

**Method 3 - From n8n:**
```
1. Open n8n workflow
2. Find "Supabase" insert/update node
3. Screenshot the field mappings
4. Share with me
```

---

## 🚀 **Once You Provide This:**

I'll implement the complete Supabase integration in ~30 minutes and you'll have:
- ✅ Real-time data sync
- ✅ No more localStorage
- ✅ Proper status updates
- ✅ Clean, reliable data flow

**Just share those 4 items and we're good to go!** 🎉
