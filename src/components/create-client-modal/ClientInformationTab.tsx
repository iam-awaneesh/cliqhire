import { NestedSelect } from "@/components/ui/nested-select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "@/styles/phone-input-override.css";
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
  handleInputChange: (
    field: keyof ClientForm,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleUrlBlur: (field: keyof ClientForm) => (e: React.FocusEvent<HTMLInputElement>) => void;
  handleEmailBlur: () => void;
  locationSuggestions: LocationSuggestion[];
  showLocationSuggestions: boolean;
  handleLocationSelect: (suggestion: LocationSuggestion) => void;
  errors?: {
    name?: string;
    phoneNumber?: string;
    address?: string;
    primaryContacts?: string;
    website?: string;
    linkedInProfile?: string;
    googleMapsLink?: string;
    primaryContactEmails?: string;
  };
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
  errors = {},
}: ClientInformationTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 pb-2">
      <div className="space-y-1">
        <div className="flex items-center mb-1">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Client Stage Info"
                className="mr-2 text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                <Info className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="max-w-xs text-sm">
              <div className="font-semibold mb-2 text-base">Client Stage Definitions</div>
              <div className="mb-2">
                <span className="font-semibold">1. Lead:</span> Potential customer who has shown
                initial interest but has not yet been contacted or qualified. First stage where
                basic information is gathered.
              </div>
              <div className="mb-2">
                <span className="font-semibold">2. Engaged:</span> The lead has responded or
                interacted. There is active communication and interest from both sides.
              </div>
              <div>
                <span className="font-semibold">3. Signed:</span> The deal is finalized. The
                customer has agreed to the terms, and a formal contract or agreement has been
                signed.
              </div>
            </PopoverContent>
          </Popover>
          <Label htmlFor="clientStage">Client Stage</Label>
        </div>
        <NestedSelect
          options={optionsForClient}
          value={formData.clientSubStage || formData.clientStage}
          onValueChange={(value) => {
            const baseStage = value.includes("_") ? value.split("_")[0] : value;
            const detailedStage = value;
            setFormData((prev) => ({
              ...prev,
              clientStage: baseStage as "Lead" | "Engaged" | "Signed",
              clientSubStage: detailedStage,
            }));
          }}
          placeholder="Select client stage"
          className="w-full"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="salesLead">Sales Lead (Internal)</Label>
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

      <div className="space-y-1">
        <Label htmlFor="referredBy">Referred By (External)</Label>
        <Input
          id="referredBy"
          value={formData.referredBy}
          onChange={handleInputChange("referredBy")}
          className="w-full"
          placeholder="Enter the name of the person who referred"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="clientPriority">Client Priority</Label>
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

      <div className="space-y-1">
        <Label htmlFor="clientSegment">Client Segment</Label>
        <Select
          onValueChange={(value) => setFormData((prev) => ({ ...prev, clientSegment: value }))}
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

      <div className="space-y-1">
        <Label htmlFor="clientSource">Client Source</Label>
        <Select
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              clientSource: value as
                | "Cold Call"
                | "Reference"
                | "Events"
                | "Existing Old Client"
                | "Others"
                | undefined,
            }))
          }
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

      <div className="space-y-1">
        <Label htmlFor="industry">Client Industry</Label>
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
    </div>
  );
}
