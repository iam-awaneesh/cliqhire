// src/components/create-client-modal/index.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ClientDetailsForm } from "./client-details-form";
import { PrimaryContactForm } from "./primary-contact-form";
import { ContractDetailsForm } from "./contract-details-form";
import { ProposalForm } from "./proposal-form";
import { createClient } from "./api";
import { ClientForm, CreateClientModalProps, LocationSuggestion, PrimaryContact, LevelType } from "./types";

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
  });

  const [emailInput, setEmailInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, level: LevelType) => {
    if (e.target.files) {
      setUploadedFiles((prev) => ({ ...prev, [level]: e.target.files![0] }));
    }
  };

  const handleCheckboxChange = (option: string) => {
    setFormData((prev) => {
      const newOptions = prev.proposalOptions?.includes(option)
        ? prev.proposalOptions.filter((o) => o !== option)
        : [...(prev.proposalOptions || []), option];
      return { ...prev, proposalOptions: newOptions };
    });
  };

  const handleAddEmail = () => {
    if (emailInput && !formData.emails.includes(emailInput)) {
      setFormData((prev) => ({ ...prev, emails: [...prev.emails, emailInput] }));
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (index: number) => {
    setFormData((prev) => ({ ...prev, emails: prev.emails.filter((_, i) => i !== index) }));
  };

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, location: value }));
    if (value.length > 2) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
        const data = await response.json();
        setLocationSuggestions(data);
        setShowLocationSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch location suggestions", error);
      }
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setFormData((prev) => ({ ...prev, location: suggestion.display_name, googleMapsLink: `https://www.google.com/maps?q=${suggestion.lat},${suggestion.lon}` }));
    setShowLocationSuggestions(false);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddContact = () => {
    setFormData((prev) => ({ ...prev, primaryContacts: [...prev.primaryContacts, newContact] }));
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
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value as string);
        }
      }
    });
    Object.entries(uploadedFiles).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    try {
      await createClient(data);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTab = () => {
    switch (currentTab) {
      case 0:
        return <ClientDetailsForm 
          formData={formData} 
          handleChange={handleChange} 
          handleSelectChange={handleSelectChange} 
          handleLocationChange={handleLocationChange} 
          handleSuggestionClick={handleSuggestionClick} 
          locationSuggestions={locationSuggestions} 
          showLocationSuggestions={showLocationSuggestions} 
          emailInput={emailInput} 
          setEmailInput={setEmailInput} 
          handleAddEmail={handleAddEmail} 
          handleRemoveEmail={handleRemoveEmail} 
        />;
      case 1:
        return <PrimaryContactForm 
          newContact={newContact} 
          handleContactChange={handleContactChange} 
          handleAddContact={handleAddContact} 
          primaryContacts={formData.primaryContacts} 
        />;
      case 2:
        return <ContractDetailsForm 
          formData={formData} 
          handleChange={handleChange} 
          handleDateChange={handleDateChange} 
        />;
      case 3:
        return <ProposalForm 
          formData={formData} 
          handleCheckboxChange={handleCheckboxChange} 
          handleFileChange={handleFileChange} 
          handleChange={handleChange} 
          uploadedFiles={uploadedFiles} 
        />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create Client</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={() => setCurrentTab(0)} variant={currentTab === 0 ? "default" : "outline"}>Client Details</Button>
          <Button onClick={() => setCurrentTab(1)} variant={currentTab === 1 ? "default" : "outline"}>Primary Contact</Button>
          <Button onClick={() => setCurrentTab(2)} variant={currentTab === 2 ? "default" : "outline"}>Contract Details</Button>
          <Button onClick={() => setCurrentTab(3)} variant={currentTab === 3 ? "default" : "outline"}>Proposal</Button>
        </div>
        {renderTab()}
        {error && <p className="text-red-500">{error}</p>}
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Create Client"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
