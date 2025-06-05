// // import { useEffect, useState } from "react";
// // import { ChevronDown, ChevronUp } from "lucide-react";
// // import { DetailRow } from "./detail-row";
// // import { FileUploadRow } from "./file-upload-row";
// // import {
// //   createContract,
// //   updateContract,
// //   getContractByClient,
// //   downloadAgreement,
// //   deleteAgreement,
// //   ContractResponse,
// // } from "@/services/contractService";
// // import { getClientById } from "@/services/clientService";

// // interface ContractSectionProps {
// //   clientId: string;
// //   clientData?: {
// //     contractStartDate?: string;
// //     contractEndDate?: string;
// //     labelType?: {
// //       seniorLevel?: string;
// //       executives?: string;
// //       nonExecutives?: string;
// //       other?: string;
// //     };
// //   };
// // }

// // export function ContractSection({ clientId, clientData }: ContractSectionProps) {
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [contract, setContract] = useState<ContractResponse | null>(null);
// //   const [showVariablePercentages, setShowVariablePercentages] = useState(false);
// //   const [editMode, setEditMode] = useState(false);
// //   const [showEditModal, setShowEditModal] = useState(false);
// //   const [selectedPercentageField, setSelectedPercentageField] = useState<string | null>(null);
// //   const [contractDetails, setContractDetails] = useState({
// //     contractStartDate: null as string | null,
// //     contractEndDate: null as string | null,
// //     fixedPercentage: "",
// //     fixWithAdvance: "",
// //     fixWithoutAdvance: "",
// //     variablePercentage: {
// //       seniorLevel: "",
// //       executives: "",
// //       nonExecutives: "",
// //       other: "",
// //     },
// //     referralPercentage: "",
// //     lineOfBusiness: "",
// //     contractDocument: null as File | null,
// //     contractDocumentName: "",
// //   });

// //   // Fetch contract data
// //   const fetchContractData = async () => {
// //     if (!clientId) return;

// //     try {
// //       setLoading(true);
// //       let contractData: ContractResponse | null = null;
// //       let fetchedClientData: any;
// //       let parsedLabelType: {
// //         seniorLevel?: string;
// //         executives?: string;
// //         nonExecutives?: string;
// //         other?: string;
// //       } = {};

// //       // Try to fetch existing contract
// //       try {
// //         contractData = await getContractByClient(clientId);
// //         console.log("Fetched contract data:", contractData); // Debug log
// //       } catch (err) {
// //         console.log("No existing contract found, proceeding with client data");
// //       }

// //       // Fetch client data if not provided via props
// //       fetchedClientData = clientData || (await getClientById(clientId));

// //       // Parse labelType if it exists
// //       if (fetchedClientData && 'labelType' in fetchedClientData) {
// //         const labelType = fetchedClientData.labelType;
// //         if (typeof labelType === 'string') {
// //           try {
// //             parsedLabelType = JSON.parse(labelType);
// //           } catch (e) {
// //             console.error('Error parsing labelType:', e);
// //           }
// //         } else if (typeof labelType === 'object' && labelType !== null) {
// //           parsedLabelType = { ...labelType };
// //         }
// //       }

// //       // Use client data from props or API
// //       const contractStartDate = 
// //         contractData?.contractStartDate || 
// //         (fetchedClientData?.contractStartDate || null);
        
// //       const contractEndDate = 
// //         contractData?.contractEndDate || 
// //         (fetchedClientData?.contractEndDate || null);

// //       // Determine which percentage field is filled
// //       const percentageFields = [
// //         { key: 'fixedPercentage', value: contractData?.fixedPercentage ?? 0 },
// //         { key: 'fixWithAdvance', value: contractData?.fixWithAdvance ?? 0 },
// //         { key: 'fixWithoutAdvance', value: contractData?.fixWithoutAdvance ?? 0 },
// //       ];
// //       const filledField = percentageFields.find(field => field.value > 0);
// //       const newSelectedField = filledField ? filledField.key : null;
// //       setSelectedPercentageField(newSelectedField);
// //       console.log("Selected percentage field:", newSelectedField); // Debug log

// //       // Update contract state
// //       setContract(contractData);

// //       // Update form state with contract and client data
// //       setContractDetails({
// //         contractStartDate,
// //         contractEndDate,
// //         fixedPercentage: contractData?.fixedPercentage?.toString() || "",
// //         fixWithAdvance: contractData?.fixWithAdvance?.toString() || "",
// //         fixWithoutAdvance: contractData?.fixWithoutAdvance?.toString() || "",
// //         variablePercentage: {
// //           seniorLevel: contractData?.variablePercentage?.seniorLevel?.toString() || "",
// //           executives: contractData?.variablePercentage?.executives?.toString() || "",
// //           nonExecutives: contractData?.variablePercentage?.nonExecutives?.toString() || "",
// //           other: contractData?.variablePercentage?.other?.toString() || "",
// //         },
// //         referralPercentage: contractData?.referralPercentage?.toString() || "",
// //         lineOfBusiness: contractData?.lineOfBusiness || 
// //           (fetchedClientData?.lineOfBusiness ? 
// //             (Array.isArray(fetchedClientData.lineOfBusiness) ? 
// //               fetchedClientData.lineOfBusiness.join(", ") : 
// //               String(fetchedClientData.lineOfBusiness)) : ""),
// //         contractDocument: null,
// //         contractDocumentName: contractData?.agreement?.fileName || "",
// //       });

// //       // Show variable percentages if any is set
// //       if (
// //         contractData?.variablePercentage?.seniorLevel ||
// //         contractData?.variablePercentage?.executives ||
// //         contractData?.variablePercentage?.nonExecutives ||
// //         contractData?.variablePercentage?.other
// //       ) {
// //         setShowVariablePercentages(true);
// //       }

// //       // If no contract exists but client data has dates, create a new contract
// //       if (!contractData && (contractStartDate || contractEndDate)) {
// //         const formData = new FormData();
// //         formData.append("clientId", clientId);
// //         if (contractStartDate) formData.append("contractStartDate", contractStartDate);
// //         if (contractEndDate) formData.append("contractEndDate", contractEndDate);
// //         formData.append("fixedPercentage", "0");
// //         formData.append("referralPercentage", "0");
// //         formData.append("variablePercentage", JSON.stringify({
// //           seniorLevel: "",
// //           executives: "",
// //           nonExecutives: "",
// //           other: "",
// //         }));

// //         try {
// //           const newContract = await createContract(formData as any);
// //           setContract(newContract);
// //           // Notify other tabs of the new contract
// //           localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now() }));
// //         } catch (error) {
// //           console.error("Error creating initial contract:", error);
// //           setError("Failed to initialize contract with client dates");
// //         }
// //       }

// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Error fetching contract data:", error);
// //       setError("Failed to load contract data");
// //       setLoading(false);
// //     }
// //   };

// //   // Initial fetch and listen for storage events
// //   useEffect(() => {
// //     fetchContractData();

// //     // Listen for storage events to detect contract updates from other tabs
// //     const handleStorageChange = (event: StorageEvent) => {
// //       if (event.key === "contractUpdate") {
// //         const updateData = event.newValue ? JSON.parse(event.newValue) : null;
// //         if (updateData && updateData.clientId === clientId) {
// //           console.log("Detected contract update in another tab, refetching data"); // Debug log
// //           fetchContractData(); // Refetch data when another tab updates the contract
// //         }
// //       }
// //     };

// //     window.addEventListener("storage", handleStorageChange);

// //     return () => {
// //       window.removeEventListener("storage", handleStorageChange);
// //     };
// //   }, [clientId, clientData]);

