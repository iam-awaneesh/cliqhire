"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClientInformationTab } from "./ClientInformationTab";
import { ContactDetailsTab } from "./ContactDetailsTab";
import { ContractInformationTab } from "./ContractInformationTab";
import { DocumentsTab } from "@/components/create-client-modal/DocumentsTab";
import { ContactModal } from "@/components/create-client-modal/ContactModal";
import {
  ClientForm,
  PrimaryContact,
  LocationSuggestion,
} from "@/components/create-client-modal/type";
import { createClient } from "./api";
import { clientSubStages } from "./constants";
import axios from "axios";
import { useRouter } from "next/navigation";

export function CreateClientModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
    clientStage: undefined,
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
    advanceMoneyCurrency: "SAR",
    seniorLevelCurrency: "SAR",
    executivesCurrency: "SAR",
    nonExecutivesCurrency: "SAR",
    otherCurrency: "SAR",
    clientSource: undefined,
    proposalOptions: [],
    technicalProposalNotes: "",
    financialProposalNotes: "",
    businessContracts: {},
  });

  const [emailInput, setEmailInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    general?: string;
    name?: string;
    phoneNumber?: string;
    address?: string;
    primaryContacts?: string;
    website?: string;
    linkedInProfile?: string;
    googleMapsLink?: string;
    primaryContactEmails?: string;
  }>({});
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
    technicalProposal: null,
    financialProposal: null,
  });

  const technicalProposalInputRef = useRef<HTMLInputElement>(null);
  const financialProposalInputRef = useRef<HTMLInputElement>(null);
  const technicalProposalOptionInputRef = useRef<HTMLInputElement>(null);
  const financialProposalOptionInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const [savedContracts, setSavedContracts] = useState<{ [business: string]: boolean }>({});
  const contractsSaved = Object.values(savedContracts).some(Boolean);

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
            formData.location,
          )}`,
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
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${suggestion.lat}&lon=${suggestion.lon}`,
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
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange =
    (field: keyof ClientForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      if (
        field === "website" ||
        field === "linkedInProfile" ||
        field === "googleMapsLink" ||
        Object.keys(errors).length > 0
      ) {
        setErrors({});
      }
    };

  const handleUrlBlur = (field: keyof ClientForm) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !validateUrl(value)) {
      setErrors({ [field]: `Invalid URL for ${field}` });
    } else {
      setErrors({});
    }
  };

  const handleEmailBlur = () => {
    const emails = emailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    const invalidEmails = validateEmails(emails);
    if (invalidEmails.length > 0) {
      setErrors({ primaryContactEmails: `Invalid email(s): ${invalidEmails.join(", ")}` });
    } else {
      setFormData((prev) => ({
        ...prev,
        emails,
      }));
      setErrors({});
    }
  };

  const handleFileChange =
    (field: keyof typeof uploadedFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          setErrors({ general: `File ${file.name} is too large. Maximum size is 5MB.` });
          return;
        }
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
          setErrors({
            general: `Invalid file type for ${file.name}. Allowed types are: JPEG, PNG, PDF`,
          });
          return;
        }
        setUploadedFiles((prev) => ({
          ...prev,
          [field]: file,
        }));
        setErrors({});
      }
    };

  const handlePreview = (file: File | string | null) => {
    if (!file) {
      setErrors({ general: "No file uploaded to preview." });
      return;
    }

    if (typeof file === "string") {
      const fileUrl = file.startsWith("http") ? file : `https://aems-backend.onrender.com/${file}`;
      window.open(fileUrl, "_blank");
    } else if (file instanceof File) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, "_blank");
    } else {
      setErrors({ general: "Unsupported file type for preview." });
    }
  };

  const handleDownload = (file: File | null) => {
    if (!file) {
      setErrors({ general: "No file uploaded to download." });
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

  const handleAddContact = (contact: PrimaryContact) => {
    if (!contact.firstName || contact.firstName.trim() === "") {
      setErrors({ general: "Contact first name is required" });
      return;
    }
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setErrors({ general: `Invalid contact email: ${contact.email}` });
      return;
    }
    if (!contact.phone) {
      setErrors({ general: "Contact phone number is required" });
      return;
    }
    if (contact.linkedin && !validateUrl(contact.linkedin)) {
      setErrors({ general: "Invalid LinkedIn URL" });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      primaryContacts: [...prev.primaryContacts, { ...contact }],
    }));
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
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newErrors: typeof errors = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Client name is required";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (formData.primaryContacts.length === 0) {
      newErrors.primaryContacts = "At least one primary contact is required";
    }
    const invalidContactEmails = formData.primaryContacts.filter(
      (contact: PrimaryContact) =>
        contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email),
    );
    if (invalidContactEmails.length > 0) {
      newErrors.primaryContactEmails = `Invalid contact email(s): ${invalidContactEmails
        .map((c) => c.email)
        .join(", ")}`;
    }
    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = "Invalid website URL";
    }
    if (formData.linkedInProfile && !validateUrl(formData.linkedInProfile)) {
      newErrors.linkedInProfile = "Invalid LinkedIn profile URL";
    }
    if (formData.googleMapsLink && !validateUrl(formData.googleMapsLink)) {
      newErrors.googleMapsLink = "Invalid Google Maps link";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      // Always create the payload, regardless of selectedLevels
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      if (formData.emails && formData.emails.length > 0) {
        formDataToSend.append("emails", JSON.stringify(formData.emails));
      }
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      if (formData.website) {
        formDataToSend.append("website", formData.website);
      }
      formDataToSend.append("industry", formData.industry || "");
      formDataToSend.append("address", formData.address || "");
      if (formData.googleMapsLink) {
        formDataToSend.append("googleMapsLink", formData.googleMapsLink);
      }
      if (Array.isArray(formData.lineOfBusiness)) {
        formDataToSend.append("lineOfBusiness", JSON.stringify(formData.lineOfBusiness));
      } else if (typeof formData.lineOfBusiness === "string") {
        const lineOfBusinessArray = formData.lineOfBusiness.split(",").filter(Boolean);
        formDataToSend.append("lineOfBusiness", JSON.stringify(lineOfBusinessArray));
      }
      if (formData.countryOfBusiness) {
        formDataToSend.append("countryOfBusiness", formData.countryOfBusiness);
      }
      formDataToSend.append("referredBy", formData.referredBy || "");
      if (formData.linkedInProfile) {
        formDataToSend.append("linkedInProfile", formData.linkedInProfile);
      }
      formDataToSend.append("countryCode", formData.countryCode || "+966");
      if (formData.primaryContacts && formData.primaryContacts.length > 0) {
        formDataToSend.append(
          "primaryContacts",
          JSON.stringify(
            formData.primaryContacts.map((contact) => ({
              name: `${contact.firstName || ""} ${contact.lastName || ""}`.trim(),
              gender: contact.gender,
              email: contact.email,
              phone: contact.phone,
              countryCode: contact.countryCode,
              designation: contact.designation,
              linkedin: contact.linkedin || "",
              isPrimary: contact.isPrimary,
            })),
          ),
        );
      }
      formDataToSend.append("clientTeam", formData.clientTeam || "Enterprise");
      if (clientSubStages.includes(formData.clientStage!)) {
        formDataToSend.append("clientStage", "Engaged");
        formDataToSend.append("clientStageStatus", formData.clientStage || "");
      } else {
        formDataToSend.append("clientStage", formData.clientStage || "");
      }
      formDataToSend.append("salesLead", formData.salesLead ?? "");
      if (formData.clientPriority) {
        formDataToSend.append("clientPriority", formData.clientPriority.toString());
      }
      if (formData.clientSegment) {
        formDataToSend.append("clientSegment", formData.clientSegment);
      }
      if (formData.clientSource) {
        formDataToSend.append("clientSource", formData.clientSource);
      }
      if (formData.technicalProposalNotes) {
        formDataToSend.append("technicalProposalNotes", formData.technicalProposalNotes);
      }
      if (formData.financialProposalNotes) {
        formDataToSend.append("financialProposalNotes", formData.financialProposalNotes);
      }
      if (formData.contractStartDate) {
        const startDate = new Date(formData.contractStartDate);
        const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
        formDataToSend.append("contractStartDate", startDateStr);
      }
      if (formData.contractEndDate) {
        const endDate = new Date(formData.contractEndDate);
        const endDateStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
        formDataToSend.append("contractEndDate", endDateStr);
      }
      if (formData.contractType) {
        formDataToSend.append("contractType", formData.contractType);
      }
      // Only add level-based fields if selectedLevels has values
      if (selectedLevels?.length) {
        const labelType: Record<string, string> = {};
        const fieldMap: Record<string, string> = {
          "Senior Level": "seniorLevel",
          Executives: "executives",
          "Non-Executives": "nonExecutives",
        };
        selectedLevels.forEach((level) => {
          const fieldName = fieldMap[level] || "other";
          if (!labelType[fieldName]) {
            labelType[fieldName] = level;
          }
        });
        if (formData.contractType === "Level Based (Hiring)") {
          if (selectedLevels.includes("Senior Level")) {
            formDataToSend.append(
              "seniorLevelPercentage",
              (formData.seniorLevelPercentage ?? 0).toString(),
            );
          }
          if (selectedLevels.includes("Executives")) {
            formDataToSend.append(
              "executivesPercentage",
              (formData.executivesPercentage ?? 0).toString(),
            );
          }
          if (selectedLevels.includes("Non-Executives")) {
            formDataToSend.append(
              "nonExecutivesPercentage",
              (formData.nonExecutivesPercentage ?? 0).toString(),
            );
          }
          if (selectedLevels.includes("Other")) {
            formDataToSend.append("otherPercentage", (formData.otherPercentage ?? 0).toString());
          }
          if (selectedLevels.includes("Senior Level") && formData.seniorLevelNotes) {
            formDataToSend.append("seniorLevelNotes", formData.seniorLevelNotes);
          }
          if (selectedLevels.includes("Executives") && formData.executivesNotes) {
            formDataToSend.append("executivesNotes", formData.executivesNotes);
          }
          if (selectedLevels.includes("Non-Executives") && formData.nonExecutivesNotes) {
            formDataToSend.append("nonExecutivesNotes", formData.nonExecutivesNotes);
          }
          if (selectedLevels.includes("Other") && formData.otherNotes) {
            formDataToSend.append("otherNotes", formData.otherNotes);
          }
        }
        if (formData.contractType === "Level Based With Advance") {
          if (selectedLevels.includes("Senior Level")) {
            if (formData.seniorLevelPercentage !== undefined)
              formDataToSend.append(
                "seniorLevelPercentage",
                (formData.seniorLevelPercentage ?? 0).toString(),
              );
            if (formData.seniorLevelMoney !== undefined && formData.seniorLevelMoney !== null)
              formDataToSend.append("seniorLevelMoney", formData.seniorLevelMoney.toString());
            if (formData.seniorLevelCurrency)
              formDataToSend.append("seniorLevelCurrency", formData.seniorLevelCurrency);
            if (formData.seniorLevelNotes)
              formDataToSend.append("seniorLevelNotes", formData.seniorLevelNotes);
          }
          if (selectedLevels.includes("Executives")) {
            if (formData.executivesPercentage !== undefined)
              formDataToSend.append(
                "executivesPercentage",
                (formData.executivesPercentage ?? 0).toString(),
              );
            if (formData.executivesMoney !== undefined && formData.executivesMoney !== null)
              formDataToSend.append("executivesMoney", formData.executivesMoney.toString());
            if (formData.executivesCurrency)
              formDataToSend.append("executivesCurrency", formData.executivesCurrency);
            if (formData.executivesNotes)
              formDataToSend.append("executivesNotes", formData.executivesNotes);
          }
          if (selectedLevels.includes("Non-Executives")) {
            if (formData.nonExecutivesPercentage !== undefined)
              formDataToSend.append(
                "nonExecutivesPercentage",
                (formData.nonExecutivesPercentage ?? 0).toString(),
              );
            if (formData.nonExecutivesMoney !== undefined && formData.nonExecutivesMoney !== null)
              formDataToSend.append("nonExecutivesMoney", formData.nonExecutivesMoney.toString());
            if (formData.nonExecutivesCurrency)
              formDataToSend.append("nonExecutivesCurrency", formData.nonExecutivesCurrency);
            if (formData.nonExecutivesNotes)
              formDataToSend.append("nonExecutivesNotes", formData.nonExecutivesNotes);
          }
          if (selectedLevels.includes("Other")) {
            if (formData.otherPercentage !== undefined)
              formDataToSend.append("otherPercentage", (formData.otherPercentage ?? 0).toString());
            if (formData.otherMoney !== undefined && formData.otherMoney !== null)
              formDataToSend.append("otherMoney", formData.otherMoney.toString());
            if (formData.otherCurrency)
              formDataToSend.append("otherCurrency", formData.otherCurrency);
            if (formData.otherNotes) formDataToSend.append("otherNotes", formData.otherNotes);
          }
        }
      }
      if (formData.contractType === "Fix with Advance") {
        if (
          formData.fixWithoutAdvanceValue !== undefined &&
          formData.fixWithoutAdvanceValue !== null
        )
          formDataToSend.append(
            "fixWithoutAdvanceValue",
            formData.fixWithoutAdvanceValue.toString(),
          );
        if (
          formData.fixWithoutAdvance !== undefined &&
          formData.fixWithoutAdvance !== null &&
          formData.fixWithoutAdvance !== ""
        )
          formDataToSend.append("fixWithoutAdvance", formData.fixWithoutAdvance.toString());
        if (formData.fixedPercentageAdvanceNotes)
          formDataToSend.append(
            "fixedPercentageAdvanceNotes",
            formData.fixedPercentageAdvanceNotes,
          );
      }
      if (formData.cLevelPercentage) {
        formDataToSend.append("cLevelPercentage", formData.cLevelPercentage.toString());
      }
      if (formData.belowCLevelPercentage) {
        formDataToSend.append("belowCLevelPercentage", formData.belowCLevelPercentage.toString());
      }
      if (formData.fixedPercentageNotes) {
        formDataToSend.append("fixedPercentageNotes", formData.fixedPercentageNotes);
      }
      if (formData.cLevelPercentageNotes) {
        formDataToSend.append("cLevelPercentageNotes", formData.cLevelPercentageNotes);
      }
      if (formData.fixWithoutAdvanceNotes) {
        formDataToSend.append("fixWithoutAdvanceNotes", formData.fixWithoutAdvanceNotes);
      }
      if (formData.fixedPercentage) {
        formDataToSend.append("fixedPercentage", formData.fixedPercentage.toString());
      }
      if (formData.fixWithoutAdvanceValue) {
        formDataToSend.append("fixWithoutAdvanceValue", formData.fixWithoutAdvanceValue.toString());
      }
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
        "profileImage",
        "technicalProposal",
        "financialProposal",
      ];
      for (const field of fileFields) {
        if (uploadedFiles[field]) {
          formDataToSend.append(field.toString(), uploadedFiles[field]!);
        }
      }
      // Debug log: print all key-value pairs in FormData before sending
      for (let pair of formDataToSend.entries()) {
        console.log(`[CreateClientModal] Payload: ${pair[0]}:`, pair[1]);
      }
      const payload = { ...formData };
      const result = await createClient(formDataToSend);
      if (result && result.success && result.data && result.data.data && result.data.data._id) {
        router.push(`/clients/${result.data.data._id}`);
        return;
      }

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
        clientStage: undefined,
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
        clientSource: undefined,
        proposalOptions: [],
        businessContracts: {},
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
        technicalProposal: null,
        financialProposal: null,
      });
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
      setCurrentTab(0);
      setIsContactModalOpen(false);
      setSelectedLevels([]);
      setActiveLevel(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating client:", error);
      setErrors({ general: "An error occurred while creating the client. Please try again." });
      setLoading(false);
    }
  };

  const handleNext = () => {
    const newTab = Math.min(currentTab + 1, 3);
    setCurrentTab(newTab);
  };

  const handlePrevious = () => {
    setCurrentTab((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] p-4 sm:p-6 md:p-8 flex flex-col">
        <div className="sticky top-0 z-20 bg-white pb-2">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Create Client</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Fill in the client details below. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap border-b mt-1">
            {[
              "Client General Info",
              "Client Contact Info",
              "Contract Information",
              "Documents",
            ].map((tab, index) => (
              <button
                key={tab}
                className={`flex-1 px-2 py-2 text-center text-xs sm:text-sm md:text-base ${currentTab === index ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                onClick={() => setCurrentTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-[400px] -mt-4 overflow-y-auto pb-32">
          <div className="pr-2">
            <form onSubmit={handleSubmit}>
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                  <div className="font-semibold mb-1">
                    Please check form and fill the missing field.
                  </div>
                </div>
              )}
              {currentTab === 0 && (
                <ClientInformationTab
                  formData={formData}
                  setFormData={setFormData}
                  emailInput={emailInput}
                  handleInputChange={handleInputChange}
                  handleUrlBlur={handleUrlBlur}
                  handleEmailBlur={handleEmailBlur}
                  locationSuggestions={locationSuggestions}
                  showLocationSuggestions={showLocationSuggestions}
                  handleLocationSelect={handleLocationSelect}
                  errors={errors}
                />
              )}
              {currentTab === 1 && (
                <ContactDetailsTab
                  formData={formData}
                  setFormData={setFormData}
                  setIsContactModalOpen={setIsContactModalOpen}
                  handleInputChange={handleInputChange}
                  uploadedFiles={uploadedFiles}
                  handleFileChange={handleFileChange}
                  handlePreview={handlePreview}
                  handleDownload={handleDownload}
                  technicalProposalOptionInputRef={technicalProposalOptionInputRef}
                  financialProposalOptionInputRef={financialProposalOptionInputRef}
                  errors={errors}
                />
              )}
              {currentTab === 2 && (
                <ContractInformationTab
                  formData={formData}
                  setFormData={setFormData}
                  selectedLevels={selectedLevels}
                  setSelectedLevels={setSelectedLevels}
                  activeLevel={activeLevel}
                  setActiveLevel={setActiveLevel}
                  uploadedFiles={uploadedFiles}
                  handleFileChange={handleFileChange}
                  handlePreview={handlePreview}
                  handleDownload={handleDownload}
                  handleInputChange={handleInputChange}
                  technicalProposalOptionInputRef={technicalProposalOptionInputRef}
                  financialProposalOptionInputRef={financialProposalOptionInputRef}
                  setBusinessContracts={(business, data) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessContracts: { ...prev.businessContracts, [business]: data },
                    }))
                  }
                  savedContracts={savedContracts}
                  setSavedContracts={setSavedContracts}
                />
              )}
              {currentTab === 3 && (
                <DocumentsTab
                  uploadedFiles={uploadedFiles}
                  handleFileChange={handleFileChange}
                  handlePreview={handlePreview}
                  handleDownload={handleDownload}
                />
              )}

              {/* Move DialogFooter and buttons inside the form */}
              <div className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-white z-50 border-t p-4 rounded-b-xl shadow-lg">
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
                        <>
                          {console.log(
                            "[CreateClientModal] savedContracts:",
                            savedContracts,
                            "contractsSaved:",
                            contractsSaved,
                          )}
                          {console.log(
                            "[CreateClientModal] Next button render. currentTab:",
                            currentTab,
                            "disabled:",
                            loading,
                          )}
                          <Button
                            type="button"
                            onClick={handleNext}
                            disabled={loading}
                            className="w-full sm:w-auto"
                          >
                            Next
                          </Button>
                        </>
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
              </div>
            </form>
          </div>
        </div>

        {isContactModalOpen && (
          <ContactModal
            isOpen={isContactModalOpen}
            onOpenChange={setIsContactModalOpen}
            newContact={newContact}
            setNewContact={setNewContact}
            handleAddContact={handleAddContact}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
