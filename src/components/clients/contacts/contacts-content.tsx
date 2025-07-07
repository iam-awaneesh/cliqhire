"use client"

import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import { useState, useEffect } from "react"
import { CreateContactDialog } from "./create-contact-dialog"
import { getClientById, PrimaryContact, ClientResponse } from "@/services/clientService"
import { EditFieldModal } from "../summary/edit-field-modal"
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { EditPrimaryContactDialog } from "./EditPrimaryContactDialog"

interface ContactsContentProps {
  clientId: string;
}

interface Contact {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  location: string;
  description: string;
}

interface ExtendedPrimaryContact extends PrimaryContact {
  firstName?: string;
  lastName?: string;
  gender?: string;
}

export function ContactsContent({ clientId }: ContactsContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [primaryContacts, setPrimaryContacts] = useState<ExtendedPrimaryContact[]>([]);
  const [clientPhoneNumber, setClientPhoneNumber] = useState<string>("");
  const [clientWebsite, setClientWebsite] = useState<string>("");
  const [clientEmails, setClientEmails] = useState<string[]>([]);
  const [clientLinkedIn, setClientLinkedIn] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPhoneEditOpen, setIsPhoneEditOpen] = useState(false);
  const [isWebsiteEditOpen, setIsWebsiteEditOpen] = useState(false);
  const [isEmailsEditOpen, setIsEmailsEditOpen] = useState(false);
  const [isLinkedInEditOpen, setIsLinkedInEditOpen] = useState(false);
  const [editContactIndex, setEditContactIndex] = useState<number | null>(null);
  const [deleteContactIndex, setDeleteContactIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        setError("");

        const response: any = await getClientById(clientId);

        // Handle different possible response structures
        let clientData: any;

        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            clientData = response.data;
          } else if ('name' in response) {
            clientData = response;
          } else if (response.client) {
            clientData = response.client;
          } else if (response.result) {
            clientData = response.result;
          } else {
            throw new Error("Invalid response structure from API");
          }
        } else {
          throw new Error("No valid response received from API");
        }

        // Map primary contacts to include gender and split name into firstName/lastName
        const mappedContacts = (clientData.primaryContacts || []).map((c: any) => ({
          name: c.name || '',
          email: c.email || '',
          phone: c.phone || '',
          countryCode: c.countryCode || '',
          position: c.position || '',
          linkedin: c.linkedin || '',
          firstName: c.firstName || (c.name ? c.name.split(' ')[0] : ''),
          lastName: c.lastName || (c.name ? c.name.split(' ').slice(1).join(' ') : ''),
          gender: c.gender || '',
        }));

        setPrimaryContacts(mappedContacts);
        setClientPhoneNumber(clientData.phoneNumber || "");
        setClientWebsite(clientData.website || "");
        setClientEmails(clientData.emails || []);
        setClientLinkedIn(clientData.linkedInProfile || "");
        setLoading(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load client data";
        setError(`${errorMessage}. Please try again.`);
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientData();
    } else {
      setError("No client ID provided");
      setLoading(false);
    }
  }, [clientId]);

  const handleAddContact = (contactData: any) => {
    const newContact = {
      id: Date.now().toString(),
      ...contactData
    };
    setContacts(prev => [...prev, newContact]);
  };

  const countryCodes = [
    { code: "+966", label: "+966 (Saudi Arabia)" },
    { code: "+1", label: "+1 (USA)" },
    { code: "+91", label: "+91 (India)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+86", label: "+86 (China)" },
    { code: "+81", label: "+81 (Japan)" },
  ];

  const getCountryCodeLabel = (code: string) => {
    const country = countryCodes.find((option) => option.code === code);
    return country ? country.label : code;
  };

  const handlePhoneNumberUpdate = (newPhoneNumber: string) => {
    setClientPhoneNumber(newPhoneNumber);
    setIsPhoneEditOpen(false);
    // TODO: Optionally, call an API to persist the change
  };

  const handleWebsiteUpdate = (newWebsite: string) => {
    setClientWebsite(newWebsite);
    setIsWebsiteEditOpen(false);
    // TODO: Optionally, call an API to persist the change
  };

  const handleEmailsUpdate = (newEmails: string) => {
    setClientEmails(newEmails.split(',').map(e => e.trim()).filter(Boolean));
    setIsEmailsEditOpen(false);
    // TODO: Optionally, call an API to persist the change
  };

  const handleLinkedInUpdate = (newLinkedIn: string) => {
    setClientLinkedIn(newLinkedIn);
    setIsLinkedInEditOpen(false);
    // TODO: Optionally, call an API to persist the change
  };

  // Handler for editing a primary contact
  const handleEditContact = (index: number) => {
    setEditContactIndex(index);
  };

  // Handler for deleting a primary contact
  const handleDeleteContact = (index: number) => {
    setPrimaryContacts(prev => prev.filter((_, i) => i !== index));
    setDeleteContactIndex(null);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading contacts...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // If there are primary contacts, show them
  if (primaryContacts.length > 0) {
    return (
      <div className="p-0">
        {/* <div className="mb-6">
          <h2 className="text-lg font-semibold">Contacts</h2>
        </div> */}
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Heading for contact details */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
              <h2 className=" text-sm font-semibold mb-4">Client Contact Details</h2>
              {/* Phone Number */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">Client Phone Number</span>
                <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => setIsPhoneEditOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />Edit
                </Button>
              </div>
              <div className="text-base mb-4 border-b border-gray-200 pb-2">
                {clientPhoneNumber ? (
                  (() => {
                    const parsed = parsePhoneNumberFromString('+' + clientPhoneNumber);
                    if (parsed && parsed.isValid()) {
                      return <span>{parsed.formatInternational()}</span>;
                    } else {
                      return <span>{clientPhoneNumber}</span>;
                    }
                  })()
                ) : (
                  <span className="text-muted-foreground">No phone number</span>
                )}
              </div>
              {/* Website */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">Client Website</span>
                <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => setIsWebsiteEditOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />Edit
                </Button>
              </div>
              <div className="text-base mb-4 border-b border-gray-200 pb-2">
                {clientWebsite ? (
                  <a href={clientWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{clientWebsite}</a>
                ) : (
                  <span className="text-muted-foreground">No website</span>
                )}
              </div>
              {/* Emails */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">Client Email(s)</span>
                <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => setIsEmailsEditOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />Edit
                </Button>
              </div>
              <div className="text-base mb-4 border-b border-gray-200 pb-2">
                {clientEmails && clientEmails.length > 0 ? (
                  <ul className="list-disc ml-4">
                    {clientEmails.map((email, idx) => (
                      <li key={idx}>
                        <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground">No email</span>
                )}
              </div>
              {/* LinkedIn Profile */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">Client LinkedIn Profile</span>
                <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => setIsLinkedInEditOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />Edit
                </Button>
              </div>
              <div className="text-base">
                {clientLinkedIn ? (
                  <a href={clientLinkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{clientLinkedIn}</a>
                ) : (
                  <span className="text-muted-foreground">No LinkedIn profile</span>
                )}
              </div>
            </div>
            {/* Edit Modals */}
            <EditFieldModal
              open={isPhoneEditOpen}
              onClose={() => setIsPhoneEditOpen(false)}
              fieldName="Client Phone Number"
              currentValue={clientPhoneNumber}
              onSave={handlePhoneNumberUpdate}
            />
            <EditFieldModal
              open={isWebsiteEditOpen}
              onClose={() => setIsWebsiteEditOpen(false)}
              fieldName="Client Website"
              currentValue={clientWebsite}
              onSave={handleWebsiteUpdate}
            />
            <EditFieldModal
              open={isEmailsEditOpen}
              onClose={() => setIsEmailsEditOpen(false)}
              fieldName="Client Email(s)"
              currentValue={clientEmails.join(', ')}
              onSave={handleEmailsUpdate}
            />
            <EditFieldModal
              open={isLinkedInEditOpen}
              onClose={() => setIsLinkedInEditOpen(false)}
              fieldName="Client LinkedIn Profile"
              currentValue={clientLinkedIn}
              onSave={handleLinkedInUpdate}
            />
          </div>
          {/* Primary Contacts on the right */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Primary Contacts</span>
                <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />Add
                </Button>
              </div>
              {primaryContacts.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">No primary contacts</div>
              ) : (
                <div className="space-y-3">
                  {primaryContacts.map((contact, index) => (
                    <div key={index} className="p-3 rounded-md border">
                      {/* Buttons row */}
                      <div className="flex justify-end gap-2 mb-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditContact(index)}>
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteContactIndex(index)}>
                          Delete
                        </Button>
                      </div>
                      {/* Name */}
                      <div className="text-sm text-muted-foreground">
                        <span className="text-xs font-semibold text-gray-500 mr-1">Name:</span>
                        {`${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.name || "Unnamed Contact"}
                      </div>
                      {/* Position */}
                      {contact.position && <p className="text-sm text-muted-foreground">{contact.position}</p>}
                      {/* Email */}
                      {contact.email && (
                        <p className="text-sm text-muted-foreground">
                          <span className="text-xs font-semibold text-gray-500 mr-1">Email:</span>
                          {contact.email}
                        </p>
                      )}
                      {/* Phone Number */}
                      <div className="text-sm text-muted-foreground">
                        <span className="text-xs font-semibold text-gray-500 mr-1">Phone Number:</span>
                        {getCountryCodeLabel(contact.countryCode || "")}<span className="mx-1">-</span>{contact.phone || "No phone"}
                      </div>
                      {/* LinkedIn */}
                      <div className="text-sm text-muted-foreground">
                        <span className="text-xs font-semibold text-gray-500 mr-1">LinkedIn:</span>
                        {contact.linkedin ? (
                          <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {contact.linkedin}
                          </a>
                        ) : (
                          "No LinkedIn"
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <CreateContactDialog 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAddContact}
        />
        {/* Edit modal for primary contact (placeholder, can be replaced with a full modal) */}
        <EditPrimaryContactDialog
          open={editContactIndex !== null}
          onOpenChange={() => setEditContactIndex(null)}
          contact={editContactIndex !== null ? primaryContacts[editContactIndex] : null}
          onSave={(updatedContact) => {
            setPrimaryContacts(prev => prev.map((c, i) => i === editContactIndex ? updatedContact : c));
            setEditContactIndex(null);
          }}
        />
        {/* Delete confirmation (simple, can be replaced with a dialog) */}
        {deleteContactIndex !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <div className="mb-4">Are you sure you want to delete this contact?</div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeleteContactIndex(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleDeleteContact(deleteContactIndex!)}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If no primary contacts, show the empty state
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-240px)]">
      <div className="w-32 h-32 mb-6">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full text-blue-500"
        >
          <circle cx="100" cy="100" r="40" fill="currentColor" fillOpacity="0.1"/>
          <circle cx="150" cy="70" r="25" fill="currentColor" fillOpacity="0.1"/>
          <path d="M90 90 L160 60" stroke="currentColor" strokeWidth="4"/>
          <circle cx="60" cy="130" r="20" fill="currentColor" fillOpacity="0.1"/>
          <path d="M90 110 L70 125" stroke="currentColor" strokeWidth="4"/>
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">You have not created any contacts yet</h3>
      <p className="text-muted-foreground text-center max-w-lg mb-8">
        Creating Contacts will allow you to associate contacts with specific clients. These contacts do not have access to any information in your Manatal account, unless you invite them to collaborate as guests.
      </p>
      <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
        <Plus className="h-4 w-4" />
        Create contact
      </Button>

      <CreateContactDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddContact}
      />
    </div>
  )
}