'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, Truck, Package, Store, BarChart3 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useStore();
  const [email, setEmail] = useState('john.smith@cvg.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = login(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  const features = [
    { icon: Store, title: 'Counter Management', description: 'Manage branches and staff' },
    { icon: Package, title: 'Inventory Control', description: 'Track stock levels' },
    { icon: Truck, title: 'Shipment Tracking', description: 'Real-time logistics' },
    { icon: BarChart3, title: 'Analytics', description: 'Comprehensive reports' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-lg">
              CVG
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">CVG Logistics</h1>
              <p className="text-sm text-muted-foreground">Counter & Logistics Management</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-foreground leading-tight text-balance">
                Streamline your logistics operations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                A comprehensive platform for managing counters, inventory, orders, and shipments all in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-4 rounded-2xl bg-card/50 border border-border/50 transition-all duration-300 hover:bg-card hover:border-border hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3 transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Trusted by logistics companies worldwide
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <div className="lg:hidden flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                CVG
              </div>
              <span className="font-semibold text-lg">Logistics</span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/30 border-border/50 focus:border-primary/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/30 border-border/50 focus:border-primary/50 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive animate-fade-in">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full h-11 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Demo Credentials</span>
                </div>
              </div>

              <div className="rounded-xl bg-secondary/30 p-4 text-sm">
                <p className="text-muted-foreground mb-2">Use any of these demo accounts:</p>
                <div className="space-y-1 font-mono text-xs">
                  <p><span className="text-foreground">Admin:</span> john.smith@cvg.com</p>
                  <p><span className="text-foreground">Manager:</span> sarah.j@cvg.com</p>
                  <p><span className="text-foreground">Staff:</span> mike.w@cvg.com</p>
                  <p><span className="text-foreground">Driver:</span> david.l@cvg.com</p>
                </div>
                <p className="text-muted-foreground mt-2">Password: <span className="font-mono text-foreground">demo123</span></p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
