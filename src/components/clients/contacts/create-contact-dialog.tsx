import React from 'react';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { X, Bold, Italic, Underline, Strikethrough, Link2, List, AlignLeft, AlignCenter, AlignRight, Undo, Type } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import * as Flags from 'country-flag-icons/react/3x2';

interface ContactFormData {
  fullName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  location: string;
  description: string;
}

interface CreateContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ContactFormData) => void;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface Country {
  name: string;
  code: string;
  flag: keyof typeof Flags;
  dialCode: string;
}

const countries: Country[] = [
    { name: "Afghanistan", code: "AF", flag: "AF", dialCode: "+93" },
    { name: "Albania", code: "AL", flag: "AL", dialCode: "+355" },
    { name: "Algeria", code: "DZ", flag: "DZ", dialCode: "+213" },
    { name: "Argentina", code: "AR", flag: "AR", dialCode: "+54" },
    { name: "Australia", code: "AU", flag: "AU", dialCode: "+61" },
    { name: "Austria", code: "AT", flag: "AT", dialCode: "+43" },
    { name: "Bahrain", code: "BH", flag: "BH", dialCode: "+973" },
    { name: "Bangladesh", code: "BD", flag: "BD", dialCode: "+880" },
    { name: "Belgium", code: "BE", flag: "BE", dialCode: "+32" },
    { name: "Brazil", code: "BR", flag: "BR", dialCode: "+55" },
    { name: "Canada", code: "CA", flag: "CA", dialCode: "+1" },
    { name: "Chile", code: "CL", flag: "CL", dialCode: "+56" },
    { name: "China", code: "CN", flag: "CN", dialCode: "+86" },
    { name: "Colombia", code: "CO", flag: "CO", dialCode: "+57" },
    { name: "Croatia", code: "HR", flag: "HR", dialCode: "+385" },
    { name: "Czech Rep.", code: "CZ", flag: "CZ", dialCode: "+420" },
    { name: "Denmark", code: "DK", flag: "DK", dialCode: "+45" },
    { name: "Egypt", code: "EG", flag: "EG", dialCode: "+20" },
    { name: "Finland", code: "FI", flag: "FI", dialCode: "+358" },
    { name: "France", code: "FR", flag: "FR", dialCode: "+33" },
    { name: "Germany", code: "DE", flag: "DE", dialCode: "+49" },
    { name: "Greece", code: "GR", flag: "GR", dialCode: "+30" },
    { name: "Hong Kong", code: "HK", flag: "HK", dialCode: "+852" },
    { name: "Hungary", code: "HU", flag: "HU", dialCode: "+36" },
    { name: "Iceland", code: "IS", flag: "IS", dialCode: "+354" },
    { name: "India", code: "IN", flag: "IN", dialCode: "+91" },
    { name: "Indonesia", code: "ID", flag: "ID", dialCode: "+62" },
    { name: "Iran", code: "IR", flag: "IR", dialCode: "+98" },
    { name: "Iraq", code: "IQ", flag: "IQ", dialCode: "+964" },
    { name: "Ireland", code: "IE", flag: "IE", dialCode: "+353" },
    { name: "Israel", code: "IL", flag: "IL", dialCode: "+972" },
    { name: "Italy", code: "IT", flag: "IT", dialCode: "+39" },
    { name: "Japan", code: "JP", flag: "JP", dialCode: "+81" },
    { name: "Jordan", code: "JO", flag: "JO", dialCode: "+962" },
    { name: "Kuwait", code: "KW", flag: "KW", dialCode: "+965" },
    { name: "Lebanon", code: "LB", flag: "LB", dialCode: "+961" },
    { name: "Malaysia", code: "MY", flag: "MY", dialCode: "+60" },
    { name: "Mexico", code: "MX", flag: "MX", dialCode: "+52" },
    { name: "Morocco", code: "MA", flag: "MA", dialCode: "+212" },
    { name: "Netherlands", code: "NL", flag: "NL", dialCode: "+31" },
    { name: "New Zealand", code: "NZ", flag: "NZ", dialCode: "+64" },
    { name: "Nigeria", code: "NG", flag: "NG", dialCode: "+234" },
    { name: "Norway", code: "NO", flag: "NO", dialCode: "+47" },
    { name: "Oman", code: "OM", flag: "OM", dialCode: "+968" },
    { name: "Pakistan", code: "PK", flag: "PK", dialCode: "+92" },
    { name: "Palestine", code: "PS", flag: "PS", dialCode: "+970" },
    { name: "Peru", code: "PE", flag: "PE", dialCode: "+51" },
    { name: "Philippines", code: "PH", flag: "PH", dialCode: "+63" },
    { name: "Poland", code: "PL", flag: "PL", dialCode: "+48" },
    { name: "Portugal", code: "PT", flag: "PT", dialCode: "+351" },
    { name: "Qatar", code: "QA", flag: "QA", dialCode: "+974" },
    { name: "Romania", code: "RO", flag: "RO", dialCode: "+40" },
    { name: "Russia", code: "RU", flag: "RU", dialCode: "+7" },
    { name: "Saudi Arabia", code: "SA", flag: "SA", dialCode: "+966" },
    { name: "Singapore", code: "SG", flag: "SG", dialCode: "+65" },
    { name: "Slovakia", code: "SK", flag: "SK", dialCode: "+421" },
    { name: "South Africa", code: "ZA", flag: "ZA", dialCode: "+27" },
    { name: "South Korea", code: "KR", flag: "KR", dialCode: "+82" },
    { name: "Spain", code: "ES", flag: "ES", dialCode: "+34" },
    { name: "Sri Lanka", code: "LK", flag: "LK", dialCode: "+94" },
    { name: "Sweden", code: "SE", flag: "SE", dialCode: "+46" },
    { name: "Switzerland", code: "CH", flag: "CH", dialCode: "+41" },
    { name: "Syria", code: "SY", flag: "SY", dialCode: "+963" },
    { name: "Taiwan", code: "TW", flag: "TW", dialCode: "+886" },
    { name: "Thailand", code: "TH", flag: "TH", dialCode: "+66" },
    { name: "Tunisia", code: "TN", flag: "TN", dialCode: "+216" },
    { name: "Turkey", code: "TR", flag: "TR", dialCode: "+90" },
    { name: "UAE", code: "AE", flag: "AE", dialCode: "+971" },
    { name: "UK", code: "GB", flag: "GB", dialCode: "+44" },
    { name: "Ukraine", code: "UA", flag: "UA", dialCode: "+380" },
    { name: "USA", code: "US", flag: "US", dialCode: "+1" },
    { name: "Vietnam", code: "VN", flag: "VN", dialCode: "+84" },
    { name: "Yemen", code: "YE", flag: "YE", dialCode: "+967" },
];

