'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import AppSwal from '@/lib/swal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await res.json();
      if (data.user.role === 'SUPERADMIN') router.push('/superadmin');
      else if (data.user.role === 'ADMIN') router.push('/admin');
      else if (data.user.role === 'OPERATOR') router.push('/operator');
      else if (data.user.role === 'FUNDRAISING') router.push('/fundraising');
      else router.push('/dashboard');
      
    } catch (err: any) {
      AppSwal.fire({
        icon: 'error',
        title: 'LOGIN GAGAL',
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-primary relative">
      {/* Neo-brutalist decorative shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-accent border-4 border-foreground shadow-brutal-lg hidden md:block" />
      <div className="absolute bottom-10 right-10 w-48 h-12 bg-blue-900 border-4 border-foreground shadow-brutal-lg hidden md:block" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md z-10"
      >
        <Card className="w-full bg-white border-4 border-foreground shadow-brutal-lg rounded-none relative overflow-hidden">
          <CardHeader className="space-y-2 pb-6 pt-10 text-center border-b-4 border-foreground bg-cyan-100">
            <CardTitle className="text-5xl font-black uppercase tracking-tight text-foreground">Sign In.</CardTitle>
            <CardDescription className="text-foreground font-bold">
              PORTAL ORGANISASI YMCC VII
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8">
            <form onSubmit={onSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-bold uppercase tracking-wider text-sm">Alamat Surel</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  required
                  className="bg-zinc-100 border-4 border-foreground shadow-brutal-sm text-foreground focus-visible:ring-0 focus-visible:outline-none focus:bg-white transition-none h-12 rounded-none px-4 font-bold" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground font-bold uppercase tracking-wider text-sm">Kata Sandi</Label>
                  <Link href="/forgot-password" className="text-xs font-bold text-accent-foreground hover:bg-accent px-1 border-2 border-transparent hover:border-foreground transition-none">
                    Lupa sandi?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="bg-zinc-100 border-4 border-foreground shadow-brutal-sm text-foreground focus-visible:ring-0 focus-visible:outline-none focus:bg-white transition-none h-12 rounded-none px-4 font-bold" 
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-foreground hover:bg-zinc-800 text-white border-4 border-transparent hover:border-accent hover:shadow-brutal-neon rounded-none h-14 text-xl font-black uppercase shadow-brutal-sm transition-all active:translate-y-1 active:shadow-none mt-6">
                {loading ? 'MEMVERIFIKASI...' : 'AKSES DASHBOARD'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8 pt-6 border-t-4 border-foreground bg-zinc-50">
            <div className="text-sm text-foreground font-medium text-center w-full">
              BELUM MEMILIKI AKUN?{' '}
              <Link href="/register" className="text-primary font-bold hover:bg-primary hover:text-white px-2 py-1 border-2 border-transparent hover:border-foreground border-dashed transition-none">
                DAFTAR SEKARANG
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
