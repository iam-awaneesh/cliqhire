"use client"

import { X, FileText, Upload, Files, Table } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CreateCandidateModalProps {
  isOpen: boolean
  onClose: () => void
}

interface OptionCardProps {
  icon: React.ReactNode
  title: string
  onClick: () => void
}

function OptionCard({ icon, title, onClick }: OptionCardProps) {
  return (
    <Button
      variant="outline"
      className="h-auto flex flex-col items-center gap-6 p-8 hover:border-blue-600 hover:bg-blue-50"
      onClick={onClick}
    >
      <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-lg">
        {icon}
      </div>
      <span className="text-lg font-semibold">{title}</span>
    </Button>
  )
}

export function CreateCandidateModal({ isOpen, onClose }: CreateCandidateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Create Candidate</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <OptionCard
            icon={<FileText className="w-8 h-8 text-blue-600" />}
            title="Complete a Form"
            onClick={() => console.log("Complete form clicked")}
          />
          <OptionCard
            icon={<Upload className="w-8 h-8 text-blue-600" />}
            title="Upload a Resume"
            onClick={() => console.log("Upload resume clicked")}
          />
          <OptionCard
            icon={<Files className="w-8 h-8 text-blue-600" />}
            title="Upload multiple Resumes"
            onClick={() => console.log("Upload multiple resumes clicked")}
          />
          <OptionCard
            icon={<Table className="w-8 h-8 text-blue-600" />}
            title="Import a JSON or CSV file"
            onClick={() => console.log("Import file clicked")}
          />
        </div>

        <div className="text-center text-gray-600 pt-4">
          Or{" "}
          <Link href="#" className="text-blue-600 hover:underline">
            install a chrome extension
          </Link>
          {" "}to source candidates from LinkedIn.
        </div>
      </DialogContent>
    </Dialog>
  )
}

