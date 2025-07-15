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

        <div className='flex flex-col sm:flex-row gap-4'>
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
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Filter berdasarkan tipe' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Tipe</SelectItem>
              <SelectItem value='income'>Pemasukan</SelectItem>
              <SelectItem value='expense'>Pengeluaran</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Filter berdasarkan kategori' />
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
            <p className='text-center text-muted-foreground py-8'>
              Tidak ada transaksi ditemukan
            </p>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className='flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50'
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='font-medium'>{transaction.description}</h3>
                    <Badge
                      variant={
                        transaction.type === 'income' ? 'default' : 'secondary'
                      }
                    >
                      {transaction.type}
                    </Badge>
                    {transaction.isRecurring && (
                      <Badge variant='outline' className='text-xs'>
                        🔄 {transaction.recurringFrequency}
                      </Badge>
                    )}
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {format(parseISO(transaction.date), 'MMM dd, yyyy')} •{' '}
                    {transaction.category}
                  </p>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='text-right'>
                    <p
                      className={`font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatIDR(transaction.amount)}
                    </p>
                    {transaction.tags && transaction.tags.length > 0 && (
                      <div className='flex gap-1 mt-1'>
                        {transaction.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant='outline'
                            className='text-xs'
                          >
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

                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onEdit(transaction)}
                      className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    >
                      <Edit2 className='h-4 w-4' />
                    </Button>

                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onDelete(transaction.id)}
                      className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    >
                      <Trash2 className='h-4 w-4' />
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
