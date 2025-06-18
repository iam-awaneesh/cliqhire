// src/components/create-client-modal/primary-contact-form.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PrimaryContact } from "./types";

interface PrimaryContactFormProps {
  newContact: PrimaryContact;
  handleContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddContact: () => void;
  primaryContacts: PrimaryContact[];
}

export function PrimaryContactForm({ newContact, handleContactChange, handleAddContact, primaryContacts }: PrimaryContactFormProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" value={newContact.firstName} onChange={handleContactChange} />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={newContact.lastName} onChange={handleContactChange} />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Input id="gender" name="gender" value={newContact.gender} onChange={handleContactChange} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" value={newContact.email} onChange={handleContactChange} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={newContact.phone} onChange={handleContactChange} />
        </div>
        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input id="designation" name="designation" value={newContact.designation} onChange={handleContactChange} />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" name="linkedin" value={newContact.linkedin} onChange={handleContactChange} />
        </div>
      </div>
      <Button onClick={handleAddContact} className="mt-4">Add Contact</Button>
      <div className="mt-4">
        <h3 className="font-bold">Primary Contacts</h3>
        {primaryContacts.map((contact, index) => (
          <div key={index} className="border p-2 mt-2 rounded-md">
            <p>{contact.firstName} {contact.lastName}</p>
            <p>{contact.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
