# API y Endpoints - Sistema CAGPU

## Visión General

La API del Sistema CAGPU está construida sobre Next.js API Routes, proporcionando endpoints RESTful para todas las funcionalidades del sistema. La API está protegida por middleware de autenticación y utiliza Prisma como ORM para la gestión de datos.

## Estructura de la API

### Organización de Endpoints

```
/api/
├── auth/                    # Autenticación y gestión de usuarios
│   ├── login               # POST - Inicio de sesión
│   ├── crearusuario        # POST - Crear nuevo usuario
│   └── logout              # POST - Cerrar sesión
├── users/                   # Gestión de usuarios
│   ├── [id]                # GET, PUT, DELETE - Operaciones CRUD
│   └── route               # GET - Lista de usuarios
├── directions/              # Gestión de direcciones
│   └── route               # GET, POST - CRUD de direcciones
├── services/                # Gestión de servicios
│   ├── [id]                # GET, PUT, DELETE - Operaciones CRUD
│   └── route               # GET, POST - CRUD de servicios
├── notifications/           # Sistema de notificaciones
│   └── route               # GET, POST - CRUD de notificaciones
├── profile/                 # Gestión de perfil de usuario
│   └── route               # GET, PUT - Perfil del usuario actual
├── user-change-history/     # Historial de cambios de usuario
│   └── route               # GET - Consulta de historial
├── audit-log/               # Log de auditoría
│   └── route               # GET - Consulta de logs
└── ping/                    # Health check del sistema
    └── route               # GET - Estado del sistema
```

## Endpoints de Autenticación

### 1. Login (`/api/auth/login`)

**Método:** POST

**Descripción:** Autentica un usuario y genera un token JWT

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@ejemplo.com",
    "role": "user",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "department": "Departamento",
    "serviceId": "SERV001"
  }
}
```

**Respuestas de Error:**
```json
// 400 - Credenciales inválidas
{
  "success": false,
  "error": "Credenciales inválidas"
}

// 400 - Usuario inactivo
{
  "success": false,
  "error": "Usuario inactivo"
}

// 500 - Error interno
{
  "success": false,
  "error": "Error interno del servidor"
}
```

**Implementación:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username y password son requeridos' },
        { status: 400 }
      )
    }

    const authResult = await authenticateUser(username, password)
    
    if (!authResult) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 400 }
      )
    }

    if ('inactive' in authResult) {
      return NextResponse.json(
        { success: false, error: 'Usuario inactivo' },
        { status: 400 }
      )
    }

    // Generar JWT y establecer cookie
    const token = await generateJWT(authResult)
    const response = NextResponse.json({ success: true, user: authResult })
    
    response.cookies.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

### 2. Crear Usuario (`/api/auth/crearusuario`)

**Método:** POST

**Descripción:** Crea un nuevo usuario en el sistema (solo administradores)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user",
  "firstName": "string",
  "lastName": "string",
  "department": "string",
  "phone": "string",
  "serviceId": "string"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "user": {
    "id": 2,
    "username": "nuevo_usuario",
    "email": "nuevo@ejemplo.com",
    "role": "user",
    "firstName": "Nuevo",
    "lastName": "Usuario",
    "department": "Departamento",
    "phone": "123456789",
    "serviceId": "SERV001"
  }
}
```

**Validaciones:**
- Username único
- Email único
- Contraseña mínima 4 caracteres (temporal)
- Rol válido (user/admin)
- Campos requeridos: username, email, password

### 3. Logout (`/api/auth/logout`)

**Método:** POST

**Descripción:** Cierra la sesión del usuario actual

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

**Implementación:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logout exitoso' 
    })
    
    // Eliminar cookie de autenticación
    response.cookies.delete('auth')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

## Endpoints de Usuarios

### 1. Lista de Usuarios (`/api/users`)

**Método:** GET

