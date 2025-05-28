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
    fixWithoutAdvanceNotes:"",
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
  const [variablePercentageSection, setVariablePercentageSection] = useState<string | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({
    profileImage: null,
    crCopy: null,
    vatCopy: null,
    gstTinDocument: null,
    fixedPercentage: null,
    fixedPercentageAdvance: null,
    variablePercentageCLevel: null,
    variablePercentageBelowCLevel: null,
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
    } else if (field === "website" && value && !value.match(/^https?:\/\//)) {
      value = `${value}`;
    } else if (field === "contractValue" || field === "cLevelPercentage" || field === "belowCLevelPercentage") {
      value = e.target.value ? parseFloat(e.target.value) : 0;
    } else if (
      field === "fixedPercentageNotes" ||
      field === "fixedPercentageAdvanceNotes" ||
      field === "cLevelPercentageNotes" ||
      field === "belowCLevelPercentageNotes"
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

  const handlePreview = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    } else {
      setError("No file uploaded to preview.");
    }
  };

  const handleDownload = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      setError("No file uploaded to download.");
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
    { code: "+93", label: "+93 (Afghanistan)" },
    { code: "+355", label: "+355 (Albania)" },
    { code: "+213", label: "+213 (Algeria)" },
    { code: "+376", label: "+376 (Andorra)" },
    { code: "+244", label: "+244 (Angola)" },
    { code: "+54", label: "+54 (Argentina)" },
    { code: "+374", label: "+374 (Armenia)" },
    { code: "+61", label: "+61 (Australia)" },
    { code: "+43", label: "+43 (Austria)" },
    { code: "+994", label: "+994 (Azerbaijan)" },
    { code: "+973", label: "+973 (Bahrain)" },
    { code: "+880", label: "+880 (Bangladesh)" },
    { code: "+375", label: "+375 (Belarus)" },
    { code: "+32", label: "+32 (Belgium)" },
    { code: "+501", label: "+501 (Belize)" },
    { code: "+229", label: "+229 (Benin)" },
    { code: "+975", label: "+975 (Bhutan)" },
    { code: "+591", label: "+591 (Bolivia)" },
    { code: "+387", label: "+387 (Bosnia)" },
    { code: "+267", label: "+267 (Botswana)" },
    { code: "+55", label: "+55 (Brazil)" },
    { code: "+359", label: "+359 (Bulgaria)" },
    { code: "+226", label: "+226 (Burkina Faso)" },
    { code: "+257", label: "+257 (Burundi)" },
    { code: "+855", label: "+855 (Cambodia)" },
    { code: "+237", label: "+237 (Cameroon)" },
    { code: "+1", label: "+1 (Canada)" },
    { code: "+238", label: "+238 (Cape Verde)" },
    { code: "+236", label: "+236 (Central African)" },
    { code: "+235", label: "+235 (Chad)" },
    { code: "+56", label: "+56 (Chile)" },
    { code: "+86", label: "+86 (China)" },
    { code: "+57", label: "+57 (Colombia)" },
    { code: "+269", label: "+269 (Comoros)" },
    { code: "+506", label: "+506 (Costa Rica)" },
    { code: "+385", label: "+385 (Croatia)" },
    { code: "+53", label: "+53 (Cuba)" },
    { code: "+357", label: "+357 (Cyprus)" },
    { code: "+420", label: "+420 (Czech Republic)" },
    { code: "+243", label: "+243 (Congo)" },
    { code: "+45", label: "+45 (Denmark)" },
    { code: "+253", label: "+253 (Djibouti)" },
    { code: "+670", label: "+670 (East Timor)" },
    { code: "+593", label: "+593 (Ecuador)" },
    { code: "+20", label: "+20 (Egypt)" },
    { code: "+503", label: "+503 (El Salvador)" },
    { code: "+240", label: "+240 (Equatorial Guinea)" },
    { code: "+291", label: "+291 (Eritrea)" },
    { code: "+372", label: "+372 (Estonia)" },
    { code: "+251", label: "+251 (Ethiopia)" },
    { code: "+679", label: "+679 (Fiji)" },
    { code: "+358", label: "+358 (Finland)" },
    { code: "+33", label: "+33 (France)" },
    { code: "+241", label: "+241 (Gabon)" },
    { code: "+220", label: "+220 (Gambia)" },
    { code: "+995", label: "+995 (Georgia)" },
    { code: "+49", label: "+49 (Germany)" },
    { code: "+233", label: "+233 (Ghana)" },
    { code: "+30", label: "+30 (Greece)" },
    { code: "+502", label: "+502 (Guatemala)" },
    { code: "+224", label: "+224 (Guinea)" },
    { code: "+245", label: "+245 (Guinea-Bissau)" },
    { code: "+592", label: "+592 (Guyana)" },
    { code: "+509", label: "+509 (Haiti)" },
    { code: "+504", label: "+504 (Honduras)" },
    { code: "+852", label: "+852 (Hong Kong)" },
    { code: "+36", label: "+36 (Hungary)" },
    { code: "+354", label: "+354 (Iceland)" },
    { code: "+91", label: "+91 (India)" },
    { code: "+62", label: "+62 (Indonesia)" },
    { code: "+98", label: "+98 (Iran)" },
    { code: "+964", label: "+964 (Iraq)" },
    { code: "+353", label: "+353 (Ireland)" },
    { code: "+972", label: "+972 (Israel)" },
    { code: "+39", label: "+39 (Italy)" },
    { code: "+225", label: "+225 (Ivory Coast)" },
    { code: "+876", label: "+876 (Jamaica)" },
    { code: "+81", label: "+81 (Japan)" },
    { code: "+962", label: "+962 (Jordan)" },
    { code: "+7", label: "+7 (Kazakhstan)" },
    { code: "+254", label: "+254 (Kenya)" },
    { code: "+686", label: "+686 (Kiribati)" },
    { code: "+965", label: "+965 (Kuwait)" },
    { code: "+996", label: "+996 (Kyrgyzstan)" },
    { code: "+856", label: "+856 (Laos)" },
    { code: "+371", label: "+371 (Latvia)" },
    { code: "+961", label: "+961 (Lebanon)" },
    { code: "+266", label: "+266 (Lesotho)" },
    { code: "+231", label: "+231 (Liberia)" },
    { code: "+218", label: "+218 (Libya)" },
    { code: "+423", label: "+423 (Liechtenstein)" },
    { code: "+370", label: "+370 (Lithuania)" },
    { code: "+352", label: "+352 (Luxembourg)" },
    { code: "+853", label: "+853 (Macau)" },
    { code: "+389", label: "+389 (Macedonia)" },
    { code: "+261", label: "+261 (Madagascar)" },
    { code: "+265", label: "+265 (Malawi)" },
    { code: "+60", label: "+60 (Malaysia)" },
    { code: "+960", label: "+960 (Maldives)" },
    { code: "+223", label: "+223 (Mali)" },
    { code: "+356", label: "+356 (Malta)" },
    { code: "+692", label: "+692 (Marshall Islands)" },
    { code: "+222", label: "+222 (Mauritania)" },
    { code: "+230", label: "+230 (Mauritius)" },
    { code: "+52", label: "+52 (Mexico)" },
    { code: "+691", label: "+691 (Micronesia)" },
    { code: "+373", label: "+373 (Moldova)" },
    { code: "+377", label: "+377 (Monaco)" },
    { code: "+976", label: "+976 (Mongolia)" },
    { code: "+382", label: "+382 (Montenegro)" },
    { code: "+212", label: "+212 (Morocco)" },
    { code: "+258", label: "+258 (Mozambique)" },
    { code: "+95", label: "+95 (Myanmar)" },
    { code: "+264", label: "+264 (Namibia)" },
    { code: "+674", label: "+674 (Nauru)" },
    { code: "+977", label: "+977 (Nepal)" },
    { code: "+31", label: "+31 (Netherlands)" },
    { code: "+64", label: "+64 (New Zealand)" },
    { code: "+505", label: "+505 (Nicaragua)" },
    { code: "+227", label: "+227 (Niger)" },
    { code: "+234", label: "+234 (Nigeria)" },
    { code: "+47", label: "+47 (Norway)" },
    { code: "+968", label: "+968 (Oman)" },
    { code: "+92", label: "+92 (Pakistan)" },
    { code: "+680", label: "+680 (Palau)" },
    { code: "+507", label: "+507 (Panama)" },
    { code: "+675", label: "+675 (Papua Guinea)" },
    { code: "+595", label: "+595 (Paraguay)" },
    { code: "+51", label: "+51 (Peru)" },
    { code: "+63", label: "+63 (Philippines)" },
    { code: "+48", label: "+48 (Poland)" },
    { code: "+351", label: "+351 (Portugal)" },
    { code: "+974", label: "+974 (Qatar)" },
    { code: "+242", label: "+242 (R T Congo)" },
    { code: "+40", label: "+40 (Romania)" },
    { code: "+7", label: "+7 (Russia)" },
    { code: "+250", label: "+250 (Rwanda)" },
    { code: "+685", label: "+685 (Samoa)" },
    { code: "+378", label: "+378 (San Marino)" },
    { code: "+239", label: "+239 (SOTM)" },
    { code: "+221", label: "+221 (Senegal)" },
    { code: "+381", label: "+381 (Serbia)" },
    { code: "+248", label: "+248 (Seychelles)" },
    { code: "+232", label: "+232 (Sierra Leone)" },
    { code: "+65", label: "+65 (Singapore)" },
    { code: "+421", label: "+421 (Slovakia)" },
    { code: "+386", label: "+386 (Slovenia)" },
    { code: "+677", label: "+677 (Solomon Islands)" },
    { code: "+252", label: "+252 (Somalia)" },
    { code: "+27", label: "+27 (South Africa)" },
    { code: "+82", label: "+82 (South Korea)" },
    { code: "+211", label: "+211 (South Sudan)" },
    { code: "+34", label: "+34 (Spain)" },
    { code: "+94", label: "+94 (Sri Lanka)" },
    { code: "+249", label: "+249 (Sudan)" },
    { code: "+597", label: "+597 (Suriname)" },
    { code: "+268", label: "+268 (Swaziland)" },
    { code: "+46", label: "+46 (Sweden)" },
    { code: "+41", label: "+41 (Switzerland)" },
    { code: "+963", label: "+963 (Syria)" },
    { code: "+886", label: "+886 (Taiwan)" },
    { code: "+992", label: "+992 (Tajikistan)" },
    { code: "+255", label: "+255 (Tanzania)" },
    { code: "+66", label: "+66 (Thailand)" },
    { code: "+228", label: "+228 (Togo)" },
    { code: "+676", label: "+676 (Tonga)" },
    { code: "+216", label: "+216 (Tunisia)" },
    { code: "+90", label: "+90 (Turkey)" },
    { code: "+993", label: "+993 (Turkmenistan)" },
    { code: "+688", label: "+688 (Tuvalu)" },
    { code: "+256", label: "+256 (Uganda)" },
    { code: "+380", label: "+380 (Ukraine)" },
    { code: "+971", label: "+971 (UAE)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+1", label: "+1 (USA)" },
    { code: "+598", label: "+598 (Uruguay)" },
    { code: "+998", label: "+998 (Uzbekistan)" },
    { code: "+678", label: "+678 (Vanuatu)" },
    { code: "+58", label: "+58 (Venezuela)" },
    { code: "+84", label: "+84 (Vietnam)" },
    { code: "+967", label: "+967 (Yemen)" },
    { code: "+260", label: "+260 (Zambia)" },
    { code: "+263", label: "+263 (Zimbabwe)" }
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
        contractNumber: formData.contractNumber || undefined,
        contractStartDate: formData.contractStartDate ? formData.contractStartDate.toISOString().split('T')[0] : undefined,
        contractEndDate: formData.contractEndDate ? formData.contractEndDate.toISOString().split('T')[0] : undefined,
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
        fixWithoutAdvanceNotes:"",
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
      });
      setNewContact({ name: "", email: "", phone: "", countryCode: "+966", position: "", linkedin: "" });
      setCurrentTab(0);
      setIsContactModalOpen(false);
      setVariablePercentageSection(null);
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
            Contact Details
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
                <Label htmlFor="salesLead">Sales Lead *</Label>
                <Select
                  value={formData.salesLead || ""}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, salesLead: value }))}
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
                <Label htmlFor="phoneNumber">Client LandLine Number  </Label>
                <div className="flex space-x-2">
                  <select
                    className="border rounded px-2 py-1"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-20 -mt-5">

                <div className="space-y-2">
                <Label htmlFor="referredBy">Referred By *</Label>
                <Input
                  id="referredBy"
                  value={formData.referredBy}
                  onChange={handleInputChange("referredBy")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractStartDate">Contract Start Date</Label>
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
                    maxDate={formData.contractEndDate || new Date(new Date().setFullYear(new Date().getFullYear() + 10))}
                    showIcon
                    icon="📅"
                    toggleCalendarOnIconClick
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractEndDate">Contract End Date</Label>
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
                <Label htmlFor="contractType">Contract Type</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, contractType: value }));
                    setVariablePercentageSection(null);
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
                  <Label htmlFor="fixedPercentageNotes">Fixed Percentage Notes</Label>
                  <Textarea
                    id="fixedPercentageNotes"
                    value={formData.fixedPercentageNotes || ""}
                    onChange={handleInputChange("fixedPercentageNotes")}
                    placeholder="Enter notes for Fixed Percentage"
                    rows={3}
                  />
                  <Label>Fixed Percentage Document</Label>
                  <div className="flex space-x-2 items-center">
                    <div
                      className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1"
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
                    <p className="text-sm mt-2">Selected file: {uploadedFiles.fixedPercentage.name}</p>
                  )}
                </div>
              )}

              {formData.contractType === "Fix with Advance" && (
                <div className="space-y-2">
                  <Label htmlFor="fixedPercentageAdvanceNotes">Fix with Advance Notes</Label>
                  <Textarea
                    id="fixedPercentageAdvanceNotes"
                    value={formData.fixedPercentageAdvanceNotes || ""}
                    onChange={handleInputChange("fixedPercentageAdvanceNotes")}
                    placeholder="Enter notes for Fix with Advance"
                    rows={3}
                  />
                  <Label>Fix with Advance Document</Label>
                  <div className="flex space-x-2 items-center">
                    <div
                      className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1"
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
                    <p className="text-sm mt-2">Selected file: {uploadedFiles.fixedPercentageAdvance.name}</p>
                  )}
                </div>
              )}

              {formData.contractType === "Fix without Advance" && (
                <div className="space-y-2">
                  <Label>Fix without Advance Document</Label>
                  <div className="flex space-x-2 items-center">
                    <div
                      className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1"
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
                    <p className="text-sm mt-2">Selected file: {uploadedFiles.fixWithoutAdvance.name}</p>
                  )}
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="fixWithoutAdvanceNotes">Notes</Label>
                    <Textarea
                      id="fixWithoutAdvanceNotes"
                      value={formData.fixWithoutAdvanceNotes || ""}
                      onChange={handleInputChange("fixWithoutAdvanceNotes")}
                      placeholder="Enter notes for Fix without Advance"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {formData.contractType === "Level Based (Hiring)" && (
                <div className="space-y-4 col-span-2 border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Level Type</Label>
                      <Select
                        onValueChange={(value) => setVariablePercentageSection(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Senior Level">Senior Level</SelectItem>
                          <SelectItem value="Executives">Executives</SelectItem>
                          <SelectItem value="Non-Executives">Non-Executives</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {variablePercentageSection && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[variablePercentageSection].map((level) => (
                          <div key={level} className="space-y-2 border rounded-lg p-4">
                            <h4 className="font-medium">{level}</h4>
                            <div className="space-y-2">
                              <Label>Document</Label>
                              <div className="flex space-x-2 items-center">
                                <div
                                  className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1"
                                  onClick={() => document.getElementById(`${level.toLowerCase().replace(' ', '')}Input`)?.click()}
                                >
                                  <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                  <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
                                </div>
                                <input
                                  id={`${level.toLowerCase().replace(' ', '')}Input`}
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={handleFileChange(`${variablePercentageSection.toLowerCase().replace(' ', '')}${level.replace(' ', '')}`)}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePreview(uploadedFiles[`${variablePercentageSection.toLowerCase().replace(' ', '')}${level.replace(' ', '')}`])}
                                  disabled={!uploadedFiles[`${variablePercentageSection.toLowerCase().replace(' ', '')}${level.replace(' ', '')}`]}
                                >
                                  Preview
                                </Button>
                              </div>
                              {uploadedFiles[`${variablePercentageSection.toLowerCase().replace(' ', '')}${level.replace(' ', '')}`] && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {uploadedFiles[`${variablePercentageSection.toLowerCase().replace(' ', '')}${level.replace(' ', '')}`]?.name}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Notes</Label>
                              <Textarea
                                placeholder={`Enter notes for ${level}`}
                                rows={2}
                                onChange={(e) => {
                                  const notesField = `${variablePercentageSection.toLowerCase().replace(' ', '')}${level.replace(' ', '')}Notes`;
                                  setFormData(prev => ({
                                    ...prev,
                                    [notesField]: e.target.value
                                  }));
                                }}
                                value={formData[`${variablePercentageSection.toLowerCase().replace(' ', '')}${level.replace(' ', '')}Notes` as keyof ClientForm] as string || ''}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {formData.contractType === "Variable Percentage" && (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      variant={variablePercentageSection === "C-Level" ? "default" : "outline"}
                      onClick={() => setVariablePercentageSection("C-Level")}
                    >
                      C-Level %
                    </Button>
                    <Button
                      variant={variablePercentageSection === "Below C-Level" ? "default" : "outline"}
                      onClick={() => setVariablePercentageSection("Below C-Level")}
                    >
                      Below C-Level %
                    </Button>
                  </div>

                  {variablePercentageSection === "C-Level" && (
                    <div className="space-y-2">
                      <Label htmlFor="cLevelPercentage">C-Level %</Label>
                      <Input
                        id="cLevelPercentage"
                        type="number"
                        value={formData.cLevelPercentage || ""}
                        onChange={handleInputChange("cLevelPercentage")}
                        placeholder="Enter C-Level percentage"
                      />
                      <Label htmlFor="cLevelPercentageNotes">C-Level Notes</Label>
                      <Textarea
                        id="cLevelPercentageNotes"
                        value={formData.cLevelPercentageNotes || ""}
                        onChange={handleInputChange("cLevelPercentageNotes")}
                        placeholder="Enter notes for C-Level Percentage"
                        rows={3}
                      />
                      <Label>C-Level Document</Label>
                      <div className="flex space-x-2 items-center">
                        <div
                          className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1"
                          onClick={() => document.getElementById("variablePercentageCLevelInput")?.click()}
                        >
                          <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
                        </div>
                        <input
                          id="variablePercentageCLevelInput"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={handleFileChange("variablePercentageCLevel")}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(uploadedFiles.variablePercentageCLevel)}
                          disabled={!uploadedFiles.variablePercentageCLevel}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(uploadedFiles.variablePercentageCLevel)}
                          disabled={!uploadedFiles.variablePercentageCLevel}
                        >
                          Download
                        </Button>
                      </div>
                      {uploadedFiles.variablePercentageCLevel && (
                        <p className="text-sm mt-2">Selected file: {uploadedFiles.variablePercentageCLevel.name}</p>
                      )}
                    </div>
                  )}

                  {variablePercentageSection === "Below C-Level" && (
                    <div className="space-y-2">
                      <Label htmlFor="belowCLevelPercentage">Below C-Level %</Label>
                      <Input
                        id="belowCLevelPercentage"
                        type="number"
                        value={formData.belowCLevelPercentage || ""}
                        onChange={handleInputChange("belowCLevelPercentage")}
                        placeholder="Enter Below C-Level percentage"
                      />
                      <Label htmlFor="belowCLevelPercentageNotes">Below C-Level Notes</Label>
                      <Textarea
                        id="belowCLevelPercentageNotes"
                        value={formData.belowCLevelPercentageNotes || ""}
                        onChange={handleInputChange("belowCLevelPercentageNotes")}
                        placeholder="Enter notes for Below C-Level Percentage"
                        rows={3}
                      />
                      <Label>Below C-Level Document</Label>
                      <div className="flex space-x-2 items-center">
                        <div
                          className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-muted/50 flex-1"
                          onClick={() => document.getElementById("variablePercentageBelowCLevelInput")?.click()}
                        >
                          <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Upload (PDF, JPEG, PNG)</p>
                        </div>
                        <input
                          id="variablePercentageBelowCLevelInput"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={handleFileChange("variablePercentageBelowCLevel")}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(uploadedFiles.variablePercentageBelowCLevel)}
                          disabled={!uploadedFiles.variablePercentageBelowCLevel}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(uploadedFiles.variablePercentageBelowCLevel)}
                          disabled={!uploadedFiles.variablePercentageBelowCLevel}
                        >
                          Download
                        </Button>
                      </div>
                      {uploadedFiles.variablePercentageBelowCLevel && (
                        <p className="text-sm mt-2">Selected file: {uploadedFiles.variablePercentageBelowCLevel.name}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
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
                  maja                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
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