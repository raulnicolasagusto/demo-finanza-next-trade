'use client';

import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AddExpenseModal from '@/components/AddExpenseModal';
import AddIncomeModal from '@/components/AddIncomeModal';
import ExpensesTable from '@/components/ExpensesTable';

interface ExpenseData {
  name: string;
  amount: string;
  category: string;
  paymentMethod: string;
}

interface IncomeData {
  amount: string;
  type: string;
  note: string;
}

export default function Transacciones() {
  const { userId, isLoaded } = useAuth();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [incomes, setIncomes] = useState<IncomeData[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    redirect('/sign-in');
  }

  const handleAddExpense = (expense: ExpenseData) => {
    setExpenses([...expenses, expense]);
    setRefreshTrigger(prev => prev + 1);
    console.log('Nuevo gasto agregado:', expense);
  };

  const handleAddIncome = (income: IncomeData) => {
    setIncomes([...incomes, income]);
    setRefreshTrigger(prev => prev + 1);
    console.log('Nuevo ingreso agregado:', income);
  };

  const handleExpenseUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout onExpenseUpdate={handleExpenseUpdate}>
      {/* Action Buttons */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          Agregar Gasto
        </button>
        <button
          onClick={() => setIsIncomeModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          Agregar Ingreso
        </button>
      </div>

      {/* Expenses Table */}
      <ExpensesTable refreshTrigger={refreshTrigger} />

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onAdd={handleAddExpense}
      />

      {/* Add Income Modal */}
      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onAdd={handleAddIncome}
      />
    </DashboardLayout>
  );
}