import { NestedSelect } from "@/components/ui/nested-select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
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
import { Info } from "lucide-react";
import { ClientForm, LocationSuggestion } from "@/components/create-client-modal/type";
import { optionsForClient, countryCodes } from "./constants";
import { INDUSTRIES } from "@/lib/constants";

interface ClientInformationTabProps {
  formData: ClientForm;
  setFormData: React.Dispatch<React.SetStateAction<ClientForm>>;
  emailInput: string;
  handleInputChange: (field: keyof ClientForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleUrlBlur: (field: keyof ClientForm) => (e: React.FocusEvent<HTMLInputElement>) => void;
  handleEmailBlur: () => void;
  locationSuggestions: LocationSuggestion[];
  showLocationSuggestions: boolean;
  handleLocationSelect: (suggestion: LocationSuggestion) => void;
}

export function ClientInformationTab({
  formData,
  setFormData,
  emailInput,
  handleInputChange,
  handleUrlBlur,
  handleEmailBlur,
  locationSuggestions,
  showLocationSuggestions,
  handleLocationSelect,
}: ClientInformationTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
      <div className="space-y-2">
        <div className="flex items-center mb-1">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" aria-label="Client Stage Info" className="mr-2 text-blue-500 hover:text-blue-700 focus:outline-none">
                <Info className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="max-w-xs text-sm">
              <div className="font-semibold mb-2 text-base">Client Stage Definitions</div>
              <div className="mb-2">
                <span className="font-semibold">1. Lead:</span> Potential customer who has shown initial interest but has not yet been contacted or qualified. First stage where basic information is gathered.
              </div>
              <div className="mb-2">
                <span className="font-semibold">2. Engaged:</span> The lead has responded or interacted. There is active communication and interest from both sides.
              </div>
              <div>
                <span className="font-semibold">3. Signed:</span> The deal is finalized. The customer has agreed to the terms, and a formal contract or agreement has been signed.
              </div>
            </PopoverContent>
          </Popover>
          <Label htmlFor="clientStage" className="text-sm sm:text-base mb-0">
            Client Stage *
          </Label>
        </div>
        <NestedSelect
          options={optionsForClient}
          value={formData.clientSubStage || formData.clientStage}
          onValueChange={(value) => {
            const baseStage = value.includes('_') ? value.split('_')[0] : value;
            const detailedStage = value;
            setFormData((prev) => ({
              ...prev,
              clientStage: baseStage as "Lead" | "Engaged" | "Signed",
              clientSubStage: detailedStage
            }));
          }}
          placeholder="Select client stage"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="salesLead" className="text-sm sm:text-base">
          Sales Lead (Internal)*
        </Label>
        <Select
          value={formData.salesLead || ""}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, salesLead: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sales lead" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="emmanuel">Emmanuel</SelectItem>
            <SelectItem value="rocky">Rocky</SelectItem>
            <SelectItem value="hamed">Hamed</SelectItem>
            <SelectItem value="abhay">Abhay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="referredBy" className="text-sm sm:text-base">
          Referred By (External) *
        </Label>
        <Input
          id="referredBy"
          value={formData.referredBy}
          onChange={handleInputChange("referredBy")}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientPriority" className="text-sm sm:text-base">Client Priority</Label>
        <Select
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, clientPriority: parseInt(value, 10) }))
          }
          value={formData.clientPriority?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Priority</SelectLabel>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientSegment" className="text-sm sm:text-base">Client Segment</Label>
        <Select
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, clientSegment: value }))
          }
          value={formData.clientSegment}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Segment</SelectLabel>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm sm:text-base">
          Client Name *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleInputChange("name")}
          required
          className="w-full"
          placeholder="Enter client name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientSource" className="text-sm sm:text-base">
          Client Source *
        </Label>
        <Select
          onValueChange={(value) => setFormData((prev) => ({ ...prev, clientSource: value as "Cold Call" | "Reference" | "Events" | "Existing Old Client" | "Others" | undefined }))}
          value={formData.clientSource}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Client Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Client Source</SelectLabel>
              <SelectItem value="Cold Call">Cold Call</SelectItem>
              <SelectItem value="Reference">Reference</SelectItem>
              <SelectItem value="Events">Events</SelectItem>
              <SelectItem value="Existing Old Client">Existing Old Client</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emails" className="text-sm sm:text-base">
          Client Email(s)
        </Label>
        <Input
          id="emails"
          type="text"
          value={emailInput}
          onChange={handleInputChange("emails")}
          onBlur={handleEmailBlur}
          placeholder="email1@example.com,email2@example.com"
          autoComplete="off"
          className="w-full"
        />
        <p className="text-xs sm:text-sm text-muted-foreground">
          Enter multiple emails separated by commas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm sm:text-base">
          Client LandLine Number *
        </Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className="border rounded px-2 py-1 w-full sm:w-32"
            value={formData.countryCode}
            onChange={handleInputChange("countryCode")}
          >
            {countryCodes.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange("phoneNumber")}
            placeholder="50 123 4567"
            required
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm sm:text-base">
          Client Address *
        </Label>
        <Input
          id="address"
          value={formData.address}
          onChange={handleInputChange("address")}
          placeholder="Enter detailed address"
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website" className="text-sm sm:text-base">
          Client Website
        </Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={handleInputChange("website")}
          onBlur={handleUrlBlur("website")}
          placeholder="https://www.example.com"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedInProfile" className="text-sm sm:text-base">
          Client LinkedIn Profile
        </Label>
        <Input
          id="linkedInProfile"
          value={formData.linkedInProfile}
          onChange={handleInputChange("linkedInProfile")}
          onBlur={handleUrlBlur("linkedInProfile")}
          placeholder="https://www.linkedin.com/in/..."
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry" className="text-sm sm:text-base">
          Client Industry *
        </Label>
        <Select
          value={formData.industry}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {Object.entries(INDUSTRIES).map(([category, industries]) => (
              <SelectGroup key={category}>
                <SelectLabel className="font-semibold">{category}</SelectLabel>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="googleMapsLink" className="text-sm sm:text-base">
          Google Maps Link
        </Label>
        <Input
          id="googleMapsLink"
          value={formData.googleMapsLink}
          onChange={handleInputChange("googleMapsLink")}
          onBlur={handleUrlBlur("googleMapsLink")}
          placeholder="https://maps.google.com/..."
          className="w-full"
        />
        {showLocationSuggestions && locationSuggestions.length > 0 && (
          <div className="border rounded-md max-h-40 overflow-y-auto">
            {locationSuggestions.map((suggestion) => (
              <div
                key={suggestion.display_name}
                className="p-2 hover:bg-muted cursor-pointer"
                onClick={() => handleLocationSelect(suggestion)}
              >
                {suggestion.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="countryOfBusiness" className="text-sm sm:text-base">
          Country of Business
        </Label>
        <Input
          id="countryOfBusiness"
          value={formData.countryOfBusiness}
          onChange={handleInputChange("countryOfBusiness")}
          placeholder="Enter country of business"
          className="w-full"
        />
      </div>
    </div>
  );
}