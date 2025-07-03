import React from "react";
import { Button } from "@/components/ui/button";

interface BusinessTabsProps {
  formData: any;
  setFormData: any;
  activeBusinessTab: string | null;
  setActiveBusinessTab: (tab: string | null) => void;
  previewBusinessTab: string | null;
  setPreviewBusinessTab: (tab: string | null) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  modalBusiness: string | null;
  setModalBusiness: (business: string | null) => void;
  savedContracts: { [business: string]: boolean };
  setSavedContracts: React.Dispatch<React.SetStateAction<{ [business: string]: boolean }>>;
  setBusinessContracts: (business: string, data: any) => void;
}

export const BusinessTabs: React.FC<BusinessTabsProps> = ({
  formData,
  setFormData,
  activeBusinessTab,
  setActiveBusinessTab,
  previewBusinessTab,
  setPreviewBusinessTab,
  modalOpen,
  setModalOpen,
  modalBusiness,
  setModalBusiness,
  savedContracts,
  setSavedContracts,
  setBusinessContracts,
}) => {
  return (
    <div className="w-full rounded-xl border p-2 bg-[#f5f6f7] ">
      {/* ...existing code for business tabs... */}
    </div>
  );
};
