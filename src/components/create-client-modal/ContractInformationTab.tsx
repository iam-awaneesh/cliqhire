import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Upload, Eye, Download, CalendarIcon } from "lucide-react";
import { ClientForm } from "@/components/create-client-modal/type";
import { levelFieldMap } from "./constants";
import { Textarea } from "@/components/ui/textarea";
import { useState, Fragment, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { ContractTypeFields } from "./contract-fields/ContractTypeFields";
import { ConsultingFields } from "./contract-fields/ConsultingFields";
import { OutsourcingFields } from "./contract-fields/OutsourcingFields";
import { ContractPreviewModal } from "./contract-fields/ContractPreviewModal";

interface ContractInformationTabProps {
  formData: ClientForm;
  setFormData: React.Dispatch<React.SetStateAction<ClientForm>>;
  selectedLevels: string[];
  setSelectedLevels: React.Dispatch<React.SetStateAction<string[]>>;
  activeLevel: string | null;
  setActiveLevel: React.Dispatch<React.SetStateAction<string | null>>;
  uploadedFiles: { [key: string]: File | null };
  handleFileChange: (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePreview: (file: File | string | null) => void;
  handleDownload: (file: File | null) => void;
  handleInputChange: (
    field: keyof ClientForm,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  technicalProposalOptionInputRef: React.RefObject<HTMLInputElement>;
  financialProposalOptionInputRef: React.RefObject<HTMLInputElement>;
  setBusinessContracts: (business: string, data: any) => void;
  savedContracts: { [business: string]: boolean };
  setSavedContracts: React.Dispatch<React.SetStateAction<{ [business: string]: boolean }>>;
}

export function ContractInformationTab({
  formData,
  setFormData,
  selectedLevels,
  setSelectedLevels,
  activeLevel,
  setActiveLevel,
  uploadedFiles,
  handleFileChange,
  handlePreview,
  handleDownload,
  technicalProposalOptionInputRef,
  financialProposalOptionInputRef,
  handleInputChange,
  setBusinessContracts,
  savedContracts,
  setSavedContracts,
}: ContractInformationTabProps) {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [activeBusinessTab, setActiveBusinessTab] = useState<string | null>(null);
  const [previewBusinessTab, setPreviewBusinessTab] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBusiness, setModalBusiness] = useState<string | null>(null);

  const handleLevelChange = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
    setActiveLevel(level);
  };

  const handleSelectDate = (date: Date | undefined, type: "start" | "end") => {
    if (type === "start") {
      setFormData((prev) => ({ ...prev, contractStartDate: date || null }));
      setOpenStart(false);
    } else {
      setFormData((prev) => ({ ...prev, contractEndDate: date || null }));
      setOpenEnd(false);
    }
  };

  const businessOptions = [
    "Recruitment",
    "HR Consulting",
    "Mgt Consulting",
    "Outsourcing",
    "HR Managed Services",
    "IT & Technology",
  ];

  return (
    <div className="space-y-6 pt-4 pb-2">
      <div className="space-y-1">
        <Label htmlFor="lineOfBusiness">
          Line of Business<span className="text-red-700">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-2">
          {businessOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`lob-${option}`}
                checked={formData.lineOfBusiness?.includes(option)}
                onCheckedChange={(checked) => {
                  setFormData((prev) => {
                    const current = Array.isArray(prev.lineOfBusiness)
                      ? prev.lineOfBusiness
                      : prev.lineOfBusiness
                        ? [prev.lineOfBusiness]
                        : [];
                    return {
                      ...prev,
                      lineOfBusiness: checked
                        ? [...current, option]
                        : current.filter((item: string) => item !== option),
                    };
                  });
                  if (!formData.lineOfBusiness?.includes(option) && activeBusinessTab === option) {
                    setActiveBusinessTab(null);
                    setPreviewBusinessTab(null);
                  }
                }}
              />
              <label
                htmlFor={`lob-${option}`}
                className={`text-xs sm:text-sm font-medium leading-none cursor-pointer ${
                  formData.lineOfBusiness?.includes(option) ? "font-bold text-primary" : ""
                }`}
                onClick={() =>
                  formData.lineOfBusiness?.includes(option) &&
                  setFormData((prev) => ({ ...prev, lineOfBusiness: [option] }))
                }
              >
                {option
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </label>
            </div>
          ))}
        </div>
      </div>

      {formData.lineOfBusiness &&
        Array.isArray(formData.lineOfBusiness) &&
        formData.lineOfBusiness.length > 0 && (
          <div className="w-full rounded-xl border p-2 bg-[#f5f6f7] ">
            <div className="mt-1 w-full">
              <div className="w-full">
                {formData.lineOfBusiness.map((business: string) => (
                  <div
                    key={business}
                    className="rounded-xl border bg-white py-4 px-6 mb-4 flex items-center justify-between w-full"
                  >
                    <span className="font-medium text-xs sm:text-sm">{business} contract form</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="w-24"
                        variant={
                          activeBusinessTab === business && !previewBusinessTab
                            ? "default"
                            : "outline"
                        }
                        onClick={() => {
                          setActiveBusinessTab(business);
                          setPreviewBusinessTab(null);
                          setModalBusiness(business);
                          setModalOpen(true);
                        }}
                      >
                        Open
                      </Button>
                      {savedContracts[business] && (
                        <Button
                          size="sm"
                          className="w-24"
                          variant={previewBusinessTab === business ? "default" : "outline"}
                          onClick={() => {
                            setPreviewBusinessTab(business);
                          }}
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      {/* Modal for contract form */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl w-full h-[400px] p-4 gap-0 flex flex-col">
          <DialogHeader className="mb-0 pb-0">
            <DialogTitle className="text-base leading-tight m-0 p-0">
              {modalBusiness} Contract Form
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <div className="overflow-y-auto overflow-x-hidden h-full pr-1 flex flex-col gap-1">
              {modalBusiness &&
                ["Recruitment", "HR Managed Services", "IT & Technology"].includes(
                  modalBusiness,
                ) && (
                  <ContractTypeFields
                    formData={formData}
                    setFormData={setFormData}
                    selectedLevels={selectedLevels}
                    setSelectedLevels={setSelectedLevels}
                    activeLevel={activeLevel}
                    setActiveLevel={setActiveLevel}
                    uploadedFiles={uploadedFiles}
                    handleFileChange={handleFileChange}
                    handlePreview={handlePreview}
                    handleDownload={handleDownload}
                  />
                )}
              {modalBusiness && ["HR Consulting", "Mgt Consulting"].includes(modalBusiness) && (
                <ConsultingFields
                  formData={formData}
                  handleInputChange={handleInputChange}
                  uploadedFiles={uploadedFiles}
                  handleFileChange={handleFileChange}
                  technicalProposalOptionInputRef={technicalProposalOptionInputRef}
                  financialProposalOptionInputRef={financialProposalOptionInputRef}
                />
              )}
              {modalBusiness === "Outsourcing" && (
                <OutsourcingFields
                  formData={formData}
                  setFormData={setFormData}
                  uploadedFiles={uploadedFiles}
                  handleFileChange={handleFileChange}
                  handlePreview={handlePreview}
                  handleDownload={handleDownload}
                  openStart={openStart}
                  setOpenStart={setOpenStart}
                  openEnd={openEnd}
                  setOpenEnd={setOpenEnd}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="ml-auto "
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (modalBusiness) {
                  setSavedContracts((prev) => ({ ...prev, [modalBusiness]: true }));
                  setBusinessContracts(modalBusiness, { ...formData });
                }
                setModalOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <ContractPreviewModal
        previewBusinessTab={previewBusinessTab}
        setPreviewBusinessTab={setPreviewBusinessTab}
        formData={formData}
      />
    </div>
  );
}
