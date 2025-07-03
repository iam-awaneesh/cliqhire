import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ConsultingFieldsProps {
  formData: any;
  handleInputChange: any;
  uploadedFiles: { [key: string]: File | null };
  handleFileChange: (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  technicalProposalOptionInputRef: React.RefObject<HTMLInputElement>;
  financialProposalOptionInputRef: React.RefObject<HTMLInputElement>;
}

export const ConsultingFields: React.FC<ConsultingFieldsProps> = ({
  formData,
  handleInputChange,
  uploadedFiles,
  handleFileChange,
  technicalProposalOptionInputRef,
  financialProposalOptionInputRef,
}) => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-row gap-4">
        <div className="flex-1 space-y-1">
          <Label htmlFor="contractStartDate">Contract Start Date</Label>
          <div className="grid gap-2">
            <input
              type="date"
              value={formData.contractStartDate ? formData.contractStartDate : ""}
              onChange={(e) =>
                handleInputChange("contractStartDate")({ target: { value: e.target.value } })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor="contractEndDate">Contract End Date</Label>
          <div className="grid gap-2">
            <input
              type="date"
              value={formData.contractEndDate ? formData.contractEndDate : ""}
              onChange={(e) =>
                handleInputChange("contractEndDate")({ target: { value: e.target.value } })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex-1 space-y-1">
          <Label>Technical Proposal</Label>
          <Textarea
            value={formData.technicalProposalNotes || ""}
            onChange={handleInputChange("technicalProposalNotes")}
            placeholder="Enter Technical Proposal notes..."
            className="min-h-[60px]"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => technicalProposalOptionInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Upload File
            </Button>
            <input
              ref={technicalProposalOptionInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange("technicalProposal")}
            />
            {uploadedFiles.technicalProposal && (
              <span className="text-xs text-muted-foreground truncate">
                {uploadedFiles.technicalProposal.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <Label>Financial Proposal</Label>
          <Textarea
            value={formData.financialProposalNotes || ""}
            onChange={handleInputChange("financialProposalNotes")}
            placeholder="Enter Financial Proposal notes..."
            className="min-h-[60px]"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => financialProposalOptionInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Upload File
            </Button>
            <input
              ref={financialProposalOptionInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange("financialProposal")}
            />
            {uploadedFiles.financialProposal && (
              <span className="text-xs text-muted-foreground truncate">
                {uploadedFiles.financialProposal.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
