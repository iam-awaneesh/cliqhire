"use client";
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
import { use } from "react";
import { useRouter, useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table";
import { Plus, RefreshCcw, SlidersHorizontal, MoreVertical } from "lucide-react";
import { CreateClientModal } from "@/components/create-client-modal";
import { getSampleClients } from "@/app/clients/data/sample-clients";
import { ClientStageBadge } from "@/components/client-stage-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { differenceInYears } from 'date-fns';


// Define the Client type
interface Client {
id: string;
name: string;
industry: string;
location: string;
stage: "Lead" | "Negotiation" | "Engaged" | "Signed";
owner: string;
team: string;
createdAt: string;
jobCount: number;
incorporationDate: string;
}

type SortField = "name" | "industry" | "location" | "createdAt";
type SortOrder = "asc" | "desc";

interface SortConfig {
field: SortField;
order: SortOrder;
}

interface Filters {
name: string;
industry: string;
maxAge: string;
}

export default function ClientsPage() {
const router = useRouter();
const params = useParams();
const [open, setOpen] = useState(false);
const [filterOpen, setFilterOpen] = useState(false);
const [viewType, setViewType] = useState<"list" | "board">("list");
const [sortConfig, setSortConfig] = useState<SortConfig>({ field: "name", order: "asc" });
const [filters, setFilters] = useState<Filters>({
name: "",
industry: "",
maxAge: "",
});

const [clients, setClients] = useState<Client[]>([]);
const [clientId, setClientId] = useState<string>()
const [newStage, setNewStage] = useState<string>()
const [isLoading, setIsLoading] = useState<boolean>(false)
const [showConfirmDialog, setShowConfirmDialog] = useState(false)
const [pendingChange, setPendingChange] = useState<{ clientId: string; stage: Client["stage"] } | null>(null)

useEffect(() => {
getSampleClients().then((data) => setClients(data));
}, []);

function getYearDifference(createdAt: string) {
  const createdDate = new Date(createdAt);
  const today = new Date();
  return differenceInYears(today, createdDate);
}

const calculateAge = (createdAt: string) => {
const created = new Date(createdAt);
const now = new Date();
const diffTime = Math.abs(now.getTime() - created.getTime());
const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
return diffMonths;
};

const handleStageChange = (clientId: string, newStage: Client["stage"]) => {
setClients((prevClients) =>
prevClients.map((client) =>
client.id === clientId ? { ...client, stage: newStage } : client
)
);
// setClientId(clientId)
// setNewStage(newStage)
setPendingChange({ clientId, stage: newStage })
setShowConfirmDialog(true)
};

const filteredAndSortedClients = useMemo(() => {
let result = [...clients];

// Apply filters
if (filters.name) {
result = result.filter((client) =>
client.name.toLowerCase().includes(filters.name.toLowerCase())
);
}
if (filters.industry) {
result = result.filter((client) =>
client.industry.toLowerCase().includes(filters.industry.toLowerCase())
);
}
if (filters.maxAge) {
const maxAgeMonths = parseInt(filters.maxAge);
if (!isNaN(maxAgeMonths)) {
result = result.filter(
(client) => calculateAge(client.createdAt) <= maxAgeMonths
);
}
}

// Apply sorting
result.sort((a, b) => {
if (a[sortConfig.field] < b[sortConfig.field]) {
return sortConfig.order === "asc" ? -1 : 1;
}
if (a[sortConfig.field] > b[sortConfig.field]) {
return sortConfig.order === "asc" ? 1 : -1;
}
return 0;
});

return result;
}, [sortConfig, filters, clients]);

const formatAge = (createdAt: string) => {
const months = calculateAge(createdAt);
const years = Math.floor(months / 12);
const remainingMonths = months % 12;

if (years === 0) {
return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
} else if (remainingMonths === 0) {
return `${years} year${years !== 1 ? "s" : ""}`;
} else {
return `${years} year${years !== 1 ? "s" : ""}, ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
}
};
const handleChange = ( id:any, newStage:any) => {

handleStageChange(id, newStage)
}
const handleConfirmChange = async () => {
if (!pendingChange) return

setClientId(pendingChange.clientId)
setNewStage(pendingChange.stage)
setClients(prev => prev.map(client =>
client.id === pendingChange.clientId ? { ...client, stage: pendingChange.stage } : client
))
setShowConfirmDialog(false)
}

const handleCancelChange = () => {
setPendingChange(null)
setShowConfirmDialog(false)
}

useEffect(() => {

const updateClientStage = async () => {
if (!clientId || !newStage) return;

try {
setIsLoading(true);

const response = await fetch(`https://aems-backend.onrender.com/api/clients/${clientId}`, {
method: 'PATCH',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ clientStage: newStage }),
});
console.log(response)

if (!response.ok) {
throw new Error('Failed to update job stage');
}

} catch (error) {
console.error('Error updating client stage:', error);
} finally {
setIsLoading(false);
}
}

