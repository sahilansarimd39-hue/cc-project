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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Edit, Trash2, Users, MapPin } from 'lucide-react';
import type { Counter } from '@/lib/mock-data';

export default function CountersPage() {
  const { counters, staff, addCounter, updateCounter, deleteCounter } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
  });

  const resetForm = () => {
    setFormData({ name: '', location: '', address: '', status: 'active' });
  };

  const handleAdd = () => {
    addCounter({
      ...formData,
      staff: [],
      dailyTransactions: 0,
      monthlyRevenue: 0,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedCounter) {
      updateCounter(selectedCounter.id, formData);
      setIsEditDialogOpen(false);
      setSelectedCounter(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedCounter) {
      deleteCounter(selectedCounter.id);
      setIsDeleteDialogOpen(false);
      setSelectedCounter(null);
    }
  };

  const openEditDialog = (counter: Counter) => {
    setSelectedCounter(counter);
    setFormData({
      name: counter.name,
      location: counter.location,
      address: counter.address,
      status: counter.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (counter: Counter) => {
    setSelectedCounter(counter);
    setIsDeleteDialogOpen(true);
  };

  const columns = [
    {
      key: 'name',
      header: 'Counter Name',
      sortable: true,
      cell: (counter: Counter) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">{counter.name}</p>
            <p className="text-xs text-muted-foreground">{counter.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
      cell: (counter: Counter) => (
        <div>
          <p className="text-foreground">{counter.location}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
            {counter.address}
          </p>
        </div>
      ),
    },
    {
      key: 'staff',
      header: 'Staff',
      cell: (counter: Counter) => {
        const counterStaff = staff.filter((s) => s.counterId === counter.id);
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{counterStaff.length} members</span>
          </div>
        );
      },
    },
    {
      key: 'dailyTransactions',
      header: 'Daily Transactions',
      sortable: true,
      cell: (counter: Counter) => (
        <span className="font-medium">{counter.dailyTransactions}</span>
      ),
    },
    {
      key: 'monthlyRevenue',
      header: 'Monthly Revenue',
      sortable: true,
      cell: (counter: Counter) => (
        <span className="font-medium text-success">
          ${counter.monthlyRevenue.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (counter: Counter) => (
        <Badge
          variant={counter.status === 'active' ? 'default' : 'secondary'}
          className={
            counter.status === 'active'
              ? 'bg-success/10 text-success hover:bg-success/20'
              : 'bg-muted text-muted-foreground'
          }
        >
          {counter.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (counter: Counter) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditDialog(counter)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDeleteDialog(counter)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AppLayout title="Counters" subtitle="Manage your counter locations and branches">
      <DataTable
        data={counters}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search counters..."
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Counter
          </Button>
        }
      />

      {/* Add Counter Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Counter</DialogTitle>
            <DialogDescription>
              Create a new counter location for your business.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Counter Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter counter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">City/Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter city or location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!formData.name || !formData.location}>
              Add Counter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Counter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Counter</DialogTitle>
            <DialogDescription>
              Update the counter information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Counter Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">City/Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Full Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Counter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedCounter?.name}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
