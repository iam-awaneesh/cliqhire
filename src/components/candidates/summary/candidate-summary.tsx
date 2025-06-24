import React, { useState } from 'react';

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
      {/* Top section: avatar, name, tags */}
      <div className="flex items-center mb-2">
        <div className="w-14 h-14 rounded-full bg-blue-700 text-white flex items-center justify-center text-3xl font-semibold mr-5">
          {initial}
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold">{candidate.name}</span>
          <a href="#" className="text-blue-700 text-sm underline mt-1 w-fit">+ Tags</a>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-gray-200 mt-4">
        <nav className="flex space-x-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 whitespace-nowrap focus:outline-none
                ${activeTab === tab ? 'border-blue-700 text-blue-700 bg-white' : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300'}`}
              type="button"
            >
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
