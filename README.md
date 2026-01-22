# Legal Research & Contract Analysis

> AI-Powered Legal Document Analysis & Research Platform

Contract & Case Law Researcher is an intelligent legal automation platform that combines AI-powered document analysis with real-time legal research capabilities. Built for law firms and legal professionals, it streamlines contract review, risk assessment, and case law research through advanced natural language processing.

---

## 🎯 Features

### 📄 **Document Analysis**
- **Contract Analysis**: Automated risk assessment, clause extraction, and compliance checking
- **Legal Research**: Precedent search and legislative update tracking
- **Multi-Format Support**: PDF upload and URL-based document processing
- **Real-Time Processing**: Background analysis with live status updates

### 🔍 **AI-Powered Insights**
- **Risk Scoring**: 0-10 scale risk assessment with detailed breakdowns
- **Clause Extraction**: Automatic identification and categorization of contract clauses
- **Compliance Flags**: Regulatory compliance validation and gap analysis
- **Precedent Matching**: Relevant case law discovery with applicability scoring

### 📊 **Data Management**
- **Supabase Integration**: Real-time database with persistent storage
- **Document History**: Complete audit trail of all analyzed documents
- **Advanced Filtering**: Search by client, document type, risk level, and more
- **Export Ready**: Structured data for reports and further analysis

### 🔄 **Workflow Automation**
- **n8n Integration**: Automated document processing pipeline
- **Google Drive**: Automatic document archival
- **Slack Notifications**: Real-time alerts for critical findings
- **Google Sheets**: Automated reporting and data export

---

## 📖 Usage

### Analyzing a Document

1. **Navigate to the home page**
2. **Fill in Document Details**:
   - Document ID (e.g., DOC-2024-001)
   - Document Type (Contract or Case Law)
   - Client Name and Email
   - Case ID (optional)
   - Jurisdiction (required)

3. **Upload Document**:
   - Drag & drop PDF file, or
   - Paste a document URL

4. **Select Analysis Types**:
   - ✓ Risk Assessment
   - ✓ Clause Extraction
   - ✓ Precedent Search
   - ✓ Legislative Update

5. **Submit for Analysis**
   - Processing happens in background
   - Navigate to History page to view results

### Viewing Results

1. **Go to History page**
2. **Use filters** to find documents:
   - Search by client name, email, or document ID
   - Filter by document type
   - Filter by risk level

3. **Click the eye icon** to view detailed analysis:
   - Executive Summary
   - Risk Score (0-10)
   - Confidence Score
   - Compliance Flags
   - Extracted Clauses
   - Precedent Cases
   - Recommended Actions

4. **Delete documents** using the trash icon
   - Confirmation required
   - Permanent deletion from database

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **TanStack Query** - Data fetching
- **React Router** - Navigation
- **Sonner** - Toast notifications

### Backend & Automation
- **n8n** - Workflow automation
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Google Gemini** - AI analysis (2.5-flash, 2.5-pro)
- **PDF.co** - PDF text extraction
- **Pinecone** - Vector database for case law search
- **Tavily** - Web search for legislative updates
- **Google Drive** - Document storage
- **Google Sheets** - Data export
- **Slack** - Notifications

---

## 🔐 Security

### Environment Variables
- All sensitive credentials stored in `.env`
- `.env` is gitignored and never committed
- `.env.example` provides template without secrets

### Supabase RLS
- Row Level Security enabled on all tables
- Policies configured for anon key access
- Adjust policies for production use with authentication

### API Keys
- n8n workflow uses secure credential storage
- Frontend only uses public/anon keys
- Service role keys kept server-side only

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **n8n** - Workflow automation platform
- **Supabase** - Backend infrastructure
- **Google Gemini** - AI analysis capabilities
- **shadcn/ui** - Beautiful UI components
- **Vercel** - Deployment platform
