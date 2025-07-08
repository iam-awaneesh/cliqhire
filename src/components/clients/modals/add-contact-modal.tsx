"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '@/styles/phone-input-override.css';

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (contact: { firstName: string; lastName: string; gender: string; email: string; phone: string; countryCode: string; position: string; linkedin: string }) => void;
  countryCodes: { code: string; label: string }[];
  positionOptions: { value: string; label: string }[];
}

export function AddContactModal({ open, onOpenChange, onAdd, countryCodes, positionOptions }: AddContactModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "Other",
    email: "",
    phone: "",
    countryCode: "+966",
    position: positionOptions[0]?.value || "HR",
    linkedin: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.phone || !formData.position) {
      alert("Please fill all required fields.");
      return;
    }
    onAdd({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      gender: formData.gender,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      countryCode: formData.countryCode,
      position: formData.position,
      linkedin: formData.linkedin.trim(),
    });
    onOpenChange(false);
    setFormData({
      firstName: "",
      lastName: "",
      gender: "Other",
      email: "",
      phone: "",
      countryCode: "+966",
      position: positionOptions[0]?.value || "HR",
      linkedin: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full border rounded p-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <PhoneInput
                country="sa"
                preferredCountries={['sa']}
                value={formData.phone}
                onChange={(value, data) => setFormData(prev => ({ ...prev, phone: value, countryCode: `+${data.dialCode}` }))}
                inputClass="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
                inputProps={{ id: 'phone', required: true }}
                enableSearch={true}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <select
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full border rounded p-2"
                required
              >
                {positionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="Enter LinkedIn profile URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Contact</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}