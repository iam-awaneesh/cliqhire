import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface ContractPreviewModalProps {
  previewBusinessTab: string | null;
  setPreviewBusinessTab: (tab: string | null) => void;
  formData: any;
}

export const ContractPreviewModal: React.FC<ContractPreviewModalProps> = ({
  previewBusinessTab,
  setPreviewBusinessTab,
  formData,
}) => {
  return (
    <Dialog open={!!previewBusinessTab} onOpenChange={() => setPreviewBusinessTab(null)}>
      <DialogContent className="max-w-2xl w-full h-[500px] p-4 gap-0">
        <DialogHeader className="mb-0 pb-0">
          <DialogTitle className="text-base leading-tight m-0 p-0">
            {previewBusinessTab} Contract Preview
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll overflow-x-hidden max-h-[350px] pr-1 flex flex-col gap-1 ">
          {previewBusinessTab &&
            ["Recruitment", "HR Managed Services", "IT & Technology"].includes(
              previewBusinessTab,
            ) && (
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-row gap-4">
                  <div className="flex-1 space-y-1">
                    <Label>Contract Start Date</Label>
                    <div className="grid gap-2">
                      <div className="w-full border rounded px-3 py-2 bg-muted/50">
                        {formData.contractStartDate
                          ? format(new Date(formData.contractStartDate), "PPP")
                          : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label>Contract End Date</Label>
                    <div className="grid gap-2">
                      <div className="w-full border rounded px-3 py-2 bg-muted/50">
                        {formData.contractEndDate
                          ? format(new Date(formData.contractEndDate), "PPP")
                          : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label>Contract Type</Label>
                    <div className="w-full border rounded px-3 py-2 bg-muted/50">
                      {formData.contractType || "-"}
                    </div>
                  </div>
                </div>
                {/* Add more read-only fields as needed */}
              </div>
            )}
          {previewBusinessTab &&
            ["HR Consulting", "Mgt Consulting"].includes(previewBusinessTab) && (
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-row gap-4">
                  <div className="flex-1 space-y-1">
                    <Label>Contract Start Date</Label>
                    <div className="grid gap-2">
                      <div className="w-full border rounded px-3 py-2 bg-muted/50">
                        {formData.contractStartDate
                          ? format(new Date(formData.contractStartDate), "PPP")
                          : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label>Contract End Date</Label>
                    <div className="grid gap-2">
                      <div className="w-full border rounded px-3 py-2 bg-muted/50">
                        {formData.contractEndDate
                          ? format(new Date(formData.contractEndDate), "PPP")
                          : "-"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-4 mt-2">
                  <div className="flex-1 space-y-1">
                    <Label>Technical Proposal</Label>
                    <div className="w-full border rounded px-3 py-2 bg-muted/50">
                      {formData.technicalProposalNotes || "-"}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label>Financial Proposal</Label>
                    <div className="w-full border rounded px-3 py-2 bg-muted/50">
                      {formData.financialProposalNotes || "-"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          {/* Add more preview layouts for other business types as needed */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
