import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/api/db/connection';
import { SharedExpenseInvitation, Expense } from '@/api/models';
import { v4 as uuidv4 } from 'uuid';

interface RouteParams {
  params: {
    invitationId: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body; // 'accept' o 'decline'
    const { invitationId } = await params;

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Acción inválida. Use "accept" o "decline"' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Buscar la invitación
    const invitation = await SharedExpenseInvitation.findOne({
      invitation_id: invitationId,
      status: 'pending'
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitación no encontrada o ya procesada' },
        { status: 404 }
      );
    }

    // Verificar que no haya expirado
    if (invitation.expires_at < new Date()) {
      invitation.status = 'expired';
      await invitation.save();
      return NextResponse.json(
        { error: 'La invitación ha expirado' },
        { status: 400 }
      );
    }

    if (action === 'accept') {
      // Crear el gasto para ambos usuarios
      const expenseData = invitation.expense_data;
      
      // Gasto para el usuario que acepta
      const userExpense = new Expense({
        expense_id: uuidv4(),
        user_id: userId,
        expense_name: expenseData.expense_name,
        expense_amount: expenseData.expense_amount,
        expense_category: expenseData.expense_category,
        payment_method: expenseData.payment_method,
        is_shared: true,
        shared_with_email: invitation.sender_email,
        original_creator_id: invitation.sender_email
      });

      await userExpense.save();

      // Actualizar invitación
      invitation.status = 'accepted';
      invitation.accepted_at = new Date();
      await invitation.save();

      return NextResponse.json(
        { message: 'Gasto compartido aceptado exitosamente' },
        { status: 200 }
      );

    } else {
      // Rechazar invitación
      invitation.status = 'declined';
      invitation.declined_at = new Date();
      await invitation.save();

      return NextResponse.json(
        { message: 'Invitación rechazada' },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Error procesando invitación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}