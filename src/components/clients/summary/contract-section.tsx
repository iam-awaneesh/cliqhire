"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DetailRow } from "./detail-row";
import { FileUploadRow } from "./file-upload-row";
import {
  createContract,
  updateContract,
  downloadAgreement,
  deleteAgreement,
  ContractResponse,
} from "@/services/contractService";

interface ContractTypeDetail {
  percentage: string;
  notes: string;
}

interface ContractDetailsState {
  contractStartDate: string | null;
  contractEndDate: string | null;
  contractType: string;
  contractTypeDetails: Record<string, ContractTypeDetail>;
  selectedLevels: string[];
  referralPercentage: string;
  lineOfBusiness: string[];
  contractDocument: File | null;
  contractDocumentName: string;
  clientName: string;
}

interface ContractSectionProps {
  clientId: string;
  clientData?: {
    contractStartDate?: string;
    contractEndDate?: string;
    labelType?: Partial<Record<"seniorLevel" | "executives" | "nonExecutives" | "other", string>>;
  };
}

export function ContractSection({ clientId, clientData }: ContractSectionProps) {
  const levelOptions = ["Senior Level", "Executives", "Non-Executives", "Other"];
  const contractTypes = ["Fixed Percentage", "Fix with Advance", "Fix without Advance", "Level Based (Hiring)"];
  const lineOfBusinessOptions = ["Recruitment", "HR Consulting", "Mgt Consulting", "Outsourcing", "HR Managed Services", "IT & Technology"];
  const [contract, setContract] = useState<ContractResponse | null>(null);
  const [contractDetails, setContractDetails] = useState<ContractDetailsState>({
    contractStartDate: null,
    contractEndDate: null,
    referralPercentage: "",
    lineOfBusiness: [],
    contractDocument: null,
    contractDocumentName: "",
    contractType: "",
    contractTypeDetails: {},
    selectedLevels: [],
    clientName: "",
  });
  const [isContractTypeDropdownOpen, setIsContractTypeDropdownOpen] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [isLineOfBusinessDropdownOpen, setIsLineOfBusinessDropdownOpen] = useState(false);
  const [tempLineOfBusiness, setTempLineOfBusiness] = useState<string[]>([]);
  const [editDialog, setEditDialog] = useState({ open: false, type: "", level: "", percentage: "", notes: "" });
  const [editingLevel, setEditingLevel] = useState<string | null>(null);
  const [isEditingContractType, setIsEditingContractType] = useState(false);
  const [status, setStatus] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });

  const patchClientData = useCallback(
    async (field: string, value: any) => {
      try {
        setStatus({ loading: true, error: "" });
        const response = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [field]: value,
            ...(contractDetails.clientName ? { clientName: contractDetails.clientName } : {}),
          }),
        });
        if (!response.ok) throw new Error(`Failed to update ${field}`);
        const updatedData = await response.json();
        return updatedData.data;
      } catch (error: any) {
        setStatus((prev) => ({ ...prev, error: error.message }));
        throw error;
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    },
    [clientId, contractDetails.clientName]
  );

  const updateContractDetails = useCallback((updates: Partial<ContractDetailsState>) => {
    setContractDetails((prev) => ({ ...prev, ...updates }));
  }, []);

  const fetchContractData = useCallback(async () => {
    if (!clientId) return;
    setStatus({ loading: true, error: "" });
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${clientId}`);
      if (!response.ok) throw new Error("Failed to fetch client data");
      const { data: client } = await response.json();

      const contractStartDate = client.contractStartDate || clientData?.contractStartDate || null;
      const contractEndDate = client.contractEndDate || clientData?.contractEndDate || null;
      const contractType = client.contractType || "Level Based (Hiring)";
      const contractTypeDetails: Record<string, ContractTypeDetail> = {};
      let selectedLevels: string[] = [];

      if (contractType === "Fixed Percentage") {
        contractTypeDetails[contractType] = {
          percentage: client.fixedPercentageValue?.toString() || "",
          notes: client.fixedPercentageNotes || "",
        };
      } else if (contractType === "Fix with Advance") {
        contractTypeDetails[contractType] = {
          percentage: client.fixWithAdvanceValue?.toString() || "",
          notes: client.fixedPercentageAdvanceNotes || "",
        };
      } else if (contractType === "Fix without Advance") {
        contractTypeDetails[contractType] = {
          percentage: client.fixWithoutAdvanceValue?.toString() || "",
          notes: client.fixWithoutAdvanceNotes || "",
        };
      } else if (contractType === "Level Based (Hiring)") {
        const levelsData: Record<string, ContractTypeDetail> = {};
        const activeLevels: string[] = [];
        const processLevel = (level: string, percentage: any, notes: any) => {
          if (percentage != null || notes) {
            const percentageStr = percentage != null ? String(percentage) : "";
            levelsData[level] = { percentage: percentageStr, notes: String(notes || "") };
            activeLevels.push(level);
          }
        };
        processLevel("Senior Level", client.seniorLevelPercentage, client.seniorLevelNotes);
        processLevel("Executives", client.executivesPercentage, client.executivesNotes);
        processLevel("Non-Executives", client.nonExecutivesPercentage, client.nonExecutivesNotes);
        processLevel("Other", client.otherPercentage, client.otherNotes);
        Object.assign(contractTypeDetails, levelsData);
        selectedLevels = activeLevels.sort((a, b) => levelOptions.indexOf(a) - levelOptions.indexOf(b));
      }

      setContract({
        _id: client.contractId || client._id,
        clientId,
        contractStartDate,
        contractEndDate,
        contractType,
        levelBasedDetails: contractType === "Level Based (Hiring)"
          ? Object.fromEntries(
              (["seniorLevel", "executives", "nonExecutives", "other"] as const)
                .map((key, i) => [key, client[`${key}Percentage`]])
                .filter(([, perc]) => typeof perc === "number")
                .map(([, perc], i) => [
                  ["seniorLevel", "executives", "nonExecutives", "other"][i],
                  { percentage: perc, notes: client[`${["seniorLevel", "executives", "nonExecutives", "other"][i]}Notes`] || "" },
                ])
            )
          : null,
        agreement: client.agreement || null,
        referralPercentage: parseFloat(client.referralPercentage) || 0,
        notes: client.contractNotes || client.notes || "",
        lineOfBusiness: client.lineOfBusiness || [],
        createdBy: client.createdBy,
        createdAt: client.createdAt || new Date().toISOString(),
        updatedAt: client.updatedAt || new Date().toISOString(),
      });

      let lob: string[] = [];
      if (Array.isArray(client.lineOfBusiness)) {
        lob = client.lineOfBusiness;
      } else if (typeof client.lineOfBusiness === 'string' && client.lineOfBusiness) {
                lob = client.lineOfBusiness.split(',').map((s: string) => s.trim());
      }

      updateContractDetails({
        contractStartDate,
        contractEndDate,
        referralPercentage: client.referralPercentage?.toString() || "",
        lineOfBusiness: lob,
        contractDocumentName: (client.agreement && (typeof client.agreement === 'string' ? client.agreement : client.agreement.fileName)) || "",
        contractType,
        contractTypeDetails,
        selectedLevels,
        clientName: client.name || "", // Changed from clientName to name to match CreateClientModal
      });

      if (!client.contractType && (contractStartDate || contractEndDate)) {
        const formData = new FormData();
        formData.append("clientId", clientId);
        if (contractStartDate) formData.append("contractStartDate", contractStartDate);
        if (contractEndDate) formData.append("contractEndDate", contractEndDate);
        formData.append("referralPercentage", "0");
        formData.append("clientName", client.name || "");
        const newContract = await createContract(formData as any);
        setContract(newContract);
        localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "new_contract" }));
      }
    } catch (error) {
      setStatus({ loading: false, error: "Failed to load contract data" });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }, [clientId, clientData, updateContractDetails]);

  useEffect(() => {
    fetchContractData();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "contractUpdate") {
        const updateData = event.newValue ? JSON.parse(event.newValue) : null;
        if (updateData?.clientId === clientId) fetchContractData();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [clientId, fetchContractData]);

  const handleUpdateField = useCallback(
    async (field: string, value: any) => {
      try {
        let processedValue = value;
        if ((field === "contractStartDate" || field === "contractEndDate") && value) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            processedValue = date.toISOString().split("T")[0];
          }
        }
        await patchClientData(field, processedValue);
        localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: field }));
        await fetchContractData();
      } catch (error) {
        console.error("Error updating field:", error);
        if (contract) updateContractDetails({ [field]: contract[field as keyof ContractResponse] || "" });
      }
    },
    [contract, clientId, patchClientData, updateContractDetails, fetchContractData]
  );

  const handleContractDocumentUpload = useCallback(
    async (file: File | null) => {
      if (!file) {
        // Handle the case where no file is selected or the file is removed.
        // For example, you might want to clear the contract document state.
        updateContractDetails({ contractDocument: null, contractDocumentName: "" });
        return;
      }
      try {
        updateContractDetails({ contractDocument: file, contractDocumentName: file.name });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("field", "agreement");
        formData.append("clientName", contractDetails.clientName);
        const response = await fetch(`http://localhost:5000/api/clients/${clientId}/upload`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Failed to upload agreement");
        const updatedData = await response.json();
        setContract((prev) => ({
          ...prev!,
          agreement: updatedData.data.agreement,
          updatedAt: new Date().toISOString(),
        }));
        localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "agreement" }));
      } catch (error) {
        setStatus((prev) => ({ ...prev, error: "Failed to upload agreement" }));
        updateContractDetails({ contractDocument: null, contractDocumentName: (contract?.agreement && (typeof contract.agreement === 'string' ? contract.agreement : contract.agreement.fileName)) || "" });
      }
    },
    [contract, clientId, contractDetails.clientName, updateContractDetails]
  );

  const handleDownloadContractDocument = useCallback(async () => {
    const fileName = contract?.agreement && (typeof contract.agreement === 'string' ? contract.agreement : contract.agreement.fileName);
    if (!fileName) {
      setStatus((prev) => ({ ...prev, error: "Agreement file is missing." }));
      return;
    }
    try {
      setStatus((prev) => ({ ...prev, loading: true, error: null }));
      const blob = await downloadAgreement(fileName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "agreement.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Detailed download error:", error);
      setStatus((prev) => ({ ...prev, error: "Failed to download agreement. See console for details." }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }, [contract]);

  const handlePreviewContractDocument = useCallback(async () => {
    const fileName = contract?.agreement && (typeof contract.agreement === 'string' ? contract.agreement : contract.agreement.fileName);
    if (!fileName) {
       setStatus((prev) => ({ ...prev, error: "Agreement file is missing." }));
      return;
    }
    try {
      setStatus((prev) => ({ ...prev, loading: true, error: null }));
      const blob = await downloadAgreement(fileName);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Detailed preview error:", error);
      setStatus((prev) => ({ ...prev, error: "Failed to preview agreement. See console for details." }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }, [contract]);

  const handleDeleteContractDocument = useCallback(async () => {
    const fileName = contract?.agreement && (typeof contract.agreement === 'string' ? contract.agreement : contract.agreement.fileName);
    if (!fileName) return;
    try {
      const updatedContract = await deleteAgreement(fileName);
      setContract(updatedContract);
      updateContractDetails({ contractDocument: null, contractDocumentName: "" });
      localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "agreement" }));
    } catch (error) {
      setStatus((prev) => ({ ...prev, error: "Failed to delete agreement" }));
    }
  }, [contract, clientId, updateContractDetails]);

  const handleContractTypeSelect = useCallback(
    async (type: string) => {
      try {
        updateContractDetails({
          contractType: type,
          selectedLevels: type === "Level Based (Hiring)" ? contractDetails.selectedLevels : [],
          contractTypeDetails: type === "Level Based (Hiring)" ? contractDetails.contractTypeDetails : {},
        });
        const updatedClient = await patchClientData("contractType", type);
        setContract((prev) => ({
          ...prev!,
          ...updatedClient,
          contractType: type,
          updatedAt: new Date().toISOString(),
        }));
        localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "contractType" }));
      } catch (error) {
        setStatus((prev) => ({ ...prev, error: "Failed to update contract type" }));
        updateContractDetails({ contractType: contract?.contractType || "" });
      }
    },
    [contract, clientId, contractDetails, patchClientData, updateContractDetails]
  );

  const handleLevelSelect = useCallback(
    async (level: string) => {
      const newLevels = contractDetails.selectedLevels.includes(level)
        ? contractDetails.selectedLevels.filter((l) => l !== level)
        : [...contractDetails.selectedLevels, level];
      try {
        updateContractDetails({ selectedLevels: newLevels });
        setIsLevelDropdownOpen(false);
        const updatedClient = await patchClientData("selectedLevels", newLevels);
        setContract((prev) => ({
          ...prev!,
          ...updatedClient,
          selectedLevels: newLevels,
          updatedAt: new Date().toISOString(),
        }));
        localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "selectedLevels" }));
      } catch (error) {
        setStatus((prev) => ({ ...prev, error: "Failed to update levels" }));
        updateContractDetails({ selectedLevels: contractDetails.selectedLevels });
      }
    },
    [contract, clientId, contractDetails, patchClientData, updateContractDetails]
  );

  const openLineOfBusinessDropdown = () => {
    setTempLineOfBusiness(contractDetails.lineOfBusiness);
    setIsLineOfBusinessDropdownOpen(true);
  };

  const handleTempLineOfBusinessSelect = (option: string) => {
    const newLOB = tempLineOfBusiness.includes(option)
      ? tempLineOfBusiness.filter((item) => item !== option)
      : [...tempLineOfBusiness, option];
    setTempLineOfBusiness(newLOB);
  };

  const saveLineOfBusiness = useCallback(async () => {
    try {
      const updatedClient = await patchClientData("lineOfBusiness", tempLineOfBusiness);
      updateContractDetails({ lineOfBusiness: tempLineOfBusiness });
      setContract((prev) => ({
        ...prev!,
        ...updatedClient,
        lineOfBusiness: tempLineOfBusiness,
      }));
      localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "lineOfBusiness" }));
      setIsLineOfBusinessDropdownOpen(false);
    } catch (error) {
      console.error("Failed to update Line of Business", error);
      setStatus((prev) => ({ ...prev, error: "Failed to save Line of Business" }));
    }
  }, [clientId, tempLineOfBusiness, patchClientData, updateContractDetails]);

  const cancelLineOfBusinessEdit = () => {
    setIsLineOfBusinessDropdownOpen(false);
  };

  const startEditing = useCallback((type: "level" | "contractType", level?: string) => {
    if (type === "level" && level) {
      setEditingLevel(level);
    } else {
      setEditingLevel("contractType");
    }
  }, []);

  const levelFieldMap: Record<string, { percentage: string; notes: string }> = {
    "Senior Level": { percentage: "seniorLevelPercentage", notes: "seniorLevelNotes" },
    "Executives": { percentage: "executivesPercentage", notes: "executivesNotes" },
    "Non-Executives": { percentage: "nonExecutivesPercentage", notes: "nonExecutivesNotes" },
    "Other": { percentage: "otherPercentage", notes: "otherNotes" },
  };

  const saveEdit = useCallback(
    async (type: "level" | "contractType", level?: string) => {
      try {
        const newDetails = { ...contractDetails.contractTypeDetails };
        if (type === "level" && level) {
          const { percentage, notes } = newDetails[level] || {};
          const percentageField = levelFieldMap[level]?.percentage;
          const notesField = levelFieldMap[level]?.notes;
          if (percentageField && notesField) {
            await patchClientDataBulk({
              [percentageField]: Number(percentage) || 0,
              [notesField]: notes || "",
            });
          }
        } else {
          const key = contractDetails.contractType;
          if (key === "Fixed Percentage") {
            await patchClientData("fixedPercentageValue", newDetails[key]?.percentage || "");
            await patchClientData("fixedPercentageNotes", newDetails[key]?.notes || "");
          } else if (key === "Fix with Advance") {
            await patchClientData("fixWithAdvanceValue", newDetails[key]?.percentage || "");
            await patchClientData("fixedPercentageAdvanceNotes", newDetails[key]?.notes || "");
          } else if (key === "Fix without Advance") {
            await patchClientData("fixWithoutAdvanceValue", newDetails[key]?.percentage || "");
            await patchClientData("fixWithoutAdvanceNotes", newDetails[key]?.notes || "");
          }
        }
        localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: type === "level" && level ? level : "contractType" }));
        setEditingLevel(null);
        await fetchContractData();
      } catch (error) {
        setStatus((prev) => ({ ...prev, error: "Failed to save changes" }));
      }
    },
    [clientId, contractDetails.contractType, contractDetails.contractTypeDetails, patchClientData, fetchContractData]
  );

  const patchClientDataBulk = useCallback(
    async (fields: Record<string, any>) => {
      try {
        setStatus({ loading: true, error: "" });
        const response = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...fields,
            ...(contractDetails.clientName ? { clientName: contractDetails.clientName } : {}),
          }),
        });
        if (!response.ok) throw new Error("Failed to update fields");
        const updatedData = await response.json();
        return updatedData.data;
      } catch (error: any) {
        setStatus((prev) => ({ ...prev, error: error.message }));
        throw error;
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    },
    [clientId, contractDetails.clientName]
  );

  const cancelEdit = useCallback(
    (type: "level" | "contractType", level?: string) => {
      setEditingLevel(null);
      updateContractDetails({
        contractTypeDetails: {
          ...contractDetails.contractTypeDetails,
          [level || contractDetails.contractType]: contractDetails.contractTypeDetails[level || contractDetails.contractType],
        },
      });
    },
    [contractDetails.contractType, contractDetails.contractTypeDetails, updateContractDetails]
  );

  const openEditDialog = useCallback(
    (type: string, level?: string) => {
      setEditDialog({
        open: true,
        type,
        level: level || "",
        percentage: level ? contractDetails.contractTypeDetails[level]?.percentage || "" : contractDetails.contractTypeDetails[type]?.percentage || "",
        notes: level ? contractDetails.contractTypeDetails[level]?.notes || "" : contractDetails.contractTypeDetails[type]?.notes || "",
      });
    },
    [contractDetails]
  );

  const saveEditDialog = useCallback(
    async () => {
      try {
        const { type, level, percentage, notes } = editDialog;
        const key = level || type;
        const newDetails = { ...contractDetails.contractTypeDetails, [key]: { percentage, notes } };
        updateContractDetails({ contractTypeDetails: newDetails });

        if (contractDetails.contractType === "Fixed Percentage") {
          await patchClientData("fixedPercentageValue", percentage);
          await patchClientData("fixedPercentageNotes", notes);
        } else if (contractDetails.contractType === "Fix with Advance") {
          await patchClientData("fixWithAdvanceValue", percentage);
          await patchClientData("fixedPercentageAdvanceNotes", notes);
        } else if (contractDetails.contractType === "Fix without Advance") {
          await patchClientData("fixWithoutAdvanceValue", percentage);
          await patchClientData("fixWithoutAdvanceNotes", notes);
        } else if (level) {
          const percentageField = levelFieldMap[level]?.percentage;
          const notesField = levelFieldMap[level]?.notes;
          if (percentageField && notesField) {
            await patchClientDataBulk({
              [percentageField]: Number(percentage) || 0,
              [notesField]: notes || "",
            });
          }
        }
        await fetchContractData();
        localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: level || type }));
        setEditDialog({ open: false, type: "", level: "", percentage: "", notes: "" });
      } catch (error) {
        setStatus((prev) => ({ ...prev, error: "Failed to save contract details" }));
      }
    },
    [contractDetails.contractType, contractDetails.contractTypeDetails, clientId, patchClientData, patchClientDataBulk, updateContractDetails, editDialog, fetchContractData]
  );

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">Contract Information</h2>
      {status.error && <div className="text-red-500 text-sm mt-2">{status.error}</div>}
      {status.loading && <div className="text-gray-500 text-sm mt-2">Loading...</div>}
      <div className="space-y-4 mt-4">
        <DetailRow label="Contract Start Date" value={contractDetails.contractStartDate} onUpdate={(value) => handleUpdateField("contractStartDate", value)} isDate />
        <DetailRow label="Contract End Date" value={contractDetails.contractEndDate} onUpdate={(value) => handleUpdateField("contractEndDate", value)} isDate />
        <div className="flex items-center space-x-4">
          <label className="w-1/3 text-sm font-medium text-gray-600">Contract Type</label>
          <div className="w-2/3 flex items-center space-x-2">
            {isEditingContractType ? (
              <div className="relative flex-1">
                <button
                  className="w-full bg-gray-100 border rounded-md p-2 text-sm text-gray-500 flex justify-between hover:bg-gray-200"
                  onClick={() => setIsContractTypeDropdownOpen(!isContractTypeDropdownOpen)}
                >
                  <span>{contractDetails.contractType || "Select Contract Type"}</span>
                  {isContractTypeDropdownOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>
                {isContractTypeDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                    {contractTypes.map((type) => (
                      <button
                        key={type}
                        className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-blue-50"
                        onClick={() => {
                          handleContractTypeSelect(type);
                          setIsContractTypeDropdownOpen(false);
                          setIsEditingContractType(false);
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 bg-gray-50 border rounded-md p-2 text-sm text-gray-800">
                {contractDetails.contractType || "No contract type selected"}
              </div>
            )}
            <button
              className="p-2 border rounded-md hover:bg-gray-100 group relative"
              onClick={() => {
                setIsEditingContractType(!isEditingContractType);
                if (!isEditingContractType) {
                  setIsContractTypeDropdownOpen(true);
                }
              }}
              aria-label={isEditingContractType ? "Cancel Edit" : "Edit Contract Type"}
            >
              {isEditingContractType ? (
                <X className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                {isEditingContractType ? "Cancel" : "Edit Contract Type"}
              </span>
            </button>
          </div>
        </div>
        {contractDetails.contractType && contractDetails.contractType !== "Level Based (Hiring)" && (
          <div className="ml-8 flex items-center space-x-4">
            <label className="w-1/3 text-sm font-medium text-gray-600">{contractDetails.contractType}</label>
            <div className="w-2/3 flex items-center space-x-2">
              <div className="relative w-1/3">
                <input
                  type="number"
                  value={contractDetails.contractTypeDetails[contractDetails.contractType]?.percentage || ""}
                  onChange={(e) =>
                    updateContractDetails({
                      contractTypeDetails: {
                        ...contractDetails.contractTypeDetails,
                        [contractDetails.contractType]: {
                          ...contractDetails.contractTypeDetails[contractDetails.contractType],
                          percentage: e.target.value,
                        },
                      },
                    })
                  }
                  readOnly={editingLevel !== "contractType"}
                  className={`w-full border rounded-md p-2 text-sm pr-6 ${
                    editingLevel === "contractType"
                      ? "focus:ring-2 focus:ring-blue-500 bg-white"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                  min="0"
                  max="100"
                  placeholder="0"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">%</span>
              </div>
              <input
                type="text"
                value={contractDetails.contractTypeDetails[contractDetails.contractType]?.notes || ""}
                onChange={(e) =>
                  updateContractDetails({
                    contractTypeDetails: {
                      ...contractDetails.contractTypeDetails,
                      [contractDetails.contractType]: {
                        ...contractDetails.contractTypeDetails[contractDetails.contractType],
                        notes: e.target.value,
                      },
                    },
                  })
                }
                readOnly={editingLevel !== "contractType"}
                className={`w-2/3 border rounded-md p-2 text-sm ${
                  editingLevel === "contractType"
                    ? "focus:ring-2 focus:ring-blue-500 bg-white"
                    : "bg-gray-50 cursor-not-allowed"
                }`}
                placeholder="Notes"
              />
              <div className="flex space-x-1">
                {editingLevel === "contractType" ? (
                  <>
                    <button
                      className="p-2 border rounded-md hover:bg-green-50 group relative"
                      onClick={() => saveEdit("contractType")}
                      aria-label="Save Changes"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        Save Changes
                      </span>
                    </button>
                    <button
                      className="p-2 border rounded-md hover:bg-gray-100 group relative"
                      onClick={() => cancelEdit("contractType")}
                      aria-label="Cancel Edit"
                    >
                      <X className="h-4 w-4" />
                      <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        Cancel
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    className="p-2 border rounded-md hover:bg-gray-100 group relative"
                    onClick={() => startEditing("contractType")}
                    aria-label={`Edit ${contractDetails.contractType} Details`}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      Edit {contractDetails.contractType} Details
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {contractDetails.contractType === "Level Based (Hiring)" && (
          <div className="ml-8 space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-sm font-medium text-gray-600">Levels</label>
              <div className="relative w-3/4 flex space-x-2">
                <button
                  className="flex-1 bg-gray-100 border rounded-md p-2 text-sm text-gray-800 flex justify-between hover:bg-gray-200"
                  onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                >
                  {contractDetails.selectedLevels.join(", ") || "Select Levels"}
                  {isLevelDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <button
                  className="p-2 border rounded-md hover:bg-gray-100 group relative"
                  onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                  aria-label="Edit Levels"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 -translate-x-1/2">
                    Edit Levels
                  </span>
                </button>
                {isLevelDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border rounded-md mt-10 shadow-lg">
                    {levelOptions.map((level) => (
                      <button
                        key={level}
                        className={`w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-blue-50 ${
                          contractDetails.selectedLevels.includes(level) ? "bg-blue-100" : ""
                        }`}
                        onClick={() => handleLevelSelect(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {contractDetails.selectedLevels.map((level) => (
              <div key={level} className="ml-4 flex items-center space-x-4">
                <label className="w-1/4 text-sm font-medium text-gray-600">{level}</label>
                <div className="w-3/4 flex items-center space-x-2">
                  <div className="relative w-1/3">
                    <input
                      type="number"
                      value={contractDetails.contractTypeDetails[level]?.percentage || ""}
                      onChange={(e) =>
                        updateContractDetails({
                          contractTypeDetails: {
                            ...contractDetails.contractTypeDetails,
                            [level]: { ...contractDetails.contractTypeDetails[level], percentage: e.target.value },
                          },
                        })
                      }
                      readOnly={editingLevel !== level}
                      className={`w-full border rounded-md p-2 text-sm pr-6 ${
                        editingLevel === level
                          ? "focus:ring-2 focus:ring-blue-500 bg-white"
                          : "bg-gray-50 cursor-not-allowed"
                      }`}
                      min="0"
                      max="100"
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">%</span>
                  </div>
                  <input
                    type="text"
                    value={contractDetails.contractTypeDetails[level]?.notes || ""}
                    onChange={(e) =>
                      updateContractDetails({
                        contractTypeDetails: {
                          ...contractDetails.contractTypeDetails,
                          [level]: { ...contractDetails.contractTypeDetails[level], notes: e.target.value },
                        },
                      })
                    }
                    readOnly={editingLevel !== level}
                    className={`w-2/3 border rounded-md p-2 text-sm ${
                      editingLevel === level
                        ? "focus:ring-2 focus:ring-blue-500 bg-white"
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    placeholder="Notes"
                  />
                  <div className="flex space-x-1">
                    {editingLevel === level ? (
                      <>
                        <button
                          className="p-2 border rounded-md hover:bg-green-50 group relative"
                          onClick={() => saveEdit("level", level)}
                          aria-label={`Save ${level} Details`}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            Save Changes
                          </span>
                        </button>
                        <button
                          className="p-2 border rounded-md hover:bg-gray-100 group relative"
                          onClick={() => cancelEdit("level", level)}
                          aria-label={`Cancel Edit`}
                        >
                          <X className="h-4 w-4" />
                          <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            Cancel
                          </span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="p-2 border rounded-md hover:bg-gray-100 group relative"
                          onClick={() => startEditing("level", level)}
                          aria-label={`Edit ${level} Details`}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            Edit {level} Details
                          </span>
                        </button>
                        <button
                          className="p-2 border rounded-md hover:bg-red-50 group relative"
                          onClick={() => handleLevelSelect(level)}
                          aria-label={`Remove ${level}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            Remove {level}
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center space-x-4 py-2 border-t border-gray-200">
          <label className="w-1/4 text-sm font-medium text-gray-600">Line of Business</label>
          <div className="relative w-3/4 flex space-x-2">
            <div className="flex-1 relative">
              <div
                className="w-full bg-gray-100 border rounded-md p-2 text-sm text-gray-800 flex justify-between items-center"
              >
                <span className="truncate pr-8">
                  {contractDetails.lineOfBusiness.length > 0
                    ? contractDetails.lineOfBusiness.join(", ")
                    : "Select Line of Business"}
                </span>
              </div>
              {isLineOfBusinessDropdownOpen && (
                <div className="absolute z-20 w-full bg-white border rounded-md mt-1 shadow-lg">
                  {lineOfBusinessOptions.map((option) => (
                    <label
                      key={option}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-blue-50 flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={tempLineOfBusiness.includes(option)}
                        onChange={() => handleTempLineOfBusinessSelect(option)}
                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      {option}
                    </label>
                  ))}
                  <div className="flex justify-end space-x-2 p-2 bg-gray-50 border-t">
                    <button onClick={cancelLineOfBusinessEdit} className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100">Cancel</button>
                    <button onClick={saveLineOfBusiness} className="px-4 py-2 text-sm rounded-md border bg-blue-600 text-white hover:bg-blue-700">Save</button>
                  </div>
                </div>
              )}
            </div>
            <button
              className="p-2 border rounded-md hover:bg-gray-100 group relative"
              onClick={openLineOfBusinessDropdown}
              aria-label="Edit Line of Business"
            >
              <Pencil className="h-4 w-4" />
              <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 -translate-x-1/2">
                Edit
              </span>
            </button>
          </div>
        </div>
        <FileUploadRow
          id="contract-document-upload"
          label="Contract Document"
          onFileSelect={handleContractDocumentUpload}
          docUrl={contract?.agreement?.filePath}
          currentFileName={contractDetails.contractDocumentName}
          onPreview={contract?.agreement ? handlePreviewContractDocument : undefined}
          onDownload={contract?.agreement ? handleDownloadContractDocument : undefined}
        />
      </div>
      {editDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Percentage</label>
                <div className="relative">
                  <input
                    type="number"
                    value={editDialog.percentage}
                    onChange={(e) => setEditDialog((prev) => ({ ...prev, percentage: e.target.value }))}
                    className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 pr-6"
                    min="0"
                    max="100"
                    placeholder="0"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
                <textarea
                  value={editDialog.notes}
                  onChange={(e) => setEditDialog((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-800 hover:bg-gray-300"
                  onClick={() => setEditDialog({ open: false, type: "", level: "", percentage: "", notes: "" })}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  onClick={saveEditDialog}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}