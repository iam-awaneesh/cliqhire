"use client";
import React from 'react';
import {useState} from 'react'
import Dashboardheader from '@/components/dashboard-header';
import { Table ,TableBody ,TableCell, TableHeader ,TableHead } from '@/components/ui/table';
import Tableheader from '@/components/table-header';


const headerArr = [
  "Recruiter Name",
  "Recruiter Email",
  "Recruiter Phone", 
  "Recruiter Location",
  "Recruiter Experience",
  "Recruiter Skills",
  "Recruiter Resume",
  "Recruiter Status",
  "Actions"
];

export default function RecruiterPage() {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);


  return (
   <div>
      <Dashboardheader 
          setOpen={setOpen}
          setFilterOpen={setFilterOpen}
          initialLoading={initialLoading}
          heading="Recruiter"
          buttonText="Add Recruiter"
     />

      {/* Table */}
       <Table>
          <TableHeader>
            <Tableheader
                    tableHeadArr={headerArr}
                  />
          </TableHeader>
          <TableBody>
            {/* Map through your data here */}
          </TableBody>


       </Table>
      
   </div>
  )
}