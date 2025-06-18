// src/components/create-client-modal/client-details-form.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { INDUSTRIES } from "@/lib/constants";
import { ClientForm, LocationSuggestion } from "./types";

interface ClientDetailsFormProps {
  formData: ClientForm;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSuggestionClick: (suggestion: LocationSuggestion) => void;
  locationSuggestions: LocationSuggestion[];
  showLocationSuggestions: boolean;
  emailInput: string;
  setEmailInput: (value: string) => void;
  handleAddEmail: () => void;
  handleRemoveEmail: (index: number) => void;
}

export function ClientDetailsForm({ 
  formData, 
  handleChange, 
  handleSelectChange, 
  handleLocationChange, 
  handleSuggestionClick, 
  locationSuggestions, 
  showLocationSuggestions, 
  emailInput, 
  setEmailInput, 
  handleAddEmail, 
  handleRemoveEmail 
}: ClientDetailsFormProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Client Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="emails">Client Emails</Label>
          <div className="flex items-center gap-2">
            <Input id="emails" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
            <button type="button" onClick={handleAddEmail}>Add</button>
          </div>
          <div className="mt-2">
            {formData.emails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{email}</span>
                <button type="button" onClick={() => handleRemoveEmail(index)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" value={formData.website} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select name="industry" onValueChange={(value) => handleSelectChange("industry", value)} value={formData.industry}>
            <SelectTrigger>
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Industries</SelectLabel>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleLocationChange} />
          {showLocationSuggestions && locationSuggestions.length > 0 && (
            <ul className="border rounded-md mt-1">
              {locationSuggestions.map((suggestion) => (
                <li key={suggestion.display_name} onClick={() => handleSuggestionClick(suggestion)} className="p-2 cursor-pointer hover:bg-gray-200">
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="googleMapsLink">Google Maps Link</Label>
          <Input id="googleMapsLink" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
}
