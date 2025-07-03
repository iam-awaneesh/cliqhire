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
import { Button } from "@/components/ui/button";
import { Upload, Eye, Download, CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface OutsourcingFieldsProps {
  formData: any;
  setFormData: any;
  uploadedFiles: { [key: string]: File | null };
  handleFileChange: (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePreview: (file: File | string | null) => void;
  handleDownload: (file: File | null) => void;
  openStart: boolean;
  setOpenStart: (open: boolean) => void;
  openEnd: boolean;
  setOpenEnd: (open: boolean) => void;
}

export const OutsourcingFields: React.FC<OutsourcingFieldsProps> = ({
  formData,
  setFormData,
  uploadedFiles,
  handleFileChange,
  handlePreview,
  handleDownload,
  openStart,
  setOpenStart,
  openEnd,
  setOpenEnd,
}) => {
  return (
    <div className="flex flex-col gap-1 mt-3">
      <div className="flex flex-row gap-2">
        <div className="flex-1 space-y-1 ml-2">
          <Label htmlFor="outsourcingContractStartDate">Contract Start Date</Label>
          <div className="grid gap-2">
            <Popover open={openStart} onOpenChange={setOpenStart} modal>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.outsourcingContractStartDate
                    ? formData.outsourcingContractStartDate
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={formData.outsourcingContractStartDate}
                  onSelect={(date) => {
                    setFormData((prev: any) => ({
                      ...prev,
                      outsourcingContractStartDate: date || null,
                    }));
                    setOpenStart(false);
                  }}
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor="outsourcingContractEndDate">Contract End Date</Label>
          <div className="grid gap-2">
            <Popover open={openEnd} onOpenChange={setOpenEnd} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.outsourcingContractEndDate
                    ? formData.outsourcingContractEndDate
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.outsourcingContractEndDate}
                  onSelect={(date) => {
                    setFormData((prev: any) => ({
                      ...prev,
                      outsourcingContractEndDate: date || null,
                    }));
                    setOpenEnd(false);
                  }}
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor="outsourcingContractType">Contract Type</Label>
          <Select
            value={formData.outsourcingContractType || ""}
            onValueChange={(value) =>
              setFormData((prev: any) => ({ ...prev, outsourcingContractType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fixed Cost">Fixed Cost</SelectItem>
              <SelectItem value="Cost Plus">Cost Plus</SelectItem>
              <SelectItem value="Time & Materials">Time & Materials</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="flex-1 ml-2">
          <Label>Service Category</Label>
          <Input
            value={formData.outsourcingServiceCategory || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                outsourcingServiceCategory: e.target.value,
              }))
            }
            placeholder="Service Category"
          />
        </div>
        <div className="flex-1">
          <Label>Number of Resources</Label>
          <Input
            type="number"
            value={formData.outsourcingNumResources || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                outsourcingNumResources: e.target.value,
              }))
            }
            placeholder="Number of Resources"
          />
        </div>
        <div className="flex-1 ml-2">
          <Label>Duration Per Resource</Label>
          <Input
            value={formData.outsourcingDurationPerResource || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                outsourcingDurationPerResource: e.target.value,
              }))
            }
            placeholder="Duration Per Resource"
          />
        </div>
        <div className="flex-1">
          <Label>SLA Terms</Label>
          <Input
            value={formData.outsourcingSlaTerms || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                outsourcingSlaTerms: e.target.value,
              }))
            }
            placeholder="SLA Terms"
          />
        </div>
        <div className="flex-1 ml-2">
          <Label>Total Cost</Label>
          <Input
            type="number"
            value={formData.outsourcingTotalCost || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                outsourcingTotalCost: e.target.value,
              }))
            }
            placeholder="Total Cost"
          />
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <Label className="text-sm sm:text-base font-semibold">Contract Document</Label>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center">
          <div
            className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1 w-full"
            onClick={() => document.getElementById("outsourcingContractDocumentInput")?.click()}
          >
            <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
          </div>
          <input
            id="outsourcingContractDocumentInput"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange("outsourcingContractDocument")}
          />
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs px-2 gap-1"
              onClick={() => handlePreview(uploadedFiles.outsourcingContractDocument)}
              disabled={!uploadedFiles.outsourcingContractDocument}
            >
              <Eye className="h-3 w-3" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => handleDownload(uploadedFiles.outsourcingContractDocument)}
              disabled={!uploadedFiles.outsourcingContractDocument}
            >
              <Download className="h-3 w-3" />
              Download
            </Button>
          </div>
          {uploadedFiles.outsourcingContractDocument && (
            <span className="text-xs text-muted-foreground truncate">
              Selected file: {uploadedFiles.outsourcingContractDocument.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
