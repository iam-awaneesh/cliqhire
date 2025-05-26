"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, File } from "lucide-react"
import { useRef } from "react"

interface FileUploadRowProps {
  label: string
  accept: string
  onFileSelect: (file: File) => void
  currentFileName?: string
  showOnlyIfOverseas?: boolean
  showFileName?: boolean
  showPreviewButton?: boolean
  showDownloadButton?: boolean
  onPreview?: () => void
  onDownload?: () => void
  onDelete?: () => Promise<void>;
}

export function FileUploadRow({
  label,
  accept,
  onFileSelect,
  currentFileName,
  showOnlyIfOverseas,
  showFileName = true,
  showPreviewButton = false,
  showDownloadButton = false,
  onPreview,
  onDownload
}: FileUploadRowProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && typeof onFileSelect === "function") {
      onFileSelect(file);
    } else {
      console.error("onFileSelect is not a function or no file selected");
    }
  }

  // If showOnlyIfOverseas is true and client is not overseas, don't show the component
  // This is a placeholder condition - you should replace it with your actual overseas check
  if (showOnlyIfOverseas && !true) {
    return null
  }

  return (
    <div className="flex items-center py-2 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground w-1/3">{label}</span>
      <div className="flex items-center justify-between flex-1">
        {showFileName && currentFileName ? (
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{currentFileName}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Upload file</span>
        )}
        <div className="flex items-center gap-2">
          {currentFileName && showPreviewButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={onPreview}
            >
              Preview
            </Button>
          )}
          {currentFileName && showDownloadButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={onDownload}
            >
              Download
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8"
            onClick={handleClick}
          >
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </Button>
        </div>
      </div>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
    </div>
  )
}