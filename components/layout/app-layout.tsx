'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, sidebarOpen } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header title={title} subtitle={subtitle} />
      <main
        className={cn(
          'min-h-[calc(100vh-4rem)] transition-all duration-300 p-6',
          sidebarOpen ? 'ml-64' : 'ml-20'
        )}
      >
        {children}
      </main>
    </div>
  );
}
