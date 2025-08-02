import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/api/db/connection';
import { Income } from '@/api/models';
import { v4 as uuidv4 } from 'uuid';

// POST - Crear un nuevo ingreso
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
    const { income_amount, income_type, income_note } = body;

    // Validar campos requeridos
    if (!income_amount || !income_type || !income_note) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Todos los campos son requeridos' 
        },
        { status: 400 }
      );
    }

    // Validar tipo de ingreso
    const validIncomeTypes = ['Sueldo', 'Honorarios', 'Ventas', 'Rentas', 'Otros Ingresos'];
    if (!validIncomeTypes.includes(income_type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tipo de ingreso no válido' 
        },
        { status: 400 }
      );
    }

    // Validar longitud de la nota (máximo 150 caracteres)
    if (income_note.trim().length > 150) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'La observación no puede exceder 150 caracteres' 
        },
        { status: 400 }
      );
    }

    // Validar que el monto sea un número válido
    const amountNumber = parseFloat(income_amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'El monto debe ser un número válido mayor a 0' 
        },
        { status: 400 }
      );
    }

    // Crear nuevo ingreso
    const newIncome = new Income({
      income_id: uuidv4(),
      user_id: userId,
      income_amount: income_amount.trim(),
      income_type,
      income_note: income_note.trim()
    });

    // Guardar en la base de datos
    await newIncome.save();

    return NextResponse.json({
      success: true,
      message: 'Ingreso agregado exitosamente',
      data: {
        income_id: newIncome.income_id,
        income_amount: newIncome.income_amount,
        income_type: newIncome.income_type,
        income_note: newIncome.income_note,
        createdAt: newIncome.createdAt
      }
    });

  } catch (error) {
    console.error('Error al crear ingreso:', error);
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

// GET - Obtener ingresos del usuario
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

    // Obtener ingresos del usuario
    const incomes = await Income.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limitar a los últimos 50 ingresos

    return NextResponse.json({
      success: true,
      message: 'Ingresos obtenidos exitosamente',
      data: incomes
    });

  } catch (error) {
    console.error('Error al obtener ingresos:', error);
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

// DELETE - Eliminar un ingreso
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

    // Obtener el income_id de los parámetros de consulta
    const url = new URL(request.url);
    const income_id = url.searchParams.get('income_id');

    if (!income_id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ID del ingreso es requerido' 
        },
        { status: 400 }
      );
    }

    // Buscar y eliminar el ingreso (solo si pertenece al usuario)
    const deletedIncome = await Income.findOneAndDelete({
      income_id: income_id,
      user_id: userId
    });

    if (!deletedIncome) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Ingreso no encontrado o no tienes permisos para eliminarlo' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ingreso eliminado exitosamente',
      data: {
        income_id: deletedIncome.income_id,
        income_type: deletedIncome.income_type
      }
    });

  } catch (error) {
    console.error('Error al eliminar ingreso:', error);
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