updateClientStage();
}, [clientId, newStage]);

if(isLoading) {
return <div>Loading...</div>
}
return (
<>
<AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
<AlertDialogContent>
<AlertDialogHeader>
<AlertDialogTitle>Confirm Stage Change</AlertDialogTitle>
<AlertDialogDescription>
Are you sure you want to update the job stage? This action will be saved immediately.
</AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>
<AlertDialogCancel onClick={handleCancelChange}>Cancel</AlertDialogCancel>
<AlertDialogAction onClick={handleConfirmChange}>Confirm</AlertDialogAction>
</AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>
<div className="flex flex-col h-full">
{/* Header */}
<div className="border-b">
<div className="flex h-16 items-center px-4">
<h1 className="text-2xl font-semibold">Clients</h1>
<div className="ml-auto flex items-center space-x-2">
<Button
variant={viewType === "list" ? "default" : "outline"}
size="sm"
onClick={() => setViewType("list")}
>
LIST
</Button>
</div>
</div>
</div>

{/* Toolbar */}
<div className="flex items-center justify-between p-4">
<Button size="sm" onClick={() => setOpen(true)}>
<Plus className="h-4 w-4 mr-2" />
Create Client
</Button>
<div className="flex items-center gap-2">
<Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
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

{/* Table */}
{viewType === "list" && (
<div className="flex-1">
<Table>
<TableHeader>
<TableRow className="hover:bg-transparent">
<TableHead className="text-xs uppercase text-muted-foreground font-medium">
Client Name
</TableHead>
<TableHead className="text-xs uppercase text-muted-foreground font-medium">
Client Industry
</TableHead>
<TableHead className="text-xs uppercase text-muted-foreground font-medium">
Client Location
</TableHead>
<TableHead className="text-xs uppercase text-muted-foreground font-medium">
Client Stage
</TableHead>
<TableHead className="text-xs uppercase text-muted-foreground font-medium">
Client Rm
</TableHead>
<TableHead className="text-xs uppercase text-muted-foreground font-medium">
Client Team
</TableHead>
<TableHead className="text-xs uppercase text-muted-foreground font-medium">
Client Age
</TableHead>
<TableHead className="text-xs uppercase text-muted-foreground font-medium">
Job Count
</TableHead>
</TableRow>
</TableHeader>
<TableBody>
{filteredAndSortedClients.length === 0 ? (
<TableRow>
<TableCell colSpan={8} className="h-[calc(100vh-240px)] text-center">
<div className="py-24">
<div className="text-center">No clients found</div>
</div>
</TableCell>
</TableRow>
) : (
filteredAndSortedClients.map((client) => (
<TableRow
key={client.id}
className="hover:bg-muted/50 cursor-pointer"
onClick={(e) => {
// Only navigate if click was outside ClientStageBadge
if (!(e.target as HTMLElement).closest('.client-stage-badge')) {
router.push(`/clients/${client.id}`);
}
}}
>
<TableCell className="text-sm font-medium">{client.name}</TableCell>
<TableCell className="text-sm">{client.industry}</TableCell>
<TableCell className="text-sm">{client.location}</TableCell>
<TableCell className="text-sm">
<ClientStageBadge
id={client.id}
stage={client.stage}
onStageChange={(id:any, newstage:any) => handleChange(id, newstage)}
/>
</TableCell>
<TableCell className="text-sm">{client.owner}</TableCell>
<TableCell className="text-sm">{client.team}</TableCell>
<TableCell className="text-sm">{client.incorporationDate ? `${getYearDifference(client.incorporationDate)} years`: "0 years" }</TableCell>
<TableCell className="text-sm">{client.jobCount}</TableCell>
</TableRow>
))
)}
</TableBody>
</Table>
</div>
)}

{/* Modal */}
<CreateClientModal open={open} onOpenChange={setOpen} />
</div>

{/* Filters Modal */}
<Dialog open={filterOpen} onOpenChange={setFilterOpen}>
<DialogContent>
<DialogHeader>
<DialogTitle>Filters</DialogTitle>
</DialogHeader>
<div className="space-y-4 py-2">
<div>
<Label htmlFor="name-filter">Client Name</Label>
<Input
id="name-filter"
placeholder="Enter client name"
value={filters.name}
onChange={(e) => setFilters({ ...filters, name: e.target.value })}
/>
</div>
<div>
<Label htmlFor="industry-filter">Client Industry</Label>
<Input
id="industry-filter"
placeholder="Enter client industry"
value={filters.industry}
onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
/>
</div>
<div>
<Label htmlFor="age-filter">Client Age (months)</Label>
<Input
id="age-filter"
placeholder="Enter max age"
value={filters.maxAge}
onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
/>
</div>
</div>
</DialogContent>
</Dialog>
</>
);
}
