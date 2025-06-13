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
import { Upload, Plus, Eye, Download } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { INDUSTRIES } from "@/lib/constants";

// Interfaces
interface PrimaryContact {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  countryCode: string;
  designation: string;
  linkedin?: string;
  isPrimary: boolean;
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
  registrationNumber?: string;
  lineOfBusiness?: string[] | string;
  countryOfBusiness?: string;
  referredBy?: string;
  linkedInProfile?: string;
  linkedInPage?: string;
  countryCode?: string;
  primaryContacts: PrimaryContact[];
  clientStage?: "Lead" | "Engaged" | "Negotiation" | "Signed";
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
  fixedPercentageValue?: string | number;
  fixedPercentageAdvanceNotes?: string;
  fixWithAdvanceValue?: string | number;
  fixWithAdvanceMoney?: string | number; // Added for money value
  advanceMoneyCurrency?: string;
  advanceMoneyAmount?: number;
  fixWithoutAdvanceValue?: string | number;
  cLevelPercentageNotes?: string;
  belowCLevelPercentageNotes?: string;
  fixWithoutAdvanceNotes?: string;
  seniorLevelPercentage?: number;
  executivesPercentage?: number;
  nonExecutivesPercentage?: number;
  otherPercentage?: number;
  seniorLevelNotes?: string;
  executivesNotes?: string;
  nonExecutivesNotes?: string;
  otherNotes?: string;
  salesLead?: string;
  clientPriority?: number;
  clientSegment?: string;
  // File upload fields
  crCopy?: any;
  vatCopy?: any;
  gstTinDocument?: any;
  fixedPercentage?: any;
  fixedPercentageAdvance?: any;
  variablePercentageCLevel?: any;
  variablePercentageBelowCLevel?: any;
  fixWithoutAdvance?: any;
  seniorLevel?: any;
  executives?: any;
  nonExecutives?: any;
  other?: any;
  seniorLevelMoney?: number;
  seniorLevelCurrency?: string;
  executivesMoney?: number;
  executivesCurrency?: string;
  nonExecutivesMoney?: number;
  nonExecutivesCurrency?: string;
  otherMoney?: number;
  otherCurrency?: string;
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

// API call to create client
const createClient = async (data: FormData) => {
  try {
    const response = await axios.post(
      "https://aems-backend.onrender.com/api/clients",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error(error.response?.data?.message || "Failed to create client");
  }
};

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
    registrationNumber: "",
    lineOfBusiness: [],
    countryOfBusiness: "",
    referredBy: "",
    linkedInProfile: "",
    linkedInPage: "",
    countryCode: "+966",
    primaryContacts: [],
    clientStage: "Lead",
    clientTeam: "Enterprise",
    clientRm: "",
    clientAge: 0,
    contractNumber: "",
    contractStartDate: null,
    contractEndDate: null,
    contractValue: 0,
    contractType: "",
    cLevelPercentage: 0,
    belowCLevelPercentage: 0,
    fixedPercentageNotes: "",
    fixedPercentageValue: "",
    fixedPercentageAdvanceNotes: "",
    fixWithAdvanceValue: "",
    fixWithAdvanceMoney: "", // Added for money value
    fixWithoutAdvanceValue: "",
    cLevelPercentageNotes: "",
    belowCLevelPercentageNotes: "",
    fixWithoutAdvanceNotes: "",
    seniorLevelPercentage: 0,
    executivesPercentage: 0,
    nonExecutivesPercentage: 0,
    otherPercentage: 0,
    seniorLevelNotes: "",
    executivesNotes: "",
    nonExecutivesNotes: "",
    otherNotes: "",
    salesLead: "",
    advanceMoneyCurrency: "SAR",
    seniorLevelCurrency: "SAR",
    executivesCurrency: "SAR",
    nonExecutivesCurrency: "SAR",
    otherCurrency: "SAR",
  });

  const [emailInput, setEmailInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const levelFieldMap: Record<string, { percentage: keyof ClientForm; notes: keyof ClientForm; money: keyof ClientForm; currency: keyof ClientForm; }> = {
    "Senior Level": { percentage: "seniorLevelPercentage", notes: "seniorLevelNotes", money: "seniorLevelMoney", currency: "seniorLevelCurrency" },
    "Executives": { percentage: "executivesPercentage", notes: "executivesNotes", money: "executivesMoney", currency: "executivesCurrency" },
    "Non-Executives": { percentage: "nonExecutivesPercentage", notes: "nonExecutivesNotes", money: "nonExecutivesMoney", currency: "nonExecutivesCurrency" },
    "Other": { percentage: "otherPercentage", notes: "otherNotes", money: "otherMoney", currency: "otherCurrency" },
  };
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState<PrimaryContact>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    countryCode: "+966",
    designation: "",
    linkedin: "",
    isPrimary: true,
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
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
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

  // Email validation
  const validateEmails = (emails: string[]): string[] => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.filter((email) => email && !emailRegex.test(email));
  };

  // URL validation
  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Allow empty URLs since these fields are optional
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

    if (field === "name") {
      value = e.target.value.trimStart();
    } else if (field === "emails") {
      setEmailInput(e.target.value);
      const emails = e.target.value
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);
      value = emails;
    } else if (
      field === "contractValue" ||
      field === "cLevelPercentage" ||
      field === "belowCLevelPercentage" ||
      field === "seniorLevelPercentage" ||
      field === "executivesPercentage" ||
      field === "nonExecutivesPercentage" ||
      field === "otherPercentage"
    ) {
      // Ensure the value is a valid number between 0 and 100
      const numValue = parseFloat(e.target.value);
      value = isNaN(numValue) ? 0 : Math.min(100, Math.max(0, numValue));
    } else {
      value = e.target.value;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "location") {
      setShowLocationSuggestions(true);
    }
    // Clear error when user starts typing in URL fields or any field
    if (
      field === "website" ||
      field === "linkedInProfile" ||
      field === "googleMapsLink" ||
      error
    ) {
      setError(null);
    }
  };

  const handleUrlBlur = (field: keyof ClientForm) => (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value && !validateUrl(value)) {
      setError(`Invalid URL for ${field}`);
    } else {
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
    if (!contact.firstName || contact.firstName.trim() === "") {
      setError("Contact first name is required");
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
    setNewContact({ firstName: "", lastName: "", gender: "", email: "", phone: "", countryCode: "+966", designation: "", linkedin: "", isPrimary: true });
    setIsContactModalOpen(false);
    setError(null);
  };

  const countryCodes = [
    { code: "+966", label: "+966 (Saudi Arabia)" },
    { code: "+1", label: "+1 (USA)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+91", label: "+91 (India)" },
  ];

  const positionOptions = [
    { value: "HR", label: "HR" },
    { value: "Senior HR", label: "Senior HR" },
    { value: "Manager", label: "Manager" },
    { value: "HR Manager", label: "HR Manager" },
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
      // Basic validation
      if (!formData.name || formData.name.trim() === "") {
        setError("Client name is required");
        setLoading(false);
        return;
      }

      if (!formData.phoneNumber) {
        setError("Phone number is required");
        setLoading(false);
        return;
      }

      if (!formData.address) {
        setError("Address is required");
        setLoading(false);
        return;
      }

      if (formData.primaryContacts.length === 0) {
        setError("At least one primary contact is required");
        setLoading(false);
        return;
      }

      // Validate primary contact emails
      const invalidContactEmails = formData.primaryContacts.filter(
        (contact: PrimaryContact) => contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
      );
      
      if (invalidContactEmails.length > 0) {
        setError(`Invalid contact email(s): ${invalidContactEmails.map(c => c.email).join(", ")}`);
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

      // Create FormData object to send both form data and files
     const formDataToSend = new FormData();

if (selectedLevels?.length) {
  const labelType: Record<string, string> = {};
  const fieldMap: Record<string, string> = {
    'Senior Level': 'seniorLevel',
    'Executives': 'executives',
    'Non-Executives': 'nonExecutives'
  };

  selectedLevels.forEach(level => {
    const fieldName = fieldMap[level] || 'other';
    
    if (!labelType[fieldName]) {
      labelType[fieldName] = level;
      formDataToSend.append(fieldName, level);
    }
  });

  formDataToSend.append('labelType', JSON.stringify(labelType));
}
console.log("formDataToSend", formDataToSend);

// Add all form data fields
formDataToSend.append('name', formData.name.trim());
      
      // Handle arrays properly by stringifying them
      if (formData.emails && formData.emails.length > 0) {
        formDataToSend.append('emails', JSON.stringify(formData.emails));
      }
      
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      
      if (formData.website) {
        formDataToSend.append('website', formData.website);
      }
      
      formDataToSend.append('industry', formData.industry || "");
      formDataToSend.append('address', formData.address);
      
      if (formData.googleMapsLink) {
        formDataToSend.append('googleMapsLink', formData.googleMapsLink);
      }
      
      // Handle lineOfBusiness which can be array or string
      if (Array.isArray(formData.lineOfBusiness)) {
        formDataToSend.append('lineOfBusiness', JSON.stringify(formData.lineOfBusiness));
      } else if (typeof formData.lineOfBusiness === 'string') {
        const lineOfBusinessArray = formData.lineOfBusiness.split(',').filter(Boolean);
        formDataToSend.append('lineOfBusiness', JSON.stringify(lineOfBusinessArray));
      }
      
      if (formData.countryOfBusiness) {
        formDataToSend.append('countryOfBusiness', formData.countryOfBusiness);
      }
      
      formDataToSend.append('referredBy', formData.referredBy || "");
      
      if (formData.linkedInProfile) {
        formDataToSend.append('linkedInProfile', formData.linkedInProfile);
      }
      
      formDataToSend.append('countryCode', formData.countryCode || "+966");
      
      // Handle primaryContacts array
      if (formData.primaryContacts && formData.primaryContacts.length > 0) {
        formDataToSend.append('primaryContacts', JSON.stringify(formData.primaryContacts.map(contact => ({
          name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
          gender: contact.gender,
          email: contact.email,
          phone: contact.phone,
          countryCode: contact.countryCode,
          designation: contact.designation,
          linkedin: contact.linkedin || "",
          isPrimary: contact.isPrimary,
        }))));
      }
      
      formDataToSend.append('clientStage', formData.clientStage || "Lead");
      formDataToSend.append('clientTeam', formData.clientTeam || "Enterprise");
      
      // Always append salesLead, even if empty, for consistency
      formDataToSend.append('salesLead', formData.salesLead ?? "");

      if (formData.clientPriority) {
        formDataToSend.append('clientPriority', formData.clientPriority.toString());
      }

      if (formData.clientSegment) {
        formDataToSend.append('clientSegment', formData.clientSegment);
      }
      
      if (formData.contractStartDate) {
        // Format date as YYYY-MM-DD without timezone conversion
        const startDate = new Date(formData.contractStartDate);
        const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
        formDataToSend.append('contractStartDate', startDateStr);
      }
      
      if (formData.contractEndDate) {
        // Format date as YYYY-MM-DD without timezone conversion
        const endDate = new Date(formData.contractEndDate);
        const endDateStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
        formDataToSend.append('contractEndDate', endDateStr);
      }
      
      if (formData.contractType) {
        formDataToSend.append('contractType', formData.contractType);
      }
            // Add percentage and notes fields for Level Based (Hiring)
      if (formData.contractType === "Level Based (Hiring)") {
        if (selectedLevels.includes("Senior Level")) {
          formDataToSend.append('seniorLevelPercentage', (formData.seniorLevelPercentage ?? 0).toString());
        }
        if (selectedLevels.includes("Executives")) {
          formDataToSend.append('executivesPercentage', (formData.executivesPercentage ?? 0).toString());
        }
        if (selectedLevels.includes("Non-Executives")) {
          formDataToSend.append('nonExecutivesPercentage', (formData.nonExecutivesPercentage ?? 0).toString());
        }
        if (selectedLevels.includes("Other")) {
          formDataToSend.append('otherPercentage', (formData.otherPercentage ?? 0).toString());
        }
        if (selectedLevels.includes("Senior Level") && formData.seniorLevelNotes) {
          formDataToSend.append('seniorLevelNotes', formData.seniorLevelNotes);
        }
        if (selectedLevels.includes("Executives") && formData.executivesNotes) {
          formDataToSend.append('executivesNotes', formData.executivesNotes);
        }
        if (selectedLevels.includes("Non-Executives") && formData.nonExecutivesNotes) {
          formDataToSend.append('nonExecutivesNotes', formData.nonExecutivesNotes);
        }
        if (selectedLevels.includes("Other") && formData.otherNotes) {
          formDataToSend.append('otherNotes', formData.otherNotes);
        }
      }

      // Add percentage, money, and notes fields for Fix with Advance
      if (formData.contractType === "Fix with Advance") {
        if (formData.fixWithAdvanceValue !== undefined && formData.fixWithAdvanceValue !== null)
          formDataToSend.append('fixWithAdvanceValue', formData.fixWithAdvanceValue.toString());
        if (formData.fixWithAdvanceMoney !== undefined && formData.fixWithAdvanceMoney !== null && formData.fixWithAdvanceMoney !== "")
          formDataToSend.append('fixWithAdvanceMoney', formData.fixWithAdvanceMoney.toString());
        if (formData.fixedPercentageAdvanceNotes)
          formDataToSend.append('fixedPercentageAdvanceNotes', formData.fixedPercentageAdvanceNotes);
      }

      // Add money, currency, and notes fields for Level Based With Advance
      if (formData.contractType === "Level Based With Advance") {
        if (selectedLevels.includes("Senior Level")) {
          if (formData.seniorLevelPercentage !== undefined)
            formDataToSend.append('seniorLevelPercentage', (formData.seniorLevelPercentage ?? 0).toString());
          if (formData.seniorLevelMoney !== undefined && formData.seniorLevelMoney !== null)
            formDataToSend.append('seniorLevelMoney', formData.seniorLevelMoney.toString());
          if (formData.seniorLevelCurrency)
            formDataToSend.append('seniorLevelCurrency', formData.seniorLevelCurrency);
          if (formData.seniorLevelNotes)
            formDataToSend.append('seniorLevelNotes', formData.seniorLevelNotes);
        }
        if (selectedLevels.includes("Executives")) {
          if (formData.executivesPercentage !== undefined)
            formDataToSend.append('executivesPercentage', (formData.executivesPercentage ?? 0).toString());
          if (formData.executivesMoney !== undefined && formData.executivesMoney !== null)
            formDataToSend.append('executivesMoney', formData.executivesMoney.toString());
          if (formData.executivesCurrency)
            formDataToSend.append('executivesCurrency', formData.executivesCurrency);
          if (formData.executivesNotes)
            formDataToSend.append('executivesNotes', formData.executivesNotes);
        }
        if (selectedLevels.includes("Non-Executives")) {
          if (formData.nonExecutivesPercentage !== undefined)
            formDataToSend.append('nonExecutivesPercentage', (formData.nonExecutivesPercentage ?? 0).toString());
          if (formData.nonExecutivesMoney !== undefined && formData.nonExecutivesMoney !== null)
            formDataToSend.append('nonExecutivesMoney', formData.nonExecutivesMoney.toString());
          if (formData.nonExecutivesCurrency)
            formDataToSend.append('nonExecutivesCurrency', formData.nonExecutivesCurrency);
          if (formData.nonExecutivesNotes)
            formDataToSend.append('nonExecutivesNotes', formData.nonExecutivesNotes);
        }
        if (selectedLevels.includes("Other")) {
          if (formData.otherPercentage !== undefined)
            formDataToSend.append('otherPercentage', (formData.otherPercentage ?? 0).toString());
          if (formData.otherMoney !== undefined && formData.otherMoney !== null)
            formDataToSend.append('otherMoney', formData.otherMoney.toString());
          if (formData.otherCurrency)
            formDataToSend.append('otherCurrency', formData.otherCurrency);
          if (formData.otherNotes)
            formDataToSend.append('otherNotes', formData.otherNotes);
        }
      }

      if (formData.cLevelPercentage) {
        formDataToSend.append('cLevelPercentage', formData.cLevelPercentage.toString());
      }
      
      if (formData.belowCLevelPercentage) {
        formDataToSend.append('belowCLevelPercentage', formData.belowCLevelPercentage.toString());
      }
      
      // Add all notes fields
      if (formData.fixedPercentageNotes) {
        formDataToSend.append('fixedPercentageNotes', formData.fixedPercentageNotes);
      }
      
      if (formData.cLevelPercentageNotes) {
        formDataToSend.append('cLevelPercentageNotes', formData.cLevelPercentageNotes);
      }
      
      if (formData.belowCLevelPercentageNotes) {
        formDataToSend.append('belowCLevelPercentageNotes', formData.belowCLevelPercentageNotes);
      }
      
      if (formData.fixWithoutAdvanceNotes) {
        formDataToSend.append('fixWithoutAdvanceNotes', formData.fixWithoutAdvanceNotes);
      }
      
      // Add all value fields
      if (formData.fixedPercentageValue) {
        formDataToSend.append('fixedPercentageValue', formData.fixedPercentageValue.toString());
      }
      
      if (formData.fixWithoutAdvanceValue) {
        formDataToSend.append('fixWithoutAdvanceValue', formData.fixWithoutAdvanceValue.toString());
      }
      
      // Add all file uploads
      const fileFields: (keyof typeof uploadedFiles)[] = [
        "crCopy",
        "vatCopy",
        "gstTinDocument",
        "fixedPercentage",
        "fixedPercentageAdvance",
        "variablePercentageCLevel",
        "variablePercentageBelowCLevel",
        "fixWithoutAdvance",
        "seniorLevel",
        "executives",
        "nonExecutives",
        "other",
        "profileImage"
      ];
      
      // Append files to FormData if they exist
      for (const field of fileFields) {
        if (uploadedFiles[field]) {
          formDataToSend.append(field.toString(), uploadedFiles[field]!);
        }
      }
      
      // Log FormData for debugging
      console.log("FormData created with the following fields:");
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      // Send data to backend
      const result = await createClient(formDataToSend);
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
        registrationNumber: "",
        lineOfBusiness: [],
        countryOfBusiness: "",
        referredBy: "",
        linkedInProfile: "",
        linkedInPage: "",
        countryCode: "+966",
        primaryContacts: [],
        clientStage: "Lead",
        clientTeam: "Enterprise",
        clientRm: "",
        clientAge: 0,
        contractNumber: "",
        contractStartDate: null,
        contractEndDate: null,
        contractValue: 0,
        contractType: "",
        cLevelPercentage: 0,
        belowCLevelPercentage: 0,
        fixedPercentageNotes: "",
        fixedPercentageAdvanceNotes: "",
        advanceMoneyCurrency: "USD",
        advanceMoneyAmount: 0,
        cLevelPercentageNotes: "",
        belowCLevelPercentageNotes: "",
        fixWithoutAdvanceNotes: "",
        seniorLevelPercentage: 0,
        executivesPercentage: 0,
        nonExecutivesPercentage: 0,
        otherPercentage: 0,
        seniorLevelNotes: "",
        executivesNotes: "",
        nonExecutivesNotes: "",
        otherNotes: "",
        salesLead: "",
        clientPriority: 1,
        clientSegment: "",
      });
      setEmailInput("");
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
        seniorLevelMoney: null,
        seniorLevelCurrency: null as File | null,
        executivesMoney: null,
        executivesCurrency: null as File | null,
        nonExecutivesMoney: null,
        nonExecutivesCurrency: null as File | null,
        otherMoney: null,
        otherCurrency: null as File | null,
      });
      setNewContact({ firstName: "", lastName: "", gender: "", email: "", phone: "", countryCode: "+966", designation: "", linkedin: "", isPrimary: true });
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
              className={`flex-1 px-2 py-2 text-center text-xs sm:text-sm md:text-base ${currentTab === index ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
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
                          firstName: "",
                          lastName: "",
                          gender: "",
                          email: "",
                          phone: "",
                          countryCode: "+966",
                          designation: "",
                          linkedin: "",
                          isPrimary: true,
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
                            <div className="font-medium">
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contact.gender}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contact.designation}
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
                    "HR Managed Services",
                    "IT & Technology",
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lob-${option}`}
                        checked={formData.lineOfBusiness?.includes(option)}
                        onCheckedChange={(checked) => {
                          setFormData((prev) => {
                            // Ensure lineOfBusiness is always treated as an array
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
                            onChange={handleInputChange("fixWithAdvanceValue")}
                            value={formData.fixWithAdvanceValue || ""}
                            className="h-8 pl-2 pr-6 text-xs"
                          />
                          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                            %
                          </span>
                        </div>
                        <div className="flex items-center space-x-0 border rounded-md overflow-hidden w-48">
                          <Select
                            value={formData.advanceMoneyCurrency || "USD"}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, advanceMoneyCurrency: value }))}
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
                            onChange={handleInputChange("fixWithAdvanceMoney")}
                            value={formData.fixWithAdvanceMoney || ""}
                            className="h-8 text-xs w-28 rounded-l-none border-l-0"
                          />
                        </div>
                        <Input
                          type="text"
                          placeholder="Notes"
                          onChange={handleInputChange("fixedPercentageAdvanceNotes")}
                          value={formData.fixedPercentageAdvanceNotes || ""}
                          className="h-8 text-xs flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base font-semibold">
                      Contract Document
                    </Label>
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
                        <span>Preview</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-2 gap-1"
                        onClick={() => handleDownload(uploadedFiles.fixedPercentageAdvance)}
                        disabled={!uploadedFiles.fixedPercentageAdvance}
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
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
                            onChange={handleInputChange("fixWithoutAdvanceValue")}
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
                          onChange={handleInputChange("fixWithoutAdvanceNotes")}
                          value={formData.fixWithoutAdvanceNotes || ""}
                          className="h-8 text-xs flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base font-semibold">
                      Contract Document
                    </Label>
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
                        <span>Preview</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-2 gap-1"
                        onClick={() => handleDownload(uploadedFiles.fixWithoutAdvance)}
                        disabled={!uploadedFiles.fixWithoutAdvance}
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
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

              {(formData.contractType === "Level Based (Hiring)" || formData.contractType === "Level Based With Advance") && (
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
                            className={`text-xs sm:text-sm font-medium leading-none cursor-pointer ${activeLevel === level
                                ? "font-bold text-primary"
                                : ""
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
                        {selectedLevels.map((level) => {
                          const fields = levelFieldMap[level];
                          if (!fields) return null;

                          const { percentage, notes, money, currency } = fields;
                          
                          return (
                          <div
                            key={level}
                            className={`border-2 shadow-sm rounded-lg p-2 cursor-pointer transition-colors w-full ${activeLevel === level
                                ? "border-primary bg-primary/5"
                                : "border-gray-400"
                              }`}
                            onClick={() => setActiveLevel(level)}
                          >
                            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
                              <h4 className={`font-medium text-xs sm:text-sm w-28 ${activeLevel === level
                                  ? "text-primary"
                                  : ""
                                }`}>{level}</h4>
                              <div className="flex items-center space-x-2 w-full sm:w-auto">
                                <div className="relative w-24">
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                    onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                                    onChange={(e) => {
                                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                                      setFormData(prev => ({
                                        ...prev,
                                        [percentage]: isNaN(value) ? 0 : Math.min(100, Math.max(0, value))
                                      }));
                                    }}
                                    value={(formData as any)[percentage] || ""}
                                    className="h-8 pl-2 pr-6 text-xs"
                                  />
                                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">%</span>
                                </div>

                                {formData.contractType === "Level Based With Advance" && (
                                  <div className="flex items-center space-x-0 border rounded-md overflow-hidden w-48">
                                    <Select
                                      value={(formData as any)[currency] || "USD"}
                                      onValueChange={(value) => setFormData((prev) => ({ ...prev, [currency]: value }))}
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
                                      onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                                      onChange={(e) => {
                                        const value = e.target.value ? parseFloat(e.target.value) : 0;
                                        setFormData(prev => ({
                                          ...prev,
                                          [money]: isNaN(value) ? 0 : value
                                        }));
                                      }}
                                      value={(formData as any)[money] || ""}
                                      className="h-8 text-xs w-28 rounded-l-none border-l-0"
                                    />
                                  </div>
                                )}
                                
                                <Input
                                  type="text"
                                  placeholder="Notes"
                                  onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                                  onChange={(e) => setFormData(prev => ({ ...prev, [notes]: e.target.value }))}
                                  value={(formData as any)[notes] || ""}
                                  className="h-8 text-xs flex-1"
                                />
                              </div>
                            </div>
                          </div>
                        )})}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base font-semibold">
                          Contract Document
                        </Label>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center">
                          <div
                            className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1 w-full"
                            onClick={() =>
                              document.getElementById(`level-${activeLevel.replace(/\s+/g, "")}-input`)?.click()
                            }
                          >
                            <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Upload (PDF, JPEG,JPG, PNG)</p>
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
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(uploadedFiles.crCopy)}
                    disabled={!uploadedFiles.crCopy}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(uploadedFiles.crCopy)}
                    disabled={!uploadedFiles.crCopy}
                  >
                    Download
                  </Button>
                </div>
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
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(uploadedFiles.vatCopy)}
                    disabled={!uploadedFiles.vatCopy}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(uploadedFiles.vatCopy)}
                    disabled={!uploadedFiles.vatCopy}
                  >
                    Download
                  </Button>
                </div>
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
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(uploadedFiles.gstTinDocument)}
                    disabled={!uploadedFiles.gstTinDocument}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(uploadedFiles.gstTinDocument)}
                    disabled={!uploadedFiles.gstTinDocument}
                  >
                    Download
                  </Button>
                </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={newContact.firstName} onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={newContact.lastName} onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => setNewContact({ ...newContact, gender: value })} value={newContact.gender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="contactDesignation" className="text-sm sm:text-base">
                    Designation
                  </Label>
                  <Select
                    value={newContact.designation}
                    onValueChange={(value) => setNewContact((prev) => ({ ...prev, designation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
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
                      firstName: "",
                      lastName: "",
                      gender: "",
                      email: "",
                      phone: "",
                      countryCode: "+966",
                      designation: "",
                      linkedin: "",
                      isPrimary: true,
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