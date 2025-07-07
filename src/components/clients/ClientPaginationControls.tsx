import React from "react";
import { Button } from "@/components/ui/button";

interface ClientPaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalClients: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  handlePageChange: (page: number) => void;
  clientsLength: number;
}

const ClientPaginationControls: React.FC<ClientPaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalClients,
  pageSize,
  setPageSize,
  handlePageChange,
  clientsLength,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">
          Showing {clientsLength > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalClients)} of {totalClients} clients
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Show</span>
          <select
            className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
            value={pageSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value);
              setPageSize(newSize);
              handlePageChange(1); // Reset to page 1 when changing page size
            }}
          >
            <option value="1000">All</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
          <span className="text-sm">per page</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ClientPaginationControls; 