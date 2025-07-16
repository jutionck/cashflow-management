import { useState } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Plus, Target, Calendar, TrendingUp, X } from 'lucide-react';

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
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import type { FinancialGoal } from '../types/transaction';
import { formatIDR } from '../utils/currency';
import { useLocalStorage, storageKeys } from '../hooks/use-local-storage';

interface FinancialGoalsProps {
  totalBalance: number;
}

const goalCategories = [
  'Emergency Fund',
  'Vacation',
  'House Down Payment',
  'Car',
  'Education',
  'Investment',
  'Retirement',
  'Other',
];

export default function FinancialGoals({ totalBalance }: FinancialGoalsProps) {
  const initialGoals: FinancialGoal[] = [
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 50000000,
      currentAmount: 15000000,
      deadline: '2024-12-31',
      category: 'Emergency Fund',
      description: '6 months of expenses',
    },
    {
      id: '2',
      title: 'Vacation to Japan',
      targetAmount: 25000000,
      currentAmount: 8000000,
      deadline: '2024-06-15',
      category: 'Vacation',
      description: 'Family trip to Japan',
    },
  ];

  const [goals, setGoals] = useLocalStorage<FinancialGoal[]>(
    storageKeys.FINANCIAL_GOALS,
    initialGoals
  );

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: new Date(),
    category: '',
    description: '',
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGoal.title || !newGoal.targetAmount || !newGoal.category) return;

    const goal: FinancialGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: Number.parseFloat(newGoal.targetAmount),
      currentAmount: Number.parseFloat(newGoal.currentAmount || '0'),
      deadline: format(newGoal.deadline, 'yyyy-MM-dd'),
      category: newGoal.category,
      description: newGoal.description,
    };

    setGoals((prev) => [...prev, goal]);
    setNewGoal({
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: new Date(),
      category: '',
      description: '',
    });
    setShowGoalForm(false);
  };

  const handleUpdateGoalProgress = (goalId: string, amount: string) => {
    const newAmount = Number.parseFloat(amount || '0');
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, currentAmount: newAmount } : goal
      )
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  };

  const getGoalStatus = (goal: FinancialGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const daysLeft = differenceInDays(parseISO(goal.deadline), new Date());
    const isOverdue = daysLeft < 0;
    const isNearDeadline = daysLeft <= 30 && daysLeft >= 0;
    const isCompleted = progress >= 100;

    return {
      progress,
      daysLeft: Math.abs(daysLeft),
      isOverdue,
      isNearDeadline,
      isCompleted,
    };
  };

  const totalGoalTarget = goals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );
  const totalGoalProgress = goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );
  const overallProgress =
    totalGoalTarget > 0 ? (totalGoalProgress / totalGoalTarget) * 100 : 0;

  return (
    <div className='space-y-4 lg:space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Goals</CardTitle>
            <Target className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-lg md:text-xl lg:text-2xl font-bold text-blue-600'>
              {goals.length}
            </div>
            <p className='text-xs text-muted-foreground'>
              Active financial goals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Target</CardTitle>
            <TrendingUp className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-lg md:text-xl lg:text-2xl font-bold text-green-600'>
              {formatIDR(totalGoalTarget)}
            </div>
            <p className='text-xs text-muted-foreground'>
              Combined goal targets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Overall Progress
            </CardTitle>
            <Calendar className='h-4 w-4 text-purple-600' />
          </CardHeader>
          <CardContent>
            <div className='text-lg md:text-xl lg:text-2xl font-bold text-purple-600'>
              {overallProgress.toFixed(1)}%
            </div>
            <p className='text-xs text-muted-foreground'>
              {formatIDR(totalGoalProgress)} saved
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0'>
        <h3 className='text-base md:text-lg lg:text-xl font-semibold'>
          Financial Goals
        </h3>
        <Button
          onClick={() => setShowGoalForm(true)}
          className='w-full md:w-auto'
        >
          <Plus className='mr-2 h-4 w-4' />
          <span className='hidden md:inline'>Add Goal</span>
          <span className='md:hidden'>Tambah Tujuan</span>
        </Button>
      </div>

      <div className='grid gap-4'>
        {goals.map((goal) => {
          const status = getGoalStatus(goal);
          return (
            <Card
              key={goal.id}
              className={
                status.isCompleted
                  ? 'border-green-200 bg-green-50'
                  : status.isOverdue
                  ? 'border-red-200 bg-red-50'
                  : status.isNearDeadline
                  ? 'border-yellow-200 bg-yellow-50'
                  : ''
              }
            >
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg'>{goal.title}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>{goal.category}</Badge>
                    {status.isCompleted && (
                      <Badge variant='default' className='bg-green-600'>
                        Completed
                      </Badge>
                    )}
                    {status.isOverdue && !status.isCompleted && (
                      <Badge variant='destructive'>Overdue</Badge>
                    )}
                    {status.isNearDeadline &&
                      !status.isCompleted &&
                      !status.isOverdue && (
                        <Badge variant='secondary'>Due Soon</Badge>
                      )}
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDeleteGoal(goal.id)}
                      className='text-red-600 hover:text-red-700'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Progress
                  </span>
                  <span className='text-sm font-medium'>
                    {formatIDR(goal.currentAmount)} /{' '}
                    {formatIDR(goal.targetAmount)}
                  </span>
                </div>

                <div className='w-full bg-gray-200 rounded-full h-3'>
                  <div
                    className={`h-3 rounded-full ${
                      status.isCompleted
                        ? 'bg-green-600'
                        : status.isOverdue
                        ? 'bg-red-600'
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(100, status.progress)}%` }}
                  />
                </div>

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-muted-foreground'>
                    {status.progress.toFixed(1)}% completed
                  </span>
                  <span className='text-muted-foreground'>
                    {status.isOverdue ? 'Overdue by' : 'Due in'}{' '}
                    {status.daysLeft} days
                  </span>
                </div>

                <div className='flex gap-2'>
                  <Input
                    type='number'
                    placeholder='Update amount'
                    defaultValue={goal.currentAmount}
                    onChange={(e) =>
                      handleUpdateGoalProgress(goal.id, e.target.value)
                    }
                    className='flex-1'
                  />
                  <span className='text-sm text-muted-foreground flex items-center'>
                    Deadline: {format(parseISO(goal.deadline), 'MMM dd, yyyy')}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showGoalForm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <Card className='w-full max-w-md max-h-[90vh] overflow-y-auto'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Add Financial Goal</CardTitle>
                  <CardDescription>Set a new financial target</CardDescription>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowGoalForm(false)}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddGoal} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Goal Title</Label>
                  <Input
                    id='title'
                    type='text'
                    placeholder='e.g., Emergency Fund'
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='category'>Category</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value) =>
                      setNewGoal((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      {goalCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='target'>Target Amount (IDR)</Label>
                  <Input
                    id='target'
                    type='number'
                    placeholder='0'
                    min='0'
                    step='100000'
                    value={newGoal.targetAmount}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        targetAmount: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='current'>Current Amount (IDR)</Label>
                  <Input
                    id='current'
                    type='number'
                    placeholder='0'
                    min='0'
                    step='10000'
                    value={newGoal.currentAmount}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        currentAmount: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='deadline'>Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full justify-start text-left font-normal'
                      >
                        <Calendar className='mr-2 h-4 w-4' />
                        {format(newGoal.deadline, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <CalendarComponent
                        mode='single'
                        selected={newGoal.deadline}
                        onSelect={(date) =>
                          date &&
                          setNewGoal((prev) => ({ ...prev, deadline: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>Description (optional)</Label>
                  <Input
                    id='description'
                    type='text'
                    placeholder='e.g., 6 months of expenses'
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className='flex gap-3 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowGoalForm(false)}
                    className='flex-1'
                  >
                    Cancel
                  </Button>
                  <Button type='submit' className='flex-1'>
                    Add Goal
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
