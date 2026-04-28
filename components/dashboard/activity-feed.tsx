'use client';

import { cn } from '@/lib/utils';
import { activities } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';
import {
  ShoppingCart,
  Truck,
  Package,
  Store,
  User,
} from 'lucide-react';

const activityIcons = {
  order: ShoppingCart,
  shipment: Truck,
  inventory: Package,
  counter: Store,
  user: User,
};

const activityColors = {
  order: 'bg-chart-1/10 text-chart-1',
  shipment: 'bg-chart-2/10 text-chart-2',
  inventory: 'bg-chart-3/10 text-chart-3',
  counter: 'bg-chart-4/10 text-chart-4',
  user: 'bg-chart-5/10 text-chart-5',
};

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.slice(0, 6).map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <div
              key={activity.id}
              className={cn(
                'flex items-start gap-4 animate-fade-in',
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  activityColors[activity.type]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.userName}</span>{' '}
                  <span className="text-muted-foreground">{activity.description}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
