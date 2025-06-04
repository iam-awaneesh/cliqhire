import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DetailRow } from "./detail-row";
import { FileUploadRow } from "./file-upload-row";
import {
  createContract,
  updateContract,
  getContractByClient,
  downloadAgreement,
  deleteAgreement,
  ContractResponse,
} from "@/services/contractService";
import { getClientById } from "@/services/clientService";

interface ContractSectionProps {
  clientId: string;
  clientData?: {
    contractStartDate?: string;
    contractEndDate?: string;
  };
}

export function ContractSection({ clientId, clientData }: ContractSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contract, setContract] = useState<ContractResponse | null>(null);
  const [showVariablePercentages, setShowVariablePercentages] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [contractDetails, setContractDetails] = useState({
    contractStartDate: null as string | null,
    contractEndDate: null as string | null,
    fixedPercentage: "",
    fixWithAdvance: "",
    fixWithoutAdvance: "",
    variablePercentage: {
      seniorLevel: "",
      executives: "",
      nonExecutives: "",
      other: "",
    },
    referralPercentage: "",
    lineOfBusiness: "",
    contractDocument: null as File | null,
    contractDocumentName: "",
  });

  // Fetch contract data and initialize with client data when component loads
  useEffect(() => {
    const fetchContractData = async () => {
      if (!clientId) return;

      try {
        setLoading(true);
        let contractData: ContractResponse | null = null;
        let fetchedClientData;

        // Try to fetch existing contract
        try {
          contractData = await getContractByClient(clientId);
        } catch (err) {
          // If contract not found, proceed with client data
          console.log("No existing contract found, proceeding with client data");
        }

        // Fetch client data if not provided via props
        fetchedClientData = clientData || (await getClientById(clientId));

        // Use client data from props or API
        const contractStartDate =
          contractData?.contractStartDate || fetchedClientData.contractStartDate || null;
        const contractEndDate =
          contractData?.contractEndDate || fetchedClientData.contractEndDate || null;

        // Update contract state
        setContract(contractData);

        // Update form state with contract and client data
        setContractDetails({
          contractStartDate,
          contractEndDate,
          fixedPercentage: contractData?.fixedPercentage?.toString() || "",
          fixWithAdvance: contractData?.fixWithAdvance?.toString() || "",
          fixWithoutAdvance: contractData?.fixWithoutAdvance?.toString() || "",
          variablePercentage: {
            seniorLevel: contractData?.variablePercentage?.seniorLevel?.toString() || "",
            executives: contractData?.variablePercentage?.executives?.toString() || "",
            nonExecutives: contractData?.variablePercentage?.nonExecutives?.toString() || "",
            other: contractData?.variablePercentage?.other?.toString() || "",
          },
          referralPercentage: contractData?.referralPercentage?.toString() || "",
          lineOfBusiness: contractData?.lineOfBusiness || ('lineOfBusiness' in fetchedClientData && fetchedClientData.lineOfBusiness ? fetchedClientData.lineOfBusiness.join(", ") : ""),
          contractDocument: null,
          contractDocumentName: contractData?.agreement?.fileName || "",
        });

        // Show variable percentages if any is set
        if (
          contractData?.variablePercentage?.seniorLevel ||
          contractData?.variablePercentage?.executives ||
          contractData?.variablePercentage?.nonExecutives ||
          contractData?.variablePercentage?.other
        ) {
          setShowVariablePercentages(true);
        }

        // If no contract exists but client data has dates, create a new contract
        if (!contractData && (contractStartDate || contractEndDate)) {
          const formData = new FormData();
          formData.append("clientId", clientId);
          if (contractStartDate) formData.append("contractStartDate", contractStartDate);
          if (contractEndDate) formData.append("contractEndDate", contractEndDate);
          formData.append("fixedPercentage", "0");
          formData.append("referralPercentage", "0");
          formData.append("variablePercentage", JSON.stringify({
            seniorLevel: "",
            executives: "",
            nonExecutives: "",
            other: "",
          }));

          try {
            const newContract = await createContract(formData as any);
            setContract(newContract);
          } catch (error) {
            console.error("Error creating initial contract:", error);
            setError("Failed to initialize contract with client dates");
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching contract data:", error);
        setError("Failed to load contract data");
        setLoading(false);
      }
    };

    fetchContractData();
  }, [clientId, clientData]);

  // Handle contract field updates
  const handleUpdateField = async (field: string, value: any) => {
    // Update local state first for immediate feedback
    setContractDetails((prev) => ({
      ...prev,
      [field]: value,
    }));

    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append(field, value);

      let updatedContract;

      if (contract) {
        // Update existing contract
        updatedContract = await updateContract(contract._id, formData as any);
      } else {
        // Create new contract if none exists
        formData.append("clientId", clientId);
        formData.append("fixedPercentage", contractDetails.fixedPercentage || "0");
        formData.append("referralPercentage", contractDetails.referralPercentage || "0");
        formData.append("variablePercentage", JSON.stringify(contractDetails.variablePercentage));
        if (contractDetails.contractStartDate)
          formData.append("contractStartDate", contractDetails.contractStartDate);
        if (contractDetails.contractEndDate)
          formData.append("contractEndDate", contractDetails.contractEndDate);
        updatedContract = await createContract(formData as any);
      }

      // Update contract state with response
      setContract(updatedContract);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setError(`Failed to update ${field}`);

      // Revert to previous value on error
      if (contract) {
        setContractDetails((prev) => ({
          ...prev,
          [field]: contract[field as keyof ContractResponse] || "",
        }));
      }
    }
  };

  // Handle contract document file upload
  const handleContractDocumentUpload = async (file: File) => {
    try {
      // Update local state for immediate feedback
      setContractDetails((prev) => ({
        ...prev,
        contractDocument: file,
        contractDocumentName: file.name,
      }));

      // Create FormData for the API call
      const formData = new FormData();
      formData.append("agreement", file); // Keep the API field name as 'agreement'

      let updatedContract;

      if (contract) {
        // Update existing contract
        updatedContract = await updateContract(contract._id, formData as any);
      } else {
        // Create new contract with minimum required fields
        formData.append("clientId", clientId);
        formData.append("fixedPercentage", contractDetails.fixedPercentage || "0");
        formData.append("referralPercentage", contractDetails.referralPercentage || "0");
        formData.append("variablePercentage", JSON.stringify(contractDetails.variablePercentage));
        if (contractDetails.contractStartDate)
          formData.append("contractStartDate", contractDetails.contractStartDate);
        if (contractDetails.contractEndDate)
          formData.append("contractEndDate", contractDetails.contractEndDate);
        updatedContract = await createContract(formData as any);
      }

      // Update contract state with response
      setContract(updatedContract);
    } catch (error) {
      console.error("Error uploading agreement:", error);
      setError("Failed to upload agreement");

      // Reset contract document info on error
      setContractDetails((prev) => ({
        ...prev,
        contractDocument: null,
        contractDocumentName: contract?.agreement?.fileName || "",
      }));
    }
  };

  // Handle contract document download
  const handleDownloadContractDocument = async () => {
    if (!contract || !contract._id) return;

    try {
      const blob = await downloadAgreement(contract._id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = contract.agreement?.fileName || "agreement.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading agreement:", error);
      setError("Failed to download agreement");
    }
  };

  // Handle contract document deletion
  const handleDeleteContractDocument = async () => {
    if (!contract || !contract._id) return;

    try {
      const updatedContract = await deleteAgreement(contract._id);

      // Update contract state
      setContract(updatedContract);

      // Update form state
      setContractDetails((prev) => ({
        ...prev,
        contractDocument: null,
        contractDocumentName: "",
      }));
    } catch (error) {
      console.error("Error deleting agreement:", error);
      setError("Failed to delete agreement");
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="text-sm font-semibold">Contract Information</h2>
      {error && <div className="text-red-500 text-sm my-2">{error}</div>}

      <div className="space-y-3 mt-4">
        <DetailRow
          label="Contract Start Date"
          value={contractDetails.contractStartDate}
          onUpdate={(value) => handleUpdateField("contractStartDate", value)}
          isDate={true}
        />
        <DetailRow
          label="Contract End Date"
          value={contractDetails.contractEndDate}
          onUpdate={(value) => handleUpdateField("contractEndDate", value)}
          isDate={true}
        />
        
        {/* Show all contract options in edit mode or if none have values */}
        {(editMode || (!contractDetails.fixedPercentage && !contractDetails.fixWithAdvance && !contractDetails.fixWithoutAdvance && 
          !contractDetails.variablePercentage.seniorLevel && !contractDetails.variablePercentage.executives && 
          !contractDetails.variablePercentage.nonExecutives && !contractDetails.variablePercentage.other)) && (
          <>
            <DetailRow
              label="Fixed Percentage"
              value={contractDetails.fixedPercentage}
              onUpdate={(value) => {
                handleUpdateField("fixedPercentage", value);
                setEditMode(false);
              }}
              isNumber={true}
              min={0}
              max={100}
              suffix="%"
            />
            <DetailRow
              label="Fix with Advance"
              value={contractDetails.fixWithAdvance}
              onUpdate={(value) => {
                handleUpdateField("fixWithAdvance", value);
                setEditMode(false);
              }}
              isNumber={true}
              min={0}
              max={100}
              suffix="%"
            />
            <DetailRow
              label="Fix without Advance"
              value={contractDetails.fixWithoutAdvance}
              onUpdate={(value) => {
                handleUpdateField("fixWithoutAdvance", value);
                setEditMode(false);
              }}
              isNumber={true}
              min={0}
              max={100}
              suffix="%"
            />
          </>
        )}
        
        {/* Show only the filled contract option when not in edit mode */}
        {!editMode && contractDetails.fixedPercentage && (
          <DetailRow
            label="Fixed Percentage"
            value={contractDetails.fixedPercentage}
            onUpdate={(value) => {
              setEditMode(true);
            }}
            isNumber={true}
            min={0}
            max={100}
            suffix="%"
          />
        )}
        {!editMode && contractDetails.fixWithAdvance && (
          <DetailRow
            label="Fix with Advance"
            value={contractDetails.fixWithAdvance}
            onUpdate={(value) => {
              setEditMode(true);
            }}
            isNumber={true}
            min={0}
            max={100}
            suffix="%"
          />
        )}
        {!editMode && contractDetails.fixWithoutAdvance && (
          <DetailRow
            label="Fix without Advance"
            value={contractDetails.fixWithoutAdvance}
            onUpdate={(value) => {
              setEditMode(true);
            }}
            isNumber={true}
            min={0}
            max={100}
            suffix="%"
          />
        )}
        
        {/* Only show variable percentage section if in edit mode or if no other contract options are filled */}
        {(editMode || (!contractDetails.fixedPercentage && !contractDetails.fixWithAdvance && !contractDetails.fixWithoutAdvance) || 
          (contractDetails.variablePercentage.seniorLevel || contractDetails.variablePercentage.executives || 
          contractDetails.variablePercentage.nonExecutives || contractDetails.variablePercentage.other)) && (
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm text-gray-500 ">Variable Percentage</span>
            <button
              onClick={() => setShowVariablePercentages(!showVariablePercentages)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-expanded={showVariablePercentages}
              aria-controls="variable-percentage-fields"
            >
              {showVariablePercentages ? (
                <ChevronUp size={16} className="transition-transform" />
              ) : (
                <ChevronDown size={16} className="transition-transform" />
              )}
            </button>
          </div>
        )}

        {showVariablePercentages && (
          <div id="variable-percentage-fields" className="space-y-3 pl-2">
            <DetailRow
              label="Senior Level Percentage"
              value={contractDetails.variablePercentage.seniorLevel}
              onUpdate={(value) => {
                handleUpdateField("seniorLevel", value);
                setEditMode(false);
              }}
              isNumber={true}
              min={0}
              max={100}
              suffix="%"
            />
            <DetailRow
              label="Executives Percentage"
              value={contractDetails.variablePercentage.executives}
              onUpdate={(value) => {
                handleUpdateField("executives", value);
                setEditMode(false);
              }}
              isNumber={true}
              min={0}
              max={100}
              suffix="%"
            />
            <DetailRow
              label="Non-Executives Percentage"
              value={contractDetails.variablePercentage.nonExecutives}
              onUpdate={(value) => {
                handleUpdateField("nonExecutives", value);
                setEditMode(false);
              }}
              isNumber={true}
              min={0}
              max={100}
              suffix="%"
            />
            <DetailRow
              label="Other Percentage"
              value={contractDetails.variablePercentage.other}
              onUpdate={(value) => {
                handleUpdateField("other", value);
                setEditMode(false);
              }}
              isNumber={true}
              min={0}
              max={100}
              suffix="%"
            />
          </div>
        )}
        
        <DetailRow
          label="Referral Percentage"
          value={contractDetails.referralPercentage}
          onUpdate={(value) => handleUpdateField("referralPercentage", value)}
          isNumber={true}
          min={0}
          max={100}
          suffix="%"
        />
        <DetailRow
          label="Line of Business"
          value={contractDetails.lineOfBusiness}
          onUpdate={(value) => handleUpdateField("lineOfBusiness", value)}
        />
        <FileUploadRow
          label="Contract Document"
          accept=".pdf,.doc,.docx"
          onFileSelect={handleContractDocumentUpload}
          currentFileName={contractDetails.contractDocumentName}
          onDownload={contract?.agreement ? handleDownloadContractDocument : undefined}
          onDelete={contract?.agreement ? handleDeleteContractDocument : undefined}
        />
      </div>
    </div>
  );
}