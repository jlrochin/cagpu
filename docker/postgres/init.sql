-- ============================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS - CAGPU
-- ============================================================================

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear usuario si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'cagpu_user') THEN
        CREATE USER cagpu_user WITH PASSWORD 'tu_contraseña_super_segura_aqui';
    END IF;
END
$$;

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON DATABASE cagpu_production TO cagpu_user;
GRANT ALL ON SCHEMA public TO cagpu_user;
