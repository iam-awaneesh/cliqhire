"use client"

import { SectionHeader } from "./section-header";
import { DetailRow } from "./detail-row";
import { TeamMember } from "./team-member";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FileUploadRow } from "./file-upload-row";
import { AddTeamMemberModal } from "../modals/add-team-member-modal";
import { AddContactModal } from "../modals/add-contact-modal";
import { EditDescriptionModal } from "../modals/edit-description-modal";
import { Plus, Pencil } from "lucide-react";
import { getClientById } from "@/services/clientService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as Flags from 'country-flag-icons/react/3x2';
import React from "react";

// Currency options with flags
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: 'US' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: 'EU' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: 'GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: 'JP' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: 'AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: 'CA' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: 'CH' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: 'CN' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: 'IN' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: 'SA' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: 'AE' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', flag: 'KW' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', flag: 'BH' },
  { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', flag: 'QA' },
  { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial', flag: 'OM' }
];

interface SummaryContentProps {
  clientId: string;
}

interface ClientDetails {
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  address?: string;
  incorporationDate?: string;
  countryOfRegistration?: string;
  registrationNumber?: string;
  countryOfBusiness?: string;
  description?: string;
  referredBy?: string;
  linkedInProfile?: string;
  clientLinkedInPage?: string;
  gstTinDocument?: string;
  clientProfileImage?: string;
  crCopy?: string;
  vatCopy?: string;
  phoneNumber?: string;
  googleMapsLink?: string;
  // Contract Information
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  feeAmount?: string;
  feeCurrency?: string;
  agreement?: string;
  referralPercentage?: string;
  lineOfBusiness?: string;
}

interface TeamMemberType {
  name: string;
  role: string;
  email: string;
  isActive?: boolean;
}

interface ContactType {
  name: string;
  email: string;
  phone: string;
  position: string;
}

export function SummaryContent({ clientId }: SummaryContentProps) {
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    name: "",
    contractStartDate: null,
    contractEndDate: null,
    feeCurrency: "USD"
  });
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([
    { name: "Shaswat singh", role: "Admin", email: "shaswat@example.com", isActive: true },
  ]);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await getClientById(clientId);
        setClientDetails(response);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    fetchClientData();
  }, [clientId]);

  const updateClientDetails = async (fieldName: string, value: string) => {
    try {
      const response = await fetch(`https://aems-backend.onrender.com/api/clients/${clientId}`, {
        method: "PATCH",
        body: JSON.stringify({[fieldName]: value }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to update client details")
      }

      // Update local state
      setClientDetails(prev => ({
        ...prev,
        [fieldName]: value
      }));
    } catch (error) {
      console.error(error)
    }
  }
  
  const handleUpdateField = (field: keyof ClientDetails) => (value: string) => {
    updateClientDetails(field, value)
  }

  const handleFileUpload = (field: keyof ClientDetails) => (file: File) => {
    setClientDetails((prev) => ({ ...prev, [field]: file }));
  };

  const handleAddTeamMember = (member: TeamMemberType) => {
    setTeamMembers((prev) => [...prev, { ...member, isActive: true }]);
  };

  const handleAddContact = (contact: ContactType) => {
    setContacts((prev) => [...prev, contact]);
  };

  const handleUpdateDescription = (description: string) => {
    setClientDetails((prev) => ({ ...prev, description }));
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-4">
      {/* Left Column - Client Details */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <SectionHeader title="Details" />
          <div className="space-y-3 mt-4">
            <FileUploadRow
              label="Client Profile Image"
              accept="image/*"
              onFileSelect={handleFileUpload("clientProfileImage")}
              currentFileName={clientDetails.clientProfileImage}
            />
            <DetailRow
              label="Client Name"
              value={clientDetails.name}
              onUpdate={handleUpdateField("name")}
            />
            <DetailRow
              label="Client Industry"
              value={clientDetails.industry}
              onUpdate={handleUpdateField("industry")}
            />
            <DetailRow
              label="Client Website"
              value={clientDetails.website}
              onUpdate={handleUpdateField("website")}
            />
            <DetailRow
              label="Phone Number"
              value={clientDetails.phoneNumber}
              onUpdate={handleUpdateField("phoneNumber")}
            />
            <DetailRow
              label="Google Maps Link"
              value={clientDetails.googleMapsLink}
              onUpdate={handleUpdateField("googleMapsLink")}
            />
            <FileUploadRow
              label="VAT Copy"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onFileSelect={handleFileUpload("vatCopy")}
              currentFileName={clientDetails.vatCopy}
            />
            <FileUploadRow
              label="CR Copy"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onFileSelect={handleFileUpload("crCopy")}
              currentFileName={clientDetails.crCopy}
            />
            <DetailRow
              label="Client Location"
              value={clientDetails.location}
              onUpdate={handleUpdateField("location")}
            />
            <DetailRow
              label="Client Address"
              value={clientDetails.address}
              onUpdate={handleUpdateField("address")}
            />
            <DetailRow
              label="Client Incorporation Date"
              value={clientDetails.incorporationDate}
              onUpdate={handleUpdateField("incorporationDate")}
              isDate={true}
            />
            <DetailRow
              label="Country of Registration"
              value={clientDetails.countryOfRegistration}
              onUpdate={handleUpdateField("countryOfRegistration")}
            />
            <DetailRow
              label="Registration Number"
              value={clientDetails.registrationNumber}
              onUpdate={handleUpdateField("registrationNumber")}
            />
            <DetailRow
              label="Country of Business"
              value={clientDetails.countryOfBusiness}
              onUpdate={handleUpdateField("countryOfBusiness")}
            />
            <DetailRow
              label="Referred By"
              value={clientDetails.referredBy}
              onUpdate={handleUpdateField("referredBy")}
            />
            <DetailRow
              label="LinkedIn Profile"
              value={clientDetails.linkedInProfile}
              onUpdate={handleUpdateField("linkedInProfile")}
              optional
            />
            <DetailRow
              label="Client LinkedIn Page"
              value={clientDetails.clientLinkedInPage}
              onUpdate={handleUpdateField("clientLinkedInPage")}
            />
          </div>
        </div>
      </div>

      {/* Right Column - Team, Description, Contacts, AEMS */}
      <div className="space-y-6">
        {/* Team Section */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Team</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTeamModalOpen(true)}
            >
              + Add
            </Button>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              {teamMembers.length} team member{teamMembers.length !== 1 ? "s" : ""}
            </div>
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                isActive={member.isActive}
              />
            ))}
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Description</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDescriptionModalOpen(true)}
            >
              {clientDetails.description ? (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
          <div className="space-y-3">
            {clientDetails.description ? (
              <p className="text-sm whitespace-pre-wrap">{clientDetails.description}</p>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No description added yet
              </div>
            )}
          </div>
        </div>

        {/* Contacts Section */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Contacts</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsContactModalOpen(true)}
            >
              + Add
            </Button>
          </div>
          {contacts.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No contacts added yet
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {contact.position}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contact.email} • {contact.phone}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contract Information Section */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <SectionHeader title="Contract Information" />
          <div className="space-y-3 mt-4">
            <DetailRow
              label="Contract Start Date"
              value={clientDetails.contractStartDate}
              onUpdate={handleUpdateField("contractStartDate")}
              isDate={true}
            />
            <DetailRow
              label="Contract End Date"
              value={clientDetails.contractEndDate}
              onUpdate={handleUpdateField("contractEndDate")}
              isDate={true}
            />
            <div className="flex items-center py-2 border-b last:border-b-0">
              <span className="text-sm text-muted-foreground w-1/3">
                Fee Amount
              </span>
              <div className="flex items-center gap-2 flex-1">
                <Select
                  value={clientDetails.feeCurrency || "USD"}
                  onValueChange={(value) => updateClientDetails("feeCurrency", value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>
                      {clientDetails.feeCurrency && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-3">
                            {currencies.find(c => c.code === clientDetails.feeCurrency)?.flag && (
                              // @ts-ignore
                              React.createElement(Flags[currencies.find(c => c.code === clientDetails.feeCurrency)?.flag || ''])
                            )}
                          </div>
                          <span>{clientDetails.feeCurrency}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-3">
                            {/* @ts-ignore */}
                            {Flags[currency.flag] && React.createElement(Flags[currency.flag])}
                          </div>
                          <span>{currency.name}</span>
                          <span className="text-muted-foreground ml-auto">{currency.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={clientDetails.feeAmount || ''}
                  onChange={(e) => updateClientDetails("feeAmount", e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1"
                />
              </div>
            </div>
            <FileUploadRow
              label="Agreement"
              accept=".pdf,.doc,.docx"
              onFileSelect={handleFileUpload("agreement")}
              showFileName={false}
            />
            <DetailRow
              label="Referral Percentage"
              value={clientDetails.referralPercentage}
              onUpdate={handleUpdateField("referralPercentage")}
            />
            <DetailRow
              label="Line of Business"
              value={clientDetails.lineOfBusiness}
              onUpdate={handleUpdateField("lineOfBusiness")}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTeamMemberModal
        open={isTeamModalOpen}
        onOpenChange={setIsTeamModalOpen}
        onAdd={handleAddTeamMember}
      />
      <AddContactModal
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        onAdd={handleAddContact}
      />
      <EditDescriptionModal
        open={isDescriptionModalOpen}
        onOpenChange={setIsDescriptionModalOpen}
        currentDescription={clientDetails.description || ""}
        onSave={handleUpdateDescription}
      />
    </div>
  );
}