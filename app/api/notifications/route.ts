import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Obtener notificaciones del usuario autenticado
export async function GET(request: NextRequest) {
  try {
    // Obtener el id del usuario autenticado desde la cookie
    const authCookie = request.cookies.get('auth');
    const userId = authCookie ? parseInt(authCookie.value) : null;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    // Excluir notificaciones de login/logout
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        OR: [
          { title: { not: { contains: 'login', mode: 'insensitive' } } },
          { title: { not: { contains: 'logout', mode: 'insensitive' } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor', detalle: String(error) }, { status: 500 });
  }
}

// Marcar una notificación como leída
export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();
    // Obtener el id del usuario autenticado desde la cookie
    const authCookie = request.cookies.get('auth');
    const userId = authCookie ? parseInt(authCookie.value) : null;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    // Verificar que la notificación pertenece al usuario
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    return NextResponse.json({ error: 'Error interno del servidor', detalle: String(error) }, { status: 500 });
  }
} 