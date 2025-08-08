import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/api/db/connection';
import { SharedExpenseInvitation, Expense } from '@/api/models';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { recipient_email, expense_data } = body;

    // Validar datos requeridos
    if (!recipient_email || !expense_data) {
      return NextResponse.json(
        { success: false, error: 'Email del destinatario y datos del gasto son requeridos' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener email REAL del usuario actual usando Clerk
    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se pudo obtener el email del usuario' },
        { status: 400 }
      );
    }
    
    const sender_email = user.emailAddresses[0].emailAddress;
    console.log('Email real del remitente:', sender_email);

    // 1. Crear el gasto para el remitente
    const senderExpense = new Expense({
      expense_id: uuidv4(),
      user_id: userId,
      expense_name: expense_data.expense_name,
      expense_amount: parseFloat(expense_data.expense_amount),
      expense_category: expense_data.expense_category,
      payment_method: expense_data.payment_method,
      is_shared: true,
      ...(expense_data.installment_quantity && { installment_quantity: expense_data.installment_quantity }),
      ...(expense_data.creditCard_id && { creditCard_id: expense_data.creditCard_id })
    });
    await senderExpense.save();

    // 2. Crear la invitación para el destinatario
    const invitation = new SharedExpenseInvitation({
      invitation_id: uuidv4(),
      sender_email,
      recipient_email,
      expense_data,
      status: 'pending',
    });

    await invitation.save();

    return NextResponse.json(
      { 
        success: true,
        message: 'Invitación enviada exitosamente',
        invitation_id: invitation.invitation_id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error enviando invitación:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}