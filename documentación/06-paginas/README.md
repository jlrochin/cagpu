# Páginas y Rutas - Sistema CAGPU

## Visión General

El sistema de páginas y rutas del CAGPU está construido sobre Next.js 14 con App Router, proporcionando una navegación intuitiva y una estructura de contenido organizada. Cada página está diseñada para cumplir funciones específicas dentro del sistema.

## Estructura de Navegación

### Jerarquía de Páginas

```
/                           # Página de inicio (redirect a /dashboard)
├── login/                  # Autenticación de usuarios
├── dashboard/              # Dashboard principal
├── admin/                  # Área administrativa
│   └── usuarios/          # Gestión de usuarios
├── configuracion/          # Configuración del sistema
├── notificaciones/         # Sistema de notificaciones
├── perfil/                 # Gestión de perfil personal
└── servicios/              # Gestión de servicios (futuro)
```

### Navegación Principal

**Menú Lateral (Sidebar):**
- **Dashboard**: Vista general del sistema
- **Usuarios**: Gestión de usuarios (solo admin)
- **Servicios**: Gestión de servicios y direcciones
- **Notificaciones**: Sistema de notificaciones
- **Perfil**: Configuración personal
- **Configuración**: Configuración del sistema (solo admin)

## Páginas Principales

### 1. Página de Inicio (`/`)

**Descripción:** Página raíz que redirige automáticamente al dashboard

**Implementación:**
```tsx
// app/page.tsx
export default function HomePage() {
  redirect('/dashboard')
}
```

**Comportamiento:**
- Redirección automática a `/dashboard` para usuarios autenticados
- Redirección a `/login` para usuarios no autenticados
- Manejo a través del middleware de autenticación

### 2. Página de Login (`/login`)

**Descripción:** Página de autenticación del sistema

**Características:**
- Formulario de login con validación
- Manejo de errores de autenticación
- Redirección automática post-login
- Diseño responsive y accesible

**Implementación:**
```tsx
// app/login/page.tsx
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <Image
            src="/logo_cagpu_optimized.png"
            alt="CAGPU Logo"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta del sistema CAGPU
          </p>
        </div>
        
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}
```

**Componentes Utilizados:**
- `LoginForm`: Formulario de autenticación
- `AnimatedBackground`: Fondo animado opcional
- Validación de campos con React Hook Form

### 3. Dashboard Principal (`/dashboard`)

**Descripción:** Página principal del sistema con métricas y resumen

**Layout:**
```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <DatePicker />
          <ExportOptions />
        </div>
      </div>
      
      <DashboardOverview />
      <AnalyticsDashboard />
    </div>
  )
}
```

**Componentes Principales:**
- `DashboardOverview`: Vista general con métricas clave
- `AnalyticsDashboard`: Gráficos y análisis detallados
- `DatePicker`: Selector de período de análisis
- `ExportOptions`: Opciones de exportación de datos

**Funcionalidades:**
- Métricas en tiempo real
- Gráficos interactivos
- Filtros por período
- Exportación de reportes
- Accesos rápidos a funcionalidades

### 4. Gestión de Usuarios (`/admin/usuarios`)

**Descripción:** Página administrativa para gestión completa de usuarios

**Acceso:** Solo usuarios con rol `admin`

**Funcionalidades:**
- Lista de usuarios con paginación
- Filtros por rol, departamento y estado
- Búsqueda por nombre, email o username
- Creación de nuevos usuarios
- Edición de usuarios existentes
- Desactivación de usuarios
- Historial de cambios

**Implementación:**
```tsx
// app/admin/usuarios/page.tsx
export default function UsersPage() {
  const { user } = useAuth()
  
  // Verificación de permisos
  if (user?.role !== 'admin') {
    return <AccessDenied />
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
        <CreateUserDialog />
      </div>
      
      <UsersFilters />
      <UsersTable />
      <UsersPagination />
    </div>
  )
}
```

**Componentes Específicos:**
- `CreateUserDialog`: Modal para crear usuarios
- `UsersFilters`: Filtros avanzados de búsqueda
- `UsersTable`: Tabla de usuarios con acciones
- `UsersPagination`: Paginación de resultados
- `UserEditDialog`: Modal para editar usuarios

### 5. Configuración del Sistema (`/configuracion`)

**Descripción:** Página de configuración general del sistema

**Acceso:** Solo usuarios con rol `admin`

**Secciones de Configuración:**
- Configuración general del sistema
- Gestión de direcciones y servicios
- Configuración de notificaciones
- Parámetros de seguridad
- Backup y restauración

**Implementación:**
```tsx
// app/configuracion/page.tsx
export default function ConfigurationPage() {
  const { user } = useAuth()
  
  if (user?.role !== 'admin') {
    return <AccessDenied />
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h2>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="directions">Direcciones</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="directions">
          <DirectionsManagement />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        
        <TabsContent value="backup">
          <BackupSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### 6. Sistema de Notificaciones (`/notificaciones`)

**Descripción:** Página para gestión de notificaciones del usuario

**Funcionalidades:**
- Lista de todas las notificaciones
- Filtros por estado (leídas/no leídas)
- Búsqueda por contenido
- Marcado masivo como leídas
- Configuración de preferencias

**Implementación:**
```tsx
// app/notificaciones/page.tsx
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filters, setFilters] = useState({
    isRead: 'all',
    search: '',
    dateRange: 'all'
  })

  useEffect(() => {
    fetchNotifications(filters).then(setNotifications)
  }, [filters])

  const markAllAsRead = async () => {
    await markNotificationsAsRead(notifications.map(n => n.id))
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Notificaciones</h2>
        <div className="flex items-center space-x-2">
          <NotificationsFilters filters={filters} onFiltersChange={setFilters} />
          <Button onClick={markAllAsRead} variant="outline">
            Marcar todas como leídas
          </Button>
        </div>
      </div>
      
      <NotificationsList 
        notifications={notifications}
        onNotificationUpdate={handleNotificationUpdate}
      />
    </div>
  )
}
```

### 7. Perfil de Usuario (`/perfil`)

**Descripción:** Página para gestión del perfil personal del usuario

**Funcionalidades:**
- Visualización de información personal
- Edición de datos del perfil
- Cambio de contraseña
- Configuración de preferencias
- Historial de actividad

**Implementación:**
```tsx
// app/perfil/page.tsx
export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const handleProfileUpdate = async (data: ProfileUpdateData) => {
    try {
      await updateUser(data)
      setIsEditing(false)
      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      toast.error('Error al actualizar el perfil')
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
        <Button 
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancelar" : "Editar Perfil"}
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileInformation 
          user={user} 
          isEditing={isEditing}
          onUpdate={handleProfileUpdate}
        />
        
        <div className="space-y-6">
          <ChangePasswordForm />
          <ActivityHistory userId={user.id} />
          <PreferencesSettings />
        </div>
      </div>
    </div>
  )
}
```

## Layouts y Estructura

### 1. Layout Principal (`app/layout.tsx`)

**Descripción:** Layout raíz de la aplicación

**Características:**
- Providers globales (Theme, Auth)
- Estilos globales
- Metadatos de la aplicación
- Estructura HTML base

**Implementación:**
```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>CAGPU - Sistema de Gestión</title>
        <meta name="description" content="Sistema de gestión de usuarios y servicios CAGPU" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. Layout de Autenticación (`app/(auth)/layout.tsx`)

**Descripción:** Layout para páginas que requieren autenticación

**Características:**
- Verificación de autenticación
- Header y sidebar
- Navegación principal
- Contenido principal

**Implementación:**
```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 3. Layout de Página Individual

**Descripción:** Layout específico para páginas individuales

**Características:**
- Breadcrumbs de navegación
- Título de página
- Acciones específicas
- Contenido principal

**Ejemplo:**
```tsx
// app/admin/usuarios/layout.tsx
export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Administración</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Usuarios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {children}
    </div>
  )
}
```

## Sistema de Rutas

### 1. Rutas Estáticas

**Definición:**
- Páginas con rutas fijas
- Contenido predefinido
- SEO optimizado
- Generación estática cuando es posible

**Ejemplos:**
- `/dashboard` - Dashboard principal
- `/login` - Página de autenticación
- `/configuracion` - Configuración del sistema

### 2. Rutas Dinámicas

**Definición:**
- Páginas con parámetros variables
- Contenido generado dinámicamente
- Navegación contextual
- Reutilización de componentes

**Ejemplos:**
- `/admin/usuarios/[id]` - Detalle de usuario específico
- `/servicios/[serviceId]` - Detalle de servicio
- `/notificaciones/[notificationId]` - Detalle de notificación

**Implementación:**
```tsx
// app/admin/usuarios/[id]/page.tsx
export default function UserDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUser(params.id).then(user => {
      setUser(user)
      setIsLoading(false)
    })
  }, [params.id])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <NotFound />
  }

  return (
    <div className="space-y-6">
      <UserHeader user={user} />
      <UserTabs user={user} />
    </div>
  )
}
```

### 3. Rutas de API

**Definición:**
- Endpoints para operaciones CRUD
- Autenticación y autorización
- Validación de datos
- Respuestas JSON estandarizadas

**Estructura:**
```
/api/
├── auth/           # Autenticación
├── users/          # Gestión de usuarios
├── services/       # Gestión de servicios
├── directions/     # Gestión de direcciones
├── notifications/  # Sistema de notificaciones
└── profile/        # Perfil de usuario
```

## Navegación y UX

### 1. Breadcrumbs

**Implementación:**
```tsx
export function Breadcrumb({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {children}
      </ol>
    </nav>
  )
}

