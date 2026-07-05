/* eslint-disable prettier/prettier */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type OrderStatus = "Pending" | "Confirmed" | "Delivered" | "Cancelled";

const orders = [
  {
    id: "ORD001",
    customer: "John Doe",
    // eslint-disable-next-line prettier/prettier
    phone: "024 123 4567",
    total: 150.0,
    status: "Delivered" as OrderStatus,
    date: "2024-07-04",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    phone: "055 987 6543",
    total: 275.5,
    status: "Pending" as OrderStatus,
    date: "2024-07-05",
  },
  {
    id: "ORD003",
    customer: "Kofi Annan",
    phone: "020 111 2222",
    total: 80.0,
    status: "Confirmed" as OrderStatus,
    date: "2024-07-05",
  },
  {
    id: "ORD004",
    customer: "Ama Brown",
    phone: "050 333 4444",
    total: 450.0,
    status: "Cancelled" as OrderStatus,
    date: "2024-07-03",
  },
];

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-yellow-500",
  Confirmed: "bg-blue-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

export function OrdersComponent() {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
      <h3 className="font-display text-xl mb-4">Recent Orders</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>GH₵{order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={`${statusColors[order.status]} text-white`}>{order.status}</Badge>
              </TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Confirmed</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Delivered</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Cancel Order</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
