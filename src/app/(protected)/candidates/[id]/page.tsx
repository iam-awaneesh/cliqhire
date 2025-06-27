"use client";
import { mockCandidates, Candidate } from "@/data/candidatesData";
import React, { useState } from "react";
import CandidateSummary from '@/components/candidates/summary/candidate-summary';
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RefreshCcw, Plus } from "lucide-react";
import { useParams } from 'next/navigation';
// If TAB_ICONS is available, import it, otherwise use placeholders
// import { TAB_ICONS } from "@/components/candidates/summary/tab-icons";

const TABS = [
  "Summary",
  "Resume",
  "Inbox",
  "Social",
  "Jobs",
  "Recommendation",
  "Activities",
  "Notes",
  "Attachments",
  "History",
];

export default function CandidatePage() {
  const params = useParams();
  const email = decodeURIComponent(params.id as string);
  // Find candidate by email from shared data
  const candidate = mockCandidates.find((c: Candidate) => c.email === email);
  const [activeTab, setActiveTab] = useState("Summary");
  return (
    <div className="p-8 bg-gray-50 min-h-[300px]">
      {/* Header */}
      <div className="flex flex-col gap-0">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <div className="text-2xl font-bold">{candidate.name}</div>
            <div className="flex items-center gap-2 text-gray-500 text-base mt-1">
              <span>{candidate.email}</span>
              <span className="mx-1">•</span>
              {/* <span>{candidate.phone}</span> */}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border rounded-md px-4">
              Website
            </Button>
            <Button variant="outline" size="sm" className="border rounded-md px-4">
              WhatsApp
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 py-3">
          <Button
            size="lg"
            className="bg-black text-white hover:bg-gray-900 font-semibold px-6 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Create A new Candidate
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border rounded-md flex items-center gap-2"
              onClick={() => console.log("Open Resume")}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border rounded-md flex items-center gap-2"
              onClick={() => console.log("Open Inbox")}
            >
              <RefreshCcw className={`h-4 w-4 `} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      {/* Tab bar */}
      <div className="border-b border-gray-200 mt-4">
        <nav className="flex space-x-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 whitespace-nowrap focus:outline-none
                ${activeTab === tab ? "border-black text-black bg-white" : "border-transparent text-gray-600 hover:text-black hover:border-black"}`}
              type="button"
            >
              {/* {TAB_ICONS[tab]} */}
              {tab}
            </button>
          ))}
        </nav>
      </div>
      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "Summary" && (
          <CandidateSummary candidate={candidate} />
        )}
        {activeTab !== "Summary" && (
          <div className="text-gray-400">{activeTab} content coming soon...</div>
        )}
      </div>
    </div>
  );
}
