'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { toast } from 'sonner';
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Building2,
  Star,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Download,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import type { Supplier } from '@/lib/mock-data';

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    categories: [] as string[],
  });

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    suppliers.forEach((s) => s.categories.forEach((c) => cats.add(c)));
    return Array.from(cats);
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || supplier.categories.includes(categoryFilter);
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [suppliers, searchQuery, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    const total = suppliers.length;
    const active = suppliers.filter((s) => s.status === 'active').length;
    const totalPurchases = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0);
    const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length || 0;
    return { total, active, totalPurchases, avgRating };
  }, [suppliers]);

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.email) {
      toast.error('Please fill in required fields');
      return;
    }
    addSupplier({
      ...newSupplier,
      rating: 0,
      totalPurchases: 0,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    });
    toast.success('Supplier added successfully');
    setNewSupplier({ name: '', email: '', phone: '', company: '', address: '', categories: [] });
    setIsAddDialogOpen(false);
  };

  const handleDeleteSupplier = (id: string) => {
    deleteSupplier(id);
    toast.success('Supplier deleted successfully');
  };

  const handleStatusChange = (supplier: Supplier, newStatus: Supplier['status']) => {
    updateSupplier(supplier.id, { status: newStatus });
    toast.success(`Supplier status updated to ${newStatus}`);
  };

  const getStatusIcon = (status: Supplier['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-chart-2" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-chart-4" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: Supplier['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'inactive':
        return 'outline';
    }
  };

  const exportSuppliers = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Company', 'Categories', 'Rating', 'Total Purchases', 'Status'],
      ...filteredSuppliers.map((s) => [
        s.name,
        s.email,
        s.phone,
        s.company,
        s.categories.join('; '),
        s.rating,
        s.totalPurchases,
        s.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suppliers.csv';
    a.click();
    toast.success('Suppliers exported successfully');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-chart-4 text-chart-4' : 'text-muted-foreground/30'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
            <p className="text-muted-foreground">Manage your supplier network</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportSuppliers}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>
                    Enter supplier details to add them to your network.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                      placeholder="Supplier Co."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newSupplier.email}
                      onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                      placeholder="contact@supplier.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newSupplier.phone}
                      onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                      placeholder="+1 555-0123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Contact Person</Label>
                    <Input
                      id="company"
                      value={newSupplier.company}
                      onChange={(e) => setNewSupplier({ ...newSupplier, company: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                      placeholder="123 Industrial Way, City, State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Electronics', 'Furniture', 'Supplies'].map((cat) => (
                        <Badge
                          key={cat}
                          variant={newSupplier.categories.includes(cat) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            setNewSupplier((prev) => ({
                              ...prev,
                              categories: prev.categories.includes(cat)
                                ? prev.categories.filter((c) => c !== cat)
                                : [...prev.categories, cat],
                            }));
                          }}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSupplier}>Add Supplier</Button>
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
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Suppliers</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
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
                  <p className="text-sm text-muted-foreground">Active Suppliers</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
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
                  <p className="text-sm text-muted-foreground">Total Purchases</p>
                  <p className="text-2xl font-bold">${(stats.totalPurchases / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-4/20">
                  <Star className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
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
                  placeholder="Search suppliers..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Supplier List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="group transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {supplier.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{supplier.name}</CardTitle>
                      <div className="mt-1">{renderStars(supplier.rating)}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(supplier, 'active')}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(supplier, 'inactive')}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Mark Inactive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {supplier.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {supplier.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{supplier.address}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {supplier.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Purchases: </span>
                    <span className="font-medium">${supplier.totalPurchases.toLocaleString()}</span>
                  </div>
                  <Badge variant={getStatusColor(supplier.status)} className="capitalize gap-1">
                    {getStatusIcon(supplier.status)}
                    {supplier.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No suppliers found</p>
              <p className="text-sm text-muted-foreground/70">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}

        {/* View Supplier Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Supplier Details</DialogTitle>
            </DialogHeader>
            {selectedSupplier && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                      {selectedSupplier.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedSupplier.name}</h3>
                    <div className="mt-1">{renderStars(selectedSupplier.rating)}</div>
                    <Badge
                      variant={getStatusColor(selectedSupplier.status)}
                      className="mt-2 capitalize gap-1"
                    >
                      {getStatusIcon(selectedSupplier.status)}
                      {selectedSupplier.status}
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedSupplier.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {selectedSupplier.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {selectedSupplier.address}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.categories.map((cat) => (
                      <Badge key={cat} variant="secondary">
                        <Package className="mr-1 h-3 w-3" />
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">
                      ${selectedSupplier.totalPurchases.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Purchases</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{selectedSupplier.createdAt}</p>
                    <p className="text-sm text-muted-foreground">Partner Since</p>
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
