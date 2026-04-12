'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
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

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('PASSWORD DAN KONFIRMASI PASSWORD TIDAK SAMA.');
    }
    if (formData.password.length < 6) {
      return setError('PASSWORD MINIMAL 6 KARAKTER.');
    }
    
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: `${formData.firstName} ${formData.lastName}`.trim(), 
          email: formData.email, 
          password: formData.password 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'REGISTRASI GAGAL');
      }

      router.push('/login?registered=true');
      
    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-primary relative">
      {/* Neo-brutalist decorative shape */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-accent border-4 border-foreground shadow-brutal-lg hidden xl:block z-0" />
      <div className="absolute bottom-20 left-10 w-64 h-16 bg-blue-900 border-4 border-foreground shadow-brutal-lg hidden xl:block z-0" />
      
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center z-10">
        {/* Left Side: Typography & Value Prop */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex flex-col space-y-8 pr-12"
        >
          <div>
            <h1 className="text-6xl font-heading text-white italic uppercase tracking-tight mb-4 drop-shadow-[4px_4px_0_#001F3F] [-webkit-text-stroke:1px_#001F3F]">
              THE GREEN COMPASS <br/> <span className="text-accent underline decoration-4 underline-offset-8">IS ASSEMBLING.</span>
            </h1>
            <p className="text-lg text-white font-bold border-l-4 border-accent pl-4 mt-6">
              DAFTARKAN TIM ANDA SEKARANG DAN DAPATKAN AKSES PENUH KE PORTAL STRATEGIS YMCC VII!
            </p>
          </div>
          
          <div className="space-y-6 pt-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start space-x-4 bg-white border-4 border-foreground p-4 shadow-brutal">
                <div className="w-8 h-8 bg-accent border-2 border-foreground flex items-center justify-center flex-shrink-0 text-foreground mt-1 shadow-[2px_2px_0_0_var(--color-foreground)]">
                  <Check className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <h4 className="font-heading italic uppercase text-xl text-foreground tracking-wide leading-tight">{feature.title}</h4>
                  <p className="text-sm text-zinc-700 font-bold mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Register Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="z-10"
        >
          <Card className="w-full bg-white border-4 border-foreground shadow-brutal-lg rounded-none">
            <CardHeader className="space-y-2 pb-6 pt-8 border-b-4 border-foreground bg-amber-200">
              <CardTitle className="text-4xl font-heading italic uppercase tracking-tight text-foreground text-center">Registrasi Tim</CardTitle>
              <CardDescription className="text-foreground text-center font-bold">
                PROSES PEMBERKASAN DAN KREDENSIAL AWAL
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <form onSubmit={onSubmit} className="space-y-6">
                {error && <div className="p-3 bg-red-400 border-4 border-foreground shadow-brutal text-foreground text-sm text-center font-bold">{error}</div>}
              
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground font-bold uppercase tracking-wider text-sm">Nama Depan</Label>
                    <Input id="firstName" value={formData.firstName} onChange={handleChange} required placeholder="JOHN" className="bg-zinc-100 border-4 border-foreground shadow-brutal-sm text-foreground focus-visible:ring-0 focus-visible:outline-none focus:bg-white transition-none h-12 rounded-none px-4 font-bold uppercase placeholder:normal-case" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground font-bold uppercase tracking-wider text-sm">Nama Belakang</Label>
                    <Input id="lastName" value={formData.lastName} onChange={handleChange} required placeholder="DOE" className="bg-zinc-100 border-4 border-foreground shadow-brutal-sm text-foreground focus-visible:ring-0 focus-visible:outline-none focus:bg-white transition-none h-12 rounded-none px-4 font-bold uppercase placeholder:normal-case" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-bold uppercase tracking-wider text-sm">Email Tim</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="tim@universitas.ac.id" className="bg-zinc-100 border-4 border-foreground shadow-brutal-sm text-foreground focus-visible:ring-0 focus-visible:outline-none focus:bg-white transition-none h-12 rounded-none px-4 font-bold" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-bold uppercase tracking-wider text-sm">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="bg-zinc-100 border-4 border-foreground shadow-brutal-sm text-foreground focus-visible:ring-0 focus-visible:outline-none focus:bg-white transition-none h-12 rounded-none px-4 font-bold" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground font-bold uppercase tracking-wider text-sm">Konfirmasi Password</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" className="bg-zinc-100 border-4 border-foreground shadow-brutal-sm text-foreground focus-visible:ring-0 focus-visible:outline-none focus:bg-white transition-none h-12 rounded-none px-4 font-bold" />
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <input type="checkbox" id="terms" required className="mt-1 w-5 h-5 accent-primary border-4 border-foreground cursor-pointer shadow-none" />
                  <label htmlFor="terms" className="text-xs text-foreground font-bold leading-relaxed uppercase">
                    Saya menyetujui seluruh <Link href="/terms" className="text-primary hover:bg-primary hover:text-white px-1 border-b-2 border-primary hover:border-transparent transition-none">Syarat & Ketentuan</Link> dan <Link href="/privacy" className="text-primary hover:bg-primary hover:text-white px-1 border-b-2 border-primary hover:border-transparent transition-none">Kebijakan Privasi</Link> YMCC VII.
                  </label>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-foreground hover:bg-zinc-800 text-white border-4 border-transparent hover:border-accent hover:shadow-brutal-neon rounded-none h-14 text-xl font-heading italic uppercase shadow-brutal-sm transition-all active:translate-y-1 active:shadow-none mt-6 flex items-center justify-center">
                  <span>{loading ? 'MEMPROSES KREDENSIAL...' : 'BUAT BASIS DATA TIM'}</span>
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6 pb-8 border-t-4 border-foreground bg-zinc-50">
              <div className="text-sm text-foreground font-medium text-center w-full uppercase">
                SUDAH MEMILIKI AKUN?{' '}
                <Link href="/login" className="text-primary font-bold hover:bg-primary hover:text-white px-2 py-1 border-2 border-transparent hover:border-foreground border-dashed transition-none">
                  MASUK KE PORTAL
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    title: 'OFFICIAL STAFF ACCES',
    desc: 'Lengkapi administrasi kompetisi secara terpusat.'
  },
  {
    title: 'THE PIPELINE UPDATE',
    desc: 'Pantau status pendaftaran secara real-time.'
  }
];
