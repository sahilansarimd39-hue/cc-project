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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Download,
  Users,
  UserCheck,
  UserX,
  Shield,
  Truck,
  Store,
  Crown,
} from 'lucide-react';
import type { Staff } from '@/lib/mock-data';

const roleConfig: Record<
  Staff['role'],
  { label: string; icon: React.ElementType; color: string }
> = {
  admin: { label: 'Administrator', icon: Crown, color: 'bg-chart-5/20 text-chart-5' },
  manager: { label: 'Manager', icon: Shield, color: 'bg-primary/20 text-primary' },
  counter_staff: { label: 'Counter Staff', icon: Store, color: 'bg-chart-2/20 text-chart-2' },
  driver: { label: 'Driver', icon: Truck, color: 'bg-chart-4/20 text-chart-4' },
};

export default function StaffPage() {
  const { staff, counters, addStaff, updateStaff, deleteStaff } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [counterFilter, setCounterFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'counter_staff' as Staff['role'],
    counterId: '',
  });

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      const matchesCounter = counterFilter === 'all' || member.counterId === counterFilter;
      return matchesSearch && matchesRole && matchesStatus && matchesCounter;
    });
  }, [staff, searchQuery, roleFilter, statusFilter, counterFilter]);

  const stats = useMemo(() => {
    const total = staff.length;
    const active = staff.filter((s) => s.status === 'active').length;
    const byRole = staff.reduce((acc, s) => {
      acc[s.role] = (acc[s.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { total, active, byRole };
  }, [staff]);

  const getCounterName = (counterId?: string) => {
    if (!counterId) return 'Unassigned';
    const counter = counters.find((c) => c.id === counterId);
    return counter?.name || 'Unknown';
  };

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email) {
      toast.error('Please fill in required fields');
      return;
    }
    addStaff({
      ...newStaff,
      avatar: newStaff.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
      status: 'active',
    });
    toast.success('Staff member added successfully');
    setNewStaff({ name: '', email: '', phone: '', role: 'counter_staff', counterId: '' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteStaff = (id: string) => {
    deleteStaff(id);
    toast.success('Staff member removed');
  };

  const handleToggleStatus = (member: Staff) => {
    updateStaff(member.id, {
      status: member.status === 'active' ? 'offline' : 'active',
    });
    toast.success(`Staff member ${member.status === 'active' ? 'deactivated' : 'activated'}`);
  };

  const handleUpdateStaff = () => {
    if (!selectedStaff) return;
    updateStaff(selectedStaff.id, selectedStaff);
    toast.success('Staff member updated');
    setIsEditDialogOpen(false);
  };

  const exportStaff = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Role', 'Counter', 'Status'],
      ...filteredStaff.map((s) => [
        s.name,
        s.email,
        s.phone,
        s.role,
        getCounterName(s.counterId),
        s.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff.csv';
    a.click();
    toast.success('Staff list exported');
  };

  const StaffCard = ({ member }: { member: Staff }) => {
    const roleInfo = roleConfig[member.role];
    const RoleIcon = roleInfo.icon;

    return (
      <Card className="group transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${
                  member.status === 'active' ? 'bg-chart-2' : 'bg-muted-foreground'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={`${roleInfo.color} gap-1`}>
                      <RoleIcon className="h-3 w-3" />
                      {roleInfo.label}
                    </Badge>
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
                        setSelectedStaff(member);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedStaff({ ...member });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(member)}>
                      {member.status === 'active' ? (
                        <>
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteStaff(member.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {member.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {getCounterName(member.counterId)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground">Manage your team members and roles</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportStaff}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Enter staff details to add them to your team.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                      placeholder="+1 555-0123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={newStaff.role}
                      onValueChange={(v) => setNewStaff({ ...newStaff, role: v as Staff['role'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleConfig).map(([role, config]) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              <config.icon className="h-4 w-4" />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Assign to Counter</Label>
                    <Select
                      value={newStaff.counterId}
                      onValueChange={(v) => setNewStaff({ ...newStaff, counterId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select counter" />
                      </SelectTrigger>
                      <SelectContent>
                        {counters.map((counter) => (
                          <SelectItem key={counter.id} value={counter.id}>
                            {counter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStaff}>Add Staff</Button>
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
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/20">
                  <UserCheck className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-4/20">
                  <Truck className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Drivers</p>
                  <p className="text-2xl font-bold">{stats.byRole['driver'] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-5/20">
                  <Shield className="h-5 w-5 text-chart-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Managers</p>
                  <p className="text-2xl font-bold">{stats.byRole['manager'] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {Object.entries(roleConfig).map(([role, config]) => (
                      <SelectItem key={role} value={role}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={counterFilter} onValueChange={setCounterFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Counter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counters</SelectItem>
                    {counters.map((counter) => (
                      <SelectItem key={counter.id} value={counter.id}>
                        {counter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Grid */}
        <Tabs defaultValue="grid" className="w-full">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStaff.map((member) => (
                <StaffCard key={member.id} member={member} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredStaff.map((member) => {
                    const roleInfo = roleConfig[member.role];
                    const RoleIcon = roleInfo.icon;
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                                member.status === 'active' ? 'bg-chart-2' : 'bg-muted-foreground'
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className={`${roleInfo.color} gap-1`}>
                            <RoleIcon className="h-3 w-3" />
                            {roleInfo.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground hidden sm:inline">
                            {getCounterName(member.counterId)}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStaff(member);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStaff({ ...member });
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteStaff(member.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {filteredStaff.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No staff found</p>
              <p className="text-sm text-muted-foreground/70">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}

        {/* View Staff Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Staff Details</DialogTitle>
            </DialogHeader>
            {selectedStaff && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                      {selectedStaff.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedStaff.name}</h3>
                    <Badge
                      variant="secondary"
                      className={`${roleConfig[selectedStaff.role].color} gap-1 mt-1`}
                    >
                      {(() => {
                        const Icon = roleConfig[selectedStaff.role].icon;
                        return <Icon className="h-3 w-3" />;
                      })()}
                      {roleConfig[selectedStaff.role].label}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedStaff.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {selectedStaff.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {getCounterName(selectedStaff.counterId)}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={selectedStaff.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {selectedStaff.status}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Staff Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>Update staff information.</DialogDescription>
            </DialogHeader>
            {selectedStaff && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedStaff.name}
                    onChange={(e) =>
                      setSelectedStaff({ ...selectedStaff, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedStaff.email}
                    onChange={(e) =>
                      setSelectedStaff({ ...selectedStaff, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={selectedStaff.phone}
                    onChange={(e) =>
                      setSelectedStaff({ ...selectedStaff, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={selectedStaff.role}
                    onValueChange={(v) =>
                      setSelectedStaff({ ...selectedStaff, role: v as Staff['role'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([role, config]) => (
                        <SelectItem key={role} value={role}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Counter</Label>
                  <Select
                    value={selectedStaff.counterId || ''}
                    onValueChange={(v) => setSelectedStaff({ ...selectedStaff, counterId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select counter" />
                    </SelectTrigger>
                    <SelectContent>
                      {counters.map((counter) => (
                        <SelectItem key={counter.id} value={counter.id}>
                          {counter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStaff}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
