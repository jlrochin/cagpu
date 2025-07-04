# CAGPU - Catálogo de Atención

Sistema de gestión de servicios hospitalarios desarrollado con Next.js y PostgreSQL.

## 🚀 Características

- **Dashboard interactivo** para gestión de servicios hospitalarios
- **Sistema de autenticación** con base de datos PostgreSQL
- **Gestión de usuarios** con roles (admin/user)
- **Catálogo de direcciones y servicios** médicos
- **Sistema de notificaciones** en tiempo real
- **Interfaz responsive** con tema claro/oscuro

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI, Framer Motion
- **Base de datos**: PostgreSQL 15
- **ORM**: Prisma
- **Autenticación**: bcryptjs
- **Gestión de paquetes**: pnpm

## 📋 Prerrequisitos

- Node.js 18+ instalado
- pnpm instalado
- PostgreSQL 15+ instalado y configurado

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd cagpu
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar la base de datos PostgreSQL

Crear una base de datos llamada `cagpu_db` en PostgreSQL:

```sql
CREATE DATABASE cagpu_db;
CREATE USER cagpu_user WITH PASSWORD 'cagpu_password';
GRANT ALL PRIVILEGES ON DATABASE cagpu_db TO cagpu_user;
```

### 4. Configurar variables de entorno

Crear archivo `.env.local`:

```env
DATABASE_URL="postgresql://cagpu_user:cagpu_password@localhost:5432/cagpu_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Generar script de inicialización de base de datos

```bash
node scripts/init-db.js
```

### 6. Configurar Prisma

```bash
pnpm prisma generate
pnpm prisma db push
```

### 7. Ejecutar aplicación

```bash
pnpm dev
```

### 8. Acceder a la aplicación

- **Aplicación**: http://localhost:3000

### 9. Credenciales de prueba

- **Admin**: admin / admin123
- **Usuario**: user / user123

## 📁 Estructura del Proyecto

```
cagpu/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # Página del dashboard
│   ├── login/            # Página de login
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI
│   └── ...
├── lib/                  # Utilidades y configuración
│   ├── auth.ts          # Funciones de autenticación
│   ├── db.ts            # Cliente de Prisma
│   └── ...
├── prisma/               # Esquema de base de datos
│   └── schema.prisma
├── scripts/              # Scripts de utilidad
└── ...
```

## 🗄️ Base de Datos

### Tablas principales:

- **users**: Usuarios del sistema
- **directions**: Direcciones hospitalarias
- **services**: Servicios médicos
- **notifications**: Notificaciones del sistema

### Conexión:

- **Host**: localhost
- **Puerto**: 5432
- **Base de datos**: cagpu_db
- **Usuario**: cagpu_user
- **Contraseña**: cagpu_password

## 🔐 Autenticación

El sistema utiliza autenticación basada en sesiones con bcrypt para el hash de contraseñas.

### Roles:

- **admin**: Acceso completo al sistema
- **user**: Acceso limitado a funcionalidades básicas

## 🚀 Comandos Útiles

```bash
# Ejecutar aplicación en desarrollo
pnpm dev

# Construir aplicación para producción
pnpm build

# Ejecutar aplicación en producción
pnpm start

# Acceder a la base de datos
psql -U cagpu_user -d cagpu_db -h localhost

# Ejecutar migraciones de Prisma
pnpm prisma migrate dev

# Generar cliente de Prisma
pnpm prisma generate

# Abrir Prisma Studio
pnpm prisma studio
```

## 🔧 Configuración de Producción

### Variables de entorno recomendadas:

```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

### Optimizaciones:

- Usar un proxy reverso (nginx)
- Configurar SSL/TLS
- Implementar rate limiting
- Configurar backups de base de datos

## 📝 Notas de Desarrollo

- La aplicación utiliza Next.js 14 con App Router
- Los datos iniciales se cargan automáticamente al ejecutar el script de inicialización
- El sistema de autenticación está preparado para JWT (pendiente de implementar)
- Se puede usar Prisma Studio para administrar la base de datos de manera visual

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
