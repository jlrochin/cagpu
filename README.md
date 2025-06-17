# CAGPU - Catálogo de Atención

Sistema de gestión de servicios hospitalarios desarrollado con Next.js, PostgreSQL y Docker.

## 🚀 Características

- **Dashboard interactivo** para gestión de servicios hospitalarios
- **Sistema de autenticación** con base de datos PostgreSQL
- **Gestión de usuarios** con roles (admin/user)
- **Catálogo de direcciones y servicios** médicos
- **Sistema de notificaciones** en tiempo real
- **Interfaz responsive** con tema claro/oscuro
- **Containerizado con Docker** para fácil despliegue

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI, Framer Motion
- **Base de datos**: PostgreSQL 15
- **ORM**: Prisma
- **Autenticación**: bcryptjs
- **Containerización**: Docker & Docker Compose
- **Gestión de paquetes**: pnpm

## 📋 Prerrequisitos

- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- pnpm (para desarrollo local)

## 🐳 Ejecutar con Docker

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd cagpu
```

### 2. Generar script de inicialización de base de datos
```bash
node scripts/init-db.js
```

### 3. Ejecutar con Docker Compose
```bash
docker-compose up -d
```

### 4. Acceder a la aplicación
- **Aplicación**: http://localhost:3000
- **pgAdmin**: http://localhost:5050
  - Email: admin@cagpu.com
  - Contraseña: admin123

### 5. Credenciales de prueba
- **Admin**: admin / admin123
- **Usuario**: user / user123

## 🔧 Desarrollo Local

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Configurar variables de entorno
Crear archivo `.env.local`:
```env
DATABASE_URL="postgresql://cagpu_user:cagpu_password@localhost:5432/cagpu_db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Ejecutar base de datos
```bash
docker-compose up postgres -d
```

### 4. Configurar Prisma
```bash
pnpm prisma generate
pnpm prisma db push
```

### 5. Ejecutar aplicación
```bash
pnpm dev
```

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
├── Dockerfile            # Configuración de Docker
├── docker-compose.yml    # Orquestación de servicios
└── ...
```

## 🗄️ Base de Datos

### Tablas principales:
- **users**: Usuarios del sistema
- **directions**: Direcciones hospitalarias
- **services**: Servicios médicos
- **notifications**: Notificaciones del sistema

### Conexión:
- **Host**: localhost (desarrollo) / postgres (Docker)
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
# Ejecutar aplicación en Docker
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener servicios
docker-compose down

# Reconstruir imagen
docker-compose build --no-cache

# Acceder a la base de datos
docker-compose exec postgres psql -U cagpu_user -d cagpu_db

# Ejecutar migraciones de Prisma
pnpm prisma migrate dev

# Generar cliente de Prisma
pnpm prisma generate
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

- La aplicación está configurada para usar `output: 'standalone'` en Next.js para optimizar el tamaño del contenedor
- Se incluye pgAdmin para administración de base de datos (opcional)
- Los datos iniciales se cargan automáticamente al iniciar el contenedor
- El sistema de autenticación está preparado para JWT (pendiente de implementar)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 