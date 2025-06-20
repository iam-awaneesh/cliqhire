import React from 'react'
import { TableHead , TableRow } from './ui/table'
type TableHeaderProps = {
  tableHeadArr: string[];   
}

const Tableheader = ({tableHeadArr}:TableHeaderProps) => {
  return (
    <TableRow className="hover:bg-transparent">
      {tableHeadArr.map((head :string, index:number) => (
        <TableHead key={index} className="text-xs uppercase text-muted-foreground font-medium">
          {head}    
        </TableHead>
      ))}
    </TableRow>
  )
}

export default  Tableheader
