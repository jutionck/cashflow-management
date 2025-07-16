import { useState } from 'react';
import { Users, Plus, Trash2, UserCircle, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { useUserStorage } from '../hooks/use-user-storage';

export default function UserManagement() {
  const {
    currentUser,
    createUser,
    deleteUser,
    logoutUser,
    isCurrentUserLoaded,
  } = useUserStorage();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      createUser(newUserName.trim());
      setNewUserName('');
      setShowCreateUser(false);
    }
  };

  if (!isCurrentUserLoaded) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p>Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
              <UserCircle className='h-6 w-6 text-primary' />
            </div>
            <CardTitle className='text-xl'>Selamat Datang</CardTitle>
            <CardDescription>
              Silakan buat pengguna untuk memulai mengelola cashflow Anda
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <form onSubmit={handleCreateUser} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='userName'>Nama Pengguna</Label>
                <Input
                  id='userName'
                  placeholder='Masukkan nama Anda...'
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>
              <Button type='submit' className='w-full'>
                <Plus className='mr-2 h-4 w-4' />
                Buat Pengguna Baru
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-3'>
      <div className='flex items-center gap-2'>
        <UserCircle className='h-5 w-5 text-muted-foreground' />
        <span className='text-sm font-medium'>{currentUser.name}</span>
        <Badge variant='secondary' className='text-xs'>
          Aktif
        </Badge>
      </div>{' '}
      <div className='flex items-center gap-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline' size='sm'>
              <Users className='mr-2 h-4 w-4' />
              <span className='hidden md:inline'>Kelola Pengguna</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Kelola Pengguna</DialogTitle>{' '}
              <DialogDescription>Kelola pengguna saat ini</DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Pengguna Saat Ini</Label>
                <div className='flex items-center justify-between p-2 border rounded-lg bg-muted/50'>
                  <div className='flex items-center gap-2'>
                    <UserCircle className='h-4 w-4' />
                    <span className='font-medium'>{currentUser.name}</span>
                    <Badge variant='default' className='text-xs'>
                      Aktif
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Aksi Pengguna</Label>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => deleteUser(currentUser.id)}
                    className='text-red-600 hover:text-red-700 flex-1'
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Hapus & Reset Data
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant='outline'
          size='sm'
          onClick={logoutUser}
          className='text-red-600 hover:text-red-700 hover:bg-red-50'
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span className='hidden md:inline'>Keluar</span>
        </Button>
      </div>
    </div>
  );
}
