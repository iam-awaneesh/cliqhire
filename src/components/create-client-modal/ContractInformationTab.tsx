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
import { useState, Fragment } from "react";

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
}: ContractInformationTabProps) {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [activeBusinessTab, setActiveBusinessTab] = useState<string | null>(null);
  const [previewBusinessTab, setPreviewBusinessTab] = useState<string | null>(null);

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

  const renderStandardContractFields = () => (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      {/* Contract Start Date */}
      <div className="flex-1 space-y-2">
        <Label htmlFor="contractStartDate">Contract Start Date</Label>
        <div className="grid gap-2">
          <Popover open={openStart} onOpenChange={setOpenStart} modal>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.contractStartDate
                  ? format(formData.contractStartDate, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={formData.contractStartDate!}
                onSelect={(date) => {
                  setFormData((prev) => ({ ...prev, contractStartDate: date || null }));
                  setOpenStart(false);
                }}
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Contract End Date */}
      <div className="flex-1 space-y-1">
        <Label htmlFor="contractEndDate">Contract End Date</Label>
        <div className="grid gap-2">
          <Popover open={openEnd} onOpenChange={setOpenEnd} modal={true}>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.contractEndDate
                  ? format(formData.contractEndDate, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.contractEndDate!}
                onSelect={(date) => {
                  setFormData((prev) => ({ ...prev, contractEndDate: date || null }));
                  setOpenEnd(false);
                }}
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Contract Type */}
      <div className="flex-1 space-y-1">
        <Label htmlFor="contractType">Contract Type</Label>
        <Select
          value={formData.contractType}
          onValueChange={(value) => {
            const isOldLevelBased =
              formData.contractType === "Level Based (Hiring)" ||
              formData.contractType === "Level Based With Advance";
            const isNewLevelBased =
              value === "Level Based (Hiring)" || value === "Level Based With Advance";
            setFormData((prev) => ({ ...prev, contractType: value }));
            if (isOldLevelBased !== isNewLevelBased) {
              setSelectedLevels([]);
              setActiveLevel(null);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select contract type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fix with Advance">Fix with Advance</SelectItem>
            <SelectItem value="Fix without Advance">Fix without Advance</SelectItem>
            <SelectItem value="Level Based (Hiring)">Level Based (Hiring)</SelectItem>
            <SelectItem value="Level Based With Advance">Level Based With Advance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.contractType === "Fix with Advance" && (
        <div className="space-y-4 col-span-1 sm:col-span-2 border rounded-lg p-4">
          <div className="border-2 shadow-sm rounded-lg p-2 cursor-pointer transition-colors w-full border-primary bg-primary/5">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <h4 className="font-medium text-xs sm:text-sm w-28">Fix with Advance</h4>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative w-24">
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      setFormData((prev) => ({
                        ...prev,
                        fixedPercentage: isNaN(value) ? 0 : Math.min(100, Math.max(0, value)),
                      }));
                    }}
                    value={formData.fixedPercentage || ""}
                    className="h-8 pl-2 pr-6 text-xs"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    %
                  </span>
                </div>
                <div className="flex items-center space-x-0 border rounded-md overflow-hidden w-48">
                  <Select
                    value={formData.advanceMoneyCurrency || "SAR"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, advanceMoneyCurrency: value }))
                    }
                  >
                    <SelectTrigger className="h-8 text-xs w-20 rounded-r-none border-r-0">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="SAR">SAR</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Amount"
                    min="0"
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      setFormData((prev) => ({
                        ...prev,
                        advanceMoneyAmount: isNaN(value) ? 0 : value,
                      }));
                    }}
                    value={formData.advanceMoneyAmount || ""}
                    className="h-8 text-xs w-28 rounded-l-none border-l-0"
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Notes"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fixedPercentageAdvanceNotes: e.target.value,
                    }))
                  }
                  value={formData.fixedPercentageAdvanceNotes || ""}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold">Contract Document</Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center">
              <div
                className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1 w-full"
                onClick={() => document.getElementById("fixedPercentageAdvanceInput")?.click()}
              >
                <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
              </div>
              <input
                id="fixedPercentageAdvanceInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange("fixedPercentageAdvance")}
              />
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2 gap-1"
                  onClick={() => handlePreview(uploadedFiles.fixedPercentageAdvance)}
                  disabled={!uploadedFiles.fixedPercentageAdvance}
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs  gap-0.5"
                  onClick={() => handleDownload(uploadedFiles.fixedPercentageAdvance)}
                  disabled={!uploadedFiles.fixedPercentageAdvance}
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
            {uploadedFiles.fixedPercentageAdvance && (
              <p className="text-xs text-muted-foreground truncate">
                Selected file: {uploadedFiles.fixedPercentageAdvance.name}
              </p>
            )}
          </div>
        </div>
      )}
      {formData.contractType === "Fix without Advance" && (
        <div className="space-y-4 col-span-1 sm:col-span-2 border rounded-lg p-4">
          <div className="border-2 shadow-sm rounded-lg p-2 cursor-pointer transition-colors w-full border-primary bg-primary/5">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <h4 className="font-medium text-xs sm:text-sm w-28">Fix without Advance</h4>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative w-24">
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      setFormData((prev) => ({
                        ...prev,
                        fixWithoutAdvanceValue: isNaN(value)
                          ? 0
                          : Math.min(100, Math.max(0, value)),
                      }));
                    }}
                    value={formData.fixWithoutAdvanceValue || ""}
                    className="h-8 pl-2 pr-6 text-xs"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    %
                  </span>
                </div>
                <Input
                  type="text"
                  placeholder="Notes"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fixWithoutAdvanceNotes: e.target.value }))
                  }
                  value={formData.fixWithoutAdvanceNotes || ""}
                  className="h-8 text-xs flex-1"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold">Contract Document</Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center">
              <div
                className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1 w-full"
                onClick={() => document.getElementById("fixWithoutAdvanceInput")?.click()}
              >
                <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
              </div>
              <input
                id="fixWithoutAdvanceInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange("fixWithoutAdvance")}
              />
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2 gap-1"
                  onClick={() => handlePreview(uploadedFiles.fixWithoutAdvance)}
                  disabled={!uploadedFiles.fixWithoutAdvance}
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2 gap-1"
                  onClick={() => handleDownload(uploadedFiles.fixWithoutAdvance)}
                  disabled={!uploadedFiles.fixWithoutAdvance}
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
            {uploadedFiles.fixWithoutAdvance && (
              <p className="text-xs text-muted-foreground truncate">
                Selected file: {uploadedFiles.fixWithoutAdvance.name}
              </p>
            )}
          </div>
        </div>
      )}
      {["Level Based (Hiring)", "Level Based With Advance"].includes(formData.contractType || "") && (
        <div className="space-y-4 col-span-1 sm:col-span-2 border rounded-lg p-4">
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold">Select Levels</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["Senior Level", "Executives", "Non-Executives", "Other"].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level}`}
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={() => handleLevelChange(level)}
                  />
                  <label
                    htmlFor={`level-${level}`}
                    className="text-xs sm:text-sm font-medium leading-none cursor-pointer"
                  >
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {selectedLevels.length > 0 && (
            <div className="space-y-4">
              {selectedLevels.map((level) => {
                const fieldKeys = levelFieldMap[level];
                return (
                  <div
                    key={level}
                    className={`border-2 shadow-sm rounded-lg p-2 cursor-pointer transition-colors w-full ${
                      activeLevel === level ? "border-primary bg-primary/5" : "border-muted"
                    }`}
                    onClick={() => setActiveLevel(level)}
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
                      <h4 className="font-medium text-xs sm:text-sm w-28">{level}</h4>
                      <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <div className="relative w-24">
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            onChange={(e) => {
                              const value = e.target.value ? parseFloat(e.target.value) : 0;
                              setFormData((prev) => ({
                                ...prev,
                                [fieldKeys.percentage]: isNaN(value)
                                  ? 0
                                  : Math.min(100, Math.max(0, value)),
                              }));
                            }}
                            value={formData[fieldKeys.percentage] || ""}
                            className="h-8 pl-2 pr-6 text-xs"
                          />
                          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                            %
                          </span>
                        </div>
                        {formData.contractType === "Level Based With Advance" && (
                          <div className="flex items-center space-x-0 border rounded-md overflow-hidden w-48">
                            <Select
                              value={formData[fieldKeys.currency] || "SAR"}
                              onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, [fieldKeys.currency]: value }))
                              }
                            >
                              <SelectTrigger className="h-8 text-xs w-20 rounded-r-none border-r-0">
                                <SelectValue placeholder="Currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                                <SelectItem value="SAR">SAR</SelectItem>
                                <SelectItem value="AED">AED</SelectItem>
                                <SelectItem value="INR">INR</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              placeholder="Amount"
                              min="0"
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : 0;
                                setFormData((prev) => ({
                                  ...prev,
                                  [fieldKeys.money]: isNaN(value) ? 0 : value,
                                }));
                              }}
                              value={formData[fieldKeys.money] || ""}
                              className="h-8 text-xs w-28 rounded-l-none border-l-0"
                            />
                          </div>
                        )}
                        <Input
                          type="text"
                          placeholder="Notes"
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, [fieldKeys.notes]: e.target.value }))
                          }
                          value={formData[fieldKeys.notes] || ""}
                          className="h-8 text-xs flex-1"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-semibold">Contract Documents</Label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center mb-2">
                  <div
                    className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1 w-full"
                    onClick={() =>
                      document.getElementById("fileInput-levelBasedContractDocument")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
                  </div>
                  <input
                    id="fileInput-levelBasedContractDocument"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange("levelBasedContractDocument")}
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2 gap-1"
                      onClick={() => handlePreview(uploadedFiles.levelBasedContractDocument)}
                      disabled={!uploadedFiles.levelBasedContractDocument}
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2 gap-1"
                      onClick={() => handleDownload(uploadedFiles.levelBasedContractDocument)}
                      disabled={!uploadedFiles.levelBasedContractDocument}
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                  {uploadedFiles.levelBasedContractDocument && (
                    <p className="text-xs text-muted-foreground truncate w-full sm:w-auto">
                      Selected file: {uploadedFiles.levelBasedContractDocument.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderConsultingFields = () => (
    <div className="flex flex-col gap-4 mt-4">
      {/* Contract Start Date */}
      <div className="flex-1 space-y-2">
        <Label htmlFor="contractStartDate">Contract Start Date</Label>
        <div className="grid gap-2">
          <Popover open={openStart} onOpenChange={setOpenStart} modal>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.contractStartDate
                  ? format(formData.contractStartDate, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={formData.contractStartDate!}
                onSelect={(date) => {
                  setFormData((prev) => ({ ...prev, contractStartDate: date || null }));
                  setOpenStart(false);
                }}
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Contract End Date */}
      <div className="flex-1 space-y-1">
        <Label htmlFor="contractEndDate">Contract End Date</Label>
        <div className="grid gap-2">
          <Popover open={openEnd} onOpenChange={setOpenEnd} modal={true}>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.contractEndDate
                  ? format(formData.contractEndDate, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.contractEndDate!}
                onSelect={(date) => {
                  setFormData((prev) => ({ ...prev, contractEndDate: date || null }));
                  setOpenEnd(false);
                }}
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Technical Proposal */}
      <div className="flex-1 space-y-2">
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
      {/* Financial Proposal */}
      <div className="flex-1 space-y-2">
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
  );

  const renderPreview = (business: string) => {
    if (["HR Consulting", "Mgt Consulting"].includes(business)) {
      return (
        <div className="border rounded-md p-4 bg-muted/30 mt-4">
          <h4 className="font-semibold mb-2">{business} Contract Preview</h4>
          <div className="text-sm">
            <div><b>Contract Start Date:</b> {formData.contractStartDate ? format(formData.contractStartDate, "PPP") : "-"}</div>
            <div><b>Contract End Date:</b> {formData.contractEndDate ? format(formData.contractEndDate, "PPP") : "-"}</div>
            <div><b>Technical Proposal:</b> {formData.technicalProposalNotes || "-"}</div>
            <div><b>Financial Proposal:</b> {formData.financialProposalNotes || "-"}</div>
          </div>
        </div>
      );
    }
    return (
      <div className="border rounded-md p-4 bg-muted/30 mt-4">
        <h4 className="font-semibold mb-2">{business} Contract Preview</h4>
        <div className="text-sm">
          <div><b>Contract Start Date:</b> {formData.contractStartDate ? format(formData.contractStartDate, "PPP") : "-"}</div>
          <div><b>Contract End Date:</b> {formData.contractEndDate ? format(formData.contractEndDate, "PPP") : "-"}</div>
          <div><b>Contract Type:</b> {formData.contractType || "-"}</div>
        </div>
      </div>
    );
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
          Line of Business *
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

      {formData.lineOfBusiness && Array.isArray(formData.lineOfBusiness) && formData.lineOfBusiness.length > 0 && (
        <div className="w-full rounded-xl border p-2 bg-[#f5f6f7] ">
          <div className="mt-1 w-full">
            <div className="w-full">
              {formData.lineOfBusiness.map((business: string) => (
                <div key={business} className="rounded-xl border bg-white py-4 px-6 mb-4 flex items-center justify-between w-full">
                  <span className="font-medium text-xs sm:text-sm">{business} contract form</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="w-24"
                      variant={activeBusinessTab === business && !previewBusinessTab ? "default" : "outline"}
                      onClick={() => {
                        setActiveBusinessTab(business);
                        setPreviewBusinessTab(null);
                      }}
                    >
                      Open
                    </Button>
                    <Button
                      size="sm"
                      className="w-24"
                      variant={previewBusinessTab === business ? "default" : "outline"}
                      onClick={() => {
                        setActiveBusinessTab(business);
                        setPreviewBusinessTab(business);
                      }}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {activeBusinessTab && !previewBusinessTab && (
              <div>
                {["Recruitment", "HR Managed Services", "Outsourcing", "IT & Technology"].includes(activeBusinessTab) && renderStandardContractFields()}
                {["HR Consulting", "Mgt Consulting"].includes(activeBusinessTab) && renderConsultingFields()}
              </div>
            )}
            {previewBusinessTab && renderPreview(previewBusinessTab)}
          </div>
        </div>
      )}
    </div>
  );
}
