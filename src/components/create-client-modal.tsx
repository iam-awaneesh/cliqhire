"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Plus } from "lucide-react";
import { createClient } from "@/services/clientService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import * as Flags from "country-flag-icons/react/3x2";
import { INDUSTRIES } from "@/lib/constants";

// Interfaces from clientService
interface PrimaryContact {
  name: string;
  email: string;
  phone: string;
  countryCode?: string;
  position?: string;
  linkedin?: string;
}

interface ClientForm {
  name: string;
  emails: string[];
  phoneNumber: string;
  website?: string;
  industry?: string;
  location?: string;
  address?: string;
  googleMapsLink?: string;
  incorporationDate?: string;
  countryOfRegistration?: string;
  registrationNumber?: string;
  lineOfBusiness?: string[];
  countryOfBusiness?: string;
  referredBy?: string;
  linkedInProfile?: string;
  linkedInPage?: string;
  countryCode?: string;
  primaryContacts: PrimaryContact[];
  clientStage?: "Lead" | "Engaged" | "Negotiation" | "Signed" | "Prospect";
  clientTeam?: "Enterprise" | "SMB" | "Mid-Market";
  clientRm?: string;
  clientAge?: number;
  contractNumber?: string; // Added for Contract Information
  contractStartDate?: string; // Added for Contract Information
  contractEndDate?: string; // Added for Contract Information
  contractValue?: number; // Added for Contract Information
}

interface CreateClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface CountrySuggestion {
  name: {
    common: string;
  };
}

