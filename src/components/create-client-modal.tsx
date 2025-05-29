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
import { Upload, Users, Plus, Briefcase, FileText, Eye, Download } from "lucide-react";
import { createClient } from "@/services/clientService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Textarea } from "@/components/ui/textarea";
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
  fixWithoutAdvanceNotes: string;
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
  contractNumber?: string;
  contractStartDate?: Date | null;
  contractEndDate?: Date | null;
  contractValue?: number;
  contractType?: string;
  cLevelPercentage?: number;
  belowCLevelPercentage?: number;
  fixedPercentageNotes?: string;
  fixedPercentageAdvanceNotes?: string;
  cLevelPercentageNotes?: string;
  belowCLevelPercentageNotes?: string;
  salesLead?: string;
  // Added fields for Level Based (Hiring)
  seniorLevelPercentage?: number;
  executivesPercentage?: number;
  nonExecutivesPercentage?: number;
  otherPercentage?: number;
  seniorLevelNotes?: string;
  executivesNotes?: string;
  nonExecutivesNotes?: string;
  otherNotes?: string;
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
    contractNumber: "",
    contractStartDate: null,
    contractEndDate: null,
    contractValue: 0,
    contractType: "",
    cLevelPercentage: 0,
    belowCLevelPercentage: 0,
    fixedPercentageNotes: "",
    fixedPercentageAdvanceNotes: "",
    cLevelPercentageNotes: "",
    belowCLevelPercentageNotes: "",
    salesLead: "",
    fixWithoutAdvanceNotes: "",
    seniorLevelPercentage: 0,
    executivesPercentage: 0,
    nonExecutivesPercentage: 0,
    otherPercentage: 0,
    seniorLevelNotes: "",
    executivesNotes: "",
    nonExecutivesNotes: "",
    otherNotes: "",
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
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({
    profileImage: null,
    crCopy: null,
    vatCopy: null,
    gstTinDocument: null,
    fixedPercentage: null,
    fixedPercentageAdvance: null,
    variablePercentageCLevel: null,
    variablePercentageBelowCLevel: null,
    fixWithoutAdvance: null,
    seniorLevel: null,
    executives: null,
    nonExecutives: null,
    other: null,
  });

  type LevelType =
    | "seniorLevel"
    | "executives"
    | "nonExecutives"
    | "other"
    | "profileImage"
    | "crCopy"
    | "vatCopy"
    | "gstTinDocument"
    | "fixedPercentage"
    | "fixedPercentageAdvance"
    | "variablePercentageCLevel"
    | "variablePercentageBelowCLevel"
    | "fixWithoutAdvance";

  const handleFileChange = (field: LevelType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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

  const handlePreview = (file: File | null) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, "_blank");
    } else {
      setError("No file uploaded to preview.");
    }
  };

  const handleDownload = (file: File | null) => {
    if (!file) {
      setError("No file uploaded to download.");
      return;
    }
    const fileUrl = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(fileUrl);
  };

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

  // URL validation
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: keyof ClientForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let value: string | string[] | number = e.target.value;

    if (field === "emails") {
      setEmailInput(e.target.value);
      const emails = e.target.value
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);
      value = emails;
    } else if (
      field === "website" ||
      field === "linkedInProfile" ||
      field === "linkedInPage" ||
      field === "googleMapsLink"
    ) {
      value = e.target.value;
      if (value && !validateUrl(value)) {
        setError(`Invalid URL for ${field}`);
        return;
      }
    } else if (
      field === "contractValue" ||
      field === "cLevelPercentage" ||
      field === "belowCLevelPercentage" ||
      field === "seniorLevelPercentage" ||
      field === "executivesPercentage" ||
      field === "nonExecutivesPercentage" ||
      field === "otherPercentage"
    ) {
      value = e.target.value ? parseFloat(e.target.value) : 0;
    } else if (
      field === "fixedPercentageNotes" ||
      field === "fixedPercentageAdvanceNotes" ||
      field === "cLevelPercentageNotes" ||
      field === "belowCLevelPercentageNotes" ||
      field === "fixWithoutAdvanceNotes" ||
      field === "seniorLevelNotes" ||
      field === "executivesNotes" ||
      field === "nonExecutivesNotes" ||
      field === "otherNotes"
    ) {
      value = e.target.value;
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
    if (contact.linkedin && !validateUrl(contact.linkedin)) {
      setError("Invalid LinkedIn URL");
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
    // ... (rest of the country codes remain unchanged)
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

      // Validate URLs
      if (formData.website && !validateUrl(formData.website)) {
        setError("Invalid website URL");
        setLoading(false);
        return;
      }
      if (formData.linkedInProfile && !validateUrl(formData.linkedInProfile)) {
        setError("Invalid LinkedIn profile URL");
        setLoading(false);
        return;
      }
      if (formData.googleMapsLink && !validateUrl(formData.googleMapsLink)) {
        setError("Invalid Google Maps link");
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
        contractNumber: formData.contractNumber || undefined,
        contractStartDate: formData.contractStartDate
          ? formData.contractStartDate.toISOString().split("T")[0]
          : undefined,
        contractEndDate: formData.contractEndDate
          ? formData.contractEndDate.toISOString().split("T")[0]
          : undefined,
        contractValue: formData.contractValue || undefined,
        contractType: formData.contractType || undefined,
        cLevelPercentage: formData.cLevelPercentage || undefined,
        belowCLevelPercentage: formData.belowCLevelPercentage || undefined,
        fixedPercentage: uploadedFiles.fixedPercentage || undefined,
        fixedPercentageAdvance: uploadedFiles.fixedPercentageAdvance || undefined,
        variablePercentageCLevel: uploadedFiles.variablePercentageCLevel || undefined,
        variablePercentageBelowCLevel: uploadedFiles.variablePercentageBelowCLevel || undefined,
        fixedPercentageNotes: formData.fixedPercentageNotes || undefined,
        fixedPercentageAdvanceNotes: formData.fixedPercentageAdvanceNotes || undefined,
        cLevelPercentageNotes: formData.cLevelPercentageNotes || undefined,
        belowCLevelPercentageNotes: formData.belowCLevelPercentageNotes || undefined,
        fixWithoutAdvanceNotes: formData.fixWithoutAdvanceNotes || undefined,
        seniorLevelPercentage: formData.seniorLevelPercentage || undefined,
        executivesPercentage: formData.executivesPercentage || undefined,
        nonExecutivesPercentage: formData.nonExecutivesPercentage || undefined,
        otherPercentage: formData.otherPercentage || undefined,
        seniorLevelNotes: formData.seniorLevelNotes || undefined,
        executivesNotes: formData.executivesNotes || undefined,
        nonExecutivesNotes: formData.nonExecutivesNotes || undefined,
        otherNotes: formData.otherNotes || undefined,
        seniorLevel: uploadedFiles.seniorLevel || undefined,
        executives: uploadedFiles.executives || undefined,
        nonExecutives: uploadedFiles.nonExecutives || undefined,
        other: uploadedFiles.other || undefined,
      };

      console.log("Submitting payload:", clientPayload);
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
        contractNumber: "",
        contractStartDate: null,
        contractEndDate: null,
        contractValue: 0,
        contractType: "",
        cLevelPercentage: 0,
        belowCLevelPercentage: 0,
        fixedPercentageNotes: "",
        fixedPercentageAdvanceNotes: "",
        cLevelPercentageNotes: "",
        belowCLevelPercentageNotes: "",
        salesLead: "",
        fixWithoutAdvanceNotes: "",
        seniorLevelPercentage: 0,
        executivesPercentage: 0,
        nonExecutivesPercentage: 0,
        otherPercentage: 0,
        seniorLevelNotes: "",
        executivesNotes: "",
        nonExecutivesNotes: "",
        otherNotes: "",
      });
      setEmailInput("");
      setSelectedYear(null);
      setUploadedFiles({
        profileImage: null,
        crCopy: null,
        vatCopy: null,
        gstTinDocument: null,
        fixedPercentage: null,
        fixedPercentageAdvance: null,
        variablePercentageCLevel: null,
        variablePercentageBelowCLevel: null,
        fixWithoutAdvance: null,
        seniorLevel: null,
        executives: null,
        nonExecutives: null,
        other: null,
      });
      setNewContact({ name: "", email: "", phone: "", countryCode: "+966", position: "", linkedin: "" });
      setCurrentTab(0);
      setIsContactModalOpen(false);
      setSelectedLevels([]);
      setActiveLevel(null);
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
    setCurrentTab((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentTab((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">Create Client</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Fill in the client details below. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap border-b mb-4">
          {["Client Information", "Contact Details", "Contract Information", "Documents"].map((tab, index) => (
            <button
              key={tab}
              className={`flex-1 px-2 py-2 text-center text-xs sm:text-sm md:text-base ${
                currentTab === index ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setCurrentTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {currentTab === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="salesLead" className="text-sm sm:text-base">
                  Sales Lead *
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
                <Label htmlFor="name" className="text-sm sm:text-base">
                  Client Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  required
                  className="w-full"
                />
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
                  Client LandLine Number
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
                  placeholder="https://maps.google.com/..."
                  className="w-full"
                />
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
          )}

          {currentTab === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
              <div className="space-y-2">
                <div className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-sm sm:text-base">Primary Contacts *</Label>
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
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {contact.position || "No position"}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {contact.email || "No email"}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {getCountryCodeLabel(contact.countryCode || "+966")} {contact.phone || "No phone"}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
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
                <Label htmlFor="lineOfBusiness" className="text-sm sm:text-base">
                  Line of Business *
                </Label>
                <div className="space-y-2 border rounded-md p-2">
                  {[
                    "Recruitment",
                    "HR Consulting",
                    "Mgt Consulting",
                    "Outsourcing",
                    "HR Managed Services ",
                    "IT & Technology",
                  ].map((option) => (
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
                      <label
                        htmlFor={`lob-${option}`}
                        className="text-xs sm:text-sm font-medium leading-none"
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
            </div>
          )}

          {currentTab === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="referredBy" className="text-sm sm:text-base">
                  Referred By *
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
                <Label htmlFor="contractStartDate" className="text-sm sm:text-base">
                  Contract Start Date
                </Label>
                <div className="relative">
                  <DatePicker
                    id="contractStartDate"
                    selected={formData.contractStartDate}
                    onChange={(date: Date | null) => {
                      setFormData((prev) => ({
                        ...prev,
                        contractStartDate: date,
                      }));
                    }}
                    dateFormat="MMM d, yyyy"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholderText="Select start date"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    scrollableYearDropdown
                    yearDropdownItemNumber={15}
                    minDate={new Date()}
                    maxDate={
                      formData.contractEndDate ||
                      new Date(new Date().setFullYear(new Date().getFullYear() + 10))
                    }
                    showIcon
                    icon="📅"
                    toggleCalendarOnIconClick
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractEndDate" className="text-sm sm:text-base">
                  Contract End Date
                </Label>
                <div className="relative">
                  <DatePicker
                    id="contractEndDate"
                    selected={formData.contractEndDate}
                    onChange={(date: Date | null) => {
                      setFormData((prev) => ({
                        ...prev,
                        contractEndDate: date,
                      }));
                    }}
                    dateFormat="MMM d, yyyy"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholderText="Select end date"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    scrollableYearDropdown
                    yearDropdownItemNumber={15}
                    minDate={formData.contractStartDate || new Date()}
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 20))}
                    showIcon
                    icon="📅"
                    toggleCalendarOnIconClick
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractType" className="text-sm sm:text-base">
                  Contract Type
                </Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, contractType: value }));
                    setSelectedLevels([]);
                    setActiveLevel(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed Percentage">Fixed Percentage</SelectItem>
                    <SelectItem value="Fix with Advance">Fix with Advance</SelectItem>
                    <SelectItem value="Fix without Advance">Fix without Advance</SelectItem>
                    <SelectItem value="Level Based (Hiring)">Level Based (Hiring)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.contractType === "Fixed Percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="fixedPercentageNotes" className="text-sm sm:text-base">
                    Fixed Percentage Notes
                  </Label>
                  <Textarea
                    id="fixedPercentageNotes"
                    value={formData.fixedPercentageNotes || ""}
                    onChange={handleInputChange("fixedPercentageNotes")}
                    placeholder="Enter notes for Fixed Percentage"
                    rows={3}
                    className="w-full"
                  />
                  <Label className="text-sm sm:text-base">Fixed Percentage Document</Label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center">
                    <div
                      className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1 w-full"
                      onClick={() => document.getElementById("fixedPercentageInput")?.click()}
                    >
                      <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
                    </div>
                    <input
                      id="fixedPercentageInput"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleFileChange("fixedPercentage")}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(uploadedFiles.fixedPercentage)}
                      disabled={!uploadedFiles.fixedPercentage}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(uploadedFiles.fixedPercentage)}
                      disabled={!uploadedFiles.fixedPercentage}
                    >
                      Download
                    </Button>
                  </div>
                  {uploadedFiles.fixedPercentage && (
                    <p className="text-xs sm:text-sm mt-2">
                      Selected file: {uploadedFiles.fixedPercentage.name}
                    </p>
                  )}
                </div>
              )}

              {formData.contractType === "Fix with Advance" && (
                <div className="space-y-2">
                  <Label htmlFor="fixedPercentageAdvanceNotes" className="text-sm sm:text-base">
                    Fix with Advance Notes
                  </Label>
                  <Textarea
                    id="fixedPercentageAdvanceNotes"
                    value={formData.fixedPercentageAdvanceNotes || ""}
                    onChange={handleInputChange("fixedPercentageAdvanceNotes")}
                    placeholder="Enter notes for Fix with Advance"
                    rows={3}
                    className="w-full"
                  />
                  <Label className="text-sm sm:text-base">Fix with Advance Document</Label>
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
                      onClick={() => handlePreview(uploadedFiles.fixedPercentageAdvance)}
                      disabled={!uploadedFiles.fixedPercentageAdvance}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(uploadedFiles.fixedPercentageAdvance)}
                      disabled={!uploadedFiles.fixedPercentageAdvance}
                    >
                      Download
                    </Button>
                  </div>
                  {uploadedFiles.fixedPercentageAdvance && (
                    <p className="text-xs sm:text-sm mt-2">
                      Selected file: {uploadedFiles.fixedPercentageAdvance.name}
                    </p>
                  )}
                </div>
              )}

              {formData.contractType === "Fix without Advance" && (
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Fix without Advance Document</Label>
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
                      onClick={() => handlePreview(uploadedFiles.fixWithoutAdvance)}
                      disabled={!uploadedFiles.fixWithoutAdvance}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(uploadedFiles.fixWithoutAdvance)}
                      disabled={!uploadedFiles.fixWithoutAdvance}
                    >
                      Download
                    </Button>
                  </div>
                  {uploadedFiles.fixWithoutAdvance && (
                    <p className="text-xs sm:text-sm mt-2">
                      Selected file: {uploadedFiles.fixWithoutAdvance.name}
                    </p>
                  )}
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="fixWithoutAdvanceNotes" className="text-sm sm:text-base">
                      Notes
                    </Label>
                    <Textarea
                      id="fixWithoutAdvanceNotes"
                      value={formData.fixWithoutAdvanceNotes || ""}
                      onChange={handleInputChange("fixWithoutAdvanceNotes")}
                      placeholder="Enter notes for Fix without Advance"
                      rows={3}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {formData.contractType === "Level Based (Hiring)" && (
                <div className="space-y-4 col-span-1 sm:col-span-2 border rounded-lg p-4">
                  <div>
                    <Label className="text-sm sm:text-base mb-2 block">Level Type</Label>
                    <div className="flex flex-wrap gap-3 border rounded-md p-3">
                      {["Senior Level", "Executives", "Non-Executives", "Other"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={`level-${level}`}
                            checked={selectedLevels.includes(level)}
                            onCheckedChange={(checked: boolean) => {
                              const newLevels = checked
                                ? [...selectedLevels, level]
                                : selectedLevels.filter((l) => l !== level);
                              setSelectedLevels(newLevels);
                              if (checked && !activeLevel) {
                                setActiveLevel(level);
                              } else if (!checked && activeLevel === level) {
                                setActiveLevel(newLevels.length > 0 ? newLevels[0] : null);
                              }
                            }}
                          />
                          <label
                            htmlFor={`level-${level}`}
                            className={`text-xs sm:text-sm font-medium leading-none cursor-pointer ${
                              activeLevel === level ? "font-bold text-primary" : ""
                            }`}
                            onClick={() => selectedLevels.includes(level) && setActiveLevel(level)}
                          >
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedLevels.length > 0 && activeLevel && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        {selectedLevels.map((level) => (
                          <div
                            key={level}
                            className={`border-2 border-gray-400 shadow-sm rounded-lg p-2 cursor-pointer transition-colors w-full ${
                              activeLevel === level ? "border-primary bg-primary/5" : "border-gray-400"
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
                                    onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                                    onChange={handleInputChange(
                                      `${level.toLowerCase().replace(/\s+/g, "")}Percentage` as keyof ClientForm
                                    )}
                                    value={
                                      formData[
                                        `${level.toLowerCase().replace(/\s+/g, "")}Percentage` as keyof ClientForm
                                      ] || ""
                                    }
                                    className="h-8 pl-2 pr-6 text-xs"
                                  />
                                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                                    %
                                  </span>
                                </div>
                                <Input
                                  type="text"
                                  placeholder="Notes"
                                  onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                                  onChange={handleInputChange(
                                    `${level.toLowerCase().replace(/\s+/g, "")}Notes` as keyof ClientForm
                                  )}
                                  value={
                                    formData[
                                      `${level.toLowerCase().replace(/\s+/g, "")}Notes` as keyof ClientForm
                                    ] || ""
                                  }
                                  className="h-8 text-xs flex-1"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base font-semibold">Contract Document</Label>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center">
                          <div
                            className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1 w-full"
                            onClick={() =>
                              document.getElementById(`level-${activeLevel.replace(/\s+/g, "")}-input`)?.click()
                            }
                          >
                            <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
                          </div>
                          <input
                            id={`level-${activeLevel.replace(/\s+/g, "")}-input`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleFileChange(activeLevel.toLowerCase().replace(/\s+/g, "") as LevelType)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2 gap-1"
                            onClick={() => {
                              const file = uploadedFiles[activeLevel.toLowerCase().replace(/\s+/g, "") as LevelType];
                              handlePreview(file);
                            }}
                            disabled={!uploadedFiles[activeLevel.toLowerCase().replace(/\s+/g, "") as LevelType]}
                          >
                            <Eye className="h-3 w-3" />
                            <span>Preview</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2 gap-1"
                            onClick={() => {
                              const file = uploadedFiles[activeLevel.toLowerCase().replace(/\s+/g, "") as LevelType];
                              handleDownload(file);
                            }}
                            disabled={!uploadedFiles[activeLevel.toLowerCase().replace(/\s+/g, "") as LevelType]}
                          >
                            <Download className="h-3 w-3" />
                            <span>Download</span>
                          </Button>
                        </div>
                        {uploadedFiles[activeLevel.toLowerCase().replace(/\s+/g, "") as LevelType] && (
                          <p className="text-xs text-muted-foreground truncate">
                            Selected file: {uploadedFiles[activeLevel.toLowerCase().replace(/\s+/g, "") as LevelType]?.name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentTab === 3 && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 py-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">CR Copy</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => document.getElementById("crCopyInput")?.click()}
                >
                  <Upload className="h-6 sm:h-8 w-6 sm:w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Upload CR Copy (PDF, JPEG, PNG)</p>
                </div>
                <input
                  id="crCopyInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange("crCopy")}
                />
                {uploadedFiles.crCopy && (
                  <p className="text-xs sm:text-sm mt-2">Selected file: {uploadedFiles.crCopy.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm sm:text-base">VAT Copy</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => document.getElementById("vatCopyInput")?.click()}
                >
                  <Upload className="h-6 sm:h-8 w-6 sm:w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Upload VAT Copy (PDF, JPEG, PNG)</p>
                </div>
                <input
                  id="vatCopyInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange("vatCopy")}
                />
                {uploadedFiles.vatCopy && (
                  <p className="text-xs sm:text-sm mt-2">Selected file: {uploadedFiles.vatCopy.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm sm:text-base">GST/TIN Document</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50"
                  onClick={() => document.getElementById("gstTinDocumentInput")?.click()}
                >
                  <Upload className="h-6 sm:h-8 w-6 sm:w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Upload GST/TIN Document (PDF, JPEG, PNG)
                  </p>
                </div>
                <input
                  id="gstTinDocumentInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange("gstTinDocument")}
                />
                {uploadedFiles.gstTinDocument && (
                  <p className="text-xs sm:text-sm mt-2">
                    Selected file: {uploadedFiles.gstTinDocument.name}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
              <div>
                {currentTab > 0 && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handlePrevious}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                {currentTab < 3 && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                )}
                {currentTab < 3 ? (
                  <Button type="button" onClick={handleNext} disabled={loading} className="w-full sm:w-auto">
                    Next
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => onOpenChange(false)}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
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
            <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Add Primary Contact</DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  Enter the details for the primary contact.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName" className="text-sm sm:text-base">
                    Name *
                  </Label>
                  <Input
                    id="contactName"
                    value={newContact.name}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm sm:text-base">
                    Email
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-sm sm:text-base">
                    Phone Number *
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      className="border rounded px-2 py-1 w-full sm:w-32"
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
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPosition" className="text-sm sm:text-base">
                    Position
                  </Label>
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
                  <Label htmlFor="contactLinkedIn" className="text-sm sm:text-base">
                    LinkedIn
                  </Label>
                  <Input
                    id="contactLinkedIn"
                    type="text"
                    value={newContact.linkedin}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://www.linkedin.com/in/..."
                    className="w-full"
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
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button onClick={() => handleAddContact(newContact)} className="w-full sm:w-auto">
                  Add Contact
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}