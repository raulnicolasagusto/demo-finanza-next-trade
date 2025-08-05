'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import DashboardLayout from '@/components/DashboardLayout';
import AddCreditCardModal from '@/components/AddCreditCardModal';
import { Wallet, CreditCard, Banknote, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface WalletCard {
  id: string;
  name: string;
  balance: number;
  type: 'efectivo' | 'tarjeta' | 'banco' | 'credito';
  currency: string;
  cardType?: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'ingreso' | 'gasto';
  date: string;
  wallet: string;
}

interface CreditCardData {
  creditCard_id: string;
  card_name: string;
  card_type: string;
  expense_amount_credit: string;
  payment_amount: string;
  createdAt: string;
}

export default function BilleteraPage() {
  const { isLoaded, userId } = useAuth();
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [creditCards, setCreditCards] = useState<CreditCardData[]>([]);
  
  // Wallets estáticos (efectivo, débito, banco)
  const [staticWallets] = useState<WalletCard[]>([
    {
      id: '1',
      name: 'Efectivo',
      balance: 15000,
      type: 'efectivo',
      currency: 'ARS'
    },
    {
      id: '2',
      name: 'Tarjeta de Débito',
      balance: 45000,
      type: 'tarjeta',
      currency: 'ARS'
    },
    {
      id: '3',
      name: 'Cuenta Bancaria',
      balance: 120000,
      type: 'banco',
      currency: 'ARS'
    }
  ]);

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      description: 'Compra en supermercado',
      amount: -2500,
      type: 'gasto',
      date: '2024-01-15',
      wallet: 'Tarjeta de Débito'
    },
    {
      id: '2',
      description: 'Transferencia recibida',
      amount: 10000,
      type: 'ingreso',
      date: '2024-01-14',
      wallet: 'Cuenta Bancaria'
    },
    {
      id: '3',
      description: 'Pago de servicios',
      amount: -3200,
      type: 'gasto',
      date: '2024-01-13',
      wallet: 'Cuenta Bancaria'
    }
  ];

  // Función para obtener tarjetas de crédito desde la API
  const fetchCreditCards = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/credit-cards');
      const result = await response.json();
      
      if (result.success) {
        setCreditCards(result.data);
      } else {
        console.error('Error al obtener tarjetas:', result.message);
        toast.error('Error al cargar las tarjetas de crédito');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión al cargar tarjetas');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar tarjetas al montar el componente
  useEffect(() => {
    if (isLoaded && userId) {
      fetchCreditCards();
    }
  }, [isLoaded, userId]);

  // Manejar nueva tarjeta agregada
  const handleAddCreditCard = (cardData: CreditCardData) => {
    setCreditCards(prev => [...prev, cardData]);
  };

  // Convertir tarjetas de crédito a formato WalletCard para mostrar
  const creditCardWallets: WalletCard[] = creditCards.map(card => ({
    id: card.creditCard_id,
    name: card.card_name,
    balance: parseFloat(card.payment_amount) - parseFloat(card.expense_amount_credit),
    type: 'credito' as const,
    currency: 'ARS',
    cardType: card.card_type
  }));

  // Combinar todas las wallets
  const allWallets = [...staticWallets, ...creditCardWallets];

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'efectivo':
        return <Banknote className="w-6 h-6" />;
      case 'tarjeta':
      case 'credito':
        return <CreditCard className="w-6 h-6" />;
      case 'banco':
        return <Wallet className="w-6 h-6" />;
      default:
        return <Wallet className="w-6 h-6" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const totalBalance = allWallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  // Mostrar loading si aún no se cargaron los datos
  if (!isLoaded || isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Billetera</h1>
          <button
            onClick={() => setIsAddCardModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar tarjeta de Crédito
          </button>
        </div>

        {/* Balance Total */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
          <h2 className="text-lg font-medium mb-2">Balance Total</h2>
          <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
        </div>

        {/* Grid de Tarjetas/Cuentas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {allWallets.map((wallet) => (
            <div key={wallet.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
                    {getWalletIcon(wallet.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{wallet.name}</h3>
                    {wallet.cardType && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{wallet.cardType}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(wallet.balance)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{wallet.currency}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Transacciones Recientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transacciones Recientes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'ingreso' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'ingreso' ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.wallet} • {transaction.date}</p>
                    </div>
                  </div>
                  <div className={`text-right ${
                    transaction.type === 'ingreso' 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    <p className="font-semibold">
                      {transaction.type === 'ingreso' ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar tarjeta de crédito */}
      <AddCreditCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onAdd={handleAddCreditCard}
      />
    </DashboardLayout>
  );
}