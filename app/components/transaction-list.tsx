import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Trash2, Search, Edit2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Transaction } from '../types/transaction';
import { formatIDR } from '../utils/currency';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory =
      filterCategory === 'all' || transaction.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Semua Transaksi</CardTitle>

        <div className='flex flex-col gap-3 md:flex-row md:gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Cari transaksi...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className='w-full md:w-[140px]'>
              <SelectValue placeholder='Tipe' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Tipe</SelectItem>
              <SelectItem value='income'>Pemasukan</SelectItem>
              <SelectItem value='expense'>Pengeluaran</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className='w-full md:w-[140px]'>
              <SelectValue placeholder='Kategori' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className='space-y-4'>
          {filteredTransactions.length === 0 ? (
            <div className='text-center py-12'>
              <div className='mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
                <Search className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                {transactions.length === 0
                  ? 'Belum Ada Transaksi'
                  : 'Tidak Ada Hasil'}
              </h3>
              <p className='text-muted-foreground'>
                {transactions.length === 0
                  ? 'Mulai dengan menambah transaksi pertama Anda.'
                  : 'Coba ubah filter atau kata kunci pencarian.'}
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className='flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-muted/50 gap-3'
              >
                <div className='flex-1'>
                  <div className='flex flex-col md:flex-row md:items-center gap-2 mb-1'>
                    <h3 className='font-medium text-sm md:text-base'>
                      {transaction.description}
                    </h3>
                    <div className='flex gap-2'>
                      <Badge
                        variant={
                          transaction.type === 'income'
                            ? 'default'
                            : 'secondary'
                        }
                        className='text-xs'
                      >
                        {transaction.type === 'income'
                          ? 'Pemasukan'
                          : 'Pengeluaran'}
                      </Badge>
                      {transaction.isRecurring && (
                        <Badge variant='outline' className='text-xs'>
                          🔄 {transaction.recurringFrequency}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className='text-xs md:text-sm text-muted-foreground'>
                    {format(parseISO(transaction.date), 'MMM dd, yyyy')} •{' '}
                    {transaction.category}
                  </p>
                  {transaction.tags && transaction.tags.length > 0 && (
                    <div className='flex gap-1 mt-2'>
                      {transaction.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant='outline' className='text-xs'>
                          {tag}
                        </Badge>
                      ))}
                      {transaction.tags.length > 2 && (
                        <Badge variant='outline' className='text-xs'>
                          +{transaction.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className='flex items-center justify-between md:justify-end gap-3'>
                  <div className='text-left md:text-right'>
                    <p
                      className={`font-semibold text-sm md:text-base ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatIDR(transaction.amount)}
                    </p>
                  </div>

                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onEdit(transaction)}
                      className='text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8'
                    >
                      <Edit2 className='h-3 w-3 md:h-4 md:w-4' />
                    </Button>

                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onDelete(transaction.id)}
                      className='text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8'
                    >
                      <Trash2 className='h-3 w-3 md:h-4 md:w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
