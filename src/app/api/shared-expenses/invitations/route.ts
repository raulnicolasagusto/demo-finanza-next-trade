import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/api/db/connection';
import { SharedExpenseInvitation } from '@/api/models';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Obtener email REAL del usuario actual usando Clerk
    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json(
        { error: 'No se pudo obtener el email del usuario' },
        { status: 400 }
      );
    }
    
    const user_email = user.emailAddresses[0].emailAddress;
    console.log('Buscando invitaciones para:', user_email);

    // Buscar invitaciones pendientes para este usuario
    const invitations = await SharedExpenseInvitation.find({
      recipient_email: user_email,
      status: 'pending',
      expires_at: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    console.log('Invitaciones encontradas:', invitations.length);

    return NextResponse.json({ invitations }, { status: 200 });

  } catch (error) {
    console.error('Error obteniendo invitaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}