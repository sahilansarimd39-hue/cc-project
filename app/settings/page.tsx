'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataTable } from '@/components/ui/data-table';
import {
  User,
  Shield,
  Bell,
  Palette,
  Users,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Key,
  Mail,
  Phone,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Staff } from '@/lib/mock-data';

const roleColors = {
  admin: 'bg-destructive/10 text-destructive',
  manager: 'bg-chart-1/10 text-chart-1',
  counter_staff: 'bg-chart-2/10 text-chart-2',
  driver: 'bg-chart-3/10 text-chart-3',
};

const roleLabels = {
  admin: 'Administrator',
  manager: 'Manager',
  counter_staff: 'Counter Staff',
  driver: 'Driver',
};

export default function SettingsPage() {
  const { user, staff, counters, addStaff, updateStaff, deleteStaff, darkMode, toggleDarkMode } = useStore();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'counter_staff' as Staff['role'],
    counterId: '',
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    shipmentUpdates: true,
    lowStock: true,
    systemAlerts: false,
    emailNotifications: true,
    pushNotifications: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'counter_staff',
      counterId: '',
    });
  };

  const handleAddUser = () => {
    addStaff({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      counterId: formData.counterId || undefined,
      avatar: formData.name.split(' ').map((n) => n[0]).join('').toUpperCase(),
      status: 'active',
    });
    setIsAddUserOpen(false);
    resetForm();
  };

  const handleEditUser = () => {
    if (selectedStaff) {
      updateStaff(selectedStaff.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        counterId: formData.counterId || undefined,
        avatar: formData.name.split(' ').map((n) => n[0]).join('').toUpperCase(),
      });
      setIsEditUserOpen(false);
      setSelectedStaff(null);
      resetForm();
    }
  };

  const handleDeleteUser = () => {
    if (selectedStaff) {
      deleteStaff(selectedStaff.id);
      setIsDeleteUserOpen(false);
      setSelectedStaff(null);
    }
  };

  const openEditUser = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      role: staffMember.role,
      counterId: staffMember.counterId || '',
    });
    setIsEditUserOpen(true);
  };

  const openDeleteUser = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsDeleteUserOpen(true);
  };

  const userColumns = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      cell: (staffMember: Staff) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {staffMember.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{staffMember.name}</p>
            <p className="text-xs text-muted-foreground">{staffMember.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      cell: (staffMember: Staff) => (
        <Badge variant="secondary" className={roleColors[staffMember.role]}>
          {roleLabels[staffMember.role]}
        </Badge>
      ),
    },
    {
      key: 'counterId',
      header: 'Counter',
      cell: (staffMember: Staff) => {
        const counter = counters.find((c) => c.id === staffMember.counterId);
        return counter ? (
          <span className="text-sm">{counter.name}</span>
        ) : (
          <span className="text-sm text-muted-foreground">Not assigned</span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      cell: (staffMember: Staff) => (
        <Badge
          variant="secondary"
          className={
            staffMember.status === 'active'
              ? 'bg-success/10 text-success'
              : 'bg-muted text-muted-foreground'
          }
        >
          {staffMember.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (staffMember: Staff) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditUser(staffMember)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDeleteUser(staffMember)}
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
    <AppLayout title="Settings" subtitle="Manage your account and application preferences">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                    {user?.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className={`mt-2 ${roleColors[user?.role || 'counter_staff']}`}>
                    {roleLabels[user?.role || 'counter_staff']}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input id="profile-name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email Address</Label>
                  <Input id="profile-email" type="email" defaultValue={user?.email} />
                </div>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and their roles. Current role: {roleLabels[user?.role || 'counter_staff']}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.role === 'admin' || user?.role === 'manager' ? (
                <DataTable
                  data={staff}
                  columns={userColumns}
                  searchKey="name"
                  searchPlaceholder="Search users..."
                  actions={
                    <Button onClick={() => setIsAddUserOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  }
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You don&apos;t have permission to manage users.</p>
                  <p className="text-sm">Contact an administrator for access.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Activity Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-muted-foreground">Receive notifications for new orders and status changes</p>
                    </div>
                    <Switch
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Shipment Updates</p>
                      <p className="text-sm text-muted-foreground">Get notified when shipments are updated or delivered</p>
                    </div>
                    <Switch
                      checked={notifications.shipmentUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, shipmentUpdates: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Low Stock Alerts</p>
                      <p className="text-sm text-muted-foreground">Be alerted when inventory levels are low</p>
                    </div>
                    <Switch
                      checked={notifications.lowStock}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Alerts</p>
                      <p className="text-sm text-muted-foreground">Important system notifications and maintenance updates</p>
                    </div>
                    <Switch
                      checked={notifications.systemAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <h4 className="text-sm font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                    />
                  </div>
                </div>
              </div>

              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Change Password
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div />
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button>Update Password</Button>
              </div>

              <div className="pt-6 border-t border-border/50">
                <h4 className="text-sm font-medium mb-4">Sessions</h4>
                <div className="rounded-xl bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Logged in since {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account with role-based access.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Full Name</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone</Label>
                <Input
                  id="add-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-0100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: Staff['role']) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="counter_staff">Counter Staff</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-counter">Assign to Counter</Label>
                <Select
                  value={formData.counterId}
                  onValueChange={(value) => setFormData({ ...formData, counterId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select counter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {counters.map((counter) => (
                      <SelectItem key={counter.id} value={counter.id}>
                        {counter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser} disabled={!formData.name || !formData.email}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: Staff['role']) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="counter_staff">Counter Staff</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-counter">Assign to Counter</Label>
                <Select
                  value={formData.counterId}
                  onValueChange={(value) => setFormData({ ...formData, counterId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select counter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {counters.map((counter) => (
                      <SelectItem key={counter.id} value={counter.id}>
                        {counter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedStaff?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
