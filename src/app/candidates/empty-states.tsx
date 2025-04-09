import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import Link from "next/link"
import { CandidateLogo } from "@/components/candidates-logo"

interface CandidatesEmptyStateProps {
  children?: React.ReactNode
}

export function CandidatesEmptyState({ children }: CandidatesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto p-4">
      <div className="w-48 h-48 mb-6">
        <CandidateLogo />
      </div>
      <h2 className="text-xl font-semibold mb-3">You have not created any candidates yet</h2>
      <p className="text-gray-500 mb-6">
        Creating candidates will allow you to add their details, resumes, add them to a job and much more.
      </p>
      {children}
    </div>
  )
}
// export function CandidatesEmptyState() {
//   return (
//     <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto p-4">
//       <div className="w-48 h-48 mb-6">
//         <CandidateLogo />
//       </div>
//       <h2 className="text-xl font-semibold mb-3">You have not created any candidates yet</h2>
//       <p className="text-gray-500 mb-6">
//         Creating candidates will allow you to add their details, resumes, add them to a job and much more.
//       </p>
//       <div className="flex flex-col items-center gap-4">
//         <Button className="bg-blue-600 hover:bg-blue-700">
//           <Plus className="h-4 w-4 mr-2" />
//           Create candidate
//         </Button>
//         <Link href="#" className="text-blue-600 hover:underline">
//           {/* Learn more about candidates */}
//         </Link>
//       </div>
//     </div>
//   )
// }

