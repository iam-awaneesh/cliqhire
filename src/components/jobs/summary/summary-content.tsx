"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface SummaryContentProps {
  jobId: string;
}

export function SummaryContent({ jobId }: SummaryContentProps) {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Job Description */}
      <div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Job Description</h2>
          <div className="bg-white rounded border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-muted-foreground">Job Description</h3>
              <Button variant="ghost" size="sm" className="h-8 text-blue-500 hover:text-blue-600">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              No description added yet
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Job Details */}
      <div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Job Details</h2>
          <div className="bg-white rounded border p-4 space-y-4">
            <DetailRow label="Job Reference" value="L794V775" />
            <DetailRow label="Position Name" value="SDE" />
            <DetailRow label="Job Location" addButton />
            <DetailRow label="Remote" addButton />
            <DetailRow label="Office Address" addButton />
            <DetailRow label="Headcount" value="1" />
            <DetailRow label="Experience Level" addButton />
            <DetailRow label="Expected Close Date" addButton />
            <DetailRow label="Minimum Salary" addButton />
            <DetailRow label="Maximum Salary" addButton />
            <DetailRow label="Currency" value="USD" />
            <DetailRow label="Frequency" value="Monthly" />
            <DetailRow label="Contract Details" value="Full time" />
            <DetailRow label="Open Date" value="2025-01-31" />
            <DetailRow label="Close Date" addButton />
            <DetailRow label="Job Industry" addButton />
          </div>

          {/* Package Details Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Package Details</h2>
            <div className="bg-white rounded border p-4">
              <DetailRow label="Package Details" addButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value?: string
  addButton?: boolean
}

function DetailRow({ label, value, addButton }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      {value ? (
        <span className="text-sm">{value}</span>
      ) : addButton ? (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-blue-500 hover:text-blue-600"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      ) : null}
    </div>
  )
}