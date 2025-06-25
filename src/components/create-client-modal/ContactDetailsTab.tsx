import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Eye, Download } from "lucide-react";
import { ClientForm } from "@/components/create-client-modal/type";
import { countryCodes } from "./constants";

interface ContactDetailsTabProps {
  formData: ClientForm;
  setFormData: React.Dispatch<React.SetStateAction<ClientForm>>;
  setIsContactModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleInputChange: (field: keyof ClientForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  uploadedFiles: { [key: string]: File | null };
  handleFileChange: (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePreview: (file: File | string | null) => void;
  handleDownload: (file: File | null) => void;
  technicalProposalOptionInputRef: React.RefObject<HTMLInputElement>;
  financialProposalOptionInputRef: React.RefObject<HTMLInputElement>;
}

export function ContactDetailsTab({
  formData,
  setFormData,
  setIsContactModalOpen,
  handleInputChange,
  uploadedFiles,
  handleFileChange,
  handlePreview,
  handleDownload,
  technicalProposalOptionInputRef,
  financialProposalOptionInputRef,
}: ContactDetailsTabProps) {
  const getCountryCodeLabel = (code: string) => {
    const country = countryCodes.find((option) => option.code === code);
    return country ? country.label : code;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm sm:text-base">
            Primary Contacts *
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsContactModalOpen(true)}
            type="button"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </Button>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4">
          {formData.primaryContacts.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No contacts added.
            </div>
          ) : (
            <div className="space-y-3">
              {formData.primaryContacts.map((contact, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="block space-y-1">
                    <div className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contact.gender}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contact.designation}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {contact.email || "No email"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {getCountryCodeLabel(contact.countryCode || "+966")} {contact.phone || "No phone"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {contact.linkedin || "No LinkedIn"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lineOfBusiness" className="text-sm sm:text-base">
          Line of Business *
        </Label>
        <div className="space-y-2 border rounded-md p-2">
          {[
            "Recruitment",
            "HR Consulting",
            "Mgt Consulting",
            "Outsourcing",
            "HR Managed Services",
            "IT & Technology",
          ].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`lob-${option}`}
                checked={formData.lineOfBusiness?.includes(option)}
                onCheckedChange={(checked) => {
                  setFormData((prev) => {
                    const current = Array.isArray(prev.lineOfBusiness) 
                      ? prev.lineOfBusiness 
                      : prev.lineOfBusiness ? [prev.lineOfBusiness] : [];
                    return {
                      ...prev,
                      lineOfBusiness: checked
                        ? [...current, option]
                        : current.filter((item: string) => item !== option),
                    };
                  });
                }}
              />
              <label
                htmlFor={`lob-${option}`}
                className={`text-xs sm:text-sm font-medium leading-none cursor-pointer ${formData.lineOfBusiness?.includes(option)
                    ? "font-bold text-primary"
                    : ""
                  }`}
                onClick={() => formData.lineOfBusiness?.includes(option) && setFormData((prev) => ({ ...prev, lineOfBusiness: [option] }))}
              >
                {option
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </label>
            </div>
          ))}
        </div>
        {(formData.lineOfBusiness?.includes("HR Consulting") || 
          formData.lineOfBusiness?.includes("Mgt Consulting")) && (
          <div className="mt-4 space-y-4">
            <h4 className="text-sm font-medium">Proposal Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Technical Proposal", "Financial Proposal"].map((type) => (
                <div key={type} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`proposal-${type}`}
                        checked={formData.proposalOptions?.includes(type)}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            proposalOptions: checked 
                              ? [...(prev.proposalOptions || []), type]
                              : (prev.proposalOptions || []).filter(opt => opt !== type)
                          }));
                        }}
                      />
                      <h5 className="font-medium">{type}</h5>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          const fileField = type.toLowerCase().includes('technical') ? 'technicalProposal' : 
                                            type.toLowerCase().includes('financial') ? 'financialProposal' : null;
                          const file = fileField ? uploadedFiles[fileField as keyof typeof uploadedFiles] : null;
                          handlePreview(file as File | string | null);
                        }}
                        disabled={!formData.proposalOptions?.includes(type)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          const fileField = type.toLowerCase().includes('technical') ? 'technicalProposal' : 
                                            type.toLowerCase().includes('financial') ? 'financialProposal' : null;
                          const file = fileField ? uploadedFiles[fileField as keyof typeof uploadedFiles] : null;
                          if (file) {
                            handleDownload(file as File);
                          }
                        }}
                        disabled={!formData.proposalOptions?.includes(type)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {formData.proposalOptions?.includes(type) && (
                    <>
                      <Textarea
                        value={type === 'Technical Proposal' ? formData.technicalProposalNotes || '' : formData.financialProposalNotes || ''}
                        onChange={handleInputChange(type === 'Technical Proposal' ? 'technicalProposalNotes' : 'financialProposalNotes')}
                        placeholder={`Enter ${type} notes...`}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          type="button"
                          onClick={() => {
                            if (type === "Technical Proposal") {
                              technicalProposalOptionInputRef.current?.click();
                            } else if (type === "Financial Proposal") {
                              financialProposalOptionInputRef.current?.click();
                            }
                          }}
                        >
                          <Upload className="h-4 w-4" />
                          Upload File
                        </Button>
                        {type === "Technical Proposal" && (
                          <input
                            ref={technicalProposalOptionInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleFileChange("technicalProposal")}
                          />
                        )}
                        {type === "Financial Proposal" && (
                          <input
                            ref={financialProposalOptionInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleFileChange("financialProposal")}
                          />
                        )}
                      </div>
                      {type === "Technical Proposal" && uploadedFiles.technicalProposal && (
                        <p className="text-xs text-muted-foreground truncate">
                          Selected file: {uploadedFiles.technicalProposal.name}
                        </p>
                      )}
                      {type === "Financial Proposal" && uploadedFiles.financialProposal && (
                        <p className="text-xs text-muted-foreground truncate">
                          Selected file: {uploadedFiles.financialProposal.name}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}