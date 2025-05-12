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

interface ContractSectionProps {
  clientId: string;
}

export function ContractSection({ clientId }: ContractSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contract, setContract] = useState<ContractResponse | null>(null);
  const [showVariablePercentages, setShowVariablePercentages] = useState(false);
  const [contractDetails, setContractDetails] = useState({
    contractStartDate: null as string | null,
    contractEndDate: null as string | null,
    fixedPercentage: "",
    variablePercentage: {
      cLevel: "",
      belowCLevel: "",
    },
    referralPercentage: "",
    lineOfBusiness: "",
    agreement: null as File | null,
    agreementName: "",
  });

  // Fetch contract data when component loads
  useEffect(() => {
    const fetchContractData = async () => {
      if (!clientId) return;

      try {
        setLoading(true);
        const contractData = await getContractByClient(clientId);

        // Update contract state
        setContract(contractData);

        // Update form state
        setContractDetails({
          contractStartDate: contractData.contractStartDate || null,
          contractEndDate: contractData.contractEndDate || null,
          fixedPercentage: contractData.fixedPercentage?.toString() || "",
          variablePercentage: {
            cLevel: contractData.variablePercentage?.cLevel?.toString() || "",
            belowCLevel: contractData.variablePercentage?.belowCLevel?.toString() || "",
          },
          referralPercentage: contractData.referralPercentage?.toString() || "",
          lineOfBusiness: contractData.lineOfBusiness || "",
          agreement: null,
          agreementName: contractData.agreement?.fileName || "",
        });

        // Show variable percentages if either is set
        if (contractData.variablePercentage?.cLevel || contractData.variablePercentage?.belowCLevel) {
          setShowVariablePercentages(true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching contract data:", error);
        // If no contract exists yet, that's not an error
        if ((error as Error).message.includes("not found")) {
          setContract(null);
          setLoading(false);
        } else {
          setError("Failed to load contract data");
          setLoading(false);
        }
      }
    };

    fetchContractData();
  }, [clientId]);

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
          [field]: contract[field as keyof ContractResponse],
        }));
      }
    }
  };

  const handleUpdateVariablePercentage = async (field: "cLevel" | "belowCLevel", value: string) => {
    // Update local state first
    setContractDetails((prev) => ({
      ...prev,
      variablePercentage: {
        ...prev.variablePercentage,
        [field]: value,
      },
    }));

    try {
      // Create FormData for the API call
      const formData = new FormData();

      // Send the whole variablePercentage object
      const updatedVariablePercentage = {
        ...contractDetails.variablePercentage,
        [field]: value,
      };

      formData.append("variablePercentage", JSON.stringify(updatedVariablePercentage));

      let updatedContract;

      if (contract) {
        // Update existing contract
        updatedContract = await updateContract(contract._id, formData as any);
      } else {
        // Create new contract if none exists
        formData.append("clientId", clientId);
        formData.append("fixedPercentage", contractDetails.fixedPercentage || "0");
        formData.append("referralPercentage", contractDetails.referralPercentage || "0");
        updatedContract = await createContract(formData as any);
      }

      // Update contract state with response
      setContract(updatedContract);
    } catch (error) {
      console.error(`Error updating variable percentage:`, error);
      setError(`Failed to update variable percentage`);

      // Revert to previous value on error
      if (contract) {
        setContractDetails((prev) => ({
          ...prev,
          variablePercentage: {
            cLevel: contract.variablePercentage?.cLevel?.toString() || "",
            belowCLevel: contract.variablePercentage?.belowCLevel?.toString() || "",
          },
        }));
      }
    }
  };

  // Handle agreement file upload
  const handleAgreementUpload = async (file: File) => {
    try {
      // Update local state for immediate feedback
      setContractDetails((prev) => ({
        ...prev,
        agreement: file,
        agreementName: file.name,
      }));

      // Create FormData for the API call
      const formData = new FormData();
      formData.append("agreement", file);

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
        updatedContract = await createContract(formData as any);
      }

      // Update contract state with response
      setContract(updatedContract);
    } catch (error) {
      console.error("Error uploading agreement:", error);
      setError("Failed to upload agreement");

      // Reset agreement info on error
      setContractDetails((prev) => ({
        ...prev,
        agreement: null,
        agreementName: contract?.agreement?.fileName || "",
      }));
    }
  };

  // Handle agreement download
  const handleDownloadAgreement = async () => {
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

  // Handle agreement deletion
  const handleDeleteAgreement = async () => {
    if (!contract || !contract._id) return;

    try {
      const updatedContract = await deleteAgreement(contract._id);

      // Update contract state
      setContract(updatedContract);

      // Update form state
      setContractDetails((prev) => ({
        ...prev,
        agreement: null,
        agreementName: "",
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
        <DetailRow
          label="Fixed Percentage"
          value={contractDetails.fixedPercentage}
          onUpdate={(value) => handleUpdateField("fixedPercentage", value)}
          isNumber={true}
          min={0}
          max={100}
          suffix="%"
        />

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

        {showVariablePercentages && (
          <div id="variable-percentage-fields" className="space-y-3 pl-2">
            <DetailRow
              label="C-Level Percentage"
              value={contractDetails.variablePercentage.cLevel}
              onUpdate={(value) => handleUpdateVariablePercentage("cLevel", value)}
              isNumber={true}
              min={0}
              max={100}
              suffix="%"
            />

            <DetailRow
              label="Below C-Level Percentage"
              value={contractDetails.variablePercentage.belowCLevel}
              onUpdate={(value) => handleUpdateVariablePercentage("belowCLevel", value)}
              isNumber={true}
              min={0}
              max={100}
              suffix="%"
            />
          </div>
        )}

        {/* <DetailRow
          label="Referral Percentage"
          value={contractDetails.referralPercentage}
          onUpdate={(value) => handleUpdateField("referralPercentage", value)}
          isNumber={true}
          min={0}
          max={100}
          suffix="%"
        /> */}

        <DetailRow
          label="Line of Business"
          value={contractDetails.lineOfBusiness}
          onUpdate={(value) => handleUpdateField("lineOfBusiness", value)}
        />

        <FileUploadRow
          label="Agreement"
          accept=".pdf,.doc,.docx"
          onFileSelect={handleAgreementUpload}
          currentFileName={contractDetails.agreementName}
          onDownload={contract?.agreement ? handleDownloadAgreement : undefined}
          onDelete={contract?.agreement ? handleDeleteAgreement : undefined}
        />
      </div>
    </div>
  );
}