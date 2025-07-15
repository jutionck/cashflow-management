'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import {
  CalendarIcon,
  Download,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
  Database,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import TransactionForm from './components/transaction-form';
import TransactionList from './components/transaction-list';
import CashflowChart from './components/cashflow-chart';
import BudgetManagement from './components/budget-management';
import FinancialGoals from './components/financial-goals';
import ImportExport from './components/import-export';
import type { Transaction } from './types/transaction';
import { formatIDR } from './utils/currency';
import { useLocalStorage, storageKeys } from './hooks/use-local-storage';

const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Gaji Bulanan',
    amount: 15000000,
    type: 'income',
    category: 'Salary',
  },
  {
    id: '2',
    date: '2024-01-16',
    description: 'Sewa Rumah',
    amount: 3500000,
    type: 'expense',
    category: 'Housing',
  },
  {
    id: '3',
    date: '2024-01-18',
    description: 'Belanja Groceries',
    amount: 450000,
    type: 'expense',
    category: 'Food',
  },
  {
    id: '4',
    date: '2024-01-20',
    description: 'Proyek Freelance',
    amount: 2400000,
    type: 'income',
    category: 'Freelance',
  },
  {
    id: '5',
    date: '2024-01-22',
    description: 'Listrik & Air',
    amount: 600000,
    type: 'expense',
    category: 'Utilities',
  },
  {
    id: '6',
    date: '2024-01-25',
    description: 'Dividen Investasi',
    amount: 900000,
    type: 'income',
    category: 'Investment',
  },
];

