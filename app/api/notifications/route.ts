import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

// Obtener notificaciones del usuario autenticado
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === '1';
    // Obtener el usuario autenticado desde el JWT de la cookie
    const authCookie = request.cookies.get('auth');
    let userId = null;
    if (authCookie) {
      try {
        const { payload } = await jwtVerify(authCookie.value, new TextEncoder().encode(JWT_SECRET));
        userId = payload.id as number;
      } catch (e) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
      }
    }
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    // Obtener el rol del usuario autenticado
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    let notifications;
    let baseWhere;
    
    if (user.role === 'admin' || user.role === 'developer') {
      // Los administradores ven todas las notificaciones
      baseWhere = {
        AND: [
          { title: { not: { contains: 'login' } } },
          { title: { not: { contains: 'logout' } } },
        ]
      };
    } else {
      // Los usuarios normales solo ven sus notificaciones
      baseWhere = {
        userId,
        AND: [
          { title: { not: { contains: 'login' } } },
          { title: { not: { contains: 'logout' } } },
        ]
      };
    }
    
    const where = showAll ? baseWhere : { ...baseWhere, isRead: false };
    notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: user.role === 'admin' || user.role === 'developer' ? 50 : 20,
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
    // Obtener el usuario autenticado desde el JWT de la cookie
    const authCookie = request.cookies.get('auth');
    let userId = null;
    if (authCookie) {
      try {
        const { payload } = await jwtVerify(authCookie.value, new TextEncoder().encode(JWT_SECRET));
        userId = payload.id as number;
      } catch (e) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
      }
    }
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    // Obtener el rol del usuario autenticado
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    // Permitir marcar como leída si es admin/developer o dueño
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || (notification.userId !== userId && user.role !== 'admin' && user.role !== 'developer')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    return NextResponse.json({ error: 'Error interno del servidor', detalle: String(error) }, { status: 500 });
  }
} 