"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useState } from "react"
import { AddNoteDialog } from "./add-note-dialog"
import { NotesList } from "./notes-list"

interface NotesContentProps {
  clientId: string;
}

// Sample notes data - in a real app this would come from an API
const sampleNotes = [
  {
    id: "1",
    content: "Initial client meeting scheduled for next week. Need to prepare presentation materials.",
    author: {
      name: "John Doe",
      avatar: "JD"
    },
    createdAt: "2025-04-04T16:10:00Z",
    isPrivate: false
  },
  {
    id: "2",
    content: "Client expressed interest in expanding services to international markets. Follow up needed on compliance requirements.",
    author: {
      name: "Jane Smith",
      avatar: "JS"
    },
    createdAt: "2025-04-03T14:30:00Z",
    isPrivate: true
  }
]

export function NotesContent({ clientId }: NotesContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [notes, setNotes] = useState(sampleNotes)

  const handleAddNote = (note: { title: string; content: string }) => {
    const newNote = {
      id: Date.now().toString(),
      content: note.content,
      author: {
        name: "Current User",
        avatar: "CU"
      },
      createdAt: new Date().toISOString(),
      isPrivate: false
    }
    setNotes([newNote, ...notes])
  }

  return (
    <div className="flex h-[calc(100vh-240px)]">
      {/* Left Sidebar */}
      <div className="w-80 border-r p-4 flex flex-col gap-4">
        <Input 
          placeholder="Search for contacts or guests" 
          className="w-full"
        />
        <Button 
          variant="default" 
          className="w-full justify-start bg-blue-600 hover:bg-blue-700"
        >
          General
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        {notes.length > 0 ? (
          <NotesList notes={notes} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-48 h-48 mb-6">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full text-blue-500"
              >
                <rect x="60" y="40" width="80" height="120" rx="8" fill="currentColor" fillOpacity="0.1" />
                <rect x="70" y="60" width="60" height="4" rx="2" fill="currentColor" />
                <rect x="70" y="80" width="40" height="4" rx="2" fill="currentColor" />
                <rect x="70" y="100" width="50" height="4" rx="2" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
            <p className="text-muted-foreground text-center mb-8">
              Add your first note to keep track of important information.
            </p>
          </div>
        )}
      </div>

      <AddNoteDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddNote}
      />
    </div>
  )
}