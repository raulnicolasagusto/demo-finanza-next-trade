'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Bell, Check, X } from 'lucide-react';

interface Invitation {
  _id: string;
  invitation_id: string;
  sender_email: string;
  expense_data: {
    expense_name: string;
    expense_amount: string;
    expense_category: string;
    payment_method: string;
  };
  createdAt: string;
}

interface SharedExpenseNotificationsProps {
  onExpenseUpdate?: () => void;
}

export default function SharedExpenseNotifications({ onExpenseUpdate }: SharedExpenseNotificationsProps) {
  const { userId } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchInvitations();
    }
  }, [userId]);

  const fetchInvitations = async () => {
    try {
      const response = await fetch('/api/shared-expenses/invitations');
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const handleInvitation = async (invitationId: string, action: 'accept' | 'decline') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/shared-expenses/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Remover la invitación de la lista
        setInvitations(prev => prev.filter(inv => inv.invitation_id !== invitationId));
        
        // Mostrar mensaje de éxito
        alert(action === 'accept' ? 'Gasto aceptado exitosamente' : 'Invitación rechazada');
        
        // NUEVA FUNCIONALIDAD: Actualizar la tabla de gastos
        if (action === 'accept' && onExpenseUpdate) {
          onExpenseUpdate();
        }
      } else {
        alert('Error procesando la invitación');
      }
    } catch (error) {
      console.error('Error handling invitation:', error);
      alert('Error procesando la invitación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <Bell className="w-6 h-6" />
        {invitations.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {invitations.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Gastos Compartidos</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {invitations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No tienes invitaciones pendientes
              </div>
            ) : (
              invitations.map((invitation) => (
                <div key={invitation.invitation_id} className="p-4 border-b border-gray-100 last:border-b-0">
                  <div className="mb-2">
                    <p className="font-medium text-gray-900">
                      {invitation.expense_data.expense_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${invitation.expense_data.expense_amount} - {invitation.expense_data.expense_category}
                    </p>
                    <p className="text-xs text-gray-500">
                      De: {invitation.sender_email}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleInvitation(invitation.invitation_id, 'accept')}
                      disabled={loading}
                      className="flex items-center px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleInvitation(invitation.invitation_id, 'decline')}
                      disabled={loading}
                      className="flex items-center px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}