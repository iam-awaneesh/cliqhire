"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const stageStatuses = [
  "Replied to a message",
  "Calls",
  "Attended a meeting",
  "Profile Sent",
  "Contract Sent",
  "Contract Negotiation",
] as const

type ClientStageStatus = (typeof stageStatuses)[number]

const stageStatusColors: Record<ClientStageStatus, string> = {
  "Replied to a message": "bg-blue-100 text-blue-800",
  Calls: "bg-purple-100 text-purple-800",
  "Attended a meeting": "bg-yellow-100 text-gray-800",
  "Profile Sent": "bg-indigo-100 text-indigo-800",
  "Contract Sent": "bg-pink-100 text-pink-800",
  "Contract Negotiation": "bg-green-100 text-green-800",
} as const

interface ClientStageStatusBadgeProps {
  id?: string
  status: ClientStageStatus
  onStatusChange?: (id: string, newStatus: ClientStageStatus) => void
}

export function ClientStageStatusBadge({ id, status, onStatusChange }: ClientStageStatusBadgeProps) {
  if (!onStatusChange) {
    return (
      <Badge variant="secondary" className={`${stageStatusColors[status]} border-none`}>
        {status}
      </Badge>
    )
  }

  const handleClick = (id: string | undefined, option: ClientStageStatus) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation()
      if (id && onStatusChange) {
        onStatusChange(id, option)
      } else {
        console.error('Cannot change status: id is undefined or onStatusChange is not provided')
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-auto p-0 hover:bg-transparent"
        >
          <Badge 
            variant="secondary" 
            className={`${stageStatusColors[status]} border-none flex items-center gap-1`}
          >
            {status}
            <ChevronDown className="h-3 w-3" />
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {stageStatuses.map((statusOption) => (
          <DropdownMenuItem
            key={statusOption}
            onClick={handleClick(id, statusOption)}
            className="flex items-center gap-2"
          >
            <Badge 
              variant="secondary" 
              className={`${stageStatusColors[statusOption]} border-none`}
            >
              {statusOption}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