export function CreateContactDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateContactDialogProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    location: "",
    description: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'center', 'right'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: formData.description,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({
        ...prev,
        description: editor.getHTML()
      }));
    },
  });

  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (formData.location.length < 3) {
        setLocationSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`
        );
        setLocationSuggestions(response.data);
        setShowLocationSuggestions(true);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    };

    const debounceTimer = setTimeout(fetchLocationSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [formData.location]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setFormData(prev => ({
      ...prev,
      location: suggestion.display_name
    }));
    setShowLocationSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      phoneNumber: `${selectedCountry.dialCode} ${formData.phoneNumber}`,
      description: editor?.getHTML() || '',
    };
    onSubmit(submissionData);
    setFormData({
      fullName: "",
      displayName: "",
      email: "",
      phoneNumber: "",
      location: "",
      description: "",
    });
    editor?.commands.setContent('');
    onOpenChange(false);
  };

  const handleLinkAdd = () => {
    const url = window.prompt('Enter URL');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name*</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Enter display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedCountry.code}
                  onValueChange={(value) => {
                    const country = countries.find(c => c.code === value);
                    if (country) setSelectedCountry(country);
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>
                      {selectedCountry && (
                        <div className="flex items-center gap-2">
                          {selectedCountry.flag && (
                            <div className="w-4 h-3">
                              {/* @ts-ignore */}
                              {Flags[selectedCountry.flag] && React.createElement(Flags[selectedCountry.flag])}
                            </div>
                          )}
                          <span>{selectedCountry.dialCode}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-3">
                            {/* @ts-ignore */}
                            {Flags[country.flag] && React.createElement(Flags[country.flag])}
                          </div>
                          <span>{country.name}</span>
                          <span className="text-muted-foreground ml-auto">{country.dialCode}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Enter phone number"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Search location"
                />
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {locationSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleLocationSelect(suggestion)}
                      >
                        {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <div className="border rounded-md">
                <div className="flex flex-wrap gap-0.5 border-b p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${editor?.isActive('bold') ? 'bg-muted' : ''}`}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${editor?.isActive('italic') ? 'bg-muted' : ''}`}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${editor?.isActive('underline') ? 'bg-muted' : ''}`}
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${editor?.isActive('strike') ? 'bg-muted' : ''}`}
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                  >
                    <Strikethrough className="h-4 w-4" />
                  </Button>
                  <div className="h-8 w-[1px] bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleLinkAdd}
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                  <div className="h-8 w-[1px] bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${editor?.isActive('bulletList') ? 'bg-muted' : ''}`}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <div className="h-8 w-[1px] bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${editor?.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}`}
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${editor?.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}`}
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${editor?.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}`}
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <div className="h-8 w-[1px] bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor?.chain().focus().undo().run()}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <div className="h-8 w-[1px] bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                </div>
                <EditorContent editor={editor} className="min-h-[200px] p-4" />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Contact</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}