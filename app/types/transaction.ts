export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: TransactionType
  category: string
  isRecurring?: boolean
  recurringFrequency?: 'monthly' | 'weekly' | 'yearly'
  tags?: string[]
}

export interface Budget {
  id: string
  category: string
  monthlyLimit: number
  spent: number
  month: string
}

export interface FinancialGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  description?: string
}