export function CreateClientModal({ open, onOpenChange }: CreateClientModalProps) {
  const [formData, setFormData] = useState<ClientForm>({
    name: "",
    emails: [],
    phoneNumber: "",
    website: "",
    industry: "",
    location: "",
    address: "",
    googleMapsLink: "",
    incorporationDate: "",
    countryOfRegistration: "",
    registrationNumber: "",
    lineOfBusiness: [],
    countryOfBusiness: "",
    referredBy: "",
    linkedInProfile: "",
    linkedInPage: "",
    countryCode: "+966",
    primaryContacts: [],
    contractNumber: "", // Added
    contractStartDate: "", // Added
    contractEndDate: "", // Added
    contractValue: 0, // Added
  });

  const [emailInput, setEmailInput] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState<CountrySuggestion[]>([]);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState<PrimaryContact>({
    name: "",
    email: "",
    phone: "",
    countryCode: "+966",
    position: "",
    linkedin: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({
    profileImage: null,
    crCopy: null,
    vatCopy: null,
    gstTinDocument: null,
  });

  // Location suggestions
  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (!formData.location || formData.location.length < 3) {
        setLocationSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            formData.location
          )}`
        );
        setLocationSuggestions(response.data);
        setShowLocationSuggestions(true);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    };

    const debounceTimer = setTimeout(fetchLocationSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [formData.location]);

  // Country suggestions
  useEffect(() => {
    const fetchCountrySuggestions = async () => {
      if (!formData.countryOfRegistration || formData.countryOfRegistration.length < 2) {
        setCountrySuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(
            formData.countryOfRegistration
          )}`
        );
        setCountrySuggestions(response.data);
        setShowCountrySuggestions(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setCountrySuggestions([]);
        } else {
          console.error("Error fetching country suggestions:", error);
        }
      }
    };

    const debounceTimer = setTimeout(fetchCountrySuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [formData.countryOfRegistration]);

  const handleLocationSelect = async (suggestion: LocationSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      location: suggestion.display_name,
      googleMapsLink: `https://www.google.com/maps?q=${suggestion.lat},${suggestion.lon}`,
    }));
    setShowLocationSuggestions(false);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${suggestion.lat}&lon=${suggestion.lon}`
      );
      const addressData = response.data.address;

      setFormData((prev) => ({
        ...prev,
        countryOfBusiness: addressData.country || prev.countryOfBusiness,
        address: addressData.road || prev.address || suggestion.display_name,
      }));
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  const handleCountrySelect = (countryName: string) => {
    setFormData((prev) => ({
      ...prev,
      countryOfRegistration: countryName,
    }));
    setShowCountrySuggestions(false);
  };

  // Email validation
  const validateEmails = (emails: string[]): string[] => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.filter((email) => email && !emailRegex.test(email));
  };

  const handleInputChange = (field: keyof ClientForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value: string | string[] | number = e.target.value;

    if (field === "emails") {
      setEmailInput(e.target.value);
      const emails = e.target.value
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);
      value = emails;
    } else if (field === "website" && value && !value.match(/^https?:\/\//)) {
      value = `https://${value}`;
    } else if (field === "contractValue") {
      value = e.target.value ? parseFloat(e.target.value) : 0;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "location") {
      setShowLocationSuggestions(true);
    }

    if (field === "countryOfRegistration") {
      setShowCountrySuggestions(true);
    }

    if (field !== "emails") {
      setError(null);
    }
  };

  const handleEmailBlur = () => {
    const emails = emailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);

    const invalidEmails = validateEmails(emails);
    if (invalidEmails.length > 0) {
      setError(`Invalid email(s): ${invalidEmails.join(", ")}`);
    } else {
      setFormData((prev) => ({
        ...prev,
        emails,
      }));
      setError(null);
    }
  };

  const handleFileChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type for ${file.name}. Allowed types are: JPEG, PNG, PDF`);
        return;
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [field]: file,
      }));
      setError(null);
    }
  };

  const handleAddContact = (contact: PrimaryContact) => {
    if (!contact.name) {
      setError("Contact name is required");
      return;
    }
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setError(`Invalid contact email: ${contact.email}`);
      return;
    }
    if (!contact.phone) {
      setError("Contact phone number is required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      primaryContacts: [...prev.primaryContacts, { ...contact }],
    }));
    setNewContact({ name: "", email: "", phone: "", countryCode: "+966", position: "", linkedin: "" });
    setIsContactModalOpen(false);
    setError(null);
  };

  const countryCodes = [
    { code: "+966", label: "+966 (Saudi Arabia)" },
    { code: "+1", label: "+1 (USA)" },
    { code: "+91", label: "+91 (India)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+86", label: "+86 (China)" },
    { code: "+81", label: "+81 (Japan)" },
  ];

  const positionOptions = [
    { value: "HR", label: "HR" },
    { value: "Senior HR", label: "Senior HR" },
    { value: "Manager", label: "Manager" },
    { value: "Director", label: "Director" },
    { value: "Executive", label: "Executive" },
  ];

  const getCountryCodeLabel = (code: string) => {
    const country = countryCodes.find((option) => option.code === code);
    return country ? country.label : code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name) {
        setError("Client Name is required");
        setLoading(false);
        return;
      }
      if (!formData.phoneNumber) {
        setError("Phone Number is required");
        setLoading(false);
        return;
      }
      if (!formData.address) {
        setError("Client Address is required");
        setLoading(false);
        return;
      }
      if (!formData.referredBy) {
        setError("Referred By is required");
        setLoading(false);
        return;
      }
      if (!formData.industry) {
        setError("Client Industry is required");
        setLoading(false);
        return;
      }
      if (!formData.lineOfBusiness || formData.lineOfBusiness.length === 0) {
        setError("Line of Business is required");
        setLoading(false);
        return;
      }
      if (!formData.countryOfRegistration) {
        setError("Country of Registration is required");
        setLoading(false);
        return;
      }

      // Validate emails
      const emails = formData.emails.filter((email) => email);
      const invalidEmails = validateEmails(emails);
      if (invalidEmails.length > 0) {
        setError(`Invalid email(s): ${invalidEmails.join(", ")}`);
        setLoading(false);
        return;
      }

      // Validate primary contacts
      if (formData.primaryContacts.length === 0) {
        setError("At least one primary contact is required");
        setLoading(false);
        return;
      }
      const invalidContactEmails = formData.primaryContacts.filter(
        (contact) => contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
      );
      if (invalidContactEmails.length > 0) {
        setError(`Invalid contact email(s): ${invalidContactEmails.map((c) => c.email).join(", ")}`);
        setLoading(false);
        return;
      }

      // Prepare payload for createClient
      const clientPayload = {
        ...formData,
        incorporationDate: formData.incorporationDate || undefined,
        emails: formData.emails.length > 0 ? formData.emails : undefined,
        lineOfBusiness: formData.lineOfBusiness.length > 0 ? formData.lineOfBusiness : undefined,
        primaryContacts: formData.primaryContacts,
        profileImage: uploadedFiles.profileImage || undefined,
        crCopy: uploadedFiles.crCopy || undefined,
        vatCopy: uploadedFiles.vatCopy || undefined,
        gstTinDocument: uploadedFiles.gstTinDocument || undefined,
        clientStage: formData.clientStage || "Lead",
        clientTeam: formData.clientTeam || "Enterprise",
        clientRm: formData.clientRm || "",
        clientAge: formData.clientAge || 0,
        contractNumber: formData.contractNumber || undefined, // Added
        contractStartDate: formData.contractStartDate || undefined, // Added
        contractEndDate: formData.contractEndDate || undefined, // Added
        contractValue: formData.contractValue || undefined, // Added
      };

      console.log("Submitting payload:", clientPayload); // Debug log

      const result = await createClient(clientPayload);
      console.log("Client created successfully:", result);

      // Reset form
      setFormData({
        name: "",
        emails: [],
        phoneNumber: "",
        website: "",
        industry: "",
        location: "",
        address: "",
        googleMapsLink: "",
        incorporationDate: "",
        countryOfRegistration: "",
        registrationNumber: "",
        lineOfBusiness: [],
        countryOfBusiness: "",
        referredBy: "",
        linkedInProfile: "",
        linkedInPage: "",
        countryCode: "+966",
        primaryContacts: [],
        contractNumber: "", // Added
        contractStartDate: "", // Added
        contractEndDate: "", // Added
        contractValue: 0, // Added
      });
      setEmailInput("");
      setSelectedYear(null);
      setUploadedFiles({
        profileImage: null,
        crCopy: null,
        vatCopy: null,
        gstTinDocument: null,
      });
      setNewContact({ name: "", email: "", phone: "", countryCode: "+966", position: "", linkedin: "" });
      setCurrentTab(0);
      setIsContactModalOpen(false);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create client:", error);
      const errorMessage = error.message.includes("Client validation failed")
        ? "Invalid data provided. Please check all fields and try again."
        : error.message || "Failed to create client. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentTab((prev) => Math.min(prev + 1, 3)); // Updated to account for 4 tabs (0 to 3)
  };

  const handlePrevious = () => {
    setCurrentTab((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto p-4 md:p-6 lg:p-8">
        <DialogHeader>
          <DialogTitle>Create Client</DialogTitle>
          <DialogDescription>
            Fill in the client details below. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap justify-between border-b mb-4">
          <button
            className={`px-4 py-2 ${currentTab === 0 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            onClick={() => setCurrentTab(0)}
          >
            Client Information
          </button>
          <button
            className={`px-4 py-2 ${currentTab === 1 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            onClick={() => setCurrentTab(1)}
          >
            Client Details
          </button>
          <button
            className={`px-4 py-2 ${currentTab === 2 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            onClick={() => setCurrentTab(2)}
          >
            Contract Information
          </button>
          <button
            className={`px-4 py-2 ${currentTab === 3 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            onClick={() => setCurrentTab(3)}
          >
            Documents
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {currentTab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emails">Client Email(s)</Label>
                <Input
                  id="emails"
                  type="text"
                  value={emailInput}
                  onChange={handleInputChange("emails")}
                  onBlur={handleEmailBlur}
                  placeholder="email1@example.com,email2@example.com"
                  autoComplete="off"
                />
                <p className="text-sm text-muted-foreground">
                  Enter multiple emails separated by commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Client Phone Number *</Label>
                <div className="flex space-x-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={formData.countryCode}
                    onChange={handleInputChange("countryCode")}
                    required
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Client Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange("address")}
                  placeholder="Enter detailed address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Client Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange("website")}
                  placeholder="https://www.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedInProfile">Client LinkedIn Profile</Label>
                <Input
                  id="linkedInProfile"
                  value={formData.linkedInProfile}
                  onChange={handleInputChange("linkedInProfile")}
                  placeholder="https://www.linkedin.com/in/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Client Industry *</Label>
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
                <Label htmlFor="referredBy">Referred By *</Label>
                <Input
                  id="referredBy"
                  value={formData.referredBy}
                  onChange={handleInputChange("referredBy")}
                  required
                />
              </div>
            </div>
          )}

          {currentTab === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <div className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label>Primary Contacts *</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewContact({
                          name: "",
                          email: "",
                          phone: "",
                          countryCode: "+966",
                          position: "",
                          linkedin: "",
                        });
                        setIsContactModalOpen(true);
                      }}
                      type="button"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {formData.primaryContacts.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No contacts added.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.primaryContacts.map((contact, index) => (
                        <div key={index} className="p-3 bg-muted/30 rounded-lg">
                          <div className="block space-y-1">
                            <div className="font-medium">{contact.name || "Unnamed Contact"}</div>
                            <div className="text-sm text-muted-foreground">
                              {contact.position || "No position"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {contact.email || "No email"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getCountryCodeLabel(contact.countryCode || "+966")} {contact.phone || "No phone"}
                            </div>
                            <div className="text-sm text-muted-foreground">
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
                <Label htmlFor="googleMapsLink">Google Maps Link</Label>
                <Input
                  id="googleMapsLink"
                  value={formData.googleMapsLink}
                  onChange={handleInputChange("googleMapsLink")}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryOfBusiness">Country of Business</Label>
                <Input
                  id="countryOfBusiness"
                  value={formData.countryOfBusiness}
                  onChange={handleInputChange("countryOfBusiness")}
                  placeholder="Enter country of business"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lineOfBusiness">Line of Business *</Label>
                <div className="space-y-2 border rounded-md p-2">
                  {["Recruitment", "HR Consulting", "Mgt Consulting", "Outsourcing", "HR Managed Services ", "IT & Technology"].map(
                    (option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lob-${option}`}
                          checked={formData.lineOfBusiness?.includes(option)}
                          onCheckedChange={(checked) => {
                            setFormData((prev) => {
                              const current = prev.lineOfBusiness || [];
                              return {
                                ...prev,
                                lineOfBusiness: checked
                                  ? [...current, option]
                                  : current.filter((item: string) => item !== option),
                              };
                            });
                          }}
                        />
                        <label htmlFor={`lob-${option}`} className="text-sm font-medium leading-none">
                          {option
                            .split("-")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {currentTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="contractNumber">Contract Number</Label>
                <Input
                  id="contractNumber"
                  value={formData.contractNumber}
                  onChange={handleInputChange("contractNumber")}
                  placeholder="Enter contract number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractStartDate">Contract Start Date</Label>
                <DatePicker
                  id="contractStartDate"
                  selected={formData.contractStartDate ? new Date(formData.contractStartDate) : null}
                  onChange={(date: Date | null) => {
                    setFormData((prev) => ({
                      ...prev,
                      contractStartDate: date ? date.toISOString() : "",
                    }));
                  }}
                  dateFormat="MM/dd/yyyy"
                  className="border rounded px-2 py-1 w-full"
                  placeholderText="Select start date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractEndDate">Contract End Date</Label>
                <DatePicker
                  id="contractEndDate"
                  selected={formData.contractEndDate ? new Date(formData.contractEndDate) : null}
                  onChange={(date: Date | null) => {
                    setFormData((prev) => ({
                      ...prev,
                      contractEndDate: date ? date.toISOString() : "",
                    }));
                  }}
                  dateFormat="MM/dd/yyyy"
                  className="border rounded px-2 py-1 w-full"
                  placeholderText="Select end date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractValue">Contract Value</Label>
                <Input
                  id="contractValue"
                  type="number"
                  value={formData.contractValue || ""}
                  onChange={handleInputChange("contractValue")}
                  placeholder="Enter contract value"
                />
              </div>
            </div>
          )}

          {currentTab === 3 && (
            <div className="grid grid-cols-1 gap-6 py-4">
              <div className="space-y-2">
                <Label>CR Copy</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => document.getElementById("crCopyInput")?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload CR Copy (PDF, JPEG, PNG)</p>
                </div>
                <input
                  id="crCopyInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange("crCopy")}
                />
                {uploadedFiles.crCopy && (
                  <p className="text-sm mt-2">Selected file: {uploadedFiles.crCopy.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>VAT Copy</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => document.getElementById("vatCopyInput")?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload VAT Copy (PDF, JPEG, PNG)</p>
                </div>
                <input
                  id="vatCopyInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange("vatCopy")}
                />
                {uploadedFiles.vatCopy && (
                  <p className="text-sm mt-2">Selected file: {uploadedFiles.vatCopy.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>GST/TIN Document</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => document.getElementById("gstTinDocumentInput")?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload GST/TIN Document (PDF, JPEG, PNG)</p>
                </div>
                <input
                  id="gstTinDocumentInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange("gstTinDocument")}
                />
                {uploadedFiles.gstTinDocument && (
                  <p className="text-sm mt-2">Selected file: {uploadedFiles.gstTinDocument.name}</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex flex-wrap justify-between w-full">
              <div>
                {currentTab > 0 && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handlePrevious}
                    disabled={loading}
                    className="mb-2 md:mb-0"
                  >
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                {currentTab < 3 && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
                {currentTab < 3 ? (
                  <Button type="button" onClick={handleNext} disabled={loading}>
                    Next
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => onOpenChange(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Client"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogFooter>
        </form>

        {isContactModalOpen && (
          <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Primary Contact</DialogTitle>
                <DialogDescription>Enter the details for the primary contact.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Name *</Label>
                  <Input
                    id="contactName"
                    value={newContact.name}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <div className="flex space-x-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={newContact.countryCode}
                      onChange={(e) =>
                        setNewContact((prev) => ({ ...prev, countryCode: e.target.value }))
                      }
                    >
                      {countryCodes.map((option) => (
                        <option key={option.code} value={option.code}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPosition">Position</Label>
                  <Select
                    value={newContact.position}
                    onValueChange={(value) => setNewContact((prev) => ({ ...prev, position: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactLinkedIn">LinkedIn</Label>
                  <Input
                    id="contactLinkedIn"
                    type="text"
                    value={newContact.linkedin}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewContact({
                      name: "",
                      email: "",
                      phone: "",
                      countryCode: "+966",
                      position: "",
                      linkedin: "",
                    });
                    setIsContactModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => handleAddContact(newContact)}>Add Contact</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}