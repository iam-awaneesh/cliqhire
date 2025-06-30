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
import { useState } from "react";

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
}: ContractInformationTabProps) {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="contractStartDate">Contract Start Date</Label>
        <div className="grid gap-2">
          <Popover open={openStart} onOpenChange={setOpenStart} modal>
            <PopoverTrigger asChild>
              <Button id="date-picker" variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.contractStartDate ? format(formData.contractStartDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar 
                mode="single" 
                captionLayout="dropdown" 
                selected={formData.contractStartDate!} 
                onSelect={(date) => handleSelectDate(date, "start")}
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contractEndDate" className="text-sm sm:text-base">
          Contract End Date
        </Label>
        <div className="grid gap-2">
          <Popover open={openEnd} onOpenChange={setOpenEnd} modal={true}>
            <PopoverTrigger asChild>
              <Button id="date-picker" variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.contractEndDate ? format(formData.contractEndDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar 
                mode="single" 
                selected={formData.contractEndDate!} 
                onSelect={(date) => handleSelectDate(date, "end")}
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contractType" className="text-sm sm:text-base">
          Contract Type
        </Label>
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
                className="h-7 text-xs px-2 gap-1"
                onClick={() => handleDownload(uploadedFiles.fixedPercentageAdvance)}
                disabled={!uploadedFiles.fixedPercentageAdvance}
              >
                <Download className="h-3 w-3" />
                Download
              </Button>
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
            {uploadedFiles.fixWithoutAdvance && (
              <p className="text-xs text-muted-foreground truncate">
                Selected file: {uploadedFiles.fixWithoutAdvance.name}
              </p>
            )}
          </div>
        </div>
      )}

      {(formData.contractType === "Level Based (Hiring)" ||
        formData.contractType === "Level Based With Advance") && (
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
}
