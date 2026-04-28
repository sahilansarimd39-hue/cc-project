'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Search,
  Moon,
  Sun,
  Check,
  Package,
  AlertTriangle,
  Info,
  XCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const notificationIcons = {
  info: Info,
  success: Check,
  warning: AlertTriangle,
  error: XCircle,
};

const notificationColors = {
  info: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
};

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    sidebarOpen,
    darkMode,
    toggleDarkMode,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6 transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-20'
      )}
    >
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9 bg-secondary/50 border-transparent focus:border-primary/30 focus:bg-background"
          />
        </div>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground animate-pulse-soft"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                  onClick={markAllNotificationsRead}
                >
                  Mark all read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mb-2" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        'flex items-start gap-3 p-3 cursor-pointer',
                        !notification.read && 'bg-primary/5'
                      )}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <div
                        className={cn(
                          'mt-0.5 rounded-full p-1.5',
                          notificationColors[notification.type],
                          notification.type === 'info' && 'bg-accent/10',
                          notification.type === 'success' && 'bg-success/10',
                          notification.type === 'warning' && 'bg-warning/10',
                          notification.type === 'error' && 'bg-destructive/10'
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      )}
                    </DropdownMenuItem>
                  );
                })
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
