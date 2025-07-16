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
import UserManagement from './components/user-management';
import type { Transaction } from './types/transaction';
import { formatIDR } from './utils/currency';
import { storageKeys } from './hooks/use-local-storage';
import { useLocalStorageSSR } from './hooks/use-local-storage-ssr';
import { useUserStorage } from './hooks/use-user-storage';

export default function CashflowManager() {
  const { currentUser, getUserStorageKey, isCurrentUserLoaded } =
    useUserStorage();

  const transactionStorageKey = currentUser
    ? `${storageKeys.TRANSACTIONS}_${currentUser.id}`
    : storageKeys.TRANSACTIONS;

  const [transactions, setTransactions, isTransactionsLoaded] =
    useLocalStorageSSR<Transaction[]>(transactionStorageKey, []);
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
    if (!isTransactionsLoaded) {
      return {
        income: 0,
        expenses: 0,
        netCashflow: 0,
        transactions: [] as Transaction[],
      };
    }

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
  }, [transactions, dateRange, isTransactionsLoaded]);

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

  if (!isCurrentUserLoaded) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p>Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <UserManagement />;
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6'>
        <div className='flex flex-col gap-4'>
          <div className='text-center md:text-left'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div>
                <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold flex items-center justify-center md:justify-start gap-2'>
                  <Wallet className='h-6 w-6 md:h-8 md:w-8' />
                  Manajemen Uang Pribadi
                </h1>
                <div className='text-muted-foreground flex items-center justify-center md:justify-start gap-2 text-sm md:text-base'>
                  Lacak pemasukan dan pengeluaran Anda
                  <Badge variant='secondary' className='text-xs'>
                    <Database className='h-3 w-3 mr-1' />
                    Simpan Otomatis
                  </Badge>
                </div>
              </div>
              <UserManagement />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-2 md:gap-4 w-full'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='justify-start text-left font-normal bg-transparent w-full md:w-auto'
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {format(dateRange.from, 'MMM yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='center'>
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

            <Button
              onClick={downloadReport}
              variant='outline'
              className='w-full md:w-auto'
            >
              <Download className='mr-2 h-4 w-4' />
              <span className='hidden md:inline'>Unduh Laporan</span>
              <span className='md:hidden'>Unduh</span>
            </Button>

            <Button
              onClick={() => setShowTransactionForm(true)}
              className='w-full md:w-auto'
            >
              <Plus className='mr-2 h-4 w-4' />
              <span className='hidden md:inline'>Tambah Transaksi</span>
              <span className='md:hidden'>Tambah</span>
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Pemasukan
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-lg md:text-xl lg:text-2xl font-bold text-green-600'>
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
              <div className='text-lg md:text-xl lg:text-2xl font-bold text-red-600'>
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
                className={`text-lg md:text-xl lg:text-2xl font-bold ${
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
          <div className='overflow-x-auto'>
            <TabsList className='grid w-full grid-cols-6 min-w-[500px] md:min-w-0'>
              <TabsTrigger
                value='overview'
                className='text-xs md:text-sm px-1 md:px-3 lg:px-4'
              >
                Ringkasan
              </TabsTrigger>
              <TabsTrigger
                value='transactions'
                className='text-xs md:text-sm px-1 md:px-3 lg:px-4'
              >
                Transaksi
              </TabsTrigger>
              <TabsTrigger
                value='budget'
                className='text-xs md:text-sm px-1 md:px-3 lg:px-4'
              >
                Anggaran
              </TabsTrigger>
              <TabsTrigger
                value='goals'
                className='text-xs md:text-sm px-1 md:px-3 lg:px-4'
              >
                Tujuan
              </TabsTrigger>
              <TabsTrigger
                value='analytics'
                className='text-xs md:text-sm px-1 md:px-3 lg:px-4'
              >
                Analitik
              </TabsTrigger>
              <TabsTrigger
                value='import-export'
                className='text-xs md:text-sm px-1 md:px-3 lg:px-4'
              >
                Impor/Ekspor
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base md:text-lg lg:text-xl'>
                    Arus Kas Bulanan
                  </CardTitle>
                  <CardDescription className='text-sm'>
                    Pemasukan vs Pengeluaran untuk{' '}
                    {format(dateRange.from, 'MMMM yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-3 md:p-4 lg:p-6'>
                  <CashflowChart transactions={monthlyData.transactions} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base md:text-lg lg:text-xl'>
                    {monthlyData.transactions.length === 0
                      ? 'Mulai Transaksi'
                      : 'Transaksi Terbaru'}
                  </CardTitle>
                  <CardDescription className='text-sm'>
                    {monthlyData.transactions.length === 0
                      ? 'Belum ada transaksi untuk bulan ini'
                      : '5 transaksi terakhir'}
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-3 md:p-4 lg:p-6'>
                  <div className='space-y-3'>
                    {monthlyData.transactions.length === 0 ? (
                      <div className='text-center py-8'>
                        <div className='mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
                          <Plus className='h-6 w-6 text-primary' />
                        </div>
                        <h3 className='text-lg font-semibold mb-2'>
                          Selamat Datang, {currentUser?.name}!
                        </h3>
                        <p className='text-muted-foreground mb-4'>
                          Belum ada transaksi. Mulai dengan menambah transaksi
                          pertama Anda.
                        </p>
                        <Button
                          onClick={() => setShowTransactionForm(true)}
                          className='mx-auto'
                        >
                          <Plus className='mr-2 h-4 w-4' />
                          Tambah Transaksi Pertama
                        </Button>
                      </div>
                    ) : (
                      monthlyData.transactions
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .slice(0, 5)
                        .map((transaction) => (
                          <div
                            key={transaction.id}
                            className='flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 border rounded-lg'
                          >
                            <div className='flex-1'>
                              <p className='font-medium text-sm md:text-base'>
                                {transaction.description}
                              </p>
                              <p className='text-xs md:text-sm text-muted-foreground'>
                                {transaction.category} •{' '}
                                {format(parseISO(transaction.date), 'MMM dd')}
                              </p>
                            </div>
                            <div className='text-left md:text-right'>
                              <p
                                className={`font-medium text-sm md:text-base ${
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
                        ))
                    )}
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
              storageKey={
                currentUser
                  ? `${storageKeys.BUDGETS}_${currentUser.id}`
                  : storageKeys.BUDGETS
              }
            />
          </TabsContent>

          <TabsContent value='goals'>
            <FinancialGoals
              totalBalance={monthlyData.netCashflow}
              storageKey={
                currentUser
                  ? `${storageKeys.FINANCIAL_GOALS}_${currentUser.id}`
                  : storageKeys.FINANCIAL_GOALS
              }
            />
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base md:text-lg lg:text-xl'>
                    Monthly Trend
                  </CardTitle>
                  <CardDescription className='text-sm'>
                    Cashflow trends over recent months
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-3 md:p-4 lg:p-6'>
                  <CashflowChart transactions={transactions} chartType='line' />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base md:text-lg lg:text-xl'>
                    Category Breakdown
                  </CardTitle>
                  <CardDescription className='text-sm'>
                    Expense distribution by category
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-3 md:p-4 lg:p-6'>
                  <CashflowChart
                    transactions={monthlyData.transactions}
                    chartType='pie'
                  />
                </CardContent>
              </Card>

              <Card className='lg:col-span-2'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base md:text-lg lg:text-xl'>
                    Financial Health Metrics
                  </CardTitle>
                  <CardDescription className='text-sm'>
                    Key indicators of your financial health
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-3 md:p-4 lg:p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4'>
                    <div className='text-center p-3 md:p-4 border rounded'>
                      <div className='text-lg md:text-xl lg:text-2xl font-bold text-blue-600'>
                        {monthlyData.income > 0
                          ? Math.round(
                              ((monthlyData.income - monthlyData.expenses) /
                                monthlyData.income) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      <p className='text-xs md:text-sm text-muted-foreground'>
                        Savings Rate
                      </p>
                    </div>
                    <div className='text-center p-3 md:p-4 border rounded'>
                      <div className='text-lg md:text-xl lg:text-2xl font-bold text-orange-600'>
                        {monthlyData.income > 0
                          ? Math.round(
                              (monthlyData.expenses / monthlyData.income) * 100
                            )
                          : 0}
                        %
                      </div>
                      <p className='text-xs md:text-sm text-muted-foreground'>
                        Expense Ratio
                      </p>
                    </div>
                    <div className='text-center p-3 md:p-4 border rounded'>
                      <div className='text-lg md:text-xl lg:text-2xl font-bold text-green-600'>
                        {monthlyData.transactions.length}
                      </div>
                      <p className='text-xs md:text-sm text-muted-foreground'>
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
