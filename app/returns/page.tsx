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
  DialogHeader,
  DialogTitle,
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
  Download,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  RotateCcw,
  DollarSign,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import type { Return } from '@/lib/mock-data';

const statusConfig: Record<
  Return['status'],
  { label: string; color: string; icon: React.ElementType }
> = {
  requested: { label: 'Requested', color: 'bg-chart-4/20 text-chart-4', icon: Clock },
  approved: { label: 'Approved', color: 'bg-primary/20 text-primary', icon: CheckCircle2 },
  received: { label: 'Received', color: 'bg-chart-3/20 text-chart-3', icon: Package },
  refunded: { label: 'Refunded', color: 'bg-chart-2/20 text-chart-2', icon: DollarSign },
  rejected: { label: 'Rejected', color: 'bg-destructive/20 text-destructive', icon: XCircle },
};

export default function ReturnsPage() {
  const { returns, updateReturnStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);

  const filteredReturns = useMemo(() => {
    return returns.filter((ret) => {
      const matchesSearch =
        ret.returnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ret.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ret.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ret.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [returns, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = returns.length;
    const pending = returns.filter((r) => r.status === 'requested' || r.status === 'approved').length;
    const totalRefunds = returns
      .filter((r) => r.status === 'refunded')
      .reduce((sum, r) => sum + r.totalRefund, 0);
    const refunded = returns.filter((r) => r.status === 'refunded').length;
    return { total, pending, totalRefunds, refunded };
  }, [returns]);

  const handleStatusChange = (ret: Return, status: Return['status']) => {
    updateReturnStatus(ret.id, status);
    toast.success(`Return ${status}`);
  };

  const exportReturns = () => {
    const csv = [
      ['Return #', 'Order #', 'Customer', 'Items', 'Refund Amount', 'Status', 'Created'],
      ...filteredReturns.map((r) => [
        r.returnNumber,
        r.orderNumber,
        r.customerName,
        r.items.length,
        r.totalRefund,
        r.status,
        r.createdAt,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'returns.csv';
    a.click();
    toast.success('Returns exported');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Returns & Refunds</h1>
            <p className="text-muted-foreground">Manage product returns and refund requests</p>
          </div>
          <Button variant="outline" onClick={exportReturns}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Returns</p>
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
                  <p className="text-sm text-muted-foreground">Refunded</p>
                  <p className="text-2xl font-bold">{stats.refunded}</p>
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
                  <p className="text-sm text-muted-foreground">Total Refunds</p>
                  <p className="text-2xl font-bold">${stats.totalRefunds.toLocaleString()}</p>
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
                  placeholder="Search return or order number..."
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

        {/* Returns Table */}
        <Card>
          <CardHeader>
            <CardTitle>Return Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return #</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((ret) => {
                  const statusInfo = statusConfig[ret.status];
                  const StatusIcon = statusInfo.icon;
                  return (
                    <TableRow key={ret.id}>
                      <TableCell className="font-medium">{ret.returnNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {ret.orderNumber}
                        </div>
                      </TableCell>
                      <TableCell>{ret.customerName}</TableCell>
                      <TableCell>
                        {ret.items.length} item{ret.items.length > 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${ret.totalRefund.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusInfo.color} gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{ret.createdAt}</TableCell>
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
                                setSelectedReturn(ret);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {ret.status === 'requested' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(ret, 'approved')}
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleStatusChange(ret, 'rejected')}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {ret.status === 'approved' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(ret, 'received')}
                              >
                                <Package className="mr-2 h-4 w-4" />
                                Mark Received
                              </DropdownMenuItem>
                            )}
                            {ret.status === 'received' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(ret, 'refunded')}
                              >
                                <DollarSign className="mr-2 h-4 w-4" />
                                Process Refund
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

            {filteredReturns.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <RotateCcw className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No returns found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Return Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Return Details</DialogTitle>
            </DialogHeader>
            {selectedReturn && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{selectedReturn.returnNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Order: {selectedReturn.orderNumber}
                    </p>
                  </div>
                  <Badge className={`${statusConfig[selectedReturn.status].color} gap-1`}>
                    {(() => {
                      const Icon = statusConfig[selectedReturn.status].icon;
                      return <Icon className="h-3 w-3" />;
                    })()}
                    {statusConfig[selectedReturn.status].label}
                  </Badge>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedReturn.customerName}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Items to Return</p>
                  {selectedReturn.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-chart-4 mt-0.5" />
                        <div className="text-right">
                          <p className="text-sm font-medium">Reason</p>
                          <p className="text-sm text-muted-foreground">{item.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-medium">Refund Amount</span>
                  <span className="text-xl font-bold text-chart-2">
                    ${selectedReturn.totalRefund.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created: </span>
                    <span className="font-medium">{selectedReturn.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Updated: </span>
                    <span className="font-medium">{selectedReturn.updatedAt}</span>
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