export default function CashflowManager() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    storageKeys.TRANSACTIONS,
    initialTransactions
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >(undefined);

  const monthlyData = useMemo(() => {
    const filteredTransactions = transactions.filter((transaction) =>
      isWithinInterval(parseISO(transaction.date), {
        start: dateRange.from,
        end: dateRange.to,
      })
    );

    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netCashflow = income - expenses;

    return {
      income,
      expenses,
      netCashflow,
      transactions: filteredTransactions,
    };
  }, [transactions, dateRange]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id
            ? { ...transaction, id: editingTransaction.id }
            : t
        )
      );
      setEditingTransaction(undefined);
    } else {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
      };
      setTransactions((prev) => [...prev, newTransaction]);
    }
    setShowTransactionForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleImportTransactions = (importedTransactions: Transaction[]) => {
    setTransactions((prev) => [...prev, ...importedTransactions]);
  };

  const downloadReport = () => {
    const csvContent = [
      ['Date', 'Description', 'Type', 'Category', 'Amount'],
      ...monthlyData.transactions.map((t) => [
        t.date,
        t.description,
        t.type,
        t.category,
        t.amount.toString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cashflow-report-${format(dateRange.from, 'yyyy-MM')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto p-6 space-y-6'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold flex items-center gap-2'>
              <Wallet className='h-8 w-8' />
              Manajemen Uang Pribadi
            </h1>
            <p className='text-muted-foreground flex items-center gap-2'>
              Lacak pemasukan dan pengeluaran Anda
              <Badge variant='secondary' className='text-xs'>
                <Database className='h-3 w-3 mr-1' />
                Simpan Otomatis
              </Badge>
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='justify-start text-left font-normal bg-transparent'
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {format(dateRange.from, 'MMM yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='end'>
                <Calendar
                  mode='single'
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setDateRange({
                        from: startOfMonth(date),
                        to: endOfMonth(date),
                      });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button onClick={downloadReport} variant='outline'>
              <Download className='mr-2 h-4 w-4' />
              Unduh Laporan
            </Button>

            <Button onClick={() => setShowTransactionForm(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Tambah Transaksi
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Pemasukan
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {formatIDR(monthlyData.income)}
              </div>
              <p className='text-xs text-muted-foreground'>
                {format(dateRange.from, 'MMM yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Pengeluaran
              </CardTitle>
              <TrendingDown className='h-4 w-4 text-red-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600'>
                {formatIDR(monthlyData.expenses)}
              </div>
              <p className='text-xs text-muted-foreground'>
                {format(dateRange.from, 'MMM yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Arus Kas Bersih
              </CardTitle>
              <Wallet className='h-4 w-4 text-blue-600' />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  monthlyData.netCashflow >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {formatIDR(monthlyData.netCashflow)}
              </div>
              <p className='text-xs text-muted-foreground'>
                {monthlyData.netCashflow >= 0 ? 'Surplus' : 'Defisit'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList className='grid w-full grid-cols-2 lg:grid-cols-6'>
            <TabsTrigger value='overview'>Ringkasan</TabsTrigger>
            <TabsTrigger value='transactions'>Transaksi</TabsTrigger>
            <TabsTrigger value='budget'>Anggaran</TabsTrigger>
            <TabsTrigger value='goals'>Tujuan</TabsTrigger>
            <TabsTrigger value='analytics'>Analitik</TabsTrigger>
            <TabsTrigger value='import-export'>Impor/Ekspor</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Arus Kas Bulanan</CardTitle>
                  <CardDescription>
                    Pemasukan vs Pengeluaran untuk{' '}
                    {format(dateRange.from, 'MMMM yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CashflowChart transactions={monthlyData.transactions} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaksi Terbaru</CardTitle>
                  <CardDescription>5 transaksi terakhir</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {monthlyData.transactions
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .slice(0, 5)
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className='flex items-center justify-between'
                        >
                          <div>
                            <p className='font-medium'>
                              {transaction.description}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                              {transaction.category} •{' '}
                              {format(parseISO(transaction.date), 'MMM dd')}
                            </p>
                          </div>
                          <div className='text-right'>
                            <p
                              className={`font-medium ${
                                transaction.type === 'income'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {transaction.type === 'income' ? '+' : '-'}
                              {formatIDR(transaction.amount)}
                            </p>
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
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='transactions'>
            <TransactionList
              transactions={monthlyData.transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value='budget'>
            <BudgetManagement
              transactions={transactions}
              currentMonth={selectedDate}
            />
          </TabsContent>

          <TabsContent value='goals'>
            <FinancialGoals totalBalance={monthlyData.netCashflow} />
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trend</CardTitle>
                  <CardDescription>
                    Cashflow trends over recent months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CashflowChart transactions={transactions} chartType='line' />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>
                    Expense distribution by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CashflowChart
                    transactions={monthlyData.transactions}
                    chartType='pie'
                  />
                </CardContent>
              </Card>

              <Card className='lg:col-span-2'>
                <CardHeader>
                  <CardTitle>Financial Health Metrics</CardTitle>
                  <CardDescription>
                    Key indicators of your financial health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='text-center p-4 border rounded'>
                      <div className='text-2xl font-bold text-blue-600'>
                        {monthlyData.income > 0
                          ? Math.round(
                              ((monthlyData.income - monthlyData.expenses) /
                                monthlyData.income) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        Savings Rate
                      </p>
                    </div>
                    <div className='text-center p-4 border rounded'>
                      <div className='text-2xl font-bold text-orange-600'>
                        {monthlyData.income > 0
                          ? Math.round(
                              (monthlyData.expenses / monthlyData.income) * 100
                            )
                          : 0}
                        %
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        Expense Ratio
                      </p>
                    </div>
                    <div className='text-center p-4 border rounded'>
                      <div className='text-2xl font-bold text-green-600'>
                        {monthlyData.transactions.length}
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        Total Transactions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='import-export'>
            <ImportExport
              transactions={transactions}
              onImport={handleImportTransactions}
              onExport={downloadReport}
            />
          </TabsContent>
        </Tabs>

        {showTransactionForm && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
            <div className='bg-background border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto'>
              <TransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => {
                  setShowTransactionForm(false);
                  setEditingTransaction(undefined);
                }}
                editTransaction={editingTransaction}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
