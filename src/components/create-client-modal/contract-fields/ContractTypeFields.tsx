import React from "react";
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
import { Upload, Eye, Download } from "lucide-react";
import { levelFieldMap } from "../constants";

interface ContractTypeFieldsProps {
  formData: any;
  setFormData: any;
  selectedLevels: string[];
  setSelectedLevels: any;
  activeLevel: string | null;
  setActiveLevel: any;
  uploadedFiles: { [key: string]: File | null };
  handleFileChange: (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePreview: (file: File | string | null) => void;
  handleDownload: (file: File | null) => void;
}

export const ContractTypeFields: React.FC<ContractTypeFieldsProps> = ({
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
}) => {
  const handleLevelChange = (level: string) => {
    setSelectedLevels((prev: string[]) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
    setActiveLevel(level);
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-4 ml-1">
          {/* Contract Start Date */}
          <div className="flex-1 space-y-1">
            <Label htmlFor="contractStartDate">Contract Start Date</Label>
            <Input
              type="date"
              value={formData.contractStartDate ? formData.contractStartDate.substring(0, 10) : ""}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, contractStartDate: e.target.value }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {/* Contract End Date */}
          <div className="flex-1 space-y-1">
            <Label htmlFor="contractEndDate">Contract End Date</Label>
            <Input
              type="date"
              value={formData.contractEndDate ? formData.contractEndDate.substring(0, 10) : ""}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, contractEndDate: e.target.value }))
              }
              className="w-full border rounded px-3 py-2"
            />
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
                setFormData((prev: any) => ({ ...prev, contractType: value }));
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
        </div>
        {/* Contract type-specific block below, in a single row if possible */}
        {formData.contractType === "Fix with Advance" && (
          <div className="w-full">
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
                          setFormData((prev: any) => ({
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
                          setFormData((prev: any) => ({ ...prev, advanceMoneyCurrency: value }))
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
                          setFormData((prev: any) => ({
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
                        setFormData((prev: any) => ({
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
          </div>
        )}
        {formData.contractType === "Fix without Advance" && (
          <div className="w-full">
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
                          setFormData((prev: any) => ({
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
                        setFormData((prev: any) => ({
                          ...prev,
                          fixWithoutAdvanceNotes: e.target.value,
                        }))
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
          </div>
        )}
        {["Level Based (Hiring)", "Level Based With Advance"].includes(
          formData.contractType || "",
        ) && (
          <div className="w-full">
            <div className="space-y-4 col-span-1 sm:col-span-2 border rounded-lg p-4">
              <div className="space-y-1">
                <Label>Select Levels</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                  {["Senior Level", "Executives", "Non-Executives", "Other"].map((level) => (
                    <div key={level} className="flex items-center space-x-1">
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
                <div className="space-y-2">
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
                                  setFormData((prev: any) => ({
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
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      [fieldKeys.currency]: value,
                                    }))
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
                                    setFormData((prev: any) => ({
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
                                setFormData((prev: any) => ({
                                  ...prev,
                                  [fieldKeys.notes]: e.target.value,
                                }))
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
          </div>
        )}
      </div>
    </div>
  );
};
