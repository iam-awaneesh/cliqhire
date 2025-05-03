import { Client } from "@/types/client";
import { getClients } from "@/services/clientService";

let sampleClients: Client[] = [];

const fetchClients = async () => {
  try {
    const response = await getClients(); // Get the full response
    const clients = Array.isArray(response) ? response : []; // Ensure response is an array
    if (!Array.isArray(clients)) {
      throw new Error("Expected an array of clients");
    }
    sampleClients = clients.map((client) => ({
      id: client._id,
      name: client.name,
      jobCount: client.jobCount,
      industry: client.industry,
      location: client.location,
      stage: client.clientStage === "Prospect" ? "Lead" : client.clientStage,
      owner: client.clientRm || "",
      team: client.clientTeam || "",
      createdAt: client.createdAt,
      incorporationDate: client.incorporationDate || "",
    }));
    return sampleClients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

const getSampleClients = async () => {
  return await fetchClients();
};

export { getSampleClients };