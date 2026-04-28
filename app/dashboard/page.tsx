'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import {
  ShipmentsOrdersChart,
  RevenueChart,
  CounterPerformanceChart,
  CategoryDistributionChart,
} from '@/components/dashboard/charts';
import { dashboardStats } from '@/lib/mock-data';
import {
  ShoppingCart,
  Truck,
  CheckCircle,
  Clock,
  DollarSign,
  Store,
  Package,
  AlertTriangle,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard" subtitle="Welcome back! Here's an overview of your operations.">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Orders"
            value={dashboardStats.totalOrders}
            change={dashboardStats.ordersChange}
            icon={ShoppingCart}
            iconColor="text-chart-1"
            iconBgColor="bg-chart-1/10"
          />
          <StatsCard
            title="In Transit"
            value={dashboardStats.shipmentsInTransit}
            change={dashboardStats.shipmentsChange}
            icon={Truck}
            iconColor="text-chart-2"
            iconBgColor="bg-chart-2/10"
          />
          <StatsCard
            title="Delivered"
            value={dashboardStats.delivered}
            change={dashboardStats.deliveredChange}
            icon={CheckCircle}
            iconColor="text-success"
            iconBgColor="bg-success/10"
          />
          <StatsCard
            title="Pending"
            value={dashboardStats.pending}
            change={dashboardStats.pendingChange}
            icon={Clock}
            iconColor="text-warning"
            iconBgColor="bg-warning/10"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={`$${(dashboardStats.totalRevenue / 1000).toFixed(0)}K`}
            change={dashboardStats.revenueChange}
            icon={DollarSign}
            iconColor="text-success"
            iconBgColor="bg-success/10"
          />
          <StatsCard
            title="Active Counters"
            value={`${dashboardStats.activeCounters}/${dashboardStats.totalCounters}`}
            icon={Store}
            iconColor="text-chart-4"
            iconBgColor="bg-chart-4/10"
          />
          <StatsCard
            title="Total Products"
            value={dashboardStats.totalProducts}
            icon={Package}
            iconColor="text-chart-3"
            iconBgColor="bg-chart-3/10"
          />
          <StatsCard
            title="Low Stock Items"
            value={dashboardStats.lowStockProducts}
            icon={AlertTriangle}
            iconColor="text-destructive"
            iconBgColor="bg-destructive/10"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ShipmentsOrdersChart />
          <RevenueChart />
        </div>

        {/* Charts Row 2 + Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <CounterPerformanceChart />
          <CategoryDistributionChart />
          <ActivityFeed />
        </div>
      </div>
    </AppLayout>
  );
}
