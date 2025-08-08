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
    const { expense_name, expense_amount, expense_category, payment_method, installment_quantity, creditCard_id } = body;

    // Validar campos requeridos
    if (!expense_name || !expense_amount || !expense_category || !payment_method) {
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
      expense_amount: expense_amount.trim(),
      expense_category,
      payment_method,
      ...(installment_quantity && { installment_quantity }),
      ...(creditCard_id && { creditCard_id })
    });

    // Guardar en la base de datos
    await newExpense.save();

    return NextResponse.json({
      success: true,
      message: 'Gasto agregado exitosamente',
      data: {
        expense_id: newExpense.expense_id,
        expense_name: newExpense.expense_name,
        expense_amount: newExpense.expense_amount,
        expense_category: newExpense.expense_category,
        payment_method: newExpense.payment_method,
        installment_quantity: newExpense.installment_quantity,
        creditCard_id: newExpense.creditCard_id,
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

// DELETE - Eliminar un gasto
export async function DELETE(request: NextRequest) {
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

    // Obtener el expense_id de los parámetros de consulta
    const url = new URL(request.url);
    const expense_id = url.searchParams.get('expense_id');

    if (!expense_id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ID del gasto es requerido' 
        },
        { status: 400 }
      );
    }

    // Buscar y eliminar el gasto (solo si pertenece al usuario)
    const deletedExpense = await Expense.findOneAndDelete({
      expense_id: expense_id,
      user_id: userId
    });

    if (!deletedExpense) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gasto no encontrado o no tienes permisos para eliminarlo' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Gasto eliminado exitosamente',
      data: {
        expense_id: deletedExpense.expense_id,
        expense_name: deletedExpense.expense_name
      }
    });

  } catch (error) {
    console.error('Error al eliminar gasto:', error);
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