'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { X, Calendar, CreditCard, Tag, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface CreditCardExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditCardId: string;
  creditCardName: string;
}

interface ExpenseDetail {
  id: string;
  expense_name: string;
  expense_amount: number;
  expense_category: string;
  installment_quantity: number;
  createdAt: string;
}

interface ExpensesResponse {
  success: boolean;
  data: {
    creditCardId: string;
    totalExpenses: number;
    expenseCount: number;
    expenses: ExpenseDetail[];
  };
}

export default function CreditCardExpensesModal({ 
  isOpen, 
  onClose, 
  creditCardId, 
  creditCardName 
}: CreditCardExpensesModalProps) {
  const { isLoaded, userId } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseDetail[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener el color de la categoría
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Comida': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Super Mercado': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Delivery': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  // Función para cargar los gastos detallados
  const fetchExpenseDetails = async () => {
    if (!isLoaded || !userId || !creditCardId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/expenses/by-credit-card/${creditCardId}/details`);
      const result: ExpensesResponse = await response.json();

      if (result.success) {
        setExpenses(result.data.expenses);
        setTotalExpenses(result.data.totalExpenses);
      } else {
        toast.error('Error al cargar los gastos');
      }
    } catch (error) {
      console.error('Error al cargar gastos:', error);
      toast.error('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar gastos cuando se abre el modal
  useEffect(() => {
    if (isOpen && creditCardId) {
      fetchExpenseDetails();
    }
  }, [isOpen, creditCardId, isLoaded, userId]);

  // Limpiar datos cuando se cierra el modal
  const handleClose = () => {
    setExpenses([]);
    setTotalExpenses(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden transition-colors duration-300"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Gastos de {creditCardName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total: {formatCurrency(totalExpenses)}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh]">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando gastos...</span>
                </div>
              ) : expenses.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No hay gastos registrados para esta tarjeta</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                            {expense.expense_name}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.expense_category)}`}>
                                {expense.expense_category}
                              </span>
                            </div>
                            
                            {expense.installment_quantity > 1 && (
                              <div className="flex items-center gap-1">
                                <Hash className="w-4 h-4" />
                                <span>{expense.installment_quantity} cuotas</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(expense.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                            {formatCurrency(expense.expense_amount)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {expenses.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {expenses.length} gasto{expenses.length !== 1 ? 's' : ''} registrado{expenses.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total: {formatCurrency(totalExpenses)}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}