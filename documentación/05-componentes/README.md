# Componentes de la Interfaz - Sistema CAGPU

## Visión General

El sistema de componentes del CAGPU está construido sobre una arquitectura modular y reutilizable, utilizando React con TypeScript y Tailwind CSS. Los componentes están organizados en dos categorías principales: componentes de interfaz base (UI) y componentes específicos de la aplicación.

## Arquitectura de Componentes

### Estructura de Directorios

```
components/
├── ui/                       # Componentes base reutilizables
│   ├── accordion.tsx        # Acordeón colapsable
│   ├── alert.tsx            # Alertas y notificaciones
│   ├── button.tsx           # Botones con variantes
│   ├── card.tsx             # Tarjetas contenedoras
│   ├── dialog.tsx           # Modales y diálogos
│   ├── form.tsx             # Formularios con validación
│   ├── input.tsx            # Campos de entrada
│   ├── table.tsx            # Tablas de datos
│   └── ...                  # Otros componentes base
├── header.tsx                # Cabecera principal
├── sidebar.tsx               # Barra lateral de navegación
├── dashboard-overview.tsx    # Vista general del dashboard
├── analytics-dashboard.tsx   # Dashboard de análisis
├── service-management.tsx    # Gestión de servicios
├── profile-content.tsx       # Contenido del perfil
├── notifications-popover.tsx # Popover de notificaciones
└── ...                       # Otros componentes específicos
```

## Sistema de Diseño

### Paleta de Colores

**Colores Primarios:**
- **Primary-600**: `#4b5563` - Botones principales, encabezados, íconos activos
- **Primary-700**: `#374151` - Estados hover, íconos secundarios
- **Accent-600**: `#dc2626` - Elementos destacados y llamadas a la acción (ROJO)

**Colores de Estado:**
- **Success**: `#10B981` - Métricas positivas
- **Warning**: `#F59E0B` - Alertas suaves
- **Error**: `#ef4444` - Elementos de atención (ROJO)

**Colores de Fondo:**
- **Card Background**: `#FFFFFF` - Con sombra suave y bordes rounded-xl
- **General Background**: `#F1F5F9` - O degradado sutil

**Colores de Texto:**
- **Primary Text**: `#1E293B` - Texto principal
- **Secondary Text**: `#64748B` - Texto secundario

### Tipografía

**Jerarquía de Texto:**
- **Títulos**: `text-xl` - Para encabezados de sección
- **Métricas Clave**: `text-3xl` - Para números importantes
- **Texto Principal**: `text-base` - Para contenido regular
- **Texto Secundario**: `text-sm` - Para información adicional

### Espaciado y Layout

**Sistema de Espaciado:**
- **xs**: `0.25rem` (4px)
- **sm**: `0.5rem` (8px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)
- **2xl**: `3rem` (48px)

**Layout Responsive:**
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: Flexbox y CSS Grid para layouts complejos

## Componentes Base (UI)

### 1. Button (`components/ui/button.tsx`)

**Descripción:** Componente de botón reutilizable con múltiples variantes

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}
```

**Variantes:**
- **default**: Botón principal con color primario
- **destructive**: Botón de acción destructiva (rojo)
- **outline**: Botón con borde y fondo transparente
- **secondary**: Botón secundario con color gris
- **ghost**: Botón fantasma sin fondo
- **link**: Botón que parece un enlace

**Ejemplo de Uso:**
```tsx
import { Button } from '@/components/ui/button'

export function ActionButtons() {
  return (
    <div className="flex gap-2">
      <Button variant="default" size="lg">
        Guardar Cambios
      </Button>
      <Button variant="outline" size="lg">
        Cancelar
      </Button>
      <Button variant="destructive" size="sm">
        Eliminar
      </Button>
    </div>
  )
}
```

### 2. Card (`components/ui/card.tsx`)

**Descripción:** Contenedor de tarjeta con encabezado, contenido y pie

**Componentes:**
- `Card`: Contenedor principal
- `CardHeader`: Encabezado de la tarjeta
- `CardTitle`: Título de la tarjeta
- `CardDescription`: Descripción de la tarjeta
- `CardContent`: Contenido principal
- `CardFooter`: Pie de la tarjeta

**Ejemplo de Uso:**
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

export function UserCard({ user }: { user: User }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{user.firstName} {user.lastName}</CardTitle>
        <CardDescription>{user.department}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-600">{user.phone}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">Editar</Button>
      </CardFooter>
    </Card>
  )
}
```

### 3. Dialog (`components/ui/dialog.tsx`)

**Descripción:** Modal/diálogo para confirmaciones y formularios

**Componentes:**
- `Dialog`: Contenedor del diálogo
- `DialogTrigger`: Elemento que activa el diálogo
- `DialogContent`: Contenido del diálogo
- `DialogHeader`: Encabezado del diálogo
- `DialogTitle`: Título del diálogo
- `DialogDescription`: Descripción del diálogo
- `DialogFooter`: Pie del diálogo

