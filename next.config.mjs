// ============================================================================
// CONFIGURACIÓN DE NEXT.JS PARA CAGPU
// ============================================================================
// Este archivo define la configuración principal de Next.js
// Incluye configuraciones para:
// - ESLint y TypeScript durante el build
// - Optimización de imágenes
// - Configuraciones de desarrollo y producción
// ============================================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================================
  // CONFIGURACIÓN DE ESLINT
  // ============================================================================
  // Ignora errores de ESLint durante el build para desarrollo
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ============================================================================
  // CONFIGURACIÓN DE TYPESCRIPT
  // ============================================================================
  // Ignora errores de TypeScript durante el build para desarrollo
  typescript: {
    ignoreBuildErrors: true,
  },

  // ============================================================================
  // CONFIGURACIÓN DE IMÁGENES
  // ============================================================================
  // Desactiva la optimización automática de imágenes para desarrollo
  // En producción, considerar habilitar esta opción
  images: {
    unoptimized: true,
  },
}

export default nextConfig
