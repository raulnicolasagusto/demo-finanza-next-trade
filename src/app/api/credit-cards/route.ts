import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/api/db/connection';
import { CreditCard } from '@/api/models';
import { v4 as uuidv4 } from 'uuid';

// POST - Crear una nueva tarjeta de crédito
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
    const { card_name, card_type } = body;

    // Validar campos requeridos
    if (!card_name || !card_type) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Todos los campos son requeridos' 
        },
        { status: 400 }
      );
    }

    // Validar tipo de tarjeta
    const validCardTypes = ['Visa', 'American Express', 'MasterCard', 'Otro'];
    if (!validCardTypes.includes(card_type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tipo de tarjeta no válido' 
        },
        { status: 400 }
      );
    }

    // Validar longitud del nombre
    if (card_name.trim().length > 30) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'El nombre de la tarjeta no puede exceder 30 caracteres' 
        },
        { status: 400 }
      );
    }

    // Crear nueva tarjeta de crédito
    const newCreditCard = new CreditCard({
      creditCard_id: uuidv4(),
      user_id: userId,
      card_name: card_name.trim(),
      card_type,
      expense_amount_credit: '0',
      payment_amount: '0'
    });

    // Guardar en la base de datos
    await newCreditCard.save();

    return NextResponse.json({
      success: true,
      message: 'Tarjeta de crédito agregada exitosamente',
      data: {
        creditCard_id: newCreditCard.creditCard_id,
        card_name: newCreditCard.card_name,
        card_type: newCreditCard.card_type,
        expense_amount_credit: newCreditCard.expense_amount_credit,
        payment_amount: newCreditCard.payment_amount,
        createdAt: newCreditCard.createdAt
      }
    });

  } catch (error) {
    console.error('Error al crear tarjeta de crédito:', error);
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

// GET - Obtener tarjetas de crédito del usuario
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

    // Obtener tarjetas de crédito del usuario
    const creditCards = await CreditCard.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(20); // Limitar a las últimas 20 tarjetas

    return NextResponse.json({
      success: true,
      message: 'Tarjetas de crédito obtenidas exitosamente',
      data: creditCards
    });

  } catch (error) {
    console.error('Error al obtener tarjetas de crédito:', error);
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

// DELETE - Eliminar una tarjeta de crédito
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

    // Obtener el creditCard_id de los parámetros de consulta
    const url = new URL(request.url);
    const creditCard_id = url.searchParams.get('creditCard_id');

    if (!creditCard_id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ID de la tarjeta de crédito es requerido' 
        },
        { status: 400 }
      );
    }

    // Buscar y eliminar la tarjeta de crédito (solo si pertenece al usuario)
    const deletedCreditCard = await CreditCard.findOneAndDelete({
      creditCard_id: creditCard_id,
      user_id: userId
    });

    if (!deletedCreditCard) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tarjeta de crédito no encontrada o no tienes permisos para eliminarla' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tarjeta de crédito eliminada exitosamente',
      data: {
        creditCard_id: deletedCreditCard.creditCard_id,
        card_name: deletedCreditCard.card_name
      }
    });

  } catch (error) {
    console.error('Error al eliminar tarjeta de crédito:', error);
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