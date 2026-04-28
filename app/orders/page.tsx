'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/ui/data-table';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MoreHorizontal,
  Eye,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  Download,
  ShoppingCart,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Order } from '@/lib/mock-data';
import { jsPDF } from 'jspdf';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-warning/10 text-warning' },
  packed: { label: 'Packed', icon: Package, className: 'bg-chart-2/10 text-chart-2' },
  shipped: { label: 'Shipped', icon: Truck, className: 'bg-chart-1/10 text-chart-1' },
  delivered: { label: 'Delivered', icon: CheckCircle, className: 'bg-success/10 text-success' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'bg-destructive/10 text-destructive' },
};

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const openViewDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
  };

  const generateInvoice = (order: Order) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(85, 85, 85);
    doc.text('INVOICE', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('CVG Logistics', 20, 40);
    doc.text('Counter & Logistics Management', 20, 46);
    
    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice #: INV-${order.orderNumber}`, 140, 30);
    doc.text(`Date: ${format(new Date(order.createdAt), 'MMM dd, yyyy')}`, 140, 36);
    doc.text(`Order #: ${order.orderNumber}`, 140, 42);
    
    // Customer info
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text('Bill To:', 20, 65);
    doc.setFontSize(10);
    doc.text(order.customerName, 20, 72);
    doc.text(order.customerEmail, 20, 78);
    doc.text(order.customerPhone, 20, 84);
    doc.text(order.shippingAddress, 20, 90, { maxWidth: 80 });
    
    // Table header
    const tableTop = 110;
    doc.setFillColor(245, 245, 245);
    doc.rect(20, tableTop, 170, 10, 'F');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Item', 25, tableTop + 7);
    doc.text('Qty', 120, tableTop + 7);
    doc.text('Price', 140, tableTop + 7);
    doc.text('Total', 165, tableTop + 7);
    
    // Table rows
    let y = tableTop + 17;
    order.items.forEach((item) => {
      doc.text(item.productName, 25, y, { maxWidth: 90 });
      doc.text(String(item.quantity), 120, y);
      doc.text(`$${item.price.toFixed(2)}`, 140, y);
      doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 165, y);
      y += 10;
    });
    
    // Total
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y + 5, 190, y + 5);
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text('Total:', 140, y + 15);
    doc.setTextColor(34, 139, 34);
    doc.text(`$${order.total.toFixed(2)}`, 165, y + 15);
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for your business!', 20, 270);
    doc.text('For questions, contact support@cvglogistics.com', 20, 276);
    
    doc.save(`invoice-${order.orderNumber}.pdf`);
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const shippedOrders = orders.filter((o) => o.status === 'shipped' || o.status === 'packed');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order',
      sortable: true,
      cell: (order: Order) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-1/10 text-chart-1">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">{order.orderNumber}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(order.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      cell: (order: Order) => (
        <div>
          <p className="font-medium text-foreground">{order.customerName}</p>
          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
        </div>
      ),
    },
    {
      key: 'counterName',
      header: 'Counter',
      sortable: true,
    },
    {
      key: 'items',
      header: 'Items',
      cell: (order: Order) => (
        <span className="text-muted-foreground">
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      cell: (order: Order) => (
        <span className="font-semibold text-success">${order.total.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (order: Order) => {
        const config = statusConfig[order.status];
        const Icon = config.icon;
        return (
          <Badge variant="secondary" className={config.className}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (order: Order) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openViewDialog(order)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => generateInvoice(order)}>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleStatusChange(order.id, 'packed')}
              disabled={order.status !== 'pending'}
            >
              <Package className="mr-2 h-4 w-4" />
              Mark as Packed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(order.id, 'shipped')}
              disabled={order.status !== 'packed'}
            >
              <Truck className="mr-2 h-4 w-4" />
              Mark as Shipped
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(order.id, 'delivered')}
              disabled={order.status !== 'shipped'}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Delivered
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AppLayout title="Orders" subtitle="Manage customer orders and invoices">
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({shippedOrders.length})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({deliveredOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            data={orders}
            columns={columns}
            searchKey="customerName"
            searchPlaceholder="Search orders..."
          />
        </TabsContent>

        <TabsContent value="pending">
          <DataTable
            data={pendingOrders}
            columns={columns}
            searchKey="customerName"
            searchPlaceholder="Search pending orders..."
            emptyMessage="No pending orders"
          />
        </TabsContent>

        <TabsContent value="processing">
          <DataTable
            data={shippedOrders}
            columns={columns}
            searchKey="customerName"
            searchPlaceholder="Search processing orders..."
            emptyMessage="No orders in processing"
          />
        </TabsContent>

        <TabsContent value="delivered">
          <DataTable
            data={deliveredOrders}
            columns={columns}
            searchKey="customerName"
            searchPlaceholder="Search delivered orders..."
            emptyMessage="No delivered orders"
          />
        </TabsContent>
      </Tabs>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.orderNumber} - {selectedOrder?.customerName}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Status and dates */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(() => {
                    const config = statusConfig[selectedOrder.status];
                    const Icon = config.icon;
                    return (
                      <Badge variant="secondary" className={config.className}>
                        <Icon className="mr-1 h-3 w-3" />
                        {config.label}
                      </Badge>
                    );
                  })()}
                </div>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value: Order['status']) =>
                    handleStatusChange(selectedOrder.id, value)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="packed">Packed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                  <div className="rounded-xl bg-secondary/30 p-4">
                    <p className="font-medium">{selectedOrder.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customerPhone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Shipping Address</h4>
                  <div className="rounded-xl bg-secondary/30 p-4">
                    <p className="text-sm">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>
              </div>

              {/* Order items */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Order Items</h4>
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-secondary/30">
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                          Product
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">
                          Price
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">{item.productName}</td>
                          <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right">${item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium">
                            ${(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-secondary/30">
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-right">
                          Total
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-right text-success">
                          ${selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <p>
                  Created: {format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy')}
                </p>
                <p>
                  Updated: {format(new Date(selectedOrder.updatedAt), 'MMM dd, yyyy')}
                </p>
                <p>Counter: {selectedOrder.counterName}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedOrder && generateInvoice(selectedOrder)}>
              <FileText className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
