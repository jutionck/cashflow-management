import { useState } from 'react';
import {
  Upload,
  Download,
  FileText,
  X,
  Check,
  Database,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import type { Transaction } from '../types/transaction';
import {
  exportAllData,
  importAllData,
  clearAllData,
} from '../hooks/use-local-storage';

interface ImportExportProps {
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
  onExport: () => void;
}

export default function ImportExport({
  transactions,
  onImport,
  onExport,
}: ImportExportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<Transaction[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      parseCSV(csv);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csv: string) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

    const errors: string[] = [];
    const preview: Transaction[] = [];

    const requiredHeaders = [
      'date',
      'description',
      'type',
      'category',
      'amount',
    ];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      errors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
      setImportErrors(errors);
      return;
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map((v) => v.trim());

      try {
        const transaction: Transaction = {
          id: `import-${Date.now()}-${i}`,
          date: values[headers.indexOf('date')],
          description: values[headers.indexOf('description')],
          type: values[headers.indexOf('type')] as 'income' | 'expense',
          category: values[headers.indexOf('category')],
          amount: Number.parseFloat(values[headers.indexOf('amount')]),
        };

        if (
          !transaction.date ||
          !transaction.description ||
          !transaction.type ||
          !transaction.category ||
          !transaction.amount
        ) {
          errors.push(`Row ${i + 1}: Missing required data`);
          continue;
        }

        if (!['income', 'expense'].includes(transaction.type)) {
          errors.push(`Row ${i + 1}: Type must be 'income' or 'expense'`);
          continue;
        }

        if (transaction.amount <= 0) {
          errors.push(`Row ${i + 1}: Amount must be positive`);
          continue;
        }

        const dateTest = new Date(transaction.date);
        if (isNaN(dateTest.getTime())) {
          errors.push(`Row ${i + 1}: Invalid date format`);
          continue;
        }

        preview.push(transaction);
      } catch (error) {
        errors.push(`Row ${i + 1}: Failed to parse data`);
      }
    }

    setImportPreview(preview);
    setImportErrors(errors);
    setIsImporting(true);
  };

  const confirmImport = () => {
    onImport(importPreview);
    setIsImporting(false);
    setImportPreview([]);
    setImportErrors([]);
  };

  const cancelImport = () => {
    setIsImporting(false);
    setImportPreview([]);
    setImportErrors([]);
  };

  const generateTemplate = () => {
    const template = [
      ['Date', 'Description', 'Type', 'Category', 'Amount'],
      ['2024-01-15', 'Sample Income', 'income', 'Gaji', '5000000'],
      ['2024-01-16', 'Sample Expense', 'expense', 'Makanan', '150000'],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cashflow-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFullBackup = () => {
    const allData = exportAllData();
    if (allData) {
      const blob = new Blob([JSON.stringify(allData, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cashflow-backup-${
        new Date().toISOString().split('T')[0]
      }.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleFullRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const success = importAllData(data);
        if (success) {
          alert('Data berhasil dipulihkan! Halaman akan dimuat ulang.');
          window.location.reload();
        } else {
          alert('Gagal memulihkan data. Pastikan file backup valid.');
        }
      } catch (error) {
        alert('File backup tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (
      window.confirm(
        'PERINGATAN: Ini akan menghapus SEMUA data (transaksi, anggaran, tujuan keuangan). Tindakan ini tidak dapat dibatalkan. Lanjutkan?'
      )
    ) {
      clearAllData();
      alert('Semua data telah dihapus. Halaman akan dimuat ulang.');
      window.location.reload();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            Import & Export
          </CardTitle>
          <CardDescription>
            Import transactions from CSV or export your data
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-3'>
              <h4 className='font-medium'>Import Transactions</h4>
              <div className='space-y-2'>
                <Label htmlFor='csv-upload' className='cursor-pointer'>
                  <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors'>
                    <Upload className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
                    <p className='text-sm font-medium'>
                      Click to upload CSV file
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Supports Date, Description, Type, Category, Amount
                    </p>
                  </div>
                  <input
                    id='csv-upload'
                    type='file'
                    accept='.csv'
                    onChange={handleFileUpload}
                    className='hidden'
                  />
                </Label>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={generateTemplate}
                  className='w-full'
                >
                  Download Template
                </Button>
              </div>
            </div>

            <div className='space-y-3'>
              <h4 className='font-medium'>Export Transactions</h4>
              <div className='space-y-2'>
                <div className='border rounded-lg p-4 text-center'>
                  <Download className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
                  <p className='text-sm font-medium mb-2'>Export to CSV</p>
                  <p className='text-xs text-muted-foreground mb-3'>
                    {transactions.length} transactions ready to export
                  </p>
                  <Button onClick={onExport} className='w-full'>
                    <Download className='mr-2 h-4 w-4' />
                    Export CSV
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className='space-y-4'>
            <h4 className='font-medium flex items-center gap-2'>
              <Database className='h-4 w-4' />
              Data Backup & Restore
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <h5 className='text-sm font-medium'>Full Backup</h5>
                <div className='border rounded-lg p-4 text-center'>
                  <Database className='h-6 w-6 mx-auto mb-2 text-green-600' />
                  <p className='text-xs text-muted-foreground mb-3'>
                    Backup all data (transactions, budgets, goals)
                  </p>
                  <Button
                    onClick={handleFullBackup}
                    variant='outline'
                    size='sm'
                    className='w-full'
                  >
                    <Download className='mr-2 h-3 w-3' />
                    Backup All Data
                  </Button>
                </div>
              </div>

              <div className='space-y-2'>
                <h5 className='text-sm font-medium'>Full Restore</h5>
                <div className='border rounded-lg p-4 text-center'>
                  <RefreshCw className='h-6 w-6 mx-auto mb-2 text-blue-600' />
                  <p className='text-xs text-muted-foreground mb-3'>
                    Restore all data from backup file
                  </p>
                  <Label htmlFor='backup-restore' className='cursor-pointer'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full'
                      asChild
                    >
                      <span>
                        <Upload className='mr-2 h-3 w-3' />
                        Restore Data
                      </span>
                    </Button>
                    <input
                      id='backup-restore'
                      type='file'
                      accept='.json'
                      onChange={handleFullRestore}
                      className='hidden'
                    />
                  </Label>
                </div>
              </div>

              <div className='space-y-2'>
                <h5 className='text-sm font-medium'>Reset Data</h5>
                <div className='border rounded-lg p-4 text-center border-red-200'>
                  <X className='h-6 w-6 mx-auto mb-2 text-red-600' />
                  <p className='text-xs text-muted-foreground mb-3'>
                    Clear all data (cannot be undone)
                  </p>
                  <Button
                    onClick={handleClearAllData}
                    variant='destructive'
                    size='sm'
                    className='w-full'
                  >
                    <X className='mr-2 h-3 w-3' />
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className='pt-4 border-t'>
            <h4 className='font-medium mb-3'>Current Data</h4>
            <div className='grid grid-cols-3 gap-4 text-center'>
              <div>
                <div className='text-2xl font-bold text-blue-600'>
                  {transactions.length}
                </div>
                <div className='text-sm text-muted-foreground'>
                  Total Transactions
                </div>
              </div>
              <div>
                <div className='text-2xl font-bold text-green-600'>
                  {transactions.filter((t) => t.type === 'income').length}
                </div>
                <div className='text-sm text-muted-foreground'>
                  Income Entries
                </div>
              </div>
              <div>
                <div className='text-2xl font-bold text-red-600'>
                  {transactions.filter((t) => t.type === 'expense').length}
                </div>
                <div className='text-sm text-muted-foreground'>
                  Expense Entries
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isImporting && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <Card className='w-full max-w-4xl max-h-[90vh] overflow-hidden'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Import Preview</CardTitle>
                  <CardDescription>
                    Review {importPreview.length} transactions before importing
                  </CardDescription>
                </div>
                <Button variant='ghost' size='sm' onClick={cancelImport}>
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {importErrors.length > 0 && (
                <div className='border border-red-200 bg-red-50 rounded-lg p-4'>
                  <h4 className='font-medium text-red-800 mb-2'>
                    Import Errors:
                  </h4>
                  <ul className='text-sm text-red-700 space-y-1'>
                    {importErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {importPreview.length > 0 && (
                <div className='border rounded-lg overflow-hidden'>
                  <div className='max-h-60 overflow-y-auto'>
                    <table className='w-full text-sm'>
                      <thead className='bg-muted'>
                        <tr>
                          <th className='text-left p-2'>Date</th>
                          <th className='text-left p-2'>Description</th>
                          <th className='text-left p-2'>Type</th>
                          <th className='text-left p-2'>Category</th>
                          <th className='text-right p-2'>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview
                          .slice(0, 10)
                          .map((transaction, index) => (
                            <tr key={index} className='border-t'>
                              <td className='p-2'>{transaction.date}</td>
                              <td className='p-2'>{transaction.description}</td>
                              <td className='p-2'>
                                <Badge
                                  variant={
                                    transaction.type === 'income'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                >
                                  {transaction.type}
                                </Badge>
                              </td>
                              <td className='p-2'>{transaction.category}</td>
                              <td className='p-2 text-right font-mono'>
                                {transaction.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {importPreview.length > 10 && (
                      <div className='p-2 text-center text-sm text-muted-foreground border-t'>
                        ... and {importPreview.length - 10} more transactions
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className='flex gap-3 pt-4'>
                <Button
                  variant='outline'
                  onClick={cancelImport}
                  className='flex-1'
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmImport}
                  disabled={
                    importPreview.length === 0 || importErrors.length > 0
                  }
                  className='flex-1'
                >
                  <Check className='mr-2 h-4 w-4' />
                  Import {importPreview.length} Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
