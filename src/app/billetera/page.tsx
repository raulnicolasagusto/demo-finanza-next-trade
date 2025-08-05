'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AddCreditCardModal from '@/components/AddCreditCardModal';
import { Wallet, CreditCard, Banknote, TrendingUp, TrendingDown, Plus } from 'lucide-react';

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
  name: string;
  type: string;
}

export default function BilleteraPage() {
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [wallets, setWallets] = useState<WalletCard[]>([
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

  const handleAddCreditCard = (cardData: CreditCardData) => {
    const newCard: WalletCard = {
      id: Date.now().toString(),
      name: cardData.name,
      balance: 0,
      type: 'credito',
      currency: 'ARS',
      cardType: cardData.type
    };
    setWallets([...wallets, newCard]);
  };

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

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Billetera</h1>
            <p className="text-gray-600 dark:text-gray-400">Gestiona tus cuentas y saldos</p>
          </div>
          <button
            onClick={() => setIsAddCardModalOpen(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar tarjeta de Crédito</span>
          </button>
        </div>

        {/* Balance Total */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Balance Total</p>
              <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Tarjetas de Billetera */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mis Cuentas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400">
                      {getWalletIcon(wallet.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{wallet.name}</h3>
                      {wallet.cardType && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{wallet.cardType}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(wallet.balance)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {wallet.type === 'credito' ? 'Tarjeta de Crédito' : wallet.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transacciones Recientes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transacciones Recientes</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'ingreso' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'ingreso' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
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