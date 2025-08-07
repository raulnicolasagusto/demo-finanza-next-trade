'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: ExpenseData) => void;
}

interface ExpenseData {
  name: string;
  amount: string;
  category: string;
  paymentMethod: string;
}

interface CreditCardData {
  creditCard_id: string;
  card_name: string;
  card_type: string;
  expense_amount_credit: string;
  payment_amount: string;
  createdAt: string;
}

const categories = ['Comida', 'Super Mercado', 'Delivery'];
const paymentMethods = ['Debito', 'Credito', 'Efectivo'];



export default function AddExpenseModal({ isOpen, onClose, onAdd }: AddExpenseModalProps) {
  const { isLoaded, userId } = useAuth();
  const [formData, setFormData] = useState<ExpenseData>({
    name: '',
    amount: '',
    category: categories[0],
    paymentMethod: paymentMethods[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para el formulario de compartir gasto
  const [isShared, setIsShared] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  
  // Estados para tarjetas de crédito
  const [creditCards, setCreditCards] = useState<CreditCardData[]>([]);
  const [selectedCreditCard, setSelectedCreditCard] = useState('');
  const [installments, setInstallments] = useState('1');
  const [loadingCreditCards, setLoadingCreditCards] = useState(false);

  // Función para obtener tarjetas de crédito
  const fetchCreditCards = async () => {
    if (!userId) return;
    
    try {
      setLoadingCreditCards(true);
      const response = await fetch('/api/credit-cards');
      const result = await response.json();
      
      if (result.success) {
        setCreditCards(result.data);
      } else {
        console.error('Error al obtener tarjetas:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingCreditCards(false);
    }
  };

  // Cargar tarjetas cuando se abre el modal y el usuario está autenticado
  useEffect(() => {
    if (isOpen && isLoaded && userId) {
      fetchCreditCards();
    }
  }, [isOpen, isLoaded, userId]);

  // Resetear campos de crédito cuando cambia el método de pago
  useEffect(() => {
    if (formData.paymentMethod !== 'Credito') {
      setSelectedCreditCard('');
      setInstallments('1');
    }
  }, [formData.paymentMethod]);

  // Generar opciones de cuotas (1 a 48)
  const installmentOptions = Array.from({ length: 48 }, (_, i) => i + 1);

  // Validación para el nombre del gasto
  const isNameValid = formData.name.length <= 40;
  
  // Validación para el monto del gasto (máximo 10 números)
  const getNumericLength = (value: string) => {
    return value.replace(/[^\d]/g, '').length;
  };
  const isAmountValid = getNumericLength(formData.amount) <= 10;
  // Función para formatear el monto con puntos
  const formatAmount = (value: string) => {
    // Remover todo excepto números y puntos
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Dividir en parte entera y decimal
    const parts = numericValue.split('.');
    
    // Limitar a máximo 2 decimales
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
    }
    
    // Reunir las partes
    return parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAmount(e.target.value);
    setFormData({ ...formData, amount: formattedValue });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.name.trim()) {
    toast.error('El nombre del gasto es requerido');
    return;
  }

  if (!formData.amount.trim()) {
    toast.error('El monto del gasto es requerido');
    return;
  }

  // Validación para gastos compartidos
  if (isShared && !recipientEmail.trim()) {
    toast.error('El email del destinatario es requerido para gastos compartidos');
    return;
  }

  setIsLoading(true);

  try {
    // Decidir endpoint y datos según si es compartido o no
    const endpoint = isShared ? '/api/shared-expenses/invite' : '/api/expenses';
    
    // DEBUG: Agregar logs temporales
    console.log('Payment Method:', formData.paymentMethod);
    console.log('Installments value:', installments);
    console.log('Installments parsed:', parseInt(installments));
    
    const requestBody = isShared ? {
      recipient_email: recipientEmail,
      expense_data: {
        expense_name: formData.name,
        expense_amount: formData.amount,
        expense_category: formData.category,
        payment_method: formData.paymentMethod,
        ...(formData.paymentMethod === 'Credito' && installments && { installment_quantity: parseInt(installments) })
      }
    } : {
      expense_name: formData.name,
      expense_amount: formData.amount,
      expense_category: formData.category,
      payment_method: formData.paymentMethod,
      is_shared: false,
      ...(formData.paymentMethod === 'Credito' && installments && { installment_quantity: parseInt(installments) })
    };

    // DEBUG: Ver el body completo
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    console.log('API Response:', result); // DEBUG

    if (result.success) {
      const successMessage = isShared 
        ? '¡Invitación de gasto compartido enviada exitosamente!' 
        : '¡Gasto agregado exitosamente!';
      toast.success(successMessage);
      
      onAdd(formData); // Actualizar la UI local
      setFormData({
        name: '',
        amount: '',
        category: categories[0],
        paymentMethod: paymentMethods[0]
      });
      setIsShared(false);
      setRecipientEmail('');
      setSelectedCreditCard('');
      setInstallments('1');
      onClose();
    } else {
      toast.error(result.message || 'Error al procesar el gasto');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error de conexión. Intenta nuevamente.');
  } finally {
    setIsLoading(false);
  }
};

const handleCancel = () => {
  setFormData({
    name: '',
    amount: '',
    category: categories[0],
    paymentMethod: paymentMethods[0]
  });
  setIsShared(false);
  setRecipientEmail('');
  setSelectedCreditCard('');
  setInstallments('1');
  onClose();
};

if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div  className="fixed inset-0  bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" 
        initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          >
       <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 transition-colors duration-300"initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agregar nuevo gasto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre del gasto */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del gasto
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 transition-colors duration-300 ${
                !isNameValid ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Ingresa el nombre del gasto"
              required
            />
            {!isNameValid && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                El nombre no puede exceder los 40 caracteres ({formData.name.length}/40)
              </p>
            )}
          </div>

          {/* Monto del gasto */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monto del gasto
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium">$</span>
              <input
                type="text"
                id="amount"
                value={formData.amount}
                onChange={handleAmountChange}
                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 transition-colors duration-300 ${
                  !isAmountValid ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0.00"
                required
              />
            </div>
            {!isAmountValid ? (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                El monto no puede exceder los 10 números ({getNumericLength(formData.amount)}/10)
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Usa punto para separar decimales (ej: 123.45)</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-300"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Medio de pago */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Medio de pago
            </label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-300"
            >
              {paymentMethods.map((method) => {
                // Si es 'Credito' y no hay tarjetas, no mostrar la opción
                if (method === 'Credito' && creditCards.length === 0) {
                  return null;
                }
                return (
                  <option key={method} value={method}>
                    {method}
                  </option>
                );
              })}
            </select>
            
            {/* Mensaje cuando no hay tarjetas de crédito */}
            {creditCards.length === 0 && !loadingCreditCards && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  No hay ninguna tarjeta de crédito.{' '}
                  <Link 
                    href="/billetera" 
                    className="font-medium underline hover:text-red-800 dark:hover:text-red-300 transition-colors"
                    onClick={onClose}
                  >
                    Carga la primera haciendo click en este enlace
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Campos adicionales para tarjeta de crédito */}
          <AnimatePresence>
            {formData.paymentMethod === 'Credito' && creditCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Seleccionar tarjeta de crédito */}
                <div>
                  <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Elige la tarjeta de crédito
                  </label>
                  <select
                    id="creditCard"
                    value={selectedCreditCard}
                    onChange={(e) => setSelectedCreditCard(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-300"
                    required={formData.paymentMethod === 'Credito'}
                  >
                    <option value="">Selecciona una tarjeta</option>
                    {creditCards.map((card) => (
                      <option key={card.creditCard_id} value={card.creditCard_id}>
                        {card.card_name} ({card.card_type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seleccionar cantidad de cuotas */}
                <div>
                  <label htmlFor="installments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selecciona la cantidad de cuotas
                  </label>
                  <select
                    id="installments"
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-300"
                  >
                    {installmentOptions.map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'cuota' : 'cuotas'}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compartir este gasto */}
<div className="mb-4">
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={isShared}
      onChange={(e) => setIsShared(e.target.checked)}
      className="mr-2"
    />
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Compartir este gasto
    </span>
  </label>
</div>
<AnimatePresence>
{isShared && (
  <motion.div  className="mb-4"initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Email del destinatario
    </label>
    <input
      type="email"
      value={recipientEmail}
      onChange={(e) => setRecipientEmail(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 transition-colors duration-300"
      placeholder="ejemplo@email.com"
      required={isShared}
    />
    </motion.div>
  )}
</AnimatePresence>
          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !isNameValid || !isAmountValid}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Agregando...' : 'Agregar'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}

//