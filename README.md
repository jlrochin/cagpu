# Sistema CAGPU

Sistema de gestión de usuarios, servicios y direcciones construido con Next.js 14, React, TypeScript y Prisma.

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd cagpu

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar desarrollo
pnpm dev
```

### Comandos Útiles

```bash
# Desarrollo
pnpm dev                    # Servidor de desarrollo
pnpm build                  # Construir para producción
pnpm start                  # Servidor de producción

# Base de datos
npx prisma studio          # Interfaz visual de BD
npx prisma migrate dev     # Ejecutar migraciones
npx prisma generate        # Generar cliente Prisma

# Testing
pnpm test                  # Ejecutar tests
pnpm test:watch           # Tests en modo watch
```

## 📚 Documentación

**La documentación completa del sistema está disponible en la aplicación web:**

- **URL**: `http://localhost:3000/documentacion` ✅ **FUNCIONANDO**
- **Acceso**: Desde el header principal (ícono de libro)
- **Navegación**: Sidebar lateral con todas las secciones
- **Estado**: Completamente funcional y accesible

### Secciones de Documentación

1. **Arquitectura del Sistema** - Estructura, tecnologías y patrones
2. **Base de Datos** - Esquema, modelos y optimización
3. **Autenticación y Autorización** - Seguridad y permisos
4. **API y Endpoints** - Endpoints disponibles y validaciones
5. **Componentes de la Interfaz** - Sistema de diseño y componentes
6. **Páginas y Rutas** - Estructura de navegación
7. **Estado y Gestión de Datos** - Hooks y contexto
8. **Utilidades y Helpers** - Funciones auxiliares
9. **Despliegue y Configuración** - Docker y CI/CD
10. **Mantenimiento y Operaciones** - Scripts y mantenimiento

## 🏗️ Arquitectura

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT, bcrypt
- **Deployment**: Docker, Nginx, Systemd

## 📁 Estructura del Proyecto

```
cagpu/
├── app/                    # App Router de Next.js
├── components/             # Componentes React
├── lib/                    # Utilidades y configuración
├── prisma/                 # Esquema y migraciones de BD
├── scripts/                # Scripts de mantenimiento
├── documentación/          # Documentación completa
└── README.md               # Este archivo
```

## 🔧 Características

- ✅ Autenticación y autorización robusta
- ✅ Gestión completa de usuarios y roles
- ✅ Sistema de notificaciones
- ✅ Auditoría y logging
- ✅ Interfaz responsive y accesible
- ✅ API RESTful documentada
- ✅ Base de datos optimizada
- ✅ Scripts de mantenimiento automático

## 📖 Documentación Detallada

Para acceder a la documentación completa del sistema:

1. Inicia el servidor de desarrollo: `pnpm dev`
2. Abre tu navegador en: `http://localhost:3000`
3. Haz clic en el ícono de libro 📚 en el header
4. Navega por las diferentes secciones usando el sidebar
5. **URL directa**: `http://localhost:3000/documentacion`

## 🤝 Contribución

1. Crear branch desde `main`
2. Implementar cambios
3. Ejecutar tests y linting
4. Crear Pull Request
5. Revisión de código
6. Merge a `main`

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

**Última actualización**: Diciembre 2024  
**Versión del sistema**: 1.0.0  
**Mantenido por**: Equipo de Desarrollo CAGPU
