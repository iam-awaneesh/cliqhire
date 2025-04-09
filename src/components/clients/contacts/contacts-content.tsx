"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateContactDialog } from "./create-contact-dialog"

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

export function ContactsContent({ clientId }: ContactsContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleAddContact = (contactData: any) => {
    const newContact = {
      id: Date.now().toString(),
      ...contactData
    };
    setContacts(prev => [...prev, newContact]);
  };

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