'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  FileText,
  ClipboardList,
  DollarSign,
  Building2,
  Calendar,
} from 'lucide-react';
import type { PurchaseOrder } from '@/lib/mock-data';

const statusConfig: Record<
  PurchaseOrder['status'],
  { label: string; color: string; icon: React.ElementType }
> = {
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground', icon: FileText },
  pending: { label: 'Pending', color: 'bg-chart-4/20 text-chart-4', icon: Clock },
  approved: { label: 'Approved', color: 'bg-primary/20 text-primary', icon: CheckCircle2 },
  received: { label: 'Received', color: 'bg-chart-2/20 text-chart-2', icon: Package },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/20 text-destructive', icon: XCircle },
};

export default function PurchaseOrdersPage() {
  const { purchaseOrders, suppliers, products, addPurchaseOrder, updatePurchaseOrderStatus } =
    useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [newPO, setNewPO] = useState({
    supplierId: '',
    items: [{ productId: '', quantity: 1 }],
    expectedDelivery: '',
  });

  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const matchesSearch =
        po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [purchaseOrders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = purchaseOrders.length;
    const pending = purchaseOrders.filter((p) => p.status === 'pending').length;
    const totalValue = purchaseOrders.reduce((sum, p) => sum + p.total, 0);
    const approved = purchaseOrders.filter((p) => p.status === 'approved').length;
    return { total, pending, totalValue, approved };
  }, [purchaseOrders]);

  const handleAddPO = () => {
    if (!newPO.supplierId || !newPO.items[0].productId) {
      toast.error('Please fill in required fields');
      return;
    }
    const supplier = suppliers.find((s) => s.id === newPO.supplierId);
    const items = newPO.items
      .filter((i) => i.productId)
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          productName: product?.name || '',
          quantity: item.quantity,
          unitPrice: product?.price || 0,
        };
      });
    const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

    addPurchaseOrder({
      poNumber: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplierId: newPO.supplierId,
      supplierName: supplier?.name || '',
      items,
      total,
      status: 'draft',
      expectedDelivery: newPO.expectedDelivery,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    toast.success('Purchase order created');
    setNewPO({ supplierId: '', items: [{ productId: '', quantity: 1 }], expectedDelivery: '' });
    setIsAddDialogOpen(false);
  };

  const handleStatusChange = (po: PurchaseOrder, status: PurchaseOrder['status']) => {
    updatePurchaseOrderStatus(po.id, status);
    toast.success(`Purchase order ${status}`);
  };

  const exportPOs = () => {
    const csv = [
      ['PO Number', 'Supplier', 'Total', 'Status', 'Expected Delivery', 'Created'],
      ...filteredPOs.map((po) => [
        po.poNumber,
        po.supplierName,
        po.total,
        po.status,
        po.expectedDelivery,
        po.createdAt,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase-orders.csv';
    a.click();
    toast.success('Purchase orders exported');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
            <p className="text-muted-foreground">Manage supplier purchase orders</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportPOs}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New PO
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Purchase Order</DialogTitle>
                  <DialogDescription>
                    Create a new purchase order for your suppliers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Supplier *</Label>
                    <Select
                      value={newPO.supplierId}
                      onValueChange={(v) => setNewPO({ ...newPO, supplierId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers
                          .filter((s) => s.status === 'active')
                          .map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Product *</Label>
                    <Select
                      value={newPO.items[0].productId}
                      onValueChange={(v) =>
                        setNewPO({ ...newPO, items: [{ ...newPO.items[0], productId: v }] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - ${product.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newPO.items[0].quantity}
                      onChange={(e) =>
                        setNewPO({
                          ...newPO,
                          items: [{ ...newPO.items[0], quantity: parseInt(e.target.value) || 1 }],
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery">Expected Delivery</Label>
                    <Input
                      id="delivery"
                      type="date"
                      value={newPO.expectedDelivery}
                      onChange={(e) => setNewPO({ ...newPO, expectedDelivery: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPO}>Create PO</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total POs</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-4/20">
                  <Clock className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/20">
                  <CheckCircle2 className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/20">
                  <DollarSign className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">${(stats.totalValue / 1000).toFixed(1)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search PO number or supplier..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* PO Table */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.map((po) => {
                  const statusInfo = statusConfig[po.status];
                  const StatusIcon = statusInfo.icon;
                  return (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.poNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {po.supplierName}
                        </div>
                      </TableCell>
                      <TableCell>{po.items.length} items</TableCell>
                      <TableCell className="font-medium">${po.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {po.expectedDelivery}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusInfo.color} gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPO(po);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {po.status === 'draft' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(po, 'pending')}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                Submit for Approval
                              </DropdownMenuItem>
                            )}
                            {po.status === 'pending' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(po, 'approved')}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {po.status === 'approved' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(po, 'received')}
                              >
                                <Package className="mr-2 h-4 w-4" />
                                Mark Received
                              </DropdownMenuItem>
                            )}
                            {(po.status === 'draft' || po.status === 'pending') && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleStatusChange(po, 'cancelled')}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredPOs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No purchase orders found
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View PO Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Purchase Order Details</DialogTitle>
            </DialogHeader>
            {selectedPO && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{selectedPO.poNumber}</p>
                    <p className="text-sm text-muted-foreground">{selectedPO.supplierName}</p>
                  </div>
                  <Badge className={`${statusConfig[selectedPO.status].color} gap-1`}>
                    {(() => {
                      const Icon = statusConfig[selectedPO.status].icon;
                      return <Icon className="h-3 w-3" />;
                    })()}
                    {statusConfig[selectedPO.status].label}
                  </Badge>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPO.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.unitPrice}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${(item.quantity * item.unitPrice).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-xl font-bold">${selectedPO.total.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created: </span>
                    <span className="font-medium">{selectedPO.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected: </span>
                    <span className="font-medium">{selectedPO.expectedDelivery}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
