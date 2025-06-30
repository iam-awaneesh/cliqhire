import { ClientForm } from "@/components/create-client-modal/type";

export const optionsForClient = [
  {
    value: "Lead",
    label: "Lead",
  },
  {
    value: "Engaged",
    label: "Engaged",
    children: [
      {
        value: "Calls",
        label: "Calls",
      },
      {
        value: "Profile Sent",
        label: "Profile Sent",
      },
      {
        value: "Contract Sent",
        label: "Contract Sent",
      },
      {
        value: "Attended a meeting",
        label: "Attended a meeting",
      },
      {
        value: "Replied to a message",
        label: "Replied to a message",
      },
      {
        value: "Contract Negotiation",
        label: "Contract Negotiation",
      }
    ]
  },
  {
    value: "Signed",
    label: "Signed",
  }
];

export const countryCodes = [
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+1", label: "+1 (USA)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+91", label: "+91 (India)" },
];

export const positionOptions = [
  { value: "HR", label: "HR" },
  { value: "Senior HR", label: "Senior HR" },
  { value: "Manager", label: "Manager" },
  { value: "HR Manager", label: "HR Manager" },
  { value: "Director", label: "Director" },
  { value: "Executive", label: "Executive" },
];

export const levelFieldMap: Record<string, { percentage: keyof ClientForm; notes: keyof ClientForm; money: keyof ClientForm; currency: keyof ClientForm; }> = {
  "Senior Level": { percentage: "seniorLevelPercentage", notes: "seniorLevelNotes", money: "seniorLevelMoney", currency: "seniorLevelCurrency" },
  "Executives": { percentage: "executivesPercentage", notes: "executivesNotes", money: "executivesMoney", currency: "executivesCurrency" },
  "Non-Executives": { percentage: "nonExecutivesPercentage", notes: "nonExecutivesNotes", money: "nonExecutivesMoney", currency: "nonExecutivesCurrency" },
  "Other": { percentage: "otherPercentage", notes: "otherNotes", money: "otherMoney", currency: "otherCurrency" },
};


export const clientSubStages = [ "Calls", "Profile Sent", "Contract Sent", "Attended a meeting", "Replied to a message", "Contract Negotiation" ];