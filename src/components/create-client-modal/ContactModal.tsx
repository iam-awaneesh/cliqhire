import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrimaryContact } from "@/components/create-client-modal/type";
import { countryCodes, positionOptions } from "./constants";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '@/styles/phone-input-override.css';

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newContact: PrimaryContact;
  setNewContact: React.Dispatch<React.SetStateAction<PrimaryContact>>;
  handleAddContact: (contact: PrimaryContact) => void;
}

export function ContactModal({
  isOpen,
  onOpenChange,
  newContact,
  setNewContact,
  handleAddContact,
}: ContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Primary Contact</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={newContact.firstName}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={newContact.lastName}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Select
              value={newContact.gender}
              onValueChange={(value) =>
                setNewContact((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={newContact.email}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, email: e.target.value }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone *
            </Label>
            <div className="col-span-3">
              <PhoneInput
                country={"sa"}
                value={newContact.phone || "966"}
                onChange={value => setNewContact(prev => ({ ...prev, phone: value || '' }))}
                inputClass="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
                inputProps={{ id: 'phone', required: true }}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="designation" className="text-right">
              Designation
            </Label>
            <Select
              value={newContact.designation}
              onValueChange={(value) =>
                setNewContact((prev) => ({ ...prev, designation: value }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select designation" />
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="linkedin" className="text-right">
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              type="url"
              value={newContact.linkedin}
              onChange={(e) =>
                setNewContact((prev) => ({ ...prev, linkedin: e.target.value }))
              }
              className="col-span-3"
              placeholder="https://www.linkedin.com/in/..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleAddContact(newContact)}
            type="button"
          >
            Add Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}