**Ejemplo de Uso:**
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function ConfirmDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Eliminar Usuario</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
        </DialogHeader>
        <p>¿Estás seguro de que quieres eliminar este usuario?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### 4. Form (`components/ui/form.tsx`)

**Descripción:** Sistema de formularios con validación usando React Hook Form y Zod

**Componentes:**
- `Form`: Contenedor del formulario
- `FormField`: Campo del formulario con validación
- `FormItem`: Item del formulario
- `FormLabel`: Etiqueta del campo
- `FormControl`: Control del campo
- `FormDescription`: Descripción del campo
- `FormMessage`: Mensaje de error/validación

**Ejemplo de Uso:**
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const userSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido')
})

export function UserForm() {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: ''
    }
  })

  function onSubmit(values: z.infer<typeof userSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa tu nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  )
}
```

### 5. Table (`components/ui/table.tsx`)

**Descripción:** Componente de tabla con ordenamiento y paginación

**Componentes:**
- `Table`: Contenedor de la tabla
- `TableHeader`: Encabezado de la tabla
- `TableRow`: Fila de la tabla
- `TableHead`: Celda de encabezado
- `TableBody`: Cuerpo de la tabla
- `TableCell`: Celda de datos

**Ejemplo de Uso:**
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function UsersTable({ users }: { users: User[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Departamento</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.firstName} {user.lastName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.department}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">Editar</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Componentes Específicos de la Aplicación

### 1. Header (`components/header.tsx`)

**Descripción:** Cabecera principal de la aplicación con navegación y controles

**Características:**
- Logo de la aplicación
- Navegación principal
- Búsqueda global
- Notificaciones
- Perfil de usuario
- Toggle de tema

**Implementación:**
```tsx
export function Header() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/logo_cagpu_optimized.png" alt="CAGPU" width={32} height={32} />
            <span className="hidden font-bold sm:inline-block">CAGPU</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ThemeToggle />
          <NotificationsPopover />
          <UserNav user={user} onLogout={logout} />
        </div>
      </div>
    </header>
  )
}
```

### 2. Sidebar (`components/ui/sidebar.tsx`)

**Descripción:** Barra lateral de navegación con menú principal

**Características:**
- Navegación por páginas
- Agrupación de elementos por categoría
- Indicadores de estado activo
- Colapso/expansión
- Responsive design

**Estructura del Menú:**
```typescript
const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Vista general del sistema"
  },
  {
    title: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
    description: "Gestión de usuarios",
    role: "admin"
  },
  {
    title: "Servicios",
    href: "/servicios",
    icon: Briefcase,
    description: "Gestión de servicios"
  },
  {
    title: "Notificaciones",
    href: "/notificaciones",
    icon: Bell,
    description: "Sistema de notificaciones"
  },
  {
    title: "Perfil",
    href: "/perfil",
    icon: User,
    description: "Gestión de perfil personal"
  },
  {
    title: "Configuración",
    href: "/configuracion",
    icon: Settings,
    description: "Configuración del sistema",
    role: "admin"
  }
]
```

### 3. Dashboard Overview (`components/dashboard-overview.tsx`)

**Descripción:** Vista general del dashboard con métricas y resumen

**Componentes:**
- Tarjetas de métricas principales
- Gráficos de estadísticas
- Lista de actividades recientes
- Accesos rápidos

**Ejemplo de Implementación:**
```tsx
export function DashboardOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    fetchDashboardStats().then(setStats)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newUsersThisMonth || 0} este mes
            </p>
          </CardContent>
        </Card>
        
        {/* Más tarjetas de métricas */}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={stats?.recentActivities || []} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 4. Service Management (`components/service-management.tsx`)

**Descripción:** Gestión completa de servicios del sistema

**Funcionalidades:**
- Lista de servicios con filtros
- Creación de nuevos servicios
- Edición de servicios existentes
- Desactivación de servicios
- Búsqueda y ordenamiento

**Componentes Principales:**
```tsx
export function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDirection, setSelectedDirection] = useState<string>('all')

  // Filtrado de servicios
  useEffect(() => {
    let filtered = services
    
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.responsiblePerson?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedDirection !== 'all') {
      filtered = filtered.filter(service => service.directionId === selectedDirection)
    }
    
    setFilteredServices(filtered)
  }, [services, searchTerm, selectedDirection])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Servicios</h2>
        <ServiceForm onServiceCreated={handleServiceCreated} />
      </div>
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedDirection} onValueChange={setSelectedDirection}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas las direcciones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las direcciones</SelectItem>
            {directions.map(direction => (
              <SelectItem key={direction.id} value={direction.id}>
                {direction.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <ServicesTable 
        services={filteredServices} 
        onServiceUpdated={handleServiceUpdated}
        onServiceDeleted={handleServiceDeleted}
      />
    </div>
  )
}
```

### 5. Notifications Popover (`components/notifications-popover.tsx`)

**Descripción:** Popover para mostrar notificaciones del usuario

**Características:**
- Lista de notificaciones no leídas
- Marcado de notificaciones como leídas
- Contador de notificaciones
- Navegación a notificaciones completas