// //   // Handle contract field updates
// //   const handleUpdateField = async (field: string, value: any, isVariablePercentage = false) => {
// //     try {
// //       // Update local state first for immediate feedback
// //       if (isVariablePercentage) {
// //         setContractDetails((prev) => ({
// //           ...prev,
// //           variablePercentage: {
// //             ...prev.variablePercentage,
// //             ...value,
// //           },
// //         }));
// //       } else {
// //         setContractDetails((prev) => ({
// //           ...prev,
// //           [field]: value,
// //         }));
// //       }

// //       // Create FormData for the API call
// //       const formData = new FormData();
// //       if (isVariablePercentage) {
// //         formData.append("variablePercentage", JSON.stringify({
// //           ...contractDetails.variablePercentage,
// //           ...value,
// //         }));
// //       } else {
// //         formData.append(field, value);
// //       }

// //       // If updating a percentage field, clear other percentage fields
// //       if (["fixedPercentage", "fixWithAdvance", "fixWithoutAdvance"].includes(field)) {
// //         const fieldsToClear = ["fixedPercentage", "fixWithAdvance", "fixWithoutAdvance"].filter(f => f !== field);
// //         fieldsToClear.forEach(f => {
// //           formData.append(f, "0");
// //           setContractDetails((prev) => ({
// //             ...prev,
// //             [f]: "",
// //           }));
// //         });
// //         setSelectedPercentageField(field);
// //         console.log("Updated percentage field:", field, "Value:", value); // Debug log
// //       }

// //       let updatedContract;

// //       if (contract) {
// //         // Update existing contract
// //         updatedContract = await updateContract(contract._id, formData as any);
// //         console.log("Updated contract:", updatedContract); // Debug log
// //       } else {
// //         // Create new contract if none exists
// //         formData.append("clientId", clientId);
// //         formData.append("fixedPercentage", contractDetails.fixedPercentage || "0");
// //         formData.append("referralPercentage", contractDetails.referralPercentage || "0");
// //         formData.append("variablePercentage", JSON.stringify(contractDetails.variablePercentage));
// //         if (contractDetails.contractStartDate)
// //           formData.append("contractStartDate", contractDetails.contractStartDate);
// //         if (contractDetails.contractEndDate)
// //           formData.append("contractEndDate", contractDetails.contractEndDate);
// //         updatedContract = await createContract(formData as any);
// //         console.log("Created new contract:", updatedContract); // Debug log
// //       }

// //       // Update contract state with response
// //       setContract(updatedContract);
// //       setEditMode(false);
// //       setShowEditModal(false);

// //       // Notify other tabs of the update
// //       localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now() }));
// //       console.log("Notified other tabs of contract update"); // Debug log
// //     } catch (error) {
// //       console.error(`Error updating ${field}:`, error);
// //       setError(`Failed to update ${field}`);

// //       // Revert to previous value on error
// //       if (contract) {
// //         setContractDetails((prev) => ({
// //           ...prev,
// //           [field]: contract[field as keyof ContractResponse] || "",
// //         }));
// //       }
// //     }
// //   };

// //   // Handle contract document upload
// //   const handleContractDocumentUpload = async (file: File) => {
// //     try {
// //       // Update local state for immediate feedback
// //       setContractDetails((prev) => ({
// //         ...prev,
// //         contractDocument: file,
// //         contractDocumentName: file.name,
// //       }));

// //       // Create FormData for the API call
// //       const formData = new FormData();
// //       formData.append("agreement", file);

// //       let updatedContract;

// //       if (contract) {
// //         updatedContract = await updateContract(contract._id, formData as any);
// //       } else {
// //         formData.append("clientId", clientId);
// //         formData.append("fixedPercentage", "0");
// //         formData.append("referralPercentage", "0");
// //         formData.append("variablePercentage", JSON.stringify(contractDetails.variablePercentage));
// //         if (contractDetails.contractStartDate)
// //           formData.append("contractStartDate", contractDetails.contractStartDate);
// //         if (contractDetails.contractEndDate)
// //           formData.append("contractEndDate", contractDetails.contractEndDate);
// //         updatedContract = await createContract(formData as any);
// //       }

// //       setContract(updatedContract);
// //       // Notify other tabs
// //       localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now() }));
// //     } catch (error) {
// //       console.error("Error uploading agreement:", error);
// //       setError("Failed to upload agreement");

// //       setContractDetails((prev) => ({
// //         ...prev,
// //         contractDocument: null,
// //         contractDocumentName: contract?.agreement?.fileName || "",
// //       }));
// //     }
// //   };

// //   // Handle contract document download
// //   const handleDownloadContract = async () => {
// //     if (!contract || !contract._id) return;

// //     try {
// //       const blob = await downloadAgreement(contract._id);
// //       const url = window.URL.createObjectURL(blob);
// //       const a = document.createElement("a");
// //       a.style.display = "none";
// //       a.href = url;
// //       a.download = contract.agreement?.fileName || "agreement.pdf";
// //       document.body.appendChild(a);
// //       a.click();
// //       window.URL.revokeObjectURL(url);
// //       document.body.removeChild(a);
// //     } catch (error) {
// //       console.error("Error downloading agreement:", error);
// //       setError("Failed to download agreement");
// //     }
// //   };

// //   // Handle contract document deletion
// //   const handleDeleteContract = async () => {
// //     if (!contract || !contract._id) return;

// //     try {
// //       const updatedContract = await deleteAgreement(contract._id);
// //       setContract(updatedContract);
// //       setContractDetails((prev) => ({
// //         ...prev,
// //         contractDocument: null,
// //         contractDocumentName: "",
// //       }));
// //       // Notify other tabs
// //       localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now() }));
// //     } catch (error) {
// //       console.error("Error deleting agreement:", error);
// //       setError("Failed to delete agreement");
// //     }
// //   };

// //   // Handle edit button click
// //   const handleEditClick = () => {
// //     setShowEditModal(true);
// //   };

// //   // Handle modal option selection
// //   const handleModalOption = (option: string) => {
// //     if (option === "editSame") {
// //       setEditMode(true);
// //       setShowEditModal(false);
// //       // Preserve selectedPercentageField
// //     } else if (option === "editDifferent") {
// //       setEditMode(true);
// //       setShowEditModal(false);
// //       setSelectedPercentageField(null); // Allow all fields
// //     }
// //   };

// //   return (
// //     <div className="bg-white rounded border p-4">
// //       <h2 className="text-sm font-semibold mb-2">Contract Information</h2>
// //       {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

// //       <div className="space-y-3">
// //         <DetailRow
// //           label="Contract Start Date"
// //           value={contractDetails.contractStartDate}
// //           onUpdate={(value) => handleUpdateField("contractStartDate", value)}
// //           isDate={true}
// //         />
// //         <DetailRow
// //           label="Contract End Date"
// //           value={contractDetails.contractEndDate}
// //           onUpdate={(value) => handleUpdateField("contractEndDate", value)}
// //           isDate={true}
// //         />

// //         {/* Show percentage fields based on edit mode and selected field */}
// //         {(editMode && !selectedPercentageField) || (!editMode && !selectedPercentageField) ? (
// //           <>
// //             <DetailRow
// //               label="Fixed Percentage"
// //               value={contractDetails.fixedPercentage}
// //               onUpdate={(value) => handleUpdateField("fixedPercentage", value)}
// //               isNumber={true}
// //               min={0}
// //               max={100}
// //               suffix="%"
// //             />
// //             <DetailRow
// //               label="Fix with Advance"
// //               value={contractDetails.fixWithAdvance}
// //               onUpdate={(value) => handleUpdateField("fixWithAdvance", value)}
// //               isNumber={true}
// //               min={0}
// //               max={100}
// //               suffix="%"
// //             />
// //             <DetailRow
// //               label="Fix without Advance"
// //               value={contractDetails.fixWithoutAdvance}
// //               onUpdate={(value) => handleUpdateField("fixWithoutAdvance", value)}
// //               isNumber={true}
// //               min={0}
// //               max={100}
// //               suffix="%"
// //             />
// //           </>
// //         ) : null}

