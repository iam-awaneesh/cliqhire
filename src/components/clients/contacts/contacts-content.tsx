"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { CreateContactDialog } from "./create-contact-dialog"
import { getClientById, PrimaryContact, ClientResponse } from "@/services/clientService"

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Primary Contacts</h2>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
        
        <div className="grid gap-4">
          {primaryContacts.map((contact, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-lg">
                    {(contact.firstName || contact.lastName)
                      ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                      : (contact.name || "Unnamed Contact")}
                  </div>
                  {contact.gender && (
                    <div className="text-sm text-muted-foreground mb-1">{contact.gender}</div>
                  )}
                  {contact.position && (
                    <div className="text-sm text-muted-foreground mb-2">{contact.position}</div>
                  )}
                  <div className="space-y-1">
                    {contact.email && (
                      <div className="text-sm">
                        <span className="font-medium">Email:</span> {contact.email}
                      </div>
                    )}
                    {contact.phone && (
                      <div className="text-sm">
                        <span className="font-medium">Phone:</span> {getCountryCodeLabel(contact.countryCode || "")} {contact.phone}
                      </div>
                    )}
                    {contact.linkedin && (
                      <div className="text-sm">
                        <span className="font-medium">LinkedIn:</span>{" "}
                        <a
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <CreateContactDialog 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAddContact}
        />
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