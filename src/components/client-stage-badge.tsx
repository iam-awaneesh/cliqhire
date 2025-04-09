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

const stageColors = {
  Lead: "bg-blue-100 text-blue-800",

  Engaged: "bg-yellow-100 text-gray-800",
  Negotiation: "bg-purple-100 text-purple-800",
  Signed: "bg-green-100 text-purple-800",
} as const

const stages: (keyof typeof stageColors)[] = [
  'Lead',
  'Engaged',
  'Negotiation',
  'Signed'
]

interface ClientStageBadgeProps {
  id?: string
  stage: keyof typeof stageColors
  onStageChange?: (id:any, newStage:any) => void
}

export function ClientStageBadge({ id, stage, onStageChange }: ClientStageBadgeProps) {
  if (!onStageChange) {

    return (
      <Badge variant="secondary" className={`${stageColors[stage]} border-none`}>
        {stage}
      </Badge>
    )
    
  }

  const handleClick =( id:any, option: any) => {
    return (event: any) => {
      event.stopPropagation()
      console.log('option', option)
      onStageChange(id, option)
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
            className={`${stageColors[stage]} border-none flex items-center gap-1`}
          >
            {stage}
            <ChevronDown className="h-3 w-3" />
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {stages.map((stageOption) => (
          <DropdownMenuItem
            key={stageOption}
            onClick={handleClick(id, stageOption)}
            className="flex items-center gap-2"
          >
            <Badge 
              variant="secondary" 
              className={`${stageColors[stageOption]} border-none`}
            >
              {stageOption}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}