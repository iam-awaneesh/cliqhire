"use client"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, List, SlidersHorizontal, RefreshCcw, MoreVertical } from 'lucide-react'
import { JobsEmptyState } from "./empty-state"
import { useState, useEffect } from "react"
import { CreateJobModal } from "@/components/jobs/create-job-modal"
import { getSampleJobs } from "../clients/data/sample-jobs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { JobStageBadge } from "@/components/jobs/job-stage-badge"
import { Job, JobStage } from "@/types/job"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function ConfirmStageChangeDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Stage Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to update the job stage? This action will be saved immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{
    jobId: string;
    newStage: JobStage;
  } | null>(null);

  const router = useRouter();

  const [clientList,  setClientList] = useState([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const fetchedJobs = await getSampleJobs();
        if (Array.isArray(fetchedJobs)) {
          const convertedJobs = fetchedJobs.map(job => ({
            ...job,
            headcount: String(job.headcount),
            minSalary: Number(job.minSalary),
            maxSalary: Number(job.maxSalary),
            jobStatus: job.jobStatus || undefined,
          }));
          setJobs(convertedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadClients = async () => {
      try {
        const response = await fetch("https://aems-backend.onrender.com/api/clients/names");
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setClientList(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    loadClients();
    
    loadJobs();
  }, []);

  console.log(clientList);

  const handleStageChange = (jobId: string, newStage: JobStage) => {
    setPendingStageChange({ jobId, newStage });
    setConfirmOpen(true);
  };

  const confirmStageChange = async () => {
    if (!pendingStageChange) return;
    
    const { jobId, newStage } = pendingStageChange;
    
    try {
      // Update local state immediately for better UX
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, stage: newStage } : job
      ));

      // Make API call to update the stage
      const response = await fetch(`https://aems-backend.onrender.com/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job stage');
      }
    } catch (error) {
      console.error('Error updating job stage:', error);
      // Revert the local state if the API call fails
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, stage: job.stage } : job
      ));
    } finally {
      setPendingStageChange(null);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              Jobs
            </h1>
            <div className="ml-auto flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <LayoutGrid className="h-4 w-4 mr-2" />
                BOARD
              </Button>
              <Button variant="default" size="sm">
                <List className="h-4 w-4 mr-2" />
                LIST
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job Requirement
          </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
        </div>

        <div className="flex-1">
          <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Position Name</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Job Department</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Job location</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Job Status</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Job Stage</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Minimum salary</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Maximum salary</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Job Owner</TableHead>
                </TableRow>
              </TableHeader>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              Jobs
            </h1>
            <div className="ml-auto flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <LayoutGrid className="h-4 w-4 mr-2" />
                BOARD
              </Button>
              <Button variant="default" size="sm">
                <List className="h-4 w-4 mr-2" />
                LIST
              </Button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4">
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job Requirement
          </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
        </div>

        {/* Content */}
        {jobs.length > 0 ? (
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Position Name</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Job Department</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Job location</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Job Status</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Job Stage</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Minimum salary</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Maximum salary</TableHead>
                  <TableHead className="text-xs uppercase text-muted-foreground font-medium">Job Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job: Job) => (
                  <TableRow 
                    key={job.id} 
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <TableCell className="text-sm font-medium">{job.positionName}</TableCell>
                    <TableCell className="text-sm">{job.department}</TableCell>
                    <TableCell className="text-sm">{job.location}</TableCell>
                    <TableCell className="text-sm">{job.headcount}</TableCell>
                    <TableCell className="text-sm">
                      <JobStageBadge 
                        stage={job.stage} 
                        onStageChange={(newStage) => handleStageChange(job.id, newStage)}
                      />
                    </TableCell>
                    <TableCell className="text-sm">{job.minSalary}</TableCell>
                    <TableCell className="text-sm">{job.maxSalary}</TableCell>
                    <TableCell className="text-sm">{}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <JobsEmptyState />
          </div>
        )}
      </div>
      
      <CreateJobModal 
        open={open} 
        onOpenChange={setOpen}
      />
      
      <ConfirmStageChangeDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmStageChange}
      />
    </>
  )
}