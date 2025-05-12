import { SectionHeader } from "./section-header";
import { DetailRow } from "./detail-row";
import { TeamMember } from "./team-member";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { FileUploadRow } from "./file-upload-row";
import { AddTeamMemberModal } from "../modals/add-team-member-modal";
import { AddContactModal } from "../modals/add-contact-modal";
import { EditDescriptionModal } from "../modals/edit-description-modal";
import { Plus, Pencil } from "lucide-react";
import { getClientById } from "@/services/clientService";
import { ContractSection } from "./contract-section"; // Import the new contract section

interface SummaryContentProps {
  clientId: string;
}

interface ApiResponse {
  status: string;
  data: ClientDetails;
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
  linkedInPage?: string; // Added to match API response
  gstTinDocument?: string;
  clientProfileImage?: string;
  profileImage?: string; // Added to match API response
  crCopy?: string;
  vatCopy?: string;
  phoneNumber?: string;
  googleMapsLink?: string;
  // Contract information removed from here - now handled by ContractSection component
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
  });
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([
    { name: "Shaswat singh", role: "Admin", email: "shaswat@example.com", isActive: true },
  ]);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const response = await getClientById(clientId);
        const clientData = (response as ApiResponse).data;

        // Map API response to our component state structure
        setClientDetails({
          name: clientData.name || "",
          website: clientData.website || "",
          industry: clientData.industry || "",
          location: clientData.location || "",
          address: clientData.address || "",
          incorporationDate: clientData.incorporationDate || "",
          countryOfRegistration: clientData.countryOfRegistration || "",
          registrationNumber: clientData.registrationNumber || "",
          countryOfBusiness: clientData.countryOfBusiness || "",
          description: clientData.description || "",
          referredBy: clientData.referredBy || "",
          linkedInProfile: clientData.linkedInProfile || "",
          clientLinkedInPage: clientData.linkedInPage || clientData.clientLinkedInPage || "",
          gstTinDocument: clientData.gstTinDocument || "",
          clientProfileImage: clientData.profileImage || clientData.clientProfileImage || "",
          crCopy: clientData.crCopy || "",
          vatCopy: clientData.vatCopy || "",
          phoneNumber: clientData.phoneNumber || "",
          googleMapsLink: clientData.googleMapsLink || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching client data:", error);
        setError("Failed to load client data. Please try again.");
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const updateClientDetails = async (fieldName: string, value: string) => {
    try {
      const response = await fetch(`https://aems-backend.onrender.com/api/clients/${clientId}`, {
        method: "PATCH",
        body: JSON.stringify({ [fieldName]: value }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update client details");
      }

      // Update local state
      setClientDetails((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateField = (field: keyof ClientDetails) => (value: string) => {
    updateClientDetails(field, value);
  };

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
    updateClientDetails("description", description);
  };

  // Show loading or error state
  if (loading) {
    return <div className="p-8 text-center">Loading client details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-6 p-4">
      {/* Left Column - Client Details */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h2 className="text-sm font-semibold">Details</h2>
          {/* <SectionHeader title="Details" /> */}
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
              value={clientDetails.clientLinkedInPage || clientDetails.linkedInPage}
              onUpdate={handleUpdateField(clientDetails.linkedInPage ? "linkedInPage" : "clientLinkedInPage")}
            />
          </div>
        </div>
      </div>

      {/* Right Column - Team, Description, Contacts, Contract */}
      <div className="space-y-6">
        {/* Contract Information Section - Now using the ContractSection component */}
        <ContractSection clientId={clientId} />

        {/* Contacts Section */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Contacts</h2>
            <Button variant="outline" size="sm" onClick={() => setIsContactModalOpen(true)}>
              + Add
            </Button>
          </div>
          {contacts.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">No contacts added yet</div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.position}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contact.email} • {contact.phone}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Team Section */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Team</h2>
            <Button variant="outline" size="sm" onClick={() => setIsTeamModalOpen(true)}>
              + Add
            </Button>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              {teamMembers.length} team member{teamMembers.length !== 1 ? "s" : ""}
            </div>
            {teamMembers.map((member, index) => (
              <TeamMember key={index} name={member.name} role={member.role} isActive={member.isActive} />
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
              <div className="text-sm text-muted-foreground text-center py-4">No description added yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Modals - These should properly manage focus when opened/closed */}
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