# ============================================================================
# DOCKERFILE PARA DESPLIEGUE EN RAILWAY
# ============================================================================

# Usar Node.js 18 LTS
FROM node:18-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Generar Prisma client
RUN npx prisma generate

# Construir la aplicación
RUN pnpm build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "start"]
