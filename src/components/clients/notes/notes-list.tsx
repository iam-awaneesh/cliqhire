"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Lock, Pencil, Trash2, Share2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Note {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  isPrivate: boolean
}

interface NotesListProps {
  notes: Note[]
}

export function NotesList({ notes }: NotesListProps) {
  const handleEdit = (noteId: string) => {
  }

  const handleDelete = (noteId: string) => {
  }

  const handleShare = (noteId: string) => {
  }

  return (
    <div className="space-y-6">
      {notes.map((note) => (
        <div key={note.id} className="bg-white rounded-lg border p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 bg-blue-500">
                <AvatarFallback>{note.author.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{note.author.name}</span>
                  {note.isPrivate && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleEdit(note.id)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(note.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare(note.id)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share with guest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: note.content }} />
        </div>
      ))}
    </div>
  )
}