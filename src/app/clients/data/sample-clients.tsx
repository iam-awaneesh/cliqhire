// import { Client } from '@/types/client';
// import { getClients } from '@/services/clientService';

// let sampleClients: Client[] = [];

// const fetchClients = async () => {
//   try {
//     const clients = await getClients();
//     sampleClients = clients.map((client) => ({
//       id: client._id,
//       name: client.name,
//       jobCount: client.jobCount,
//       industry: client.industry,
//       location: client.location,
//       stage: client.clientStage,
//       owner: client.clientSponsor || '',
//       team: client.clientTeam || '',
//       createdAt: client.createdAt,
//     }));
//   } catch (error) {
//     console.error('Error fetching clients:', error);
//   }
// };

// fetchClients();

import { Client } from "@/types/client";
import { getClients } from "@/services/clientService";

let sampleClients: Client[] = [];

const fetchClients = async () => {
  try {
    const clients = await getClients();
    sampleClients = clients.map((client) => ({
      id: client._id,
      name: client.name,
      jobCount: client.jobCount,
      industry: client.industry,
      location: client.location,
      // Filter out 'Prospect' by replacing it with 'Lead'
      stage: client.clientStage === 'Prospect' ? 'Lead' : client.clientStage,
      owner: client.clientRm || "",
      team: client.clientTeam || "",
      createdAt: client.createdAt,
      incorporationDate: client.incorporationDate || ""
    }));
    return sampleClients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

// Export a function that returns the fetched clients instead of exporting a mutable variable
const getSampleClients = async () => {
  return await fetchClients();
};

export { getSampleClients };


// Ensure `sampleClients` is exported
//export { sampleClients };