// //         {/* Show selected percentage field when not in edit mode */}
// //         {!editMode && selectedPercentageField === "fixedPercentage" && (
// //           <div className="flex items-center justify-between">
// //             <DetailRow
// //               label="Fixed Percentage"
// //               value={contractDetails.fixedPercentage}
// //               isNumber={true}
// //               min={0}
// //               max={100}
// //               suffix="%"
// //               onUpdate={() => handleEditClick()}
// //             />
// //             <button
// //               onClick={handleEditClick}
// //               className="text-blue-500 hover:text-blue-700 text-sm"
// //             >
// //               Edit
// //             </button>
// //           </div>
// //         )}
// //         {!editMode && selectedPercentageField === "fixWithAdvance" && (
// //           <div className="flex items-center justify-between">
// //             <DetailRow
// //               label="Fix with Advance"
// //               value={contractDetails.fixWithAdvance}
// //               isNumber={true}
// //               min={0}
// //               max={100}
// //               suffix="%"
// //               onUpdate={() => handleEditClick()}
// //             />
// //             <button
// //               onClick={handleEditClick}
// //               className="text-blue-500 hover:text-blue-700 text-sm"
// //             >
// //               Edit
// //             </button>
// //           </div>
// //         )}
// //         {!editMode && selectedPercentageField === "fixWithoutAdvance" && (
// //           <div className="flex items-center justify-between">
// //             <DetailRow
// //               label="Fix without Advance"
// //               value={contractDetails.fixWithoutAdvance}
// //               isNumber={true}
// //               min={0}
// //               max={100}
// //               suffix="%"
// //               onUpdate={() => handleEditClick()}
// //             />
// //             <button
// //               onClick={handleEditClick}
// //               className="text-blue-500 hover:text-blue-700 text-sm"
// //             >
// //               Edit
// //             </button>
// //           </div>
// //         )}

// //         {/* Show selected percentage field in edit mode for "Edit Same Field" */}
// //         {editMode && selectedPercentageField === "fixedPercentage" && (
// //           <DetailRow
// //             label="Fixed Percentage"
// //             value={contractDetails.fixedPercentage}
// //             onUpdate={(value) => handleUpdateField("fixedPercentage", value)}
// //             isNumber={true}
// //             min={0}
// //             max={100}
// //             suffix="%"
// //           />
// //         )}
// //         {editMode && selectedPercentageField === "fixWithAdvance" && (
// //           <DetailRow
// //             label="Fix with Advance"
// //             value={contractDetails.fixWithAdvance}
// //             onUpdate={(value) => handleUpdateField("fixWithAdvance", value)}
// //             isNumber={true}
// //             min={0}
// //             max={100}
// //             suffix="%"
// //           />
// //         )}
// //         {editMode && selectedPercentageField === "fixWithoutAdvance" && (
// //           <DetailRow
// //             label="Fix without Advance"
// //             value={contractDetails.fixWithoutAdvance}
// //             onUpdate={(value) => handleUpdateField("fixWithoutAdvance", value)}
// //             isNumber={true}
// //             min={0}
// //             max={100}
// //             suffix="%"
// //           />
// //         )}

// //         {/* Variable Percentage Section */}
// //         {(editMode || (!selectedPercentageField && !contractDetails.fixedPercentage && !contractDetails.fixWithAdvance && !contractDetails.fixWithoutAdvance) ||
// //           (contractDetails.variablePercentage.seniorLevel || contractDetails.variablePercentage.executives ||
// //           contractDetails.variablePercentage.nonExecutives || contractDetails.variablePercentage.other)) && (
// //           <div className="flex items-center justify-between border-b pb-2">
// //             <span className="text-sm text-gray-500">Variable Percentage</span>
// //             <button
// //               onClick={() => setShowVariablePercentages(!showVariablePercentages)}
// //               className="text-gray-500 hover:text-gray-700 transition-colors"
// //               aria-expanded={showVariablePercentages}
// //               aria-controls="variable-percentage-fields"
// //             >
// //               {showVariablePercentages ? (
// //                 <ChevronUp size={16} className="transition-transform" />
// //               ) : (
// //                 <ChevronDown size={16} className="transition-transform" />
// //               )}
// //             </button>
// //           </div>
// //         )}

// //         {showVariablePercentages && (
// //           <div className="space-y-2 mt-2" id="variable-percentage-fields">
// //             {Object.entries(clientData?.labelType || {}).map(([key, label]) => {
// //               if (!label) return null;

// //               let fieldName = key;
// //               if (key === 'seniorLevel' || key === 'executives' ||
// //                   key === 'nonExecutives' || key === 'other') {
// //                 // Use the key as is
// //               } else if (key.toLowerCase().includes('senior') || key.toLowerCase().includes('level')) {
// //                 fieldName = 'seniorLevel';
// //               } else if (key.toLowerCase().includes('execut')) {
// //                 fieldName = 'executives';
// //               } else if (key.toLowerCase().includes('non') || key.toLowerCase().includes('execut')) {
// //                 fieldName = 'nonExecutives';
// //               } else {
// //                 fieldName = 'other';
// //               }

// //               return (
// //                 <DetailRow
// //                   key={key}
// //                   label={label}
// //                   value={contractDetails.variablePercentage[fieldName as keyof typeof contractDetails.variablePercentage] || ''}
// //                   onUpdate={(value) => handleUpdateField("variablePercentage", { [fieldName]: value }, true)}
// //                   isNumber={true}
// //                   min={0}
// //                   max={100}
// //                   suffix="%"
// //                 />
// //               );
// //             })}
// //           </div>
// //         )}

// //         <DetailRow
// //           label="Referral Percentage"
// //           value={contractDetails.referralPercentage}
// //           onUpdate={(value) => handleUpdateField("referralPercentage", value)}
// //           isNumber={true}
// //           min={0}
// //           max={100}
// //           suffix="%"
// //         />
// //         <DetailRow
// //           label="Line of Business"
// //           value={contractDetails.lineOfBusiness}
// //           onUpdate={(value) => handleUpdateField("lineOfBusiness", value)}
// //         />
// //         <FileUploadRow
// //           label="Contract Document"
// //           accept=".pdf,.doc,.docx"
// //           onFileSelect={handleContractDocumentUpload}
// //           currentFileName={contractDetails.contractDocumentName}
// //           onDownload={contract?.agreement ? handleDownloadContract : undefined}
// //           onDelete={contract?.agreement ? handleDeleteContract : undefined}
// //         />
// //       </div>

// //       {/* Edit Modal */}
// //       {showEditModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
// //           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 sm:scale-95">
// //             <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Percentage Field</h3>
// //             <div className="space-y-3">
// //               <button
// //                 onClick={() => handleModalOption("editSame")}
// //                 className="w-full text-left px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
// //               >
// //                 Edit Same Field
// //               </button>
// //               <button
// //                 onClick={() => handleModalOption("editDifferent")}
// //                 className="w-full text-left px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
// //               >
// //                 Edit Different Field
// //               </button>
// //               <button
// //                 onClick={() => setShowEditModal(false)}
// //                 className="w-full text-center px-4 py-3 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 hover:text-red-700 transition-colors duration-200"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { DetailRow } from "./detail-row";
// import { FileUploadRow } from "./file-upload-row";
// import {
//   createContract,
//   updateContract,
//   getContractByClient,
//   downloadAgreement,
//   deleteAgreement,
//   ContractResponse,
// } from "@/services/contractService";
// import { getClientById } from "@/services/clientService";

