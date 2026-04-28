'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import {
  shipmentsChartData,
  revenueChartData,
  counterPerformanceData,
  categoryDistribution,
} from '@/lib/mock-data';

const COLORS = [
  'oklch(0.55 0.18 260)',
  'oklch(0.65 0.15 200)',
  'oklch(0.7 0.14 150)',
  'oklch(0.75 0.12 80)',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            {entry.name}:{' '}
            <span className="font-medium text-foreground">
              {typeof entry.value === 'number' && entry.name.includes('revenue')
                ? `$${entry.value.toLocaleString()}`
                : entry.value.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ShipmentsOrdersChart() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Shipments & Orders
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={shipmentsChartData}>
          <defs>
            <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.55 0.18 260)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.55 0.18 260)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.65 0.15 200)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.65 0.15 200)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'oklch(0.45 0.02 260)', fontSize: 12 }}
            axisLine={{ stroke: 'oklch(0.91 0.015 260)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'oklch(0.45 0.02 260)', fontSize: 12 }}
            axisLine={{ stroke: 'oklch(0.91 0.015 260)' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="shipments"
            stroke="oklch(0.55 0.18 260)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorShipments)"
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="oklch(0.65 0.15 200)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorOrders)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueChart() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Revenue Overview
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={revenueChartData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.55 0.18 260)" stopOpacity={1} />
              <stop offset="95%" stopColor="oklch(0.55 0.18 260)" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'oklch(0.45 0.02 260)', fontSize: 12 }}
            axisLine={{ stroke: 'oklch(0.91 0.015 260)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'oklch(0.45 0.02 260)', fontSize: 12 }}
            axisLine={{ stroke: 'oklch(0.91 0.015 260)' }}
            tickLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="revenue"
            fill="url(#colorRevenue)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CounterPerformanceChart() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Counter Performance
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={counterPerformanceData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            type="number"
            tick={{ fill: 'oklch(0.45 0.02 260)', fontSize: 12 }}
            axisLine={{ stroke: 'oklch(0.91 0.015 260)' }}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: 'oklch(0.45 0.02 260)', fontSize: 12 }}
            axisLine={{ stroke: 'oklch(0.91 0.015 260)' }}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="transactions"
            fill="oklch(0.65 0.15 200)"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryDistributionChart() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Inventory Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryDistribution}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {categoryDistribution.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
