'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2, Edit, Utensils, ShoppingCart, Truck, CreditCard, Gem, Banknote, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface Expense {
  expense_id: string;
  expense_name: string;
  expense_amount: string;
  expense_category: 'Comida' | 'Super Mercado' | 'Delivery';
  payment_method: 'Debito' | 'Credito' | 'Efectivo';
  createdAt: string;
}

interface Income {
  income_id: string;
  income_amount: string;
  income_type: 'Sueldo' | 'Honorarios' | 'Ventas' | 'Rentas' | 'Otros Ingresos';
  income_note: string;
  createdAt: string;
}

type Transaction = {
  id: string;
  type: 'expense' | 'income';
  name: string;
  amount: string;
  category?: string;
  paymentMethod?: string;
  note?: string;
  createdAt: string;
  originalData: Expense | Income;
};

interface ExpensesTableProps {
  refreshTrigger?: number;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 50, 'all'] as const;
type ItemsPerPageOption = typeof ITEMS_PER_PAGE_OPTIONS[number];

export default function ExpensesTable({ refreshTrigger }: ExpensesTableProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<ItemsPerPageOption>(5);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);

  // Función para convertir gastos e ingresos a transacciones
  const combineTransactions = (expenses: Expense[], incomes: Income[]): Transaction[] => {
    const expenseTransactions: Transaction[] = expenses.map(expense => ({
      id: expense.expense_id,
      type: 'expense' as const,
      name: expense.expense_name,
      amount: expense.expense_amount,
      category: expense.expense_category,
      paymentMethod: expense.payment_method,
      createdAt: expense.createdAt,
      originalData: expense
    }));

    const incomeTransactions: Transaction[] = incomes.map(income => ({
      id: income.income_id,
      type: 'income' as const,
      name: income.income_type,
      amount: income.income_amount,
      note: income.income_note,
      createdAt: income.createdAt,
      originalData: income
    }));

    // Combinar y ordenar por fecha (más recientes primero)
    return [...expenseTransactions, ...incomeTransactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/expenses');
      const result = await response.json();
      
      if (result.success) {
        setExpenses(result.data);
      } else {
        setError(result.message || 'Error al cargar los gastos');
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Error de conexión al cargar los gastos');
    } finally {
      setLoading(false);
    }
  };

  // Fetch incomes from API
  const fetchIncomes = async () => {
    try {
      const response = await fetch('/api/incomes');
      const result = await response.json();
      
      if (result.success) {
        setIncomes(result.data);
      } else {
        console.error('Error al cargar los ingresos:', result.message);
      }
    } catch (err) {
      console.error('Error fetching incomes:', err);
    }
  };

  // Fetch all data (expenses and incomes)
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([fetchExpenses(), fetchIncomes()]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error de conexión al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refresh when trigger changes
  useEffect(() => {
    fetchAllData();
  }, [refreshTrigger]);

  // Combine transactions when expenses or incomes change
  useEffect(() => {
    const combinedTransactions = combineTransactions(expenses, incomes);
    setTransactions(combinedTransactions);
  }, [expenses, incomes]);

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return transactions;
    
    const searchLower = searchTerm.toLowerCase();
    return transactions.filter(transaction => {
      const date = new Date(transaction.createdAt).toLocaleDateString('es-ES');
      return (
        transaction.name.toLowerCase().includes(searchLower) ||
        (transaction.amount || '').toLowerCase().includes(searchLower) ||
        (transaction.category || '').toLowerCase().includes(searchLower) ||
        (transaction.paymentMethod || '').toLowerCase().includes(searchLower) ||
        (transaction.note || '').toLowerCase().includes(searchLower) ||
        date.includes(searchLower)
      );
    });
  }, [transactions, searchTerm]);

  // Pagination logic
  const totalItems = filteredTransactions.length;
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(totalItems / (itemsPerPage as number));
  
  const paginatedTransactions = useMemo(() => {
    if (itemsPerPage === 'all') return filteredTransactions;
    
    const startIndex = (currentPage - 1) * (itemsPerPage as number);
    const endIndex = startIndex + (itemsPerPage as number);
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  // Reset to first page when search term or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Comida': return <Utensils className="w-5 h-5 text-orange-600" />;
      case 'Super Mercado': return <ShoppingCart className="w-5 h-5 text-green-600" />;
      case 'Delivery': return <Truck className="w-5 h-5 text-blue-600" />;
      default: return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  // Get payment method icon
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'Debito': return <CreditCard className="w-5 h-5 text-blue-700" />;
      case 'Credito': return <Gem className="w-5 h-5 text-purple-600" />;
      case 'Efectivo': return <Banknote className="w-5 h-5 text-green-700" />;
      default: return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  // Función para eliminar gasto
  const handleDeleteExpense = async (expense_id: string, expense_name: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el gasto "${expense_name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingTransactionId(expense_id);

    try {
      const response = await fetch(`/api/expenses?expense_id=${expense_id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Gasto eliminado exitosamente');
        // Actualizar la lista de gastos
        fetchAllData();
      } else {
        toast.error(result.message || 'Error al eliminar el gasto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión. Intenta nuevamente.');
    } finally {
      setDeletingTransactionId(null);
    }
  };

  // Función para eliminar ingreso
  const handleDeleteIncome = async (income_id: string, income_type: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el ingreso "${income_type}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingTransactionId(income_id);

    try {
      const response = await fetch(`/api/incomes?income_id=${income_id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Ingreso eliminado exitosamente');
        // Actualizar la lista de datos
        fetchAllData();
      } else {
        toast.error(result.message || 'Error al eliminar el ingreso');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión. Intenta nuevamente.');
    } finally {
      setDeletingTransactionId(null);
    }
  };

  // Función para editar gasto (placeholder)
  const handleEditExpense = (expense_id: string) => {
    toast.success('Función de editar gasto próximamente disponible');
    console.log('Editar gasto:', expense_id);
  };

  // Función para editar ingreso (placeholder)
  const handleEditIncome = (income_id: string) => {
    toast.success('Función de editar ingreso próximamente disponible');
    console.log('Editar ingreso:', income_id);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Cargando transacciones...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">❌ {error}</p>
            <button 
              onClick={fetchAllData}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Search and Controls */}
      <div className="mb-6">
        <div className="flex items-center gap-4 justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(e.target.value as ItemsPerPageOption)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'Todos' : option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-3 w-3" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-40 transition-colors duration-300"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No se encontraron transacciones que coincidan con tu búsqueda' : 'No hay transacciones registradas aún'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-blue-600 hover:text-blue-700 underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Movimiento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Monto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Categoría</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Método de Pago</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{transaction.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`font-semibold ${
                        transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ${transaction.amount}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {transaction.type === 'expense' ? (
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(transaction.category!)}
                          <span className="text-gray-700 dark:text-gray-300">{transaction.category}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {transaction.type === 'expense' ? (
                        <div className="flex items-center space-x-2">
                          {getPaymentIcon(transaction.paymentMethod!)}
                          <span className="text-gray-700 dark:text-gray-300">{transaction.paymentMethod}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{formatDate(transaction.createdAt)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {/* Botón Editar */}
                        <button
                          onClick={() => transaction.type === 'expense' 
                            ? handleEditExpense(transaction.id) 
                            : handleEditIncome(transaction.id)
                          }
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title={`Editar ${transaction.type === 'expense' ? 'gasto' : 'ingreso'}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => transaction.type === 'expense'
                            ? handleDeleteExpense(transaction.id, transaction.name)
                            : handleDeleteIncome(transaction.id, transaction.name)
                          }
                          disabled={deletingTransactionId === transaction.id}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={`Eliminar ${transaction.type === 'expense' ? 'gasto' : 'ingreso'}`}
                        >
                          {deletingTransactionId === transaction.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {itemsPerPage !== 'all' && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {((currentPage - 1) * (itemsPerPage as number)) + 1} a {Math.min(currentPage * (itemsPerPage as number), totalItems)} de {totalItems} transacciones
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-0.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-blue-600" />
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-0.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}