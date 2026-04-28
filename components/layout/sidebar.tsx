'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  Truck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  Building2,
  FileText,
  RotateCcw,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Counters', href: '/counters', icon: Store },
  { name: 'Staff', href: '/staff', icon: Users },
  { name: 'Customers', href: '/customers', icon: Building2 },
  { name: 'Suppliers', href: '/suppliers', icon: Building2 },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ClipboardList },
  { name: 'Returns', href: '/returns', icon: RotateCcw },
  { name: 'Shipments', href: '/shipments', icon: Truck },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Audit Log', href: '/audit-log', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, user, logout } = useStore();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                CVG
              </div>
              {sidebarOpen && (
                <span className="font-semibold text-sidebar-foreground animate-fade-in">
                  Logistics
                </span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return sidebarOpen ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="animate-fade-in">{item.name}</span>
                </Link>
              ) : (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center rounded-xl p-2.5 transition-all duration-200',
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-3">
            {user && (
              <div
                className={cn(
                  'flex items-center gap-3 rounded-xl p-2 transition-colors',
                  sidebarOpen ? '' : 'justify-center'
                )}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0 animate-fade-in">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 capitalize">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                )}
                {sidebarOpen && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Sign out</TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
