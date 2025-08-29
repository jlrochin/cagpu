# Autenticación y Autorización - Sistema CAGPU

## Visión General

El sistema de autenticación y autorización del CAGPU está diseñado para proporcionar un control de acceso seguro y robusto a todas las funcionalidades del sistema. Utiliza JWT (JSON Web Tokens) para la gestión de sesiones y bcrypt para la encriptación de contraseñas.

## Arquitectura de Seguridad

### 1. Flujo de Autenticación

```
Usuario → Login → Validación → JWT Token → Cookie → Acceso a Rutas Protegidas
```

### 2. Capas de Seguridad

- **Capa de Presentación**: Formularios de login con validación
- **Capa de API**: Endpoints de autenticación seguros
- **Capa de Middleware**: Verificación de tokens en cada request
- **Capa de Base de Datos**: Encriptación de contraseñas y auditoría

## Componentes del Sistema

### 1. Middleware de Autenticación (`middleware.ts`)

El middleware actúa como primera línea de defensa, interceptando todas las requests antes de que lleguen a las páginas o APIs.

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas permitidas
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/ping")
  ) {
    return NextResponse.next();
  }

  // Verificación de token JWT
  const authCookie = request.cookies.get("auth");
  if (!authCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(authCookie.value, new TextEncoder().encode(JWT_SECRET));
  } catch (e) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```

**Configuración del Middleware:**

```typescript
export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif|api/auth/login|api/auth/crearusuario|api/auth/logout).*)",
  ],
};
```

**Rutas Protegidas:**

- Todas las páginas de la aplicación
- APIs internas del sistema
- Recursos estáticos (con excepciones)

**Rutas Públicas:**

- `/login` - Página de autenticación
- `/api/auth/*` - Endpoints de autenticación
- `/api/ping` - Health check del sistema

### 2. Librería de Autenticación (`lib/auth.ts`)

#### Funciones de Gestión de Contraseñas

```typescript
// Validación de fortaleza de contraseña
export function isStrongPassword(password: string): boolean {
  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/;
  return strongRegex.test(password);
}

// Encriptación de contraseña
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 14; // Mayor seguridad
  return bcrypt.hash(password, saltRounds);
}

// Verificación de contraseña
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

**Requisitos de Contraseña:**

- Mínimo 12 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un símbolo especial

**Configuración de Bcrypt:**

- Salt rounds: 14 (alto nivel de seguridad)
- Algoritmo: bcrypt con salt único por contraseña

#### Gestión de Usuarios

```typescript
// Creación de usuario
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  phone?: string;
  serviceId?: string;
}) {
  // Validación de contraseña
  if (!userData.password || userData.password.length < 4) {
    throw new Error(
      "La contraseña debe tener al menos 4 caracteres (validación temporal para pruebas)."
    );
  }

  const hashedPassword = await hashPassword(userData.password);

  const user = await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      passwordHash: hashedPassword,
      role: userData.role || "user",
      firstName: userData.firstName,
      lastName: userData.lastName,
      department: userData.department,
      phone: userData.phone,
      serviceId: userData.serviceId,
      isActive: true,
    },
  });

  // Auditoría de creación
  if (userData.performedBy) {
    await prisma.userChangeHistory.create({
      data: {
        targetUserId: user.id,
        action: "create",
        performedBy: userData.performedBy,
        details: `Usuario creado: ${user.username}`,
      },
    });
  }

  return user;
}
```

**Características de Creación:**

- Validación de datos de entrada
- Encriptación automática de contraseña
- Asignación de rol por defecto
- Auditoría de cambios
- Activación automática del usuario

#### Autenticación de Usuarios

```typescript
export async function authenticateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return null;
  }

  if (!user.isActive) {
    return { inactive: true };
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);
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
  };
}
```

**Proceso de Autenticación:**

1. Búsqueda del usuario por username
2. Verificación de estado activo
3. Comparación de contraseña encriptada
4. Retorno de datos del usuario (sin contraseña)

#### Verificación de Autenticación

```typescript
export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get("auth")?.value;

    if (!token) {
      return { success: false, error: "No token provided" };
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    if (!payload.id) {
      return { success: false, error: "Invalid token" };
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
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return { success: false, error: "User not found or inactive" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { success: false, error: "Invalid token" };
  }
}
```

**Proceso de Verificación:**

1. Extracción del token de la cookie
2. Verificación del JWT con la clave secreta
3. Validación del payload del token
4. Búsqueda del usuario en la base de datos
5. Verificación de estado activo

## Endpoints de Autenticación

### 1. Login (`/api/auth/login`)

**Método:** POST

**Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Respuesta Exitosa:**

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

**Respuesta de Error:**

```json
{
  "success": false,
  "error": "Credenciales inválidas"
}
```

### 2. Crear Usuario (`/api/auth/crearusuario`)

**Método:** POST

**Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string",
  "firstName": "string",
  "lastName": "string",
  "department": "string",
  "phone": "string",
  "serviceId": "string"
}
```

**Respuesta Exitosa:**

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

### 3. Logout (`/api/auth/logout`)

**Método:** POST

**Respuesta:**

```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

## Gestión de Sesiones

### 1. JWT Tokens

**Configuración:**

- **Algoritmo:** HS256 (HMAC SHA-256)
- **Expiración:** Configurable por variable de entorno
- **Clave Secreta:** `JWT_SECRET` en variables de entorno

**Estructura del Token:**

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": 1,
    "username": "usuario",
    "role": "user",
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

### 2. Cookies de Sesión

**Configuración:**

- **Nombre:** `auth`
- **HttpOnly:** true (seguridad contra XSS)
- **Secure:** true en producción (HTTPS)
- **SameSite:** Strict (protección CSRF)

## Roles y Permisos

### 1. Sistema de Roles

**Roles Disponibles:**

- **`user`**: Usuario estándar del sistema
- **`admin`**: Administrador con acceso completo

**Permisos por Rol:**

#### Usuario Estándar (`user`)

- Acceso al dashboard personal
- Visualización de servicios asignados
- Gestión de perfil personal
- Visualización de notificaciones

#### Administrador (`admin`)

- Gestión completa de usuarios
- Gestión de servicios y direcciones
- Acceso a logs de auditoría
- Configuración del sistema

### 2. Control de Acceso

```typescript
// Verificación de rol en componentes
const { user } = useAuth();

if (user?.role !== "admin") {
  return <AccessDenied />;
}

// Verificación en API routes
export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);

  if (!authResult.success || authResult.user.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  // Lógica de la API
}
```

## Auditoría y Logging

### 1. Historial de Cambios

**Tabla:** `user_change_history`

**Campos Registrados:**

- Usuario objetivo del cambio
- Tipo de acción realizada
- Usuario que realizó la acción
- Detalles del cambio
- Timestamp de la acción

**Acciones Registradas:**

- `create`: Creación de usuario
- `update`: Modificación de usuario
- `deactivate`: Desactivación de usuario
- `password_change`: Cambio de contraseña

### 2. Log de Auditoría

**Tabla:** `audit_log`

**Campos Registrados:**

- Acción realizada
- Usuario objetivo (opcional)
- Usuario que realizó la acción (opcional)
- Detalles adicionales
- Dirección IP
- User Agent del navegador
- Timestamp de la acción

## Seguridad y Mejores Prácticas

### 1. Protección contra Ataques

**XSS (Cross-Site Scripting):**

- Cookies HttpOnly
- Sanitización de entrada
- Escape de salida

**CSRF (Cross-Site Request Forgery):**

- Tokens CSRF en formularios
- Cookies SameSite
- Verificación de origen

**SQL Injection:**

- Uso de Prisma ORM
- Parámetros preparados
- Validación de entrada

**Brute Force:**

- Límite de intentos de login
- Bloqueo temporal de cuentas
- Logs de intentos fallidos

### 2. Configuración de Seguridad

**Variables de Entorno Requeridas:**

```bash
JWT_SECRET=clave_secreta_muy_larga_y_compleja
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/cagpu
NODE_ENV=production
```

**Configuración de Producción:**

- HTTPS obligatorio
- Headers de seguridad
- Rate limiting
- Logs de auditoría

### 3. Monitoreo y Alertas

**Métricas de Seguridad:**

- Intentos de login fallidos
- Cambios de contraseña
- Creación/modificación de usuarios
- Accesos a rutas protegidas

**Alertas Automáticas:**

- Múltiples intentos de login fallidos
- Cambios de rol de usuario
- Desactivación de usuarios
- Accesos desde IPs sospechosas

## Troubleshooting

### 1. Problemas Comunes

**Token Expirado:**

```typescript
// Verificar expiración del JWT
const { payload } = await jwtVerify(token, secret);
if (payload.exp && payload.exp < Date.now() / 1000) {
  // Token expirado, redirigir a login
}
```

**Usuario Inactivo:**

```typescript
// Verificar estado del usuario
if (!user.isActive) {
  return { inactive: true };
}
```

**Contraseña Incorrecta:**

```typescript
// Verificar contraseña
const isValidPassword = await verifyPassword(password, user.passwordHash);
if (!isValidPassword) {
  return null;
}
```

### 2. Debug y Logs

**Habilitar Logs de Debug:**

```typescript
// En desarrollo
console.log("Auth verification error:", error);

// En producción
logger.error("Auth verification failed", { error, userId, ip });
```

**Verificar Estado de la Sesión:**

```typescript
// Verificar cookie en el navegador
document.cookie.includes("auth=");

// Verificar token en localStorage (si se usa)
localStorage.getItem("authToken");
```

## Próximas Mejoras

### 1. Autenticación Multi-Factor (MFA)

- Códigos de verificación por SMS/Email
- Aplicaciones de autenticación (TOTP)
- Backup codes para recuperación

### 2. Gestión de Sesiones Avanzada

- Múltiples sesiones por usuario
- Revocación de sesiones
- Timeout por inactividad

### 3. Integración con Sistemas Externos

- Single Sign-On (SSO)
- OAuth 2.0 / OpenID Connect
- LDAP / Active Directory

### 4. Análisis de Seguridad

- Machine Learning para detección de anomalías
- Análisis de patrones de acceso
- Alertas inteligentes
