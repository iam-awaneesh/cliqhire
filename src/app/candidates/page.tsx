'use client'
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Folder, Search, Route, Router } from 'lucide-react'
// import { CandidatesEmptyState } from "./empty-states"
import { CreateCandidate } from "@/components/ui/candidates/create-candidate"
// import Link from 'next/link'
import { useState } from "react"
import {CreateFolder} from "@/components/ui/candidates/create-folder"
import { AdvanceSearch } from "@/components/ui/candidates/AdvSearch"

export default function CandidatesPage() {
  const [selected, setSelected] = useState("candidate");

  const showSelectedOption = () => {
    switch(selected) {
      case 'candidate':
        return  <CreateCandidate />;
      case 'Folder':
        return  <CreateFolder />;
      case 'advanced':
        return  <AdvanceSearch />;
  
    }
  }
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            Candidates
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-4">
        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="w-fit border-b-0">
            <TabsTrigger value="candidates" className="gap-2" onClick={()=>{setSelected('candidate')}}>
              <Users className="h-4 w-4" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="folder" className="gap-2" onClick={()=>{setSelected('Folder')}}>
              <Folder className="h-4 w-4"  />
              Folders
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2" onClick={()=>{setSelected('advanced')}}>
              <Search className="h-4 w-4" />
              Advanced Search
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {showSelectedOption()}
    </div>
  )
}