**Descripción:** Obtiene la lista de usuarios del sistema

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
```
?page=1&limit=20&search=nombre&role=user&department=IT&isActive=true
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "username": "usuario1",
      "email": "usuario1@ejemplo.com",
      "role": "user",
      "firstName": "Nombre",
      "lastName": "Apellido",
      "department": "IT",
      "phone": "123456789",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 2. Usuario por ID (`/api/users/[id]`)

**Método:** GET

**Descripción:** Obtiene información detallada de un usuario específico

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "usuario1",
    "email": "usuario1@ejemplo.com",
    "role": "user",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "department": "IT",
    "phone": "123456789",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Método:** PUT

**Descripción:** Actualiza información de un usuario

**Body:**
```json
{
  "firstName": "Nuevo Nombre",
  "lastName": "Nuevo Apellido",
  "department": "Nuevo Departamento",
  "phone": "987654321",
  "email": "nuevo@ejemplo.com"
}
```

**Método:** DELETE

**Descripción:** Desactiva un usuario (soft delete)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario desactivado exitosamente"
}
```

## Endpoints de Direcciones

### 1. Lista de Direcciones (`/api/directions`)

**Método:** GET

**Descripción:** Obtiene la lista de direcciones del sistema

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "directions": [
    {
      "id": "DIR001",
      "name": "Dirección General",
      "description": "Dirección principal de la organización",
      "servicesCount": 15,
      "displayOrder": 1
    }
  ]
}
```

**Método:** POST

**Descripción:** Crea una nueva dirección

**Body:**
```json
{
  "id": "DIR002",
  "name": "Nueva Dirección",
  "description": "Descripción de la nueva dirección",
  "displayOrder": 2
}
```

## Endpoints de Servicios

### 1. Lista de Servicios (`/api/services`)

**Método:** GET

**Descripción:** Obtiene la lista de servicios del sistema

**Query Parameters:**
```
?directionId=DIR001&isActive=true&search=nombre
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "services": [
    {
      "id": "SERV001",
      "directionId": "DIR001",
      "name": "Servicio de IT",
      "responsiblePerson": "Juan Pérez",
      "phoneExtension": "1001",
      "serviceType": "Soporte",
      "location": "Edificio A, Piso 2",
      "description": "Servicio de soporte técnico",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "direction": {
        "id": "DIR001",
        "name": "Dirección General"
      }
    }
  ]
}
```

### 2. Servicio por ID (`/api/services/[id]`)

**Método:** GET

**Descripción:** Obtiene información detallada de un servicio

**Método:** PUT

**Descripción:** Actualiza información de un servicio

**Método:** DELETE

**Descripción:** Desactiva un servicio

## Endpoints de Notificaciones

### 1. Gestión de Notificaciones (`/api/notifications`)

**Método:** GET

**Descripción:** Obtiene notificaciones del usuario actual

**Query Parameters:**
```
?isRead=false&limit=50&page=1
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "title": "Nueva notificación",
      "message": "Tienes una nueva notificación del sistema",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 25,
    "totalPages": 1
  }
}
```

**Método:** POST

**Descripción:** Crea una nueva notificación

**Body:**
```json
{
  "title": "Título de la notificación",
  "message": "Mensaje de la notificación",
  "userId": 1,
  "serviceId": "SERV001"
}
```

## Endpoints de Perfil

### 1. Perfil de Usuario (`/api/profile`)

**Método:** GET

**Descripción:** Obtiene el perfil del usuario autenticado

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "profile": {
    "id": 1,
    "username": "usuario1",
    "email": "usuario1@ejemplo.com",
    "role": "user",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "department": "IT",
    "phone": "123456789",
    "isActive": true,
    "serviceId": "SERV001"
  }
}
```

**Método:** PUT

**Descripción:** Actualiza el perfil del usuario actual

**Body:**
```json
{
  "firstName": "Nuevo Nombre",
  "lastName": "Nuevo Apellido",
  "phone": "987654321",
  "email": "nuevo@ejemplo.com"
}
```

## Endpoints de Auditoría

### 1. Historial de Cambios (`/api/user-change-history`)

**Método:** GET

**Descripción:** Obtiene el historial de cambios de usuarios

**Query Parameters:**
```
?targetUserId=1&performedBy=2&action=update&limit=50&page=1
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "targetUserId": 1,
      "action": "update",
      "performedBy": 2,
      "details": "Usuario modificado: usuario1",
      "createdAt": "2024-01-01T00:00:00Z",
      "targetUser": {
        "username": "usuario1"
      },
      "performedByUser": {
        "username": "admin"
      }
    }
  ]
}
```

