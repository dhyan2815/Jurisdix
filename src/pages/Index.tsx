import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import DocumentForm from '@/components/upload/DocumentForm';
import { UploadFormData } from '@/types/legal';
import { transformDocumentTypeForN8N } from '@/lib/n8n-transformer';
import { toast } from 'sonner';

// n8n webhook URL from environment variable
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  throw new Error('Missing VITE_N8N_WEBHOOK_URL environment variable');
}

const Index = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: UploadFormData) => {
    setIsSubmitting(true);

    try {
      // Prepare form data for n8n webhook
      const formData = new FormData();
      formData.append('document_id', data.document_id);
      formData.append('document_type', transformDocumentTypeForN8N(data.document_type));
      formData.append('client_name', data.client_name);
      formData.append('client_email', data.client_email);
      formData.append('analysis_type', JSON.stringify(data.analysis_types));

      if (data.case_id) formData.append('case_id', data.case_id);
      if (data.jurisdiction) formData.append('jurisdiction', data.jurisdiction);
      if (data.file) formData.append('file', data.file);
      if (data.file_url) formData.append('file_url', data.file_url);

      console.log('Sending request to n8n webhook:', WEBHOOK_URL);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`n8n workflow failed with status ${response.status}: ${errorText}`);
      }

      // Show success message
      toast.success('Document submitted successfully! Analysis will take 1-2 minutes. Check the History page for results.');

      // Redirect to History page
      // Supabase will handle storing the results and real-time updates
      navigate('/history');

    } catch (error) {
      console.error('n8n workflow error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to submit document: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Legal Research & Contract Analysis</h1>
            <p className="mt-2 text-muted-foreground">
              Upload a legal document for AI-powered analysis, risk assessment, contract analysis, and legal research.
            </p>
          </div>
          <DocumentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4 text-center dark:border-blue-900/30 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="mr-2 font-semibold">Note:</span>
              Results will appear in History once processing completes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
