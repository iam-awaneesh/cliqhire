"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (contact: { name: string; email: string; phone: string; countryCode: string; position: string; linkedin: string }) => void;
  countryCodes: { code: string; label: string }[];
  positionOptions: { value: string; label: string }[];
}

export function AddContactModal({ open, onOpenChange, onAdd, countryCodes, positionOptions }: AddContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+966",
    position: positionOptions[0]?.value || "HR",
    linkedin: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate only required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.position) {
      alert("Please fill all required fields.");
      return;
    }
    onAdd({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      countryCode: formData.countryCode,
      position: formData.position,
      linkedin: formData.linkedin.trim(),
    });
    onOpenChange(false);
    setFormData({
      name: "",
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
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
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
              <div className="flex gap-2">
                <select
                  id="countryCode"
                  value={formData.countryCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                  className="border rounded p-2"
                >
                  {countryCodes.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
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