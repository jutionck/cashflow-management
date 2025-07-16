import { useMemo } from 'react';
import {
  format,
  parseISO,
  startOfMonth,
  eachMonthOfInterval,
  endOfMonth,
} from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { Transaction } from '../types/transaction';
import { formatIDR } from '../utils/currency';

interface CashflowChartProps {
  transactions: Transaction[];
  chartType?: 'bar' | 'line' | 'pie';
}

export default function CashflowChart({
  transactions,
  chartType = 'bar',
}: CashflowChartProps) {
  const chartData = useMemo(() => {
    if (transactions.length === 0) return [];

    const dates = transactions.map((t) => parseISO(t.date));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const months = eachMonthOfInterval({
      start: startOfMonth(minDate),
      end: endOfMonth(maxDate),
    });

    return months.map((month) => {
      const monthTransactions = transactions.filter((t) => {
        const transactionDate = parseISO(t.date);
        return (
          transactionDate >= startOfMonth(month) &&
          transactionDate <= endOfMonth(month)
        );
      });

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        income,
        expenses,
        net: income - expenses,
      };
    });
  }, [transactions]);

  const generateColor = (category: string) => {
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const categoryData = useMemo(() => {
    const expensesByCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
      fill: generateColor(category),
    }));
  }, [transactions]);

  const chartConfig = {
    income: {
      label: 'Income',
      color: 'hsl(142, 71%, 45%)',
    },
    expenses: {
      label: 'Expenses',
      color: 'hsl(0, 72%, 51%)',
    },
    net: {
      label: 'Net Cashflow',
      color: 'hsl(221, 83%, 53%)',
    },
  };

  if (chartData.length === 0 && categoryData.length === 0) {
    return (
      <div className='h-[300px] flex items-center justify-center text-muted-foreground'>
        No data to display
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ChartContainer config={chartConfig} className='min-h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis tickFormatter={(value) => formatIDR(value)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey='income'
                  stroke='var(--color-income)'
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-income)' }}
                />
                <Line
                  dataKey='expenses'
                  stroke='var(--color-expenses)'
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-expenses)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      case 'pie':
        return (
          <ChartContainer config={chartConfig} className='min-h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={categoryData}
                  dataKey='amount'
                  nameKey='category'
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  label={(entry) => entry.category}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        );

      default:
        return (
          <ChartContainer config={chartConfig} className='min-h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis tickFormatter={(value) => formatIDR(value)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey='income'
                  fill='var(--color-income)'
                  name='Income'
                />
                <Bar
                  dataKey='expenses'
                  fill='var(--color-expenses)'
                  name='Expenses'
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
    }
  };

  return <div className='h-[300px]'>{renderChart()}</div>;
}
