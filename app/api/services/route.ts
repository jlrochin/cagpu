import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateServiceData } from '@/lib/validation';
import { generateServiceChangeDetails } from '@/lib/change-details';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        direction: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos
    const validation = validateServiceData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.errors },
        { status: 400 }
      );
    }

    // Verificar si ya existe un servicio con el mismo nombre
    const existingService = await prisma.service.findFirst({
      where: {
        name: body.name,
      },
    });

    if (existingService) {
      return NextResponse.json(
        { error: 'Ya existe un servicio con este nombre' },
        { status: 409 }
      );
    }

    // Crear el servicio
    const service = await prisma.service.create({
      data: {
        id: body.id || `service_${Date.now()}`,
        name: body.name,
        directionId: body.directionId,
        responsiblePerson: body.responsiblePerson,
        phoneExtension: body.phoneExtension,
        serviceType: body.serviceType,
        location: body.location,
        description: body.description,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
      include: {
        direction: true,
      },
    });

    // Obtener información del usuario que creó el servicio (desde headers o token)
    const performedBy = 1; // Por ahora hardcodeado, deberías obtener del token/sesión

    // Generar detalles del cambio
    const changeDetails = generateServiceChangeDetails('create', service.name, service.direction.name);
    
    // Registrar en historial de cambios (usando la misma tabla por ahora)
    await prisma.userChangeHistory.create({
      data: {
        targetUserId: performedBy, // Para servicios, puede ser el usuario que lo creó
        action: 'service_create',
        performedBy,
        details: changeDetails,
      },
    });

    // Crear notificación para administradores
    const admins = await prisma.user.findMany({
      where: {
        role: 'admin',
        isActive: true,
      },
    });

    const performedByUser = await prisma.user.findUnique({
      where: { id: performedBy },
      select: { username: true },
    });

    await Promise.all(
      admins.map(admin =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            title: 'Nuevo servicio creado',
            message: `Se ha creado el servicio "${service.name}" en ${service.direction.name} por ${performedByUser?.username || 'un usuario'}.`,
            serviceId: service.id,
            isRead: false,
          },
        })
      )
    );

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos
    const validation = validateServiceData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.errors },
        { status: 400 }
      );
    }

    // Verificar que el servicio existe
    const existingService = await prisma.service.findUnique({
      where: { id: body.id },
      include: { direction: true },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el servicio
    const updatedService = await prisma.service.update({
      where: { id: body.id },
      data: {
        name: body.name,
        directionId: body.directionId,
        responsiblePerson: body.responsiblePerson,
        phoneExtension: body.phoneExtension,
        serviceType: body.serviceType,
        location: body.location,
        description: body.description,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
      include: {
        direction: true,
      },
    });

    // Obtener información del usuario que actualizó el servicio
    const performedBy = 1; // Por ahora hardcodeado, deberías obtener del token/sesión

    // Generar detalles legibles de los cambios
    const changeDetails = generateServiceChangeDetails('update', updatedService.name, updatedService.direction.name, existingService, updatedService);
    
    // Registrar en historial de cambios
    await prisma.userChangeHistory.create({
      data: {
        targetUserId: performedBy,
        action: 'service_update',
        performedBy,
        details: changeDetails,
      },
    });

    // Crear notificación para administradores
    const admins = await prisma.user.findMany({
      where: {
        role: 'admin',
        isActive: true,
      },
    });

    const performedByUser = await prisma.user.findUnique({
      where: { id: performedBy },
      select: { username: true },
    });

    await Promise.all(
      admins.map(admin =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            title: 'Servicio actualizado',
            message: `El servicio "${updatedService.name}" ha sido actualizado por ${performedByUser?.username || 'un usuario'}.`,
            serviceId: updatedService.id,
            isRead: false,
          },
        })
      )
    );

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 