import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    const userData = await request.json()

    // Obtener el id del usuario autenticado desde la cookie
    const authCookie = request.cookies.get('auth')
    const performedBy = authCookie ? parseInt(authCookie.value) : null
    if (!performedBy) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Preparar datos para actualización
    const updateData: any = {
      username: userData.username,
      email: userData.email,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
      department: userData.department,
      phone: userData.phone,
    }

    // Si se proporciona una nueva contraseña, hashearla
    if (userData.password) {
      updateData.passwordHash = await bcrypt.hash(userData.password, 12)
    }

    // Verificar si el nuevo username o email ya existe en otro usuario
    if (userData.username !== existingUser.username || userData.email !== existingUser.email) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: userData.username },
            { email: userData.email },
          ],
          NOT: { id: userId },
        },
      })

      if (duplicateUser) {
        return NextResponse.json(
          { error: 'El usuario o email ya existe' },
          { status: 409 }
        )
      }
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        department: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Registrar en historial
    await prisma.userChangeHistory.create({
      data: {
        targetUserId: userId,
        action: 'update',
        performedBy,
        details: `Usuario actualizado: ${JSON.stringify(updateData)}`,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    const { action } = await request.json()

    // Obtener el id del usuario autenticado desde la cookie
    const authCookie = request.cookies.get('auth')
    const performedBy = authCookie ? parseInt(authCookie.value) : null
    if (!performedBy) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    let updateData: any = {}
    let actionType = ''

    if (action === 'deactivate') {
      updateData.isActive = false
      actionType = 'deactivate'
    } else if (action === 'activate') {
      updateData.isActive = true
      actionType = 'activate'
    } else {
      return NextResponse.json(
        { error: 'Acción no válida' },
        { status: 400 }
      )
    }

    // Actualizar estado del usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        department: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Registrar en historial
    await prisma.userChangeHistory.create({
      data: {
        targetUserId: userId,
        action: actionType,
        performedBy,
        details: `Usuario ${actionType === 'deactivate' ? 'desactivado' : 'activado'}`,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Usuario ${actionType === 'deactivate' ? 'desactivado' : 'activado'} correctamente`,
    })
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 