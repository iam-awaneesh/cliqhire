import React, { useState } from 'react';
import EntityHeader from '@/components/common/entity-header';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Filter, Globe, MessageSquare } from 'lucide-react';
import { TAB_ICONS } from './tab-icons';

interface CandidateSummaryProps {
  email: string;
}

const TABS = [
  'Summary',
  'Resume',
  'Inbox',
  'Social',
  'Jobs',
  'Recommendation',
  'Activities',
  'Notes',
  'Attachments',
  'History',
];

const CandidateSummary: React.FC<CandidateSummaryProps> = ({ email }) => {
  // Mock candidate data based on email
  const candidate = {
    name: email === 'john@example.com' ? 'John Doe' : 'Jane Smith',
    email,
  };
  const initial = candidate.name.charAt(0).toUpperCase();
  const [activeTab, setActiveTab] = useState('Summary');

  return (
    <div className="p-8 bg-gray-50 min-h-[300px]">
      {/* Shared header UI */}
      <EntityHeader
        title={candidate.name}
        subtitle={candidate.email}
        // Example: location and status can be added if available
        // location={candidate.location}
        // status={candidate.status}
        actions={
          <div className="flex gap-6 items-center">
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Globe className="w-4 h-4 mr-1" /> Website
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="w-4 h-4 mr-1" /> WhatsApp
              </Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Filter className="w-4 h-4 mr-1" /> Filters
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCcw className="w-4 h-4 mr-1" /> Refresh
              </Button>
            </div>
          </div>
        }
      />

      {/* Tab bar */}
      <div className="border-b border-gray-200 mt-4">
        <nav className="flex space-x-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 whitespace-nowrap focus:outline-none
                ${activeTab === tab ? 'border-black text-black bg-white' : 'border-transparent text-gray-600 hover:text-black hover:border-black'}`}

              type="button"
            >
              {TAB_ICONS[tab]}
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'Summary' && (
          <div className="text-base">
            <div>Email: {candidate.email}</div>
            {/* Add more summary fields as needed */}
          </div>
        )}
        {activeTab !== 'Summary' && (
          <div className="text-gray-400">{activeTab} content coming soon...</div>
        )}
      </div>
    </div>
  );
};

export default CandidateSummary;
