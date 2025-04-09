"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useState, useRef } from "react"

interface AttachmentsContentProps {
  clientId: string;
}

export function AttachmentsContent({ clientId }: AttachmentsContentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    // Handle file upload logic here
    console.log('Dropped files:', files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Handle file upload logic here
    console.log('Selected files:', files)
  }

  return (
    <div className="p-4">
      {/* Upload Section */}
      <div 
        className={`border rounded-lg p-4 mb-4 cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Upload Files</span>
          <Button size="sm" variant="ghost">
            <Plus className="h-4 w-4 text-blue-500" />
          </Button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-48 h-48 mb-6">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-blue-500"
          >
            <rect x="50" y="40" width="100" height="120" rx="8" fill="currentColor" fillOpacity="0.1" />
            <path d="M50 80L100 100L150 80" stroke="currentColor" strokeWidth="2"/>
            <rect x="70" y="60" width="60" height="4" rx="2" fill="currentColor" />
            <circle cx="140" cy="30" r="20" fill="currentColor" fillOpacity="0.2" />
            <circle cx="30" cy="140" r="15" fill="currentColor" fillOpacity="0.2" />
            <circle cx="170" cy="140" r="10" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No attachments uploaded yet</h3>
        <p className="text-muted-foreground text-center">
          Drag and drop files here or click the upload button to add attachments.
        </p>
      </div>
    </div>
  )
}