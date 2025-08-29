import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto'

export function isStrongPassword(password: string): boolean {
  // Mínimo 12 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/
  return strongRegex.test(password)
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 14 // Mayor seguridad
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(userData: {
  username: string
  email: string
  password: string
  role?: string
  firstName?: string
  lastName?: string
  department?: string
  phone?: string
  serviceId?: string
}) {
  // Validación temporal para pruebas: solo requiere al menos 4 caracteres
  if (!userData.password || userData.password.length < 4) {
    throw new Error('La contraseña debe tener al menos 4 caracteres (validación temporal para pruebas).')
  }
  const hashedPassword = await hashPassword(userData.password)
  const user = await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      passwordHash: hashedPassword,
      role: userData.role || 'user',
      firstName: userData.firstName,
      lastName: userData.lastName,
      department: userData.department,
      phone: userData.phone,
      serviceId: userData.serviceId,
      isActive: true,
    },
  })
  // Registrar en historial
  if (userData.performedBy) {
    await prisma.userChangeHistory.create({
      data: {
        targetUserId: user.id,
        action: 'create',
        performedBy: userData.performedBy,
        details: `Usuario creado: ${user.username}`,
      },
    })
  }
  return user
}

export async function authenticateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return null;
  }
  if (!user.isActive) {
    return { inactive: true };
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)
  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    department: user.department,
    serviceId: user.serviceId,
  }
}

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get('auth')?.value

    if (!token) {
      return { success: false, error: 'No token provided' }
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    
    if (!payload.id) {
      return { success: false, error: 'Invalid token' }
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id as number },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        department: true,
        serviceId: true,
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      return { success: false, error: 'User not found or inactive' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Auth verification error:', error)
    return { success: false, error: 'Invalid token' }
  }
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
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
    },
  })
}

export async function updateUser(id: number, userData: {
  firstName?: string
  lastName?: string
  department?: string
  phone?: string
  email?: string
  password?: string
  performedBy?: number // id del admin que modifica
}) {
  if (userData.password && !isStrongPassword(userData.password)) {
    throw new Error('La contraseña no es lo suficientemente segura.')
  }
  let dataToUpdate: any = { ...userData }
  if (userData.password) {
    dataToUpdate.passwordHash = await hashPassword(userData.password)
    delete dataToUpdate.password
  }
  const user = await prisma.user.update({
    where: { id },
    data: dataToUpdate,
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
      updatedAt: true,
    },
  })
  // Registrar en historial
  if (userData.performedBy) {
    await prisma.userChangeHistory.create({
      data: {
        targetUserId: id,
        action: 'update',
        performedBy: userData.performedBy,
        details: `Usuario modificado: ${user.username}`,
      },
    })
  }
  return user
}

export async function deactivateUser(id: number, performedBy: number) {
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  })
  // Registrar en historial
  await prisma.userChangeHistory.create({
    data: {
      targetUserId: id,
      action: 'deactivate',
      performedBy,
      details: `Usuario desactivado: ${user.username}`,
    },
  })
  return user
} 