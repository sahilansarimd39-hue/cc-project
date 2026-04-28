'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/ui/data-table';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Truck,
  CheckCircle,
  Clock,
  Package,
  MapPin,
  Navigation,
  Calendar,
  User,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Shipment } from '@/lib/mock-data';

const statusConfig = {
  preparing: { label: 'Preparing', icon: Package, className: 'bg-warning/10 text-warning', color: 'text-warning' },
  in_transit: { label: 'In Transit', icon: Truck, className: 'bg-chart-1/10 text-chart-1', color: 'text-chart-1' },
  out_for_delivery: { label: 'Out for Delivery', icon: Navigation, className: 'bg-chart-2/10 text-chart-2', color: 'text-chart-2' },
  delivered: { label: 'Delivered', icon: CheckCircle, className: 'bg-success/10 text-success', color: 'text-success' },
  returned: { label: 'Returned', icon: RotateCcw, className: 'bg-destructive/10 text-destructive', color: 'text-destructive' },
};

export default function ShipmentsPage() {
  const { shipments, updateShipmentStatus } = useStore();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  const openViewDialog = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsViewDialogOpen(true);
  };

  const openMapDialog = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsMapDialogOpen(true);
  };

  const handleStatusChange = (shipmentId: string, status: Shipment['status']) => {
    updateShipmentStatus(shipmentId, status);
  };

  const inTransitShipments = shipments.filter((s) => s.status === 'in_transit' || s.status === 'out_for_delivery');
  const deliveredShipments = shipments.filter((s) => s.status === 'delivered');
  const preparingShipments = shipments.filter((s) => s.status === 'preparing');

  const columns = [
    {
      key: 'trackingNumber',
      header: 'Tracking',
      sortable: true,
      cell: (shipment: Shipment) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground font-mono">{shipment.trackingNumber}</p>
            <p className="text-xs text-muted-foreground">Order: {shipment.orderNumber}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'origin',
      header: 'Route',
      cell: (shipment: Shipment) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col text-sm">
            <span className="text-muted-foreground">{shipment.origin.split(',')[0]}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex flex-col text-sm">
            <span className="text-foreground font-medium">{shipment.destination.split(',')[0]}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'driverName',
      header: 'Driver',
      sortable: true,
      cell: (shipment: Shipment) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-medium">
            {shipment.driverName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-medium">{shipment.driverName}</p>
            <p className="text-xs text-muted-foreground">{shipment.vehicleNumber}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'estimatedDelivery',
      header: 'ETA',
      sortable: true,
      cell: (shipment: Shipment) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy')}
          </span>
        </div>
      ),
    },
    {
      key: 'currentLocation',
      header: 'Location',
      cell: (shipment: Shipment) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate max-w-[150px]">
            {shipment.currentLocation.address}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (shipment: Shipment) => {
        const config = statusConfig[shipment.status];
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
      cell: (shipment: Shipment) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openViewDialog(shipment)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openMapDialog(shipment)}>
              <MapPin className="mr-2 h-4 w-4" />
              Track on Map
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleStatusChange(shipment.id, 'in_transit')}
              disabled={shipment.status !== 'preparing'}
            >
              <Truck className="mr-2 h-4 w-4" />
              Start Transit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(shipment.id, 'out_for_delivery')}
              disabled={shipment.status !== 'in_transit'}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Out for Delivery
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(shipment.id, 'delivered')}
              disabled={shipment.status !== 'out_for_delivery'}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Delivered
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AppLayout title="Shipments" subtitle="Track and manage your logistics operations">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Total Shipments</CardDescription>
            <CardTitle className="text-3xl">{shipments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>In Transit</CardDescription>
            <CardTitle className="text-3xl text-chart-1">{inTransitShipments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Preparing</CardDescription>
            <CardTitle className="text-3xl text-warning">{preparingShipments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Delivered</CardDescription>
            <CardTitle className="text-3xl text-success">{deliveredShipments.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Shipments</TabsTrigger>
          <TabsTrigger value="transit">In Transit</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            data={shipments}
            columns={columns}
            searchKey="trackingNumber"
            searchPlaceholder="Search by tracking number..."
          />
        </TabsContent>

        <TabsContent value="transit">
          <DataTable
            data={inTransitShipments}
            columns={columns}
            searchKey="trackingNumber"
            searchPlaceholder="Search in transit..."
            emptyMessage="No shipments in transit"
          />
        </TabsContent>

        <TabsContent value="preparing">
          <DataTable
            data={preparingShipments}
            columns={columns}
            searchKey="trackingNumber"
            searchPlaceholder="Search preparing shipments..."
            emptyMessage="No shipments being prepared"
          />
        </TabsContent>

        <TabsContent value="delivered">
          <DataTable
            data={deliveredShipments}
            columns={columns}
            searchKey="trackingNumber"
            searchPlaceholder="Search delivered shipments..."
            emptyMessage="No delivered shipments"
          />
        </TabsContent>
      </Tabs>

      {/* View Shipment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shipment Details</DialogTitle>
            <DialogDescription>
              Tracking: {selectedShipment?.trackingNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-6 py-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                {(() => {
                  const config = statusConfig[selectedShipment.status];
                  const Icon = config.icon;
                  return (
                    <Badge variant="secondary" className={`${config.className} text-base px-4 py-1`}>
                      <Icon className="mr-2 h-4 w-4" />
                      {config.label}
                    </Badge>
                  );
                })()}
                <Select
                  value={selectedShipment.status}
                  onValueChange={(value: Shipment['status']) =>
                    handleStatusChange(selectedShipment.id, value)
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Route */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Origin
                  </h4>
                  <div className="rounded-xl bg-secondary/30 p-4">
                    <p className="font-medium">{selectedShipment.origin}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Navigation className="h-4 w-4" /> Destination
                  </h4>
                  <div className="rounded-xl bg-secondary/30 p-4">
                    <p className="font-medium">{selectedShipment.destination}</p>
                  </div>
                </div>
              </div>

              {/* Driver & Vehicle */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Driver
                  </h4>
                  <div className="rounded-xl bg-secondary/30 p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                      {selectedShipment.driverName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{selectedShipment.driverName}</p>
                      <p className="text-sm text-muted-foreground">ID: {selectedShipment.driverId}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Vehicle
                  </h4>
                  <div className="rounded-xl bg-secondary/30 p-4">
                    <p className="font-medium font-mono">{selectedShipment.vehicleNumber}</p>
                    <p className="text-sm text-muted-foreground">Delivery Truck</p>
                  </div>
                </div>
              </div>

              {/* Current Location */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Current Location</h4>
                <div className="rounded-xl bg-secondary/30 p-4">
                  <p className="font-medium">{selectedShipment.currentLocation.address}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Coordinates: {selectedShipment.currentLocation.lat.toFixed(4)}, {selectedShipment.currentLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <p>Created: {format(new Date(selectedShipment.createdAt), 'MMM dd, yyyy')}</p>
                <p>ETA: {format(new Date(selectedShipment.estimatedDelivery), 'MMM dd, yyyy')}</p>
                {selectedShipment.actualDelivery && (
                  <p>Delivered: {format(new Date(selectedShipment.actualDelivery), 'MMM dd, yyyy')}</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedShipment && openMapDialog(selectedShipment)}>
              <MapPin className="mr-2 h-4 w-4" />
              Track on Map
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Map Dialog */}
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Shipment Tracking</DialogTitle>
            <DialogDescription>
              {selectedShipment?.trackingNumber} - Live location tracking
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-4 py-4">
              {/* Mock Map UI */}
              <div className="relative rounded-xl bg-gradient-to-br from-chart-2/10 via-chart-1/5 to-chart-3/10 h-80 overflow-hidden border border-border/50">
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(10)].map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full h-px bg-border" style={{ top: `${i * 10}%` }} />
                  ))}
                  {[...Array(10)].map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full w-px bg-border" style={{ left: `${i * 10}%` }} />
                  ))}
                </div>
                
                {/* Route visualization */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="oklch(0.65 0.15 200)" />
                      <stop offset="100%" stopColor="oklch(0.55 0.18 260)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 15 70 Q 35 50 55 45 Q 75 40 85 30"
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="0.5"
                    strokeDasharray="2 1"
                  />
                </svg>

                {/* Origin marker */}
                <div className="absolute left-[12%] top-[65%] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="h-4 w-4 rounded-full bg-chart-2 shadow-lg" />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card px-2 py-1 rounded text-xs font-medium shadow">
                      Origin
                    </div>
                  </div>
                </div>

                {/* Current location marker */}
                <div className="absolute left-[55%] top-[42%] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="h-5 w-5 rounded-full bg-primary shadow-lg animate-pulse" />
                    <div className="absolute h-8 w-8 -top-1.5 -left-1.5 rounded-full border-2 border-primary/30 animate-ping" />
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium shadow">
                      Current: {selectedShipment.currentLocation.address}
                    </div>
                  </div>
                </div>

                {/* Destination marker */}
                <div className="absolute left-[85%] top-[28%] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="h-4 w-4 rounded-full bg-success shadow-lg" />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card px-2 py-1 rounded text-xs font-medium shadow">
                      Destination
                    </div>
                  </div>
                </div>

                {/* Truck icon on route */}
                <div className="absolute left-[52%] top-[44%] -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-card p-2 rounded-lg shadow-lg">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Route info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-chart-2/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-medium mt-1">{selectedShipment.origin.split(',')[0]}</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className="font-medium mt-1">{selectedShipment.currentLocation.address}</p>
                </div>
                <div className="rounded-xl bg-success/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium mt-1">{selectedShipment.destination.split(',')[0]}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMapDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
