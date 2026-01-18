import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentType } from '@/types/legal';

interface HistoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  documentType: string;
  onDocumentTypeChange: (value: string) => void;
  riskLevel: string;
  onRiskLevelChange: (value: string) => void;
}

const HistoryFilters = ({
  searchQuery,
  onSearchChange,
  documentType,
  onDocumentTypeChange,
  riskLevel,
  onRiskLevelChange,
}: HistoryFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by client, document ID, or attorney..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Select value={documentType} onValueChange={onDocumentTypeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="case_law">Case Law</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskLevel} onValueChange={onRiskLevelChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risks</SelectItem>
            <SelectItem value="low">Low (0-3)</SelectItem>
            <SelectItem value="medium">Medium (4-6)</SelectItem>
            <SelectItem value="high">High (7-10)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default HistoryFilters;
