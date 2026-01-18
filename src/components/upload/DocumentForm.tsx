import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';
import FileUploader from './FileUploader';
import { UploadFormData, AnalysisType, DocumentType } from '@/types/legal';

interface DocumentFormProps {
  onSubmit: (data: UploadFormData) => void;
  isSubmitting: boolean;
}

const analysisOptions: { value: AnalysisType; label: string; description: string }[] = [
  { value: 'risk_assessment', label: 'Risk Assessment', description: 'Identify potential legal risks' },
  { value: 'clause_extraction', label: 'Clause Extraction', description: 'Extract and categorize clauses' },
  { value: 'precedent_search', label: 'Precedent Search', description: 'Find relevant case precedents' },
  { value: 'legislative_update', label: 'Legislative Update', description: 'Check for regulatory changes' },
];

const DocumentForm = ({ onSubmit, isSubmitting }: DocumentFormProps) => {
  const [formData, setFormData] = useState<UploadFormData>({
    document_id: '',
    document_type: 'contract',
    client_name: '',
    client_email: '',
    case_id: '',
    jurisdiction: '',
    analysis_types: ['risk_assessment'],
    file: undefined,
    file_url: '',
  });

  const handleAnalysisTypeToggle = (type: AnalysisType) => {
    setFormData(prev => ({
      ...prev,
      analysis_types: prev.analysis_types.includes(type)
        ? prev.analysis_types.filter(t => t !== type)
        : [...prev.analysis_types, type]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.document_id &&
    formData.client_name &&
    formData.client_email &&
    formData.analysis_types.length > 0 &&
    (formData.file || formData.file_url);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* LEFT COLUMN - Document Details & Upload */}
        <div className="space-y-6">
          {/* Document Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
              <CardDescription>Provide information about the document and case</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="document_id">Document ID *</Label>
                  <Input
                    id="document_id"
                    placeholder="DOC-2024-001"
                    value={formData.document_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, document_id: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document_type">Document Type *</Label>
                  <Select
                    value={formData.document_type}
                    onValueChange={(value: DocumentType) => setFormData(prev => ({ ...prev, document_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="case_law">Case Law</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Name *</Label>
                  <Input
                    id="client_name"
                    placeholder="Acme Corporation"
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email">Client Email *</Label>
                  <Input
                    id="client_email"
                    type="email"
                    placeholder="client@company.com"
                    value={formData.client_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="case_id">Case ID (Optional)</Label>
                  <Input
                    id="case_id"
                    placeholder="CASE-001"
                    value={formData.case_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, case_id: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                  <Input
                    id="jurisdiction"
                    placeholder="India"
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData(prev => ({ ...prev, jurisdiction: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>Upload a legal document for AI-powered analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader
                selectedFile={formData.file || null}
                fileUrl={formData.file_url || ''}
                onFileSelect={(file) => setFormData(prev => ({ ...prev, file: file || undefined }))}
                onUrlChange={(url) => setFormData(prev => ({ ...prev, file_url: url }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Analysis Types & Submit */}
        <div className="space-y-6">
          {/* Analysis Types Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Analysis Types</CardTitle>
              <CardDescription>Select the types of analysis to perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {analysisOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-all hover:bg-accent hover:border-primary/50"
                  >
                    <Checkbox
                      checked={formData.analysis_types.includes(option.value)}
                      onCheckedChange={() => handleAnalysisTypeToggle(option.value)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit for Analysis
                    </>
                  )}
                </Button>
                {!isValid && (
                  <p className="mt-2 text-xs text-center text-muted-foreground">
                    Please fill all required fields and select at least one analysis type
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default DocumentForm;
