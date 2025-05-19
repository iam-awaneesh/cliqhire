"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getJobById, updateJobById } from "@/services/jobService";
import { EditFieldDialog } from "@/components/jobs/summary/edit-field-dialog";
import { EditSalaryDialog } from "@/components/jobs/summary/edit-salary-dialog";
import type { JobResponse } from "@/types/job";

interface SummaryContentProps {
  jobId: string;
}

interface JobDetails {
  jobTitle: string;
  department: string;
  client: string;
  location: string[]; // Changed from string to string[]
  headcount: number;
  minimumSalary: number;
  maximumSalary: number;
  salaryCurrency: string;
  jobType: string;
  experience: string;
  jobDescription: string;
  nationalities: string[];
  gender: string;
  deadline: string;
  relationshipManager: string;
  reportingTo: string;
  teamSize: number;
  link: string;
  keySkills: string;
  jobPosition: string[]; // Changed from string to string[]
  stage: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  dateRange: {
    start: string;
    end: string;
  };
}

interface EditingField {
  name: keyof JobDetails;
  value: string;
  isDate?: boolean;
  isTextArea?: boolean;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
}

export function SummaryContent({ jobId }: SummaryContentProps) {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response: JobResponse = await getJobById(jobId);

        const mappedDetails: JobDetails = {
          jobTitle: response.jobTitle ?? '',
          department: response.department ?? '',
          client: response.client?.name ?? 'N/A',
          location: Array.isArray(response.location) ? response.location : (response.location ? [response.location] : []), // Handle both string and string[] cases
          headcount: response.headcount ?? 0,
          minimumSalary: response.minimumSalary ?? response.salaryRange?.min ?? 0,
          maximumSalary: response.maximumSalary ?? response.salaryRange?.max ?? 0,
          salaryCurrency: response.salaryCurrency ?? 'USD',
          jobType: response.jobType ?? '',
          experience: response.experience ?? '',
          jobDescription: response.jobDescription ?? 'No description available',
          nationalities: response.nationalities ?? [],
          gender: response.gender ?? '',
          deadline: response.deadline ?? '',
          relationshipManager: response.relationshipManager ?? '',
          reportingTo: response.reportingTo ?? '',
          teamSize: response.teamSize ?? 0,
          link: response.link ?? '',
          keySkills: response.keySkills ?? '',
          jobPosition: Array.isArray(response.jobPosition) ? response.jobPosition : (response.jobPosition ? [response.jobPosition] : []), // Handle both string and string[] cases
          stage: response.stage ?? '',
          salaryRange: {
            min: response.salaryRange?.min ?? 0,
            max: response.salaryRange?.max ?? 0,
            currency: response.salaryCurrency ?? 'USD'
          },
          dateRange: {
            start: response.dateRange?.start ?? '',
            end: response.dateRange?.end ?? ''
          }
        };

        setJobDetails(mappedDetails);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleFieldEdit = (
    field: keyof JobDetails,
    value: string,
    options?: {
      isDate?: boolean;
      isTextArea?: boolean;
      isSelect?: boolean;
      selectOptions?: { value: string; label: string }[];
    }
  ) => {
    setEditingField({
      name: field,
      value: value,
      ...options
    });
  };

  const handleFieldSave = async (newValue: string) => {
    if (!editingField || !jobDetails) return;

    try {
      let processedValue: any = newValue;
      
      // Handle different field types
      if (editingField.isDate) {
        processedValue = new Date(newValue).toISOString();
      } else if (editingField.name === 'jobPosition' || editingField.name === 'location') {
        // Handle jobPosition and location as arrays - split by comma if it's a comma-separated string
        processedValue = newValue.split(',').map(item => item.trim()).filter(item => item.length > 0);
      }

      const updatedDetails = {
        ...jobDetails,
        [editingField.name]: processedValue
      };

      await updateJobById(jobId, updatedDetails);
      setJobDetails(updatedDetails);
      setEditingField(null);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleSalarySave = async (values: {
    minSalary: number;
    maxSalary: number;
    currency: string;
  }) => {
    if (!jobDetails) return;

    try {
      const updatedDetails = {
        ...jobDetails,
        minimumSalary: values.minSalary,
        maximumSalary: values.maxSalary,
        salaryCurrency: values.currency
      };

      await updateJobById(jobId, updatedDetails);
      setJobDetails(updatedDetails);
    } catch (error) {
      console.error("Error updating salary details:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!jobDetails) return <div>No job details found</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Job Details</h2>
          <div className="bg-white rounded border p-4 space-y-4">
            {Object.entries(jobDetails).map(([key, value]) => {
              if (
                key === 'dateRange' ||
                key === 'salaryCurrency' ||
                key === 'minimumSalary' ||
                key === 'maximumSalary' ||
                key === 'salaryRange' ||
                key === 'jobDescription'
              ) return null;

              const isDateField = ['deadline'].includes(key);
              
              // Handle display value for different types
              let displayValue: string;
              if ((key === 'jobPosition' || key === 'location') && Array.isArray(value)) {
                displayValue = value.join(', ');
              } else if (isDateField && value) {
                displayValue = new Date(value as string).toLocaleDateString();
              } else {
                displayValue = value?.toString() || '';
              }

              // Handle edit value for different types
              let editValue: string;
              if ((key === 'jobPosition' || key === 'location') && Array.isArray(value)) {
                editValue = value.join(', ');
              } else {
                editValue = value?.toString() || '';
              }

              return (
                <DetailRow
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  value={displayValue}
                  onEdit={() => handleFieldEdit(
                    key as keyof JobDetails,
                    editValue,
                    { isDate: isDateField }
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Job Description</h2>
          <div className="bg-white rounded border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-muted-foreground">Job Description</h3>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-black"
                onClick={() => handleFieldEdit('jobDescription', jobDetails.jobDescription, { isTextArea: true })}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
            <div className="text-sm whitespace-pre-wrap">
              {jobDetails.jobDescription}
            </div>
          </div>

          {/* Salary Range Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Package Details</h2>
            <div className="bg-white rounded border p-4">
              <DetailRow
                label="Salary Range"
                value={`${jobDetails.salaryCurrency} ${jobDetails.minimumSalary.toLocaleString()} - ${jobDetails.maximumSalary.toLocaleString()} per annum`}
                onEdit={() => setIsSalaryDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialogs */}
      {editingField && (
        <EditFieldDialog
          open={true}
          onClose={() => setEditingField(null)}
          fieldName={editingField.name}
          currentValue={editingField.value}
          onSave={handleFieldSave}
          isDate={editingField.isDate}
          isTextArea={editingField.isTextArea}
          isSelect={editingField.isSelect}
        />
      )}

      <EditSalaryDialog
        open={isSalaryDialogOpen}
        onClose={() => setIsSalaryDialogOpen(false)}
        currentValues={{
          minSalary: jobDetails.minimumSalary,
          maxSalary: jobDetails.maximumSalary,
          currency: jobDetails.salaryCurrency
        }}
        onSave={handleSalarySave}
      />
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value?: string;
  onEdit?: () => void;
}

function DetailRow({ label, value, onEdit }: DetailRowProps) {
  const hasValue = value && value !== "undefined" && value !== "null";

  return (
    <div className="flex items-center py-2 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground w-1/3">{label}</span>
      <div className="flex items-center justify-between flex-1">
        <span className="text-sm">{hasValue ? value : "No Details"}</span>
        <Button
          variant="outline"
          size="sm"
          
          className="h-8 text-black"
          onClick={onEdit}
        >
          {hasValue ? (
            <>
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </>
          ) : (
            <>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </>
          )}
        </Button>
      </div>
    </div>
  );
}