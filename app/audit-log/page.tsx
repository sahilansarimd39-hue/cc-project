'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Search,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Plus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Eye,
  Upload,
  Settings,
  ShoppingCart,
  Package,
  Truck,
  Store,
  Users,
  Building2,
  ChevronRight,
} from 'lucide-react';
import type { AuditLog } from '@/lib/mock-data';

const actionIcons: Record<string, React.ElementType> = {
  CREATE: Plus,
  UPDATE: Edit,
  DELETE: Trash2,
  LOGIN: LogIn,
  LOGOUT: LogOut,
  VIEW: Eye,
  EXPORT: Upload,
  IMPORT: Download,
};

const moduleIcons: Record<string, React.ElementType> = {
  orders: ShoppingCart,
  inventory: Package,
  shipments: Truck,
  counters: Store,
  users: Users,
  settings: Settings,
  customers: Building2,
  suppliers: Building2,
};

const actionColors: Record<string, string> = {
  CREATE: 'bg-chart-2/20 text-chart-2',
  UPDATE: 'bg-chart-3/20 text-chart-3',
  DELETE: 'bg-destructive/20 text-destructive',
  LOGIN: 'bg-primary/20 text-primary',
  LOGOUT: 'bg-muted text-muted-foreground',
  VIEW: 'bg-chart-4/20 text-chart-4',
  EXPORT: 'bg-chart-1/20 text-chart-1',
  IMPORT: 'bg-chart-5/20 text-chart-5',
};

export default function AuditLogPage() {
  const { auditLogs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;

      let matchesDate = true;
      if (dateFilter !== 'all') {
        const logDate = new Date(log.timestamp);
        const now = new Date();
        const diffMs = now.getTime() - logDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        switch (dateFilter) {
          case '1h':
            matchesDate = diffHours <= 1;
            break;
          case '24h':
            matchesDate = diffHours <= 24;
            break;
          case '7d':
            matchesDate = diffDays <= 7;
            break;
          case '30d':
            matchesDate = diffDays <= 30;
            break;
        }
      }

      return matchesSearch && matchesAction && matchesModule && matchesDate;
    });
  }, [auditLogs, searchQuery, actionFilter, moduleFilter, dateFilter]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = auditLogs.filter((l) => l.timestamp.startsWith(today));
    const actions = auditLogs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const uniqueUsers = new Set(auditLogs.map((l) => l.userId)).size;
    return { total: auditLogs.length, today: todayLogs.length, actions, uniqueUsers };
  }, [auditLogs]);

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Action', 'Module', 'Description', 'User', 'Role', 'IP Address'],
      ...filteredLogs.map((l) => [
        l.timestamp,
        l.action,
        l.module,
        l.description,
        l.userName,
        l.userRole,
        l.ipAddress,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Audit log exported successfully');
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const uniqueActions = [...new Set(auditLogs.map((l) => l.action))];
  const uniqueModules = [...new Set(auditLogs.map((l) => l.module))];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
            <p className="text-muted-foreground">Track all system activities and changes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success('Logs refreshed')}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Logs</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/20">
                  <Plus className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today&apos;s Activity</p>
                  <p className="text-2xl font-bold">{stats.today}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/20">
                  <Edit className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updates</p>
                  <p className="text-2xl font-bold">{stats.actions['UPDATE'] || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-4/20">
                  <Users className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
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
                  placeholder="Search logs..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {uniqueActions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {uniqueModules.map((module) => (
                      <SelectItem key={module} value={module} className="capitalize">
                        {module}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Activity Timeline
              <Badge variant="secondary" className="ml-2">
                {filteredLogs.length} entries
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {filteredLogs.map((log, index) => {
                const ActionIcon = actionIcons[log.action] || Edit;
                const ModuleIcon = moduleIcons[log.module] || FileText;

                return (
                  <div
                    key={log.id}
                    className="group relative flex items-start gap-4 py-3 px-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleViewDetails(log)}
                  >
                    {/* Timeline line */}
                    {index < filteredLogs.length - 1 && (
                      <div className="absolute left-[23px] top-14 w-0.5 h-[calc(100%-32px)] bg-border" />
                    )}

                    {/* Action Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        actionColors[log.action] || 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <ActionIcon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">{log.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">
                                {log.userName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{log.userName}</span>
                            <span className="text-muted-foreground/50">|</span>
                            <span className="capitalize">{log.userRole.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="capitalize gap-1">
                            <ModuleIcon className="h-3 w-3" />
                            {log.module}
                          </Badge>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredLogs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No logs found</p>
                <p className="text-sm text-muted-foreground/70">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Log Details</DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      actionColors[selectedLog.action] || 'bg-muted'
                    }`}
                  >
                    {(() => {
                      const Icon = actionIcons[selectedLog.action] || Edit;
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedLog.action}</p>
                    <Badge variant="outline" className="capitalize">
                      {selectedLog.module}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{selectedLog.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">User</p>
                      <p className="font-medium">{selectedLog.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">
                        {selectedLog.userRole.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">IP Address</p>
                      <p className="font-medium font-mono text-sm">{selectedLog.ipAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timestamp</p>
                      <p className="font-medium text-sm">
                        {format(new Date(selectedLog.timestamp), 'PPpp')}
                      </p>
                    </div>
                  </div>

                  {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Additional Details</p>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <pre className="text-xs font-mono overflow-auto">
                          {JSON.stringify(selectedLog.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
