import type React from 'react';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import type { Transaction, TransactionType } from '../types/transaction';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  editTransaction?: Transaction;
}

const incomeCategories = [
  'Gaji',
  'Freelance',
  'Investasi',
  'Bisnis',
  'Pendapatan Lain',
];

const expenseCategories = [
  'Rumah/Sewa',
  'Makanan',
  'Transportasi',
  'Listrik/Air',
  'Kesehatan',
  'Hiburan',
  'Belanja',
  'Pengeluaran Lain',
];

export default function TransactionForm({
  onSubmit,
  onCancel,
  editTransaction,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date(),
    description: '',
    amount: '',
    type: 'expense' as TransactionType,
    category: '',
    isRecurring: false,
    recurringFrequency: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    tags: '' as string,
  });

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        date: parseISO(editTransaction.date),
        description: editTransaction.description,
        amount: editTransaction.amount.toString(),
        type: editTransaction.type,
        category: editTransaction.category,
        isRecurring: editTransaction.isRecurring || false,
        recurringFrequency: editTransaction.recurringFrequency || 'monthly',
        tags: editTransaction.tags?.join(', ') || '',
      });
    }
  }, [editTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.category) {
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSubmit({
      date: format(formData.date, 'yyyy-MM-dd'),
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      isRecurring: formData.isRecurring,
      recurringFrequency: formData.isRecurring
        ? formData.recurringFrequency
        : undefined,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  const categories =
    formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50'>
      <Card className='w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto'>
        <CardHeader className='pb-4'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1 min-w-0'>
              <CardTitle className='text-lg sm:text-xl'>
                {editTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
              </CardTitle>
              <CardDescription className='text-sm'>
                {editTransaction
                  ? 'Ubah detail transaksi'
                  : 'Masukkan detail transaksi'}
              </CardDescription>
            </div>
            <Button variant='ghost' size='sm' onClick={onCancel}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='px-4 sm:px-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='date'>Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id='date'
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {format(formData.date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={formData.date}
                    onSelect={(date) =>
                      date && setFormData((prev) => ({ ...prev, date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='type'>Tipe</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TransactionType) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: value,
                    category: '',
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Pilih tipe' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='income'>Pemasukan</SelectItem>
                  <SelectItem value='expense'>Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category'>Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Pilih kategori' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Deskripsi</Label>
              <Input
                id='description'
                type='text'
                placeholder='Masukkan deskripsi'
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='amount'>Jumlah (IDR)</Label>
              <Input
                id='amount'
                type='number'
                placeholder='0'
                min='0'
                step='1000'
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='tags'>Tag (dipisahkan koma)</Label>
              <Input
                id='tags'
                type='text'
                placeholder='pribadi, bisnis, penting'
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
              />
            </div>

            <div className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id='isRecurring'
                  checked={formData.isRecurring}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isRecurring: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor='isRecurring'>Transaksi Berulang</Label>
              </div>

              {formData.isRecurring && (
                <div className='space-y-2'>
                  <Label htmlFor='frequency'>Frekuensi</Label>
                  <Select
                    value={formData.recurringFrequency}
                    onValueChange={(value: 'monthly' | 'weekly' | 'yearly') =>
                      setFormData((prev) => ({
                        ...prev,
                        recurringFrequency: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih frekuensi' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='weekly'>Mingguan</SelectItem>
                      <SelectItem value='monthly'>Bulanan</SelectItem>
                      <SelectItem value='yearly'>Tahunan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className='flex gap-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onCancel}
                className='flex-1'
              >
                Batal
              </Button>
              <Button type='submit' className='flex-1'>
                {editTransaction ? 'Perbarui' : 'Tambah'} Transaksi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
