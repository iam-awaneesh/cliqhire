// src/components/create-client-modal/types.ts
export interface PrimaryContact {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  countryCode: string;
  designation: string;
  linkedin?: string;
  isPrimary: boolean;
}

export interface ClientForm {
  name: string;
  emails: string[];
  phoneNumber: string;
  website?: string;
  salesLead?: string;
  industry?: string;
  location?: string;
  address?: string;
  googleMapsLink?: string;
  incorporationDate?: string;
  registrationNumber?: string;
  lineOfBusiness?: string[] | string;
  countryOfBusiness?: string;
  referredBy?: string;
  linkedInProfile?: string;
  linkedInPage?: string;
  countryCode: string;
  primaryContacts: PrimaryContact[];
  clientStage?: "Lead" | "Engaged" | "Negotiation" | "Signed";
  clientTeam?: string;
  clientRm?: string;
  clientAge?: number;
  contractNumber?: string;
  contractStartDate?: Date | null;
  contractEndDate?: Date | null;
  contractValue?: number;
  contractType?: string;
  cLevelPercentage?: number;
  belowCLevelPercentage?: number;
  fixedPercentageNotes?: string;
  fixedPercentageAdvanceNotes?: string;
  advanceMoneyCurrency?: string;
  advanceMoneyAmount?: number;
  cLevelPercentageNotes?: string;
  proposalOptions?: string[];
  // File upload fields
  crCopy?: any;
  vatCopy?: any;
  gstTinDocument?: any;
  fixedPercentage?: any;
  fixedPercentageAdvance?: any;
  variablePercentageCLevel?: any;
  variablePercentageBelowCLevel?: any;
  fixWithoutAdvance?: any;
  seniorLevel?: any;
  executives?: any;
  nonExecutives?: any;
  other?: any;
  seniorLevelMoney?: number;
  seniorLevelCurrency?: string;
  executivesMoney?: number;
  executivesCurrency?: string;
  nonExecutivesMoney?: number;
  nonExecutivesCurrency?: string;
  otherMoney?: number;
  otherCurrency?: string;
  seniorLevelPercentage?: number;
  executivesPercentage?: number;
  nonExecutivesPercentage?: number;
  otherPercentage?: number;
  seniorLevelNotes?: string;
  executivesNotes?: string;
  nonExecutivesNotes?: string;
  otherNotes?: string;
  clientSource?: string;
  fixWithoutAdvanceNotes?: string;
  fixWithoutAdvanceValue?: number;
  clientPriority?: number;
  clientSegment?: string;
  technicalProposal?: any;
  financialProposal?: any;
  technicalProposalNotes?: string;
  financialProposalNotes?: string;
}

export interface CreateClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export type LevelType =
  | "seniorLevel"
  | "executives"
  | "nonExecutives"
  | "other"
  | "profileImage"
  | "crCopy"
  | "vatCopy"
  | "gstTinDocument"
  | "fixedPercentage"
  | "fixedPercentageAdvance"
  | "variablePercentageCLevel"
  | "variablePercentageBelowCLevel"
  | "fixWithoutAdvance";
