"use client";
import CandidateSummary from '@/components/candidates/summary/candidate-summary';
import { useParams } from 'next/navigation';

export default function CandidateSummaryPage() {
  const params = useParams();
  const email = decodeURIComponent(params.email as string);
  // In a real app, fetch candidate details by email here
  return <CandidateSummary email={email} />;
}
