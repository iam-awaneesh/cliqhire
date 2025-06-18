// src/components/create-client-modal/contract-details-form.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClientForm } from "./types";

interface ContractDetailsFormProps {
  formData: ClientForm;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (name: string, date: Date | null) => void;
}

export function ContractDetailsForm({ formData, handleChange, handleDateChange }: ContractDetailsFormProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contractNumber">Contract Number</Label>
          <Input id="contractNumber" name="contractNumber" value={formData.contractNumber} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="contractValue">Contract Value</Label>
          <Input id="contractValue" name="contractValue" type="number" value={formData.contractValue} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="contractStartDate">Contract Start Date</Label>
          <DatePicker
            selected={formData.contractStartDate}
            onChange={(date) => handleDateChange("contractStartDate", date)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <Label htmlFor="contractEndDate">Contract End Date</Label>
          <DatePicker
            selected={formData.contractEndDate}
            onChange={(date) => handleDateChange("contractEndDate", date)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
