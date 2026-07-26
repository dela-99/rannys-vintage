import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ColumnDef {
  accessorKey: string;
  header: string;
}

interface DataTableProps {
  columns: ColumnDef[];
  data: any[];
  emptyState: React.ReactNode;
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
                  <TableCell key={column.accessorKey}>
                    {row[column.accessorKey]}
                  </TableCell>
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