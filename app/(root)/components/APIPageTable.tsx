import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// TableSectionProps defines the props for each API documentation section
interface TableSectionProps {
  title: string;
  parameters: [string, string][];
  exampleResponse: string;
}

/**
 * TableSection renders a documentation block with a title, a parameter table, and a JSON example response.
 * - Uses shadcn Table for consistent, modern UI.
 * - Accepts title, parameters, and exampleResponse as props.
 */
export function TableSection({
  title,
  parameters,
  exampleResponse,
}: TableSectionProps) {
  return (
    <section className="mb-8">
      {/* Section header for clarity and separation */}
      <header className="p-4 bg-muted text-foreground rounded-t-md">
        <h5 className="text-lg font-bold">{title}</h5>
      </header>
      <div className="p-4 border border-border rounded-b-md bg-background">
        {/* Parameter table using shadcn Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Parameters</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map(([param, desc], idx) => (
              <TableRow key={idx}>
                <TableCell className="text-foreground font-mono">
                  {param}
                </TableCell>
                <TableCell className="text-foreground">{desc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Example response block for developer reference */}
        <strong className="block mt-4 text-foreground">Example Response</strong>
        <pre className="rounded-md p-4 overflow-x-auto bg-muted text-foreground text-sm mt-2">
          {exampleResponse}
        </pre>
      </div>
    </section>
  );
}

// The TableSection component is reusable for each API documentation block.
