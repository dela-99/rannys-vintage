import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReactNode } from "react";

interface ColumnDef {
  accessorKey: string;
  header: string;
}

type TableRowData = Record<string, ReactNode>;

interface DataTableProps {
  columns: ColumnDef[];
  data: TableRowData[];
  emptyState: ReactNode;
}

export function DataTable({ columns, data, emptyState }: DataTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.accessorKey}>{row[column.accessorKey]}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>{emptyState}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
