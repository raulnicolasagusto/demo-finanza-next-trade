import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/api/db/connection';
import { Expense } from '@/api/models';
import { v4 as uuidv4 } from 'uuid';

// POST - Crear un nuevo gasto
export async function POST(request: NextRequest) {
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

    // Obtener datos del cuerpo de la petición
    const body = await request.json();
    const { expense_name, expense_category, payment_method } = body;

    // Validar campos requeridos
    if (!expense_name || !expense_category || !payment_method) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Todos los campos son requeridos' 
        },
        { status: 400 }
      );
    }

    // Validar categoría
    const validCategories = ['Comida', 'Super Mercado', 'Delivery'];
    if (!validCategories.includes(expense_category)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Categoría no válida' 
        },
        { status: 400 }
      );
    }

    // Validar método de pago
    const validPaymentMethods = ['Debito', 'Credito', 'Efectivo'];
    if (!validPaymentMethods.includes(payment_method)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Método de pago no válido' 
        },
        { status: 400 }
      );
    }

    // Crear nuevo gasto
    const newExpense = new Expense({
      expense_id: uuidv4(),
      user_id: userId,
      expense_name: expense_name.trim(),
      expense_category,
      payment_method
    });

    // Guardar en la base de datos
    await newExpense.save();

    return NextResponse.json({
      success: true,
      message: 'Gasto agregado exitosamente',
      data: {
        expense_id: newExpense.expense_id,
        expense_name: newExpense.expense_name,
        expense_category: newExpense.expense_category,
        payment_method: newExpense.payment_method,
        createdAt: newExpense.createdAt
      }
    });

  } catch (error) {
    console.error('Error al crear gasto:', error);
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

// GET - Obtener gastos del usuario
export async function GET(request: NextRequest) {
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

    // Obtener gastos del usuario
    const expenses = await Expense.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limitar a los últimos 50 gastos

    return NextResponse.json({
      success: true,
      message: 'Gastos obtenidos exitosamente',
      data: expenses
    });

  } catch (error) {
    console.error('Error al obtener gastos:', error);
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