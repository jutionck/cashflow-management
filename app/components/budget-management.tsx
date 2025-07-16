import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { Plus, Target, TrendingUp, AlertTriangle } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';

import type { Transaction, Budget } from '../types/transaction';
import { formatIDR } from '../utils/currency';
import { useLocalStorage, storageKeys } from '../hooks/use-local-storage';

interface BudgetManagementProps {
  transactions: Transaction[];
  currentMonth: Date;
  storageKey?: string;
}

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

export default function BudgetManagement({
  transactions,
  currentMonth,
  storageKey = storageKeys.BUDGETS,
}: BudgetManagementProps) {
  const [budgets, setBudgets] = useLocalStorage<Budget[]>(storageKey, []);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    monthlyLimit: '',
  });

  const currentMonthKey = format(currentMonth, 'yyyy-MM');

  const monthlySpending = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const monthlyTransactions = transactions.filter(
      (transaction) =>
        transaction.type === 'expense' &&
        isWithinInterval(parseISO(transaction.date), {
          start: monthStart,
          end: monthEnd,
        })
    );

    return monthlyTransactions.reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions, currentMonth]);

  const budgetStatus = useMemo(() => {
    const currentBudgets = budgets.filter((b) => b.month === currentMonthKey);

    return expenseCategories.map((category) => {
      const budget = currentBudgets.find((b) => b.category === category);
      const spent = monthlySpending[category] || 0;
      const limit = budget?.monthlyLimit || 0;
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;

      return {
        category,
        limit,
        spent,
        percentage,
        remaining: Math.max(0, limit - spent),
        isOverBudget: spent > limit && limit > 0,
        hasWarning: percentage > 80 && percentage <= 100,
      };
    });
  }, [budgets, monthlySpending, currentMonthKey]);

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newBudget.category || !newBudget.monthlyLimit) return;

    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      monthlyLimit: Number.parseFloat(newBudget.monthlyLimit),
      spent: monthlySpending[newBudget.category] || 0,
      month: currentMonthKey,
    };

    setBudgets((prev) => {
      const filtered = prev.filter(
        (b) => !(b.category === budget.category && b.month === budget.month)
      );
      return [...filtered, budget];
    });

    setNewBudget({ category: '', monthlyLimit: '' });
    setShowBudgetForm(false);
  };

  const totalBudget = budgetStatus.reduce((sum, item) => sum + item.limit, 0);
  const totalSpent = budgetStatus.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className='space-y-4 lg:space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Anggaran
            </CardTitle>
            <Target className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-lg md:text-xl lg:text-2xl font-bold text-blue-600'>
              {formatIDR(totalBudget)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {format(currentMonth, 'MMM yyyy')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Terpakai
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-lg md:text-xl lg:text-2xl font-bold text-red-600'>
              {formatIDR(totalSpent)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {totalBudget > 0
                ? `${((totalSpent / totalBudget) * 100).toFixed(
                    1
                  )}% dari anggaran`
                : 'Belum ada anggaran'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Sisa</CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${
                totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-lg md:text-xl lg:text-2xl font-bold ${
                totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatIDR(Math.abs(totalRemaining))}
            </div>
            <p className='text-xs text-muted-foreground'>
              {totalRemaining >= 0 ? 'Dalam anggaran' : 'Melebihi anggaran'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold'>Anggaran per Kategori</h3>
        <Button onClick={() => setShowBudgetForm(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Atur Anggaran
        </Button>
      </div>

      <div className='grid gap-4'>
        {budgetStatus.map((item) => (
          <Card
            key={item.category}
            className={
              item.isOverBudget
                ? 'border-red-200 bg-red-50'
                : item.hasWarning
                ? 'border-yellow-200 bg-yellow-50'
                : ''
            }
          >
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <h4 className='font-medium'>{item.category}</h4>
                  {item.isOverBudget && (
                    <Badge variant='destructive'>Over Budget</Badge>
                  )}
                  {item.hasWarning && !item.isOverBudget && (
                    <Badge variant='secondary'>Warning</Badge>
                  )}
                </div>
                <div className='text-right'>
                  <p className='font-semibold'>
                    {formatIDR(item.spent)} / {formatIDR(item.limit)}
                  </p>
                  {item.limit > 0 && (
                    <p className='text-sm text-muted-foreground'>
                      {item.percentage.toFixed(1)}% used
                    </p>
                  )}
                </div>
              </div>

              {item.limit > 0 && (
                <div className='w-full bg-gray-200 rounded-full h-2 mb-2'>
                  <div
                    className={`h-2 rounded-full ${
                      item.isOverBudget
                        ? 'bg-red-600'
                        : item.hasWarning
                        ? 'bg-yellow-500'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              )}

              <div className='flex justify-between text-sm text-muted-foreground'>
                <span>Remaining: {formatIDR(item.remaining)}</span>
                {item.limit === 0 && <span>No budget set</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showBudgetForm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <Card className='w-full max-w-md'>
            <CardHeader>
              <CardTitle>Set Budget</CardTitle>
              <CardDescription>
                Set monthly budget for {format(currentMonth, 'MMM yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBudget} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='category'>Category</Label>
                  <Select
                    value={newBudget.category}
                    onValueChange={(value) =>
                      setNewBudget((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='limit'>Monthly Limit (IDR)</Label>
                  <Input
                    id='limit'
                    type='number'
                    placeholder='0'
                    min='0'
                    step='10000'
                    value={newBudget.monthlyLimit}
                    onChange={(e) =>
                      setNewBudget((prev) => ({
                        ...prev,
                        monthlyLimit: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className='flex gap-3 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowBudgetForm(false)}
                    className='flex-1'
                  >
                    Cancel
                  </Button>
                  <Button type='submit' className='flex-1'>
                    Set Budget
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
