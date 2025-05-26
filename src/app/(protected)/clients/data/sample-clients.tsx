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
      industry: client.industry || "", // Default to empty string if undefined
      location: client.location || "", // Default to empty string if undefined
      stage: client.clientStage === "Prospect" ? "Lead" : client.clientStage || "Lead", // Default to "Lead" if undefined
      owner: client.clientRm || "", // Default to empty string if undefined
      team: client.clientTeam || "", // Default to empty string if undefined
      createdAt: client.createdAt,
      incorporationDate: client.incorporationDate || "", // Default to empty string if undefined
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