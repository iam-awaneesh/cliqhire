// src/components/create-client-modal/proposal-form.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClientForm, LevelType } from "./types";

interface ProposalFormProps {
  formData: ClientForm;
  handleCheckboxChange: (option: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, level: LevelType) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  uploadedFiles: { [key: string]: File | null };
}

export function ProposalForm({ formData, handleCheckboxChange, handleFileChange, handleChange, uploadedFiles }: ProposalFormProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Proposal Options</Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id="technicalProposal" onCheckedChange={() => handleCheckboxChange("technical")} />
              <Label htmlFor="technicalProposal">Technical Proposal</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="financialProposal" onCheckedChange={() => handleCheckboxChange("financial")} />
              <Label htmlFor="financialProposal">Financial Proposal</Label>
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="technicalProposalNotes">Technical Proposal Notes</Label>
          <Textarea id="technicalProposalNotes" name="technicalProposalNotes" value={formData.technicalProposalNotes} onChange={handleChange} />
          <Input type="file" onChange={(e) => handleFileChange(e, "technicalProposal")} />
        </div>
        <div>
          <Label htmlFor="financialProposalNotes">Financial Proposal Notes</Label>
          <Textarea id="financialProposalNotes" name="financialProposalNotes" value={formData.financialProposalNotes} onChange={handleChange} />
          <Input type="file" onChange={(e) => handleFileChange(e, "financialProposal")} />
        </div>
      </div>
    </div>
  );
}
