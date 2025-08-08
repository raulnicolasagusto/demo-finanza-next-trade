import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/api/db/connection';
import { Expense } from '@/api/models';

// GET - Obtener gastos detallados por tarjeta de crédito
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ creditCardId: string }> }
) {
  try {
    // Verificar autenticación
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Conectar a la base de datos
    await connectDB();

    const { creditCardId } = await params;

    // Validar que se proporcione creditCardId
    if (!creditCardId) {
      return NextResponse.json(
        { success: false, message: 'creditCardId es requerido' },
        { status: 400 }
      );
    }

    // Buscar todos los gastos del usuario con esa tarjeta de crédito
    const expenses = await Expense.find({
      user_id: userId,
      creditCard_id: creditCardId,
      payment_method: 'Credito'
    }).sort({ createdAt: -1 }); // Ordenar por fecha más reciente primero

    // Formatear los datos para el modal
    const detailedExpenses = expenses.map(expense => ({
      id: expense._id,
      expense_name: expense.expense_name,
      expense_amount: parseFloat(expense.expense_amount),
      expense_category: expense.expense_category,
      installment_quantity: expense.installment_quantity || 1,
      createdAt: expense.createdAt
    }));

    // Calcular el total de gastos
    const totalExpenses = expenses.reduce((total, expense) => {
      return total + parseFloat(expense.expense_amount);
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        creditCardId,
        totalExpenses,
        expenseCount: expenses.length,
        expenses: detailedExpenses
      }
    });

  } catch (error) {
    console.error('Error al obtener gastos detallados por tarjeta:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}