// interface ContractSectionProps {
//   clientId: string;
//   clientData?: {
//     contractStartDate?: string;
//     contractEndDate?: string;
//     labelType?: {
//       seniorLevel?: string;
//       executives?: string;
//       nonExecutives?: string;
//       other?: string;
//     };
//   };
// }

// export function ContractSection({ clientId, clientData }: ContractSectionProps) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [contract, setContract] = useState<ContractResponse | null>(null);
//   const [showVariablePercentages, setShowVariablePercentages] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedPercentageField, setSelectedPercentageField] = useState<string | null>(null);
//   const [contractDetails, setContractDetails] = useState({
//     contractStartDate: null as string | null,
//     contractEndDate: null as string | null,
//     fixedPercentage: "",
//     fixWithAdvance: "",
//     fixWithoutAdvance: "",
//     variablePercentage: {
//       seniorLevel: "",
//       executives: "",
//       nonExecutives: "",
//       other: "",
//     },
//     referralPercentage: "",
//     lineOfBusiness: "",
//     contractDocument: null as File | null,
//     contractDocumentName: "",
//   });

//   // Fetch contract data
//   const fetchContractData = async () => {
//     if (!clientId) return;

//     try {
//       setLoading(true);
//       let contractData: ContractResponse | null = null;
//       let fetchedClientData: any;
//       let parsedLabelType: {
//         seniorLevel?: string;
//         executives?: string;
//         nonExecutives?: string;
//         other?: string;
//       } = {};

//       // Fetch existing contract
//       try {
//         contractData = await getContractByClient(clientId);
//         console.log("Fetched contract data:", contractData); // Debug log
//       } catch (err) {
//         console.log("No existing contract found, proceeding with client data:", err);
//       }

//       // Fetch client data if not provided via props
//       fetchedClientData = clientData || (await getClientById(clientId));
//       console.log("Fetched client data:", fetchedClientData); // Debug log

//       // Parse labelType if it exists
//       if (fetchedClientData && 'labelType' in fetchedClientData) {
//         const labelType = fetchedClientData.labelType;
//         if (typeof labelType === 'string') {
//           try {
//             parsedLabelType = JSON.parse(labelType);
//           } catch (e) {
//             console.error('Error parsing labelType:', e);
//           }
//         } else if (typeof labelType === 'object' && labelType !== null) {
//           parsedLabelType = { ...labelType };
//         }
//       }

//       // Use client data from props or API
//       const contractStartDate = 
//         contractData?.contractStartDate || 
//         (fetchedClientData?.contractStartDate || null);
        
//       const contractEndDate = 
//         contractData?.contractEndDate || 
//         (fetchedClientData?.contractEndDate || null);

//       // Determine which percentage field is filled
//       const percentageFields = [
//         { key: 'fixedPercentage', value: Number(contractData?.fixedPercentage ?? 0) },
//         { key: 'fixWithAdvance', value: Number(contractData?.fixWithAdvance ?? 0) },
//         { key: 'fixWithoutAdvance', value: Number(contractData?.fixWithoutAdvance ?? 0) },
//       ];
//       const filledField = percentageFields.find(field => field.value > 0) || percentageFields[0]; // Default to first field if none are non-zero
//       const newSelectedField = filledField ? filledField.key : null;
//       setSelectedPercentageField(newSelectedField);
//       console.log("Selected percentage field:", newSelectedField, "Values:", percentageFields); // Debug log

//       // Update contract state
//       setContract(contractData);

//       // Update form state with contract and client data
//       setContractDetails({
//         contractStartDate,
//         contractEndDate,
//         fixedPercentage: contractData?.fixedPercentage?.toString() || "",
//         fixWithAdvance: contractData?.fixWithAdvance?.toString() || "",
//         fixWithoutAdvance: contractData?.fixWithoutAdvance?.toString() || "",
//         variablePercentage: {
//           seniorLevel: contractData?.variablePercentage?.seniorLevel?.toString() || "",
//           executives: contractData?.variablePercentage?.executives?.toString() || "",
//           nonExecutives: contractData?.variablePercentage?.nonExecutives?.toString() || "",
//           other: contractData?.variablePercentage?.other?.toString() || "",
//         },
//         referralPercentage: contractData?.referralPercentage?.toString() || "",
//         lineOfBusiness: contractData?.lineOfBusiness || 
//           (fetchedClientData?.lineOfBusiness ? 
//             (Array.isArray(fetchedClientData.lineOfBusiness) ? 
//               fetchedClientData.lineOfBusiness.join(", ") : 
//               String(fetchedClientData.lineOfBusiness)) : ""),
//         contractDocument: null,
//         contractDocumentName: contractData?.agreement?.fileName || "",
//       });

//       // Show variable percentages if any is set
//       if (
//         contractData?.variablePercentage?.seniorLevel ||
//         contractData?.variablePercentage?.executives ||
//         contractData?.variablePercentage?.nonExecutives ||
//         contractData?.variablePercentage?.other
//       ) {
//         setShowVariablePercentages(true);
//       }

//       // If no contract exists but client data has dates, create a new contract
//       if (!contractData && (contractStartDate || contractEndDate)) {
//         const formData = new FormData();
//         formData.append("clientId", clientId);
//         if (contractStartDate) formData.append("contractStartDate", contractStartDate);
//         if (contractEndDate) formData.append("contractEndDate", contractEndDate);
//         formData.append("fixedPercentage", "0");
//         formData.append("referralPercentage", "0");
//         formData.append("variablePercentage", JSON.stringify({
//           seniorLevel: "",
//           executives: "",
//           nonExecutives: "",
//           other: "",
//         }));

//         try {
//           const newContract = await createContract(formData as any);
//           setContract(newContract);
//           // Notify other tabs
//           localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "new_contract" }));
//           console.log("Created new contract:", newContract); // Debug log
//         } catch (error) {
//           console.error("Error creating initial contract:", error);
//           setError("Failed to initialize contract with client dates");
//         }
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching contract data:", error);
//       setError("Failed to load contract data");
//       setLoading(false);
//     }
//   };

//   // Initial fetch and listen for storage events
//   useEffect(() => {
//     fetchContractData();

//     // Listen for storage events to detect contract updates from other tabs
//     const handleStorageChange = (event: StorageEvent) => {
//       if (event.key === "contractUpdate") {
//         const updateData = event.newValue ? JSON.parse(event.newValue) : null;
//         if (updateData && updateData.clientId === clientId) {
//           console.log("Detected contract update in another tab:", updateData); // Debug log
//           fetchContractData(); // Refetch data
//         }
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, [clientId, clientData]);

//   // Handle contract field updates
//   const handleUpdateField = async (field: string, value: any, isVariablePercentage = false) => {
//     try {
//       // Update local state for immediate feedback
//       if (isVariablePercentage) {
//         setContractDetails((prev) => ({
//           ...prev,
//           variablePercentage: {
//             ...prev.variablePercentage,
//             ...value,
//           },
//         }));
//       } else {
//         setContractDetails((prev) => ({
//           ...prev,
//           [field]: value,
//         }));
//       }

//       // Create FormData for the API call
//       const formData = new FormData();
//       if (isVariablePercentage) {
//         formData.append("variablePercentage", JSON.stringify({
//           ...contractDetails.variablePercentage,
//           ...value,
//         }));
//       } else {
//         formData.append(field, value);
//       }

//       // If updating a percentage field, clear other percentage fields
//       if (["fixedPercentage", "fixWithAdvance", "fixWithoutAdvance"].includes(field)) {
//         const fieldsToClear = ["fixedPercentage", "fixWithAdvance", "fixWithoutAdvance"].filter(f => f !== field);
//         fieldsToClear.forEach(f => {
//           formData.append(f, "0");
//           setContractDetails((prev) => ({
//             ...prev,
//             [f]: "",
//           }));
//         });
//         setSelectedPercentageField(field);
//         console.log("Updated percentage field:", field, "Value:", value, "Cleared fields:", fieldsToClear); // Debug log
//       }

//       let updatedContract;

//       if (contract) {
//         // Update existing contract
//         updatedContract = await updateContract(contract._id, formData as any);
//         console.log("Updated contract:", updatedContract); // Debug log
//       } else {
//         // Create new contract if none exists
//         formData.append("clientId", clientId);
//         formData.append("fixedPercentage", contractDetails.fixedPercentage || "0");
//         formData.append("referralPercentage", contractDetails.referralPercentage || "0");
//         formData.append("variablePercentage", JSON.stringify(contractDetails.variablePercentage));
//         if (contractDetails.contractStartDate)
//           formData.append("contractStartDate", contractDetails.contractStartDate);
//         if (contractDetails.contractEndDate)
//           formData.append("contractEndDate", contractDetails.contractEndDate);
//         updatedContract = await createContract(formData as any);
//         console.log("Created new contract:", updatedContract); // Debug log
//       }

//       // Update contract state with response
//       setContract(updatedContract);
//       setEditMode(false);
//       setShowEditModal(false);

//       // Notify other tabs
//       localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: field }));
//       console.log("Notified other tabs of contract update for field:", field); // Debug log
//     } catch (error) {
//       console.error(`Error updating ${field}:`, error);
//       setError(`Failed to update ${field}`);

//       // Revert to previous value on error
//       if (contract) {
//         setContractDetails((prev) => ({
//           ...prev,
//           [field]: contract[field as keyof ContractResponse] || "",
//         }));
//       }
//     }
//   };

//   // Handle contract document upload
//   const handleContractDocumentUpload = async (file: File) => {
//     try {
//       // Update local state for immediate feedback
//       setContractDetails((prev) => ({
//         ...prev,
//         contractDocument: file,
//         contractDocumentName: file.name,
//       }));

//       // Create FormData for the API call
//       const formData = new FormData();
//       formData.append("agreement", file);

//       let updatedContract;

//       if (contract) {
//         updatedContract = await updateContract(contract._id, formData as any);
//       } else {
//         formData.append("clientId", clientId);
//         formData.append("fixedPercentage", contractDetails.fixedPercentage || "0");
//         formData.append("referralPercentage", contractDetails.referralPercentage || "0");
//         formData.append("variablePercentage", JSON.stringify(contractDetails.variablePercentage));
//         if (contractDetails.contractStartDate)
//           formData.append("contractStartDate", contractDetails.contractStartDate);
//         if (contractDetails.contractEndDate)
//           formData.append("contractEndDate", contractDetails.contractEndDate);
//         updatedContract = await createContract(formData as any);
//       }

//       setContract(updatedContract);
//       // Notify other tabs
//       localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "agreement" }));
//     } catch (error) {
//       console.error("Error uploading agreement:", error);
//       setError("Failed to upload agreement");

//       setContractDetails((prev) => ({
//         ...prev,
//         contractDocument: null,
//         contractDocumentName: contract?.agreement?.fileName || "",
//       }));
//     }
//   };

//   // Handle contract document download
//   const handleDownloadContractDocument = async () => {
//     if (!contract || !contract._id) return;

//     try {
//       const blob = await downloadAgreement(contract._id);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.style.display = "none";
//       a.href = url;
//       a.download = contract.agreement?.fileName || "agreement.pdf";
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     } catch (error) {
//       console.error("Error downloading agreement:", error);
//       setError("Failed to download agreement");
//     }
//   };

//   // Handle contract document deletion
//   const handleDeleteContractDocument = async () => {
//     if (!contract || !contract._id) return;

//     try {
//       const updatedContract = await deleteAgreement(contract._id);
//       setContract(updatedContract);
//       setContractDetails((prev) => ({
//         ...prev,
//         contractDocument: null,
//         contractDocumentName: "",
//       }));
//       // Notify other tabs
//       localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "agreement" }));
//     } catch (error) {
//       console.error("Error deleting agreement:", error);
//       setError("Failed to delete agreement");
//     }
//   };

//   // Handle edit button click
//   const handleEditClick = () => {
//     setShowEditModal(true);
//   };

//   // Handle modal option selection
//   const handleModalOption = (option: string) => {
//     if (option === "editSame") {
//       setEditMode(true);
//       setShowEditModal(false);
//       // Keep selectedPercentageField unchanged
//     } else if (option === "editDifferent") {
//       setEditMode(true);
//       setShowEditModal(false);
//       setSelectedPercentageField(null); // Allow all fields to be shown
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg border p-4">
//       <h2 className="text-sm font-semibold">Contract Information</h2>
//       {error && <div className="text-red-500 text-sm my-2">{error}</div>}
//       {loading && <div className="text-gray-500 text-sm my-2">Loading...</div>}

//       <div className="space-y-3 mt-4">
//         <DetailRow
//           label="Contract Start Date"
//           value={contractDetails.contractStartDate}
//           onUpdate={(value) => handleUpdateField("contractStartDate", value)}
//           isDate={true}
//         />
//         <DetailRow
//           label="Contract End Date"
//           value={contractDetails.contractEndDate}
//           onUpdate={(value) => handleUpdateField("contractEndDate", value)}
//           isDate={true}
//         />

//         {/* Show percentage fields based on edit mode and selected field */}
//         {editMode && !selectedPercentageField ? (
//           <>
//             <DetailRow
//               label="Fixed Percentage"
//               value={contractDetails.fixedPercentage}
//               onUpdate={(value) => handleUpdateField("fixedPercentage", value)}
//               isNumber={true}
//               min={0}
//               max={100}
//               suffix="%"
//             />
//             <DetailRow
//               label="Fix with Advance"
//               value={contractDetails.fixWithAdvance}
//               onUpdate={(value) => handleUpdateField("fixWithAdvance", value)}
//               isNumber={true}
//               min={0}
//               max={100}
//               suffix="%"
//             />
//             <DetailRow
//               label="Fix without Advance"
//               value={contractDetails.fixWithoutAdvance}
//               onUpdate={(value) => handleUpdateField("fixWithoutAdvance", value)}
//               isNumber={true}
//               min={0}
//               max={100}
//               suffix="%"
//             />
//           </>
//         ) : null}

//         {/* Show selected percentage field when not in edit mode */}
//         {!editMode && selectedPercentageField === "fixedPercentage" && (
//           <div className="flex items-center justify-between">
//             <DetailRow
//               label="Fixed Percentage"
//               value={contractDetails.fixedPercentage}
//               isNumber={true}
//               min={0}
//               max={100}
//               suffix="%"
//               onUpdate={() => handleEditClick()}
//             />
//             <button
//               onClick={handleEditClick}
//               className="text-blue-500 hover:text-blue-700 text-sm"
//             >
//               Edit
//             </button>
//           </div>
//         )}
//         {!editMode && selectedPercentageField === "fixWithAdvance" && (
//           <div className="flex items-center justify-between">
//             <DetailRow
//               label="Fix with Advance"
//               value={contractDetails.fixWithAdvance}
//               isNumber={true}
//               min={0}
//               max={100}
//               suffix="%"
//               onUpdate={() => handleEditClick()}
//             />
//             <button
//               onClick={handleEditClick}
//               className="text-blue-500 hover:text-blue-700 text-sm"
//             >
//               Edit
//             </button>
//           </div>
//         )}
//         {!editMode && selectedPercentageField === "fixWithoutAdvance" && (
//           <div className="flex items-center justify-between">
//             <DetailRow
//               label="Fix without Advance"
//               value={contractDetails.fixWithoutAdvance}
//               isNumber={true}
//               min={0}
//               max={100}
//               suffix="%"
//               onUpdate={() => handleEditClick()}
//             />
//             <button
//               onClick={handleEditClick}
//               className="text-blue-500 hover:text-blue-700 text-sm"
//             >
//               Edit
//             </button>
//           </div>
//         )}

//         {/* Fallback if no percentage field is selected */}
//         {!editMode && !selectedPercentageField && (
//           <div className="text-sm text-gray-500">No percentage field selected. Click 'Edit' to set a percentage.</div>
//         )}

//         {/* Show selected percentage field in edit mode for "Edit Same Field" */}
//         {editMode && selectedPercentageField === "fixedPercentage" && (
//           <DetailRow
//             label="Fixed Percentage"
//             value={contractDetails.fixedPercentage}
//             onUpdate={(value) => handleUpdateField("fixedPercentage", value)}
//             isNumber={true}
//             min={0}
//             max={100}
//             suffix="%"
//           />
//         )}
//         {editMode && selectedPercentageField === "fixWithAdvance" && (
//           <DetailRow
//             label="Fix with Advance"
//             value={contractDetails.fixWithAdvance}
//             onUpdate={(value) => handleUpdateField("fixWithAdvance", value)}
//             isNumber={true}
//             min={0}
//             max={100}
//             suffix="%"
//           />
//         )}
//         {editMode && selectedPercentageField === "fixWithoutAdvance" && (
//           <DetailRow
//             label="Fix without Advance"
//             value={contractDetails.fixWithoutAdvance}
//             onUpdate={(value) => handleUpdateField("fixWithoutAdvance", value)}
//             isNumber={true}
//             min={0}
//             max={100}
//             suffix="%"
//           />
//         )}

//         {/* Variable Percentage Section */}
//         {(editMode || (!selectedPercentageField && !contractDetails.fixedPercentage && !contractDetails.fixWithAdvance && !contractDetails.fixWithoutAdvance) ||
//           (contractDetails.variablePercentage.seniorLevel || contractDetails.variablePercentage.executives ||
//           contractDetails.variablePercentage.nonExecutives || contractDetails.variablePercentage.other)) && (
//           <div className="flex items-center justify-between border-b pb-2">
//             <span className="text-sm text-gray-500">Variable Percentage</span>
//             <button
//               onClick={() => setShowVariablePercentages(!showVariablePercentages)}
//               className="text-gray-500 hover:text-gray-700 transition-colors"
//               aria-expanded={showVariablePercentages}
//               aria-controls="variable-percentage-fields"
//             >
//               {showVariablePercentages ? (
//                 <ChevronUp size={16} className="transition-transform" />
//               ) : (
//                 <ChevronDown size={16} className="transition-transform" />
//               )}
//             </button>
//           </div>
//         )}

//         {showVariablePercentages && (
//           <div className="space-y-2 mt-2" id="variable-percentage-fields">
//             {Object.entries(clientData?.labelType || {}).map(([key, label]) => {
//               if (!label) return null;

//               let fieldName = key;
//               if (key === 'seniorLevel' || key === 'executives' ||
//                   key === 'nonExecutives' || key === 'other') {
//                 // Use the key as is
//               } else if (key.toLowerCase().includes('senior') || key.toLowerCase().includes('level')) {
//                 fieldName = 'seniorLevel';
//               } else if (key.toLowerCase().includes('execut')) {
//                 fieldName = 'executives';
//               } else if (key.toLowerCase().includes('non') || key.toLowerCase().includes('execut')) {
//                 fieldName = 'nonExecutives';
//               } else {
//                 fieldName = 'other';
//               }

//               return (
//                 <DetailRow
//                   key={key}
//                   label={label}
//                   value={contractDetails.variablePercentage[fieldName as keyof typeof contractDetails.variablePercentage] || ''}
//                   onUpdate={(value) => handleUpdateField("variablePercentage", { [fieldName]: value }, true)}
//                   isNumber={true}
//                   min={0}
//                   max={100}
//                   suffix="%"
//                 />
//               );
//             })}
//           </div>
//         )}

//         <DetailRow
//           label="Referral Percentage"
//           value={contractDetails.referralPercentage}
//           onUpdate={(value) => handleUpdateField("referralPercentage", value)}
//           isNumber={true}
//           min={0}
//           max={100}
//           suffix="%"
//         />
//         <DetailRow
//           label="Line of Business"
//           value={contractDetails.lineOfBusiness}
//           onUpdate={(value) => handleUpdateField("lineOfBusiness", value)}
//         />
//         <FileUploadRow
//           label="Contract Document"
//           accept=".pdf,.doc,.docx"
//           onFileSelect={handleContractDocumentUpload}
//           currentFileName={contractDetails.contractDocumentName}
//           onDownload={contract?.agreement ? handleDownloadContractDocument : undefined}
//           onDelete={contract?.agreement ? handleDeleteContractDocument : undefined}
//         />
//       </div>

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
//           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 sm:scale-95">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Percentage Field</h3>
//             <div className="space-y-3">
//               <button
//                 onClick={() => handleModalOption("editSame")}
//                 className="w-full text-left px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
//               >
//                 Edit Same Field
//               </button>
//               <button
//                 onClick={() => handleModalOption("editDifferent")}
//                 className="w-full text-left px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
//               >
//                 Edit Different Field
//               </button>
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="w-full text-center px-4 py-3 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 hover:text-red-700 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
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
    labelType?: {
      seniorLevel?: string;
      executives?: string;
      nonExecutives?: string;
      other?: string;
    };
  };
}

export function ContractSection({ clientId, clientData }: ContractSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contract, setContract] = useState<ContractResponse | null>(null);
  const [contractDetails, setContractDetails] = useState({
    contractStartDate: null as string | null,
    contractEndDate: null as string | null,
    referralPercentage: "",
    lineOfBusiness: "",
    contractDocument: null as File | null,
    contractDocumentName: "",
    contractType: "" as string,
    contractTypeDetails: {} as Record<string, { percentage: string; notes: string }>,
    selectedLevels: [] as string[],
  });
  const [isContractTypeDropdownOpen, setIsContractTypeDropdownOpen] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    type: string;
    level?: string;
    percentage: string;
    notes: string;
  }>({ open: false, type: "", percentage: "", notes: "" });

  const contractTypes = [
    "Fixed Percentage",
    "Fix with Advance",
    "Fix without Advance",
    "Level Based (Hiring)",
  ];
  const levelOptions = ["Senior Level", "Executives", "Non-Executives", "Other"];

  // Fetch contract data
  const fetchContractData = async () => {
    if (!clientId) return;

    try {
      setLoading(true);
      let contractData: ContractResponse | null = null;
      let fetchedClientData: any;

      // Fetch existing contract
      try {
        contractData = await getContractByClient(clientId);
        console.log("Fetched contract data:", contractData); // Debug log
      } catch (err) {
        console.log("No existing contract found, proceeding with client data:", err);
      }

      // Fetch client data if not provided via props
      fetchedClientData = clientData || (await getClientById(clientId));
      console.log("Fetched client data:", fetchedClientData); // Debug log

      // Use client data from props or API
      const contractStartDate = 
        contractData?.contractStartDate || 
        (fetchedClientData?.contractStartDate || null);
        
      const contractEndDate = 
        contractData?.contractEndDate || 
        (fetchedClientData?.contractEndDate || null);

      // Update contract state
      setContract(contractData);

      // Update form state with contract and client data
      setContractDetails({
        contractStartDate,
        contractEndDate,
        referralPercentage: contractData?.referralPercentage?.toString() || "",
        lineOfBusiness: contractData?.lineOfBusiness || 
          (fetchedClientData?.lineOfBusiness ? 
            (Array.isArray(fetchedClientData.lineOfBusiness) ? 
              fetchedClientData.lineOfBusiness.join(", ") : 
              String(fetchedClientData.lineOfBusiness)) : ""),
        contractDocument: null,
        contractDocumentName: contractData?.agreement?.fileName || "",
        contractType: contractData?.contractType || "",
        contractTypeDetails: contractData?.contractTypeDetails || {},
        selectedLevels: contractData?.selectedLevels || [],
      });

      // If no contract exists but client data has dates, create a new contract
      if (!contractData && (contractStartDate || contractEndDate)) {
        const formData = new FormData();
        formData.append("clientId", clientId);
        if (contractStartDate) formData.append("contractStartDate", contractStartDate);
        if (contractEndDate) formData.append("contractEndDate", contractEndDate);
        formData.append("referralPercentage", "0");

        try {
          const newContract = await createContract(formData as any);
          setContract(newContract);
          localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "new_contract" }));
          console.log("Created new contract:", newContract); // Debug log
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

  // Initial fetch and listen for storage events
  useEffect(() => {
    fetchContractData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "contractUpdate") {
        const updateData = event.newValue ? JSON.parse(event.newValue) : null;
        if (updateData && updateData.clientId === clientId) {
          console.log("Detected contract update in another tab:", updateData); // Debug log
          fetchContractData(); // Refetch data
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [clientId, clientData]);

  // Handle contract field updates
  const handleUpdateField = async (field: string, value: any) => {
    try {
      // Update local state for immediate feedback
      setContractDetails((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Create FormData for the API call
      const formData = new FormData();
      formData.append(field, value);

      let updatedContract;

      if (contract) {
        // Update existing contract
        updatedContract = await updateContract(contract._id, formData as any);
        console.log("Updated contract:", updatedContract); // Debug log
      } else {
        // Create new contract if none exists
        formData.append("clientId", clientId);
        formData.append("referralPercentage", contractDetails.referralPercentage || "0");
        if (contractDetails.contractStartDate)
          formData.append("contractStartDate", contractDetails.contractStartDate);
        if (contractDetails.contractEndDate)
          formData.append("contractEndDate", contractDetails.contractEndDate);
        updatedContract = await createContract(formData as any);
        console.log("Created new contract:", updatedContract); // Debug log
      }

      // Update contract state with response
      setContract(updatedContract);

      // Notify other tabs
      localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: field }));
      console.log("Notified other tabs of contract update for field:", field); // Debug log
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

  // Handle contract document upload
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
      formData.append("agreement", file);

      let updatedContract;

      if (contract) {
        updatedContract = await updateContract(contract._id, formData as any);
      } else {
        formData.append("clientId", clientId);
        formData.append("referralPercentage", contractDetails.referralPercentage || "0");
        if (contractDetails.contractStartDate)
          formData.append("contractStartDate", contractDetails.contractStartDate);
        if (contractDetails.contractEndDate)
          formData.append("contractEndDate", contractDetails.contractEndDate);
        updatedContract = await createContract(formData as any);
      }

      setContract(updatedContract);
      // Notify other tabs
      localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "agreement" }));
    } catch (error) {
      console.error("Error uploading agreement:", error);
      setError("Failed to upload agreement");

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
      setContract(updatedContract);
      setContractDetails((prev) => ({
        ...prev,
        contractDocument: null,
        contractDocumentName: "",
      }));
      // Notify other tabs
      localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "agreement" }));
    } catch (error) {
      console.error("Error deleting agreement:", error);
      setError("Failed to delete agreement");
    }
  };

  // Handle contract type selection
  const handleContractTypeSelect = async (type: string) => {
    try {
      setContractDetails((prev) => ({
        ...prev,
        contractType: type,
        selectedLevels: type === "Level Based (Hiring)" ? prev.selectedLevels : [],
        contractTypeDetails: type === "Level Based (Hiring)" ? prev.contractTypeDetails : {},
      }));
      setIsContractTypeDropdownOpen(false);

      const formData = new FormData();
      formData.append("contractType", type);
      if (type !== "Level Based (Hiring)") {
        formData.append("contractTypeDetails", JSON.stringify({}));
        formData.append("selectedLevels", JSON.stringify([]));
      }

      let updatedContract;
      if (contract) {
        updatedContract = await updateContract(contract._id, formData as any);
      } else {
        formData.append("clientId", clientId);
        formData.append("referralPercentage", contractDetails.referralPercentage || "0");
        if (contractDetails.contractStartDate)
          formData.append("contractStartDate", contractDetails.contractStartDate);
        if (contractDetails.contractEndDate)
          formData.append("contractEndDate", contractDetails.contractEndDate);
        updatedContract = await createContract(formData as any);
      }

      setContract(updatedContract);
      localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "contractType" }));
    } catch (error) {
      console.error("Error updating contract type:", error);
      setError("Failed to update contract type");
      setContractDetails((prev) => ({
        ...prev,
        contractType: contract?.contractType || "",
      }));
    }
  };

  // Handle level selection for Level Based (Hiring)
  const handleLevelSelect = async (level: string) => {
    const newLevels = contractDetails.selectedLevels.includes(level)
      ? contractDetails.selectedLevels.filter((l) => l !== level)
      : [...contractDetails.selectedLevels, level];

    try {
      setContractDetails((prev) => ({
        ...prev,
        selectedLevels: newLevels,
      }));
      setIsLevelDropdownOpen(false);

      const formData = new FormData();
      formData.append("selectedLevels", JSON.stringify(newLevels));

      let updatedContract;
      if (contract) {
        updatedContract = await updateContract(contract._id, formData as any);
      } else {
        formData.append("clientId", clientId);
        formData.append("contractType", "Level Based (Hiring)");
        formData.append("referralPercentage", contractDetails.referralPercentage || "0");
        if (contractDetails.contractStartDate)
          formData.append("contractStartDate", contractDetails.contractStartDate);
        if (contractDetails.contractEndDate)
          formData.append("contractEndDate", contractDetails.contractEndDate);
        updatedContract = await createContract(formData as any);
      }

      setContract(updatedContract);
      localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "selectedLevels" }));
    } catch (error) {
      console.error("Error updating levels:", error);
      setError("Failed to update levels");
      setContractDetails((prev) => ({
        ...prev,
        selectedLevels: contract?.selectedLevels || [],
      }));
    }
  };

  // Handle opening edit dialog
  const openEditDialog = (type: string, level?: string) => {
    setEditDialog({
      open: true,
      type,
      level,
      percentage: level
        ? contractDetails.contractTypeDetails[level]?.percentage || ""
        : contractDetails.contractTypeDetails[type]?.percentage || "",
      notes: level
        ? contractDetails.contractTypeDetails[level]?.notes || ""
        : contractDetails.contractTypeDetails[type]?.notes || "",
    });
  };

  // Handle saving edit dialog
  const saveEditDialog = async () => {
    try {
      const { type, level, percentage, notes } = editDialog;
      const key = level || type;
      const newDetails = {
        ...contractDetails.contractTypeDetails,
        [key]: { percentage, notes },
      };

      setContractDetails((prev) => ({
        ...prev,
        contractTypeDetails: newDetails,
      }));

      const formData = new FormData();
      formData.append("contractTypeDetails", JSON.stringify(newDetails));

      let updatedContract;
      if (contract) {
        updatedContract = await updateContract(contract._id, formData as any);
      } else {
        formData.append("clientId", clientId);
        formData.append("contractType", contractDetails.contractType);
        formData.append("referralPercentage", contractDetails.referralPercentage || "0");
        if (contractDetails.contractStartDate)
          formData.append("contractStartDate", contractDetails.contractStartDate);
        if (contractDetails.contractEndDate)
          formData.append("contractEndDate", contractDetails.contractEndDate);
        updatedContract = await createContract(formData as any);
      }

      setContract(updatedContract);
      localStorage.setItem("contractUpdate", JSON.stringify({ clientId, timestamp: Date.now(), updatedField: "contractTypeDetails" }));
      setEditDialog({ open: false, type: "", percentage: "", notes: "" });
    } catch (error) {
      console.error("Error saving contract details:", error);
      setError("Failed to save contract details");
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">Contract Information</h2>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {loading && <div className="text-gray-500 text-sm mt-2">Loading...</div>}

      <div className="space-y-4 mt-4">
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
        <div className="flex items-center space-x-4">
          <label className="w-1/3 text-sm font-medium text-gray-600">Contract Type</label>
          <div className="w-2/3 flex items-center justify-between space-x-2">
            <div className="flex-1">
              {isContractTypeDropdownOpen && (
                <div className="relative">
                  <div
                    className="w-full bg-gray-100 border rounded-md p-2 text-sm text-gray-800 flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    {contractDetails.contractType || "Select Contract Type"}
                    {isContractTypeDropdownOpen ? (
                      <ChevronUp className="h-4 w-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  {isContractTypeDropdownOpen && (
                    <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg top-full">
                      {contractTypes.map((type) => (
                        <button
                          key={type}
                          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-blue-50 transition-colors"
                          onClick={() => handleContractTypeSelect(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              className="flex items-center space-x-1 p-2 text-black hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors relative group"
              onClick={() => setIsContractTypeDropdownOpen(!isContractTypeDropdownOpen)}
              aria-label="Edit Contract Type"
            >
              <Pencil className="h-4 w-4" />
              <span className="text-sm font-medium">Edit</span>
              <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 transform -translate-x-1/2">
                Edit Contract Type
              </span>
            </button>
          </div>
        </div>
        {contractDetails.contractType && contractDetails.contractType !== "Level Based (Hiring)" && (
          <div className="ml-8 flex items-center space-x-4">
            <label className="w-1/3 text-sm font-medium text-gray-600">{contractDetails.contractType}</label>
            <div className="flex w-2/3 items-center space-x-2">
              <div className="relative w-1/3">
                <input
                  type="number"
                  value={contractDetails.contractTypeDetails[contractDetails.contractType]?.percentage || ""}
                  onChange={(e) =>
                    setContractDetails((prev) => ({
                      ...prev,
                      contractTypeDetails: {
                        ...prev.contractTypeDetails,
                        [contractDetails.contractType]: {
                          ...prev.contractTypeDetails[contractDetails.contractType],
                          percentage: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-6"
                  min="0"
                  max="100"
                  placeholder="0"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">%</span>
              </div>
              <input
                type="text"
                value={contractDetails.contractTypeDetails[contractDetails.contractType]?.notes || ""}
                onChange={(e) =>
                  setContractDetails((prev) => ({
                    ...prev,
                    contractTypeDetails: {
                      ...prev.contractTypeDetails,
                      [contractDetails.contractType]: {
                        ...prev.contractTypeDetails[contractDetails.contractType],
                        notes: e.target.value,
                      },
                    },
                  }))
                }
                className="w-2/3 border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Notes"
              />
              <button
                className="flex items-center space-x-1 p-2 text-black hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors relative group"
                onClick={() => openEditDialog(contractDetails.contractType)}
                aria-label={`Edit ${contractDetails.contractType} Details`}
              >
                <Pencil className="h-4 w-4" />
                <span className="text-sm font-medium">Edit</span>
                <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 transform -translate-x-1/2">
                  Edit {contractDetails.contractType} Details
                </span>
              </button>
            </div>
          </div>
        )}
        {contractDetails.contractType === "Level Based (Hiring)" && (
          <div className="ml-8 space-y-3">
            <div className="flex items-center space-x-4">
              <label className="w-1/3 text-sm font-medium text-gray-600">Levels</label>
              <div className="relative w-2/3 flex items-center space-x-2">
                <button
                  className="w-full bg-gray-100 border rounded-md p-2 text-sm text-gray-800 flex items-center justify-between hover:bg-gray-200 transition-colors"
                  onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                >
                  {contractDetails.selectedLevels.length > 0
                    ? contractDetails.selectedLevels.join(", ")
                    : "Select Levels"}
                  {isLevelDropdownOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </button>
                <button
                  className="flex items-center space-x-1 p-2 text-black hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors relative group"
                  onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                  aria-label="Edit Levels"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="text-sm font-medium">Edit</span>
                  <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 transform -translate-x-1/2">
                    Edit Levels
                  </span>
                </button>
                {isLevelDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg top-full">
                    {levelOptions.map((level) => (
                      <button
                        key={level}
                        className={`w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-blue-50 transition-colors ${
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
                <label className="w-1/3 text-sm font-medium text-gray-600">{level}</label>
                <div className="flex w-2/3 items-center space-x-2">
                  <div className="relative w-1/3">
                    <input
                      type="number"
                      value={contractDetails.contractTypeDetails[level]?.percentage || ""}
                      onChange={(e) =>
                        setContractDetails((prev) => ({
                          ...prev,
                          contractTypeDetails: {
                            ...prev.contractTypeDetails,
                            [level]: {
                              ...prev.contractTypeDetails[level],
                              percentage: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-6"
                      min="0"
                      max="100"
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">%</span>
                  </div>
                  <input
                    type="text"
                    value={contractDetails.contractTypeDetails[level]?.notes || ""}
                    onChange={(e) =>
                      setContractDetails((prev) => ({
                        ...prev,
                        contractTypeDetails: {
                          ...prev.contractTypeDetails,
                          [level]: {
                            ...prev.contractTypeDetails[level],
                            notes: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-2/3 border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Notes"
                  />
                  <button
                    className="flex items-center space-x-1 p-2 text-black hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors relative group"
                    onClick={() => openEditDialog(contractDetails.contractType, level)}
                    aria-label={`Edit ${level} Details`}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="text-sm font-medium">Edit</span>
                    <span className="absolute hidden group-hover:block text-xs bg-gray-800 text-white rounded p-1 -top-8 left-1/2 transform -translate-x-1/2">
                      Edit {level} Details
                    </span>
                  </button>
                </div>
              </div>
            ))}
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

      {editDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Edit {editDialog.level || editDialog.type} Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Percentage</label>
                <div className="relative">
                  <input
                    type="number"
                    value={editDialog.percentage}
                    onChange={(e) =>
                      setEditDialog((prev) => ({ ...prev, percentage: e.target.value }))
                    }
                    className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-6"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
                <textarea
                  value={editDialog.notes}
                  onChange={(e) =>
                    setEditDialog((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-800 hover:bg-gray-300 transition-colors"
                  onClick={() => setEditDialog({ open: false, type: "", percentage: "", notes: "" })}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
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