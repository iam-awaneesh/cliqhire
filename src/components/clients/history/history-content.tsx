"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

interface HistoryContentProps {
  clientId: string;
}

interface HistoryAction {
  id: string
  user: {
    name: string
    avatar: string
  }
  action: string
  client?: string
  details?: string
  timestamp: string
}

const historyActions: HistoryAction[] = [
  {
    id: "1",
    user: { name: "Shaswat singh", avatar: "SS" },
    action: "moved the client",
    client: "microsoft",
    details: "from stage Engaged to stage Negotiation",
    timestamp: "a day ago (2025-01-07 • 12:57)"
  },
  {
    id: "2",
    user: { name: "Shaswat singh", avatar: "SS" },
    action: "moved the client",
    client: "microsoft",
    details: "from stage Lead to stage Engaged",
    timestamp: "a day ago (2025-01-07 • 12:57)"
  },
  {
    id: "3",
    user: { name: "Shaswat singh", avatar: "SS" },
    action: "moved the client",
    client: "microsoft",
    details: "from stage Prospect to stage Lead",
    timestamp: "a day ago (2025-01-07 • 12:57)"
  },
  {
    id: "4",
    user: { name: "Shaswat singh", avatar: "SS" },
    action: "created the client",
    client: "microsoft",
    timestamp: "3 days ago (2025-01-05 • 14:16)"
  },
  {
    id: "5",
    user: { name: "Shaswat singh", avatar: "SS" },
    action: "added themselves",
    timestamp: "3 days ago (2025-01-05 • 14:16)"
  }
]

export function HistoryContent({ clientId }: HistoryContentProps) {
  return (
    <div className="p-4">
      <div className="text-sm mb-4">
        {historyActions.length} actions taken
      </div>

      <div className="space-y-4">
        {historyActions.map((action) => (
          <div key={action.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 bg-orange-500">
              <AvatarFallback>{action.user.avatar}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <Link href="#" className="text-blue-500 hover:underline">
                    {action.user.name}
                  </Link>{" "}
                  {action.action}{" "}
                  {action.client && (
                    <Link href="#" className="text-blue-500 hover:underline">
                      {action.client}
                    </Link>
                  )}
                  {action.details && <span> {action.details}</span>}
                </div>
                <span className="text-sm text-muted-foreground">
                  {action.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}