**Implementación:**
```tsx
export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications().then(setNotifications)
  }, [])

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length)
  }, [notifications])

  const markAsRead = async (notificationId: number) => {
    await markNotificationAsRead(notificationId)
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Notificaciones</h4>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/notificaciones">Ver todas</Link>
            </Button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.slice(0, 5).map(notification => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.isRead ? 'bg-muted/50' : 'bg-background'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {notification.message && (
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Marcar como leída
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

## Responsive Design

### 1. Breakpoints y Media Queries

**Sistema de Breakpoints:**
```css
/* Tailwind CSS breakpoints */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

**Implementación en Componentes:**
```tsx
export function ResponsiveLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        {/* Contenido */}
      </Card>
    </div>
  )
}
```

### 2. Mobile-First Approach

**Estrategia de Diseño:**
- Diseño base para móviles
- Mejoras progresivas para pantallas más grandes
- Navegación adaptativa (sidebar → mobile menu)
- Touch-friendly interactions

**Ejemplo de Navegación Responsive:**
```tsx
export function Navigation() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return <MobileNavigation />
  }

  return <DesktopNavigation />
}
```

## Accesibilidad

### 1. ARIA Labels y Roles

**Implementación de ARIA:**
```tsx
export function AccessibleButton({ children, ...props }) {
  return (
    <button
      aria-label="Descripción de la acción"
      role="button"
      tabIndex={0}
      {...props}
    >
      {children}
    </button>
  )
}
```

### 2. Navegación por Teclado

**Soporte de Teclado:**
```tsx
export function KeyboardNavigableList({ items }) {
  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        // Navegar al siguiente elemento
        break
      case 'ArrowUp':
        event.preventDefault()
        // Navegar al elemento anterior
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        // Activar elemento
        break
    }
  }

  return (
    <ul role="listbox">
      {items.map((item, index) => (
        <li
          key={item.id}
          role="option"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}
```

### 3. Contraste y Legibilidad

**Verificación de Contraste:**
- Ratio mínimo de 4.5:1 para texto normal
- Ratio mínimo de 3:1 para texto grande
- Herramientas de verificación automática
- Testing con usuarios reales

## Performance y Optimización

### 1. Lazy Loading

**Implementación de Lazy Loading:**
```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

export function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 2. Memoización

**Optimización con React.memo:**
```tsx
export const ExpensiveComponent = React.memo(({ data }: { data: any[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyProcessing(item)
    }))
  }, [data])

  return (
    <div>
      {processedData.map(item => (
        <DataItem key={item.id} item={item} />
      ))}
    </div>
  )
})
```

### 3. Virtualización

**Listas Virtuales para Datos Grandes:**
```tsx
import { FixedSizeList as List } from 'react-window'

export function VirtualizedList({ items }: { items: any[] }) {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => (
    <div style={style}>
      <ListItem item={items[index]} />
    </div>
  )

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

## Testing de Componentes

### 1. Tests Unitarios

**Ejemplo de Test:**
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Click me</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('bg-destructive')
  })
})
```

### 2. Tests de Integración

**Testing de Flujos Completos:**
```tsx
describe('UserForm Integration', () => {
  it('submits form data correctly', async () => {
    const mockSubmit = jest.fn()
    render(<UserForm onSubmit={mockSubmit} />)
    
    // Llenar formulario
    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: { value: 'Juan' }
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'juan@example.com' }
    })
    
    // Enviar formulario
    fireEvent.click(screen.getByText('Guardar'))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'Juan',
        email: 'juan@example.com'
      })
    })
  })
})
```

## Documentación de Componentes

### 1. Storybook

**Configuración de Storybook:**
```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}
```

### 2. Props Documentation

**Documentación de Props:**
```tsx
interface ButtonProps {
  /** Variante visual del botón */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  
  /** Tamaño del botón */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  
  /** Contenido del botón */
  children: React.ReactNode
  
  /** Estado de carga */
  loading?: boolean
  
  /** Deshabilitado */
  disabled?: boolean
  
  /** Función llamada al hacer click */
  onClick?: () => void
}
```

## Próximas Mejoras

### 1. Componentes Avanzados

**Planeados para Futuras Versiones:**
- DataGrid con ordenamiento avanzado
- Editor de texto rico
- Componente de calendario avanzado
- Sistema de drag & drop
- Componentes de gráficos interactivos

### 2. Optimizaciones de Performance

**Mejoras Técnicas:**
- Implementación de React Concurrent Features
- Optimización de re-renders
- Lazy loading de componentes pesados
- Virtualización de listas largas

### 3. Mejoras de Accesibilidad

**Funcionalidades de Accesibilidad:**
- Soporte completo de lectores de pantalla
- Navegación por voz
- Modo de alto contraste
- Reducción de movimiento para usuarios sensibles

### 4. Internacionalización

**Soporte Multi-idioma:**
- Componentes con soporte i18n
- Formateo de fechas y números por región
- Dirección de texto (RTL/LTR)
- Traducciones automáticas