export function BreadcrumbItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center">
      {children}
    </li>
  )
}

export function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
    >
      {children}
    </Link>
  )
}
```

### 2. Navegación por Tabs

**Implementación:**
```tsx
export function UserTabs({ user }: { user: User }) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Vista General</TabsTrigger>
        <TabsTrigger value="details">Detalles</TabsTrigger>
        <TabsTrigger value="history">Historial</TabsTrigger>
        <TabsTrigger value="permissions">Permisos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <UserOverview user={user} />
      </TabsContent>
      
      <TabsContent value="details">
        <UserDetails user={user} />
      </TabsContent>
      
      <TabsContent value="history">
        <UserHistory userId={user.id} />
      </TabsContent>
      
      <TabsContent value="permissions">
        <UserPermissions user={user} />
      </TabsContent>
    </Tabs>
  )
}
```

### 3. Navegación Móvil

**Implementación:**
```tsx
export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo_cagpu_optimized.png"
                alt="CAGPU"
                width={32}
                height={32}
              />
              <span className="font-bold">CAGPU</span>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
```

## Manejo de Estados

### 1. Estados de Carga

**Implementación:**
```tsx
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-2 text-muted-foreground">Cargando...</span>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold">Cargando aplicación...</h2>
        <p className="mt-2 text-muted-foreground">Por favor espera un momento</p>
      </div>
    </div>
  )
}
```

### 2. Estados de Error

**Implementación:**
```tsx
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="mt-4 text-xl font-semibold">Algo salió mal</h2>
        <p className="mt-2 text-muted-foreground">
          Ha ocurrido un error inesperado
        </p>
        <Button 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          Recargar página
        </Button>
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="mt-4 text-xl font-semibold">Página no encontrada</h2>
        <p className="mt-2 text-muted-foreground">
          La página que buscas no existe
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard">Volver al Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
```

### 3. Estados Vacíos

**Implementación:**
```tsx
export function EmptyState({ 
  title, 
  description, 
  action 
}: { 
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12">
      <Inbox className="h-12 w-12 text-muted-foreground mx-auto" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// Uso en componentes
export function UsersTable({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No hay usuarios"
        description="Comienza creando el primer usuario del sistema"
        action={<CreateUserDialog />}
      />
    )
  }

  return (
    <Table>
      {/* Contenido de la tabla */}
    </Table>
  )
}
```

## Optimización y Performance

### 1. Lazy Loading de Páginas

**Implementación:**
```tsx
// app/dashboard/page.tsx
import dynamic from 'next/dynamic'

const AnalyticsDashboard = dynamic(() => import('@/components/analytics-dashboard'), {
  loading: () => <AnalyticsDashboardSkeleton />,
  ssr: false
})

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardOverview />
      <AnalyticsDashboard />
    </div>
  )
}
```

### 2. Prefetching de Rutas

**Implementación:**
```tsx
export function NavigationLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      prefetch={href.startsWith('/dashboard') || href.startsWith('/admin')}
    >
      {children}
    </Link>
  )
}
```

### 3. Caching de Datos

**Implementación:**
```tsx
export function UsersPage() {
  const { data: users, isLoading } = useSWR('/api/users', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000 // 1 minuto
  })

  if (isLoading) return <LoadingSpinner />
  
  return <UsersTable users={users} />
}
```

## Seguridad y Permisos

### 1. Verificación de Roles

**Implementación:**
```tsx
export function RequireRole({ 
  role, 
  children 
}: { 
  role: string
  children: React.ReactNode 
}) {
  const { user } = useAuth()

  if (user?.role !== role) {
    return <AccessDenied />
  }

  return <>{children}</>
}

// Uso en páginas
export default function AdminPage() {
  return (
    <RequireRole role="admin">
      <div className="space-y-6">
        <h1>Página de Administración</h1>
        {/* Contenido de la página */}
      </div>
    </RequireRole>
  )
}
```

### 2. Redirección de Usuarios No Autorizados

**Implementación:**
```tsx
export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
```

## Próximas Mejoras

### 1. Navegación Avanzada

**Funcionalidades Planeadas:**
- Búsqueda global inteligente
- Navegación por historial
- Favoritos y accesos rápidos
- Navegación por voz

### 2. Personalización

**Características Futuras:**
- Dashboards personalizables
- Temas de usuario
- Layouts configurables
- Widgets arrastrables

### 3. Internacionalización

**Soporte Multi-idioma:**
- Traducción completa de la interfaz
- Formateo regional de fechas y números
- Soporte RTL para idiomas árabes
- Detección automática de idioma

### 4. PWA y Offline

**Funcionalidades Mobile:**
- Instalación como aplicación
- Funcionamiento offline
- Sincronización de datos
- Notificaciones push
