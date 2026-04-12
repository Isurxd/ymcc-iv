'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert, KeyRound, Search, UserCog } from 'lucide-react';

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // States for Password Reset
  const [passwordInput, setPasswordInput] = useState('');
  const [editingPasswordFor, setEditingPasswordFor] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      if(Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Ubah role pengguna ini menjadi ${newRole}?`)) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_ROLE', role: newRole }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Gagal mengubah role');
      }
      alert('Role berhasil diubah.');
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePasswordReset = async (userId: string) => {
    if (!passwordInput || passwordInput.length < 6) {
      alert('Kata sandi baru harus minimal 6 karakter');
      return;
    }
    
    if (!confirm('Apakah Anda yakin ingin mengatur ulang kata sandi pengguna ini?')) return;
    
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET_PASSWORD', newPassword: passwordInput }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Gagal mengubah password');
      }
      
      alert('Kata sandi berhasil diatur ulang!');
      setEditingPasswordFor(null);
      setPasswordInput('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter((u) => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-10 border-b-8 border-black pb-6 bg-white p-8 shadow-[8px_8px_0_0_red]">
        <h1 className="text-4xl md:text-5xl font-heading italic font-black tracking-wide text-black uppercase drop-shadow-[3px_3px_0_red] [-webkit-text-stroke:1px_black]">
          ACCESS CONTROL.
        </h1>
        <p className="text-zinc-600 font-bold uppercase mt-4 text-xs tracking-widest border-l-4 border-red-600 pl-4">Manajemen staf internal, perizinan role, dan manipulasi kredensial (Root Access).</p>
      </header>

      <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_black] p-6 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-[linear-gradient(45deg,transparent_25%,rgba(255,0,0,0.05)_50%,transparent_75%,transparent_100%)] bg-[size:20px_20px]">
        <div className="flex items-center gap-3 w-full md:w-1/2">
          <Search className="w-6 h-6 text-zinc-500" />
          <Input 
            placeholder="CARI NAMA ATAU EMAIL..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-4 border-black shadow-brutal-sm rounded-none h-12 uppercase font-bold text-black"
          />
        </div>
        <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 border-2 border-black font-black uppercase tracking-widest shadow-[2px_2px_0_0_black]">
          <ShieldAlert className="w-5 h-5" /> ROOT OVERRIDE ENABLED
        </div>
      </div>

      <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_black] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-bold uppercase text-sm">
            <thead>
              <tr className="bg-black text-white border-b-4 border-black">
                <th className="p-4 tracking-widest">PENGGUNA</th>
                <th className="p-4 tracking-widest text-center">CURRENT ROLE</th>
                <th className="p-4 tracking-widest text-center">PASSWORD RESET (FORCE)</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-dashed divide-zinc-200">
              {loading ? (
                <tr><td colSpan={3} className="p-8 text-center text-red-600 animate-pulse">Menghubungkan ke Database...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-zinc-500">Tidak ada pengguna ditemukan.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-100 transition-colors">
                    <td className="p-4">
                      <div className="text-black font-heading italic text-xl">{user.name}</div>
                      <div className="text-zinc-500 text-xs mt-1 lowercase">{user.email}</div>
                    </td>
                    <td className="p-4 text-center">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`border-4 border-black shadow-[2px_2px_0_0_black] font-black uppercase text-xs p-2 outline-none cursor-pointer ${
                          user.role === 'SUPERADMIN' ? 'bg-red-600 text-white' : 
                          user.role === 'ADMIN' ? 'bg-blue-600 text-white' : 
                          user.role === 'OPERATOR' ? 'bg-black text-[#CCFF00]' : 
                          user.role === 'FUNDRAISING' ? 'bg-[#E63E00] text-white' :
                          'bg-zinc-200 text-black'
                        }`}
                      >
                        <option value="USER">USER / PESERTA</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="OPERATOR">OPERATOR</option>
                        <option value="FUNDRAISING">FUNDRAISING</option>
                        <option value="SUPERADMIN">SUPERADMIN</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      {editingPasswordFor === user.id ? (
                        <div className="flex gap-2 justify-center max-w-xs mx-auto">
                           <Input 
                             type="text" 
                             placeholder="New Password" 
                             value={passwordInput}
                             onChange={(e) => setPasswordInput(e.target.value)}
                             className="border-4 border-red-600 shadow-brutal-sm rounded-none font-bold"
                           />
                           <Button onClick={() => handlePasswordReset(user.id)} className="bg-red-600 text-white hover:bg-black rounded-none border-2 border-transparent">
                             SAVE
                           </Button>
                           <Button onClick={() => setEditingPasswordFor(null)} className="bg-zinc-200 text-black hover:bg-zinc-300 rounded-none border-2 border-black">
                             X
                           </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => { setEditingPasswordFor(user.id); setPasswordInput(''); }}
                          className="bg-black text-white hover:bg-red-600 border-4 border-transparent hover:border-black rounded-none font-bold uppercase tracking-widest text-xs h-10 shadow-[2px_2px_0_0_#FFF] transition-none"
                        >
                          <KeyRound className="w-4 h-4 mr-2" /> UBAH SANDI
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