### 2. Log de Auditoría (`/api/audit-log`)

**Método:** GET

**Descripción:** Obtiene logs de auditoría del sistema

**Query Parameters:**
```
?action=login&targetUserId=1&performedBy=2&limit=100&page=1
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "auditLogs": [
    {
      "id": 1,
      "action": "login",
      "targetUserId": 1,
      "performedBy": 1,
      "details": "Inicio de sesión exitoso",
      "ip": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Endpoint de Health Check

### 1. Ping (`/api/ping`)

**Método:** GET

**Descripción:** Verifica el estado del sistema

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Sistema funcionando correctamente",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## Validaciones y Manejo de Errores

### 1. Validación de Entrada

**Ejemplo de Validación:**
```typescript
import { z } from 'zod'

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(4),
  role: z.enum(['user', 'admin']).default('user'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  serviceId: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)
    
    // Continuar con la lógica de negocio
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

### 2. Manejo de Errores

**Estructura de Error Estándar:**
```typescript
interface ApiError {
  success: false
  error: string
  details?: any
  code?: string
}

interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

type ApiResponse<T> = ApiSuccess<T> | ApiError
```

**Códigos de Error:**
- `400`: Bad Request - Datos inválidos
- `401`: Unauthorized - No autenticado
- `403`: Forbidden - No autorizado
- `404`: Not Found - Recurso no encontrado
- `409`: Conflict - Conflicto de datos
- `500`: Internal Server Error - Error interno

### 3. Middleware de Validación

**Ejemplo de Middleware:**
```typescript
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json()
      const validatedData = schema.parse(body)
      
      return handler(validatedData, request)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { success: false, error: 'Datos inválidos', details: error.errors },
          { status: 400 }
        )
      }
      
      throw error
    }
  }
}
```

## Seguridad de la API

### 1. Autenticación

**Verificación de Token:**
```typescript
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
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      return { success: false, error: 'User not found or inactive' }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Invalid token' }
  }
}
```

### 2. Autorización

**Verificación de Roles:**
```typescript
export function requireRole(requiredRole: string) {
  return function(handler: Function) {
    return async (request: NextRequest) => {
      const authResult = await verifyAuth(request)
      
      if (!authResult.success) {
        return NextResponse.json(
          { success: false, error: 'No autenticado' },
          { status: 401 }
        )
      }
      
      if (authResult.user.role !== requiredRole) {
        return NextResponse.json(
          { success: false, error: 'Acceso denegado' },
          { status: 403 }
        )
      }
      
      return handler(request, authResult.user)
    }
  }
}

// Uso
export const GET = requireRole('admin')(async (request: NextRequest, user: any) => {
  // Lógica de la API
})
```

### 3. Rate Limiting

**Implementación Básica:**
```typescript
const rateLimit = new Map()

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutos
) {
  return function(handler: Function) {
    return async (request: NextRequest) => {
      const ip = request.ip || 'unknown'
      const now = Date.now()
      const windowStart = now - windowMs
      
      if (!rateLimit.has(ip)) {
        rateLimit.set(ip, [])
      }
      
      const requests = rateLimit.get(ip)
      const validRequests = requests.filter(timestamp => timestamp > windowStart)
      
      if (validRequests.length >= maxRequests) {
        return NextResponse.json(
          { success: false, error: 'Rate limit exceeded' },
          { status: 429 }
        )
      }
      
      validRequests.push(now)
      rateLimit.set(ip, validRequests)
      
      return handler(request)
    }
  }
}
```

## Testing de la API

### 1. Tests Unitarios

**Ejemplo de Test:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createUser, authenticateUser } from '@/lib/auth'

describe('Auth API', () => {
  beforeEach(async () => {
    // Limpiar base de datos de test
    await prisma.user.deleteMany()
  })

  it('should create a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPass123!'
    }

    const user = await createUser(userData)
    
    expect(user).toBeDefined()
    expect(user.username).toBe(userData.username)
    expect(user.email).toBe(userData.email)
    expect(user.passwordHash).not.toBe(userData.password)
  })

  it('should authenticate valid user', async () => {
    // Crear usuario primero
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPass123!'
    }
    
    await createUser(userData)
    
    // Intentar autenticar
    const authResult = await authenticateUser('testuser', 'TestPass123!')
    
    expect(authResult).toBeDefined()
    expect(authResult.username).toBe('testuser')
  })
})
```

### 2. Tests de Integración

**Ejemplo de Test de Endpoint:**
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from 'http'
import { apiResolver } from 'next/dist/server/api-utils'
import { NextApiRequest, NextApiResponse } from 'next'

describe('Users API', () => {
  let server: any

  beforeAll(() => {
    server = createServer(async (req, res) => {
      const url = new URL(req.url!, `http://${req.headers.host}`)
      
      await apiResolver(
        req as NextApiRequest,
        res as NextApiResponse,
        {
          users: async (req, res) => {
            // Mock de la función de la API
            return res.json({ success: true, users: [] })
          }
        },
        {
          previewModeEnabled: false,
          previewModeId: null,
          previewModeEncryptionKey: null,
          previewModeSigningKey: null
        },
        false,
        true
      )
    })
    
    server.listen(3001)
  })

  afterAll(() => {
    server.close()
  })

  it('should return users list', async () => {
    const response = await fetch('http://localhost:3001/api/users')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.users)).toBe(true)
  })
})
```

## Monitoreo y Logging

### 1. Logs de la API

**Estructura de Log:**
```typescript
interface ApiLog {
  timestamp: string
  method: string
  path: string
  statusCode: number
  responseTime: number
  userId?: number
  ip: string
  userAgent: string
  error?: string
}

export function logApiRequest(log: ApiLog) {
  console.log(JSON.stringify(log))
  
  // En producción, enviar a sistema de logging
  if (process.env.NODE_ENV === 'production') {
    // Enviar a Elasticsearch, CloudWatch, etc.
  }
}
```

### 2. Métricas de Performance

**Medición de Tiempo de Respuesta:**
```typescript
export function withPerformanceMonitoring(handler: Function) {
  return async (request: NextRequest) => {
    const startTime = Date.now()
    
    try {
      const response = await handler(request)
      const responseTime = Date.now() - startTime
      
      logApiRequest({
        timestamp: new Date().toISOString(),
        method: request.method,
        path: request.nextUrl.pathname,
        statusCode: response.status,
        responseTime,
        ip: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
      
      return response
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      logApiRequest({
        timestamp: new Date().toISOString(),
        method: request.method,
        path: request.nextUrl.pathname,
        statusCode: 500,
        responseTime,
        ip: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        error: error.message
      })
      
      throw error
    }
  }
}
```

## Documentación de la API

### 1. OpenAPI/Swagger

**Configuración Básica:**
```typescript
import { createSwaggerSpec } from 'next-swagger-doc'

const apiConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Sistema CAGPU API',
    version: '1.0.0',
    description: 'API para gestión de usuarios, servicios y direcciones'
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      description: 'Servidor de desarrollo'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}

export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: 'app/api',
    definition: apiConfig
  })
}
```

### 2. Ejemplos de Uso

**cURL Examples:**
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Crear usuario (requiere autenticación)
curl -X POST http://localhost:3000/api/auth/crearusuario \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=<JWT_TOKEN>" \
  -d '{"username":"nuevo","email":"nuevo@example.com","password":"pass123"}'

# Obtener usuarios
curl -X GET http://localhost:3000/api/users \
  -H "Cookie: auth=<JWT_TOKEN>"
```

## Próximas Mejoras

### 1. GraphQL
- Implementar GraphQL para consultas complejas
- Resolvers optimizados
- Schema introspection

### 2. WebSockets
- Notificaciones en tiempo real
- Actualizaciones en vivo
- Chat interno

### 3. API Versioning
- Versionado de endpoints
- Migración gradual
- Compatibilidad hacia atrás

### 4. Caching
- Redis para cache de respuestas
- Cache de consultas de base de datos
- Invalidation inteligente
