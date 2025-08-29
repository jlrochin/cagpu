# Base de Datos - Sistema CAGPU

## Visión General

La base de datos del Sistema CAGPU está diseñada para gestionar usuarios, direcciones, servicios y notificaciones de manera eficiente y escalable. Utiliza PostgreSQL como motor de base de datos y Prisma como ORM para la gestión de datos.

## Esquema de la Base de Datos

### Modelo User (Usuarios)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  department VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP,
  is_invisible BOOLEAN DEFAULT false,
  service_id VARCHAR(50)
);
```

**Campos principales:**
- `id`: Identificador único autoincremental
- `username`: Nombre de usuario único
- `email`: Correo electrónico único
- `password_hash`: Contraseña encriptada con bcrypt
- `role`: Rol del usuario (user, admin)
- `is_active`: Estado activo/inactivo del usuario
- `is_invisible`: Usuario oculto del sistema
- `service_id`: Relación opcional con un servicio

**Relaciones:**
- `notifications`: Notificaciones del usuario
- `userChangeHistoryAsTarget`: Historial de cambios realizados al usuario
- `userChangeHistoryAsPerformer`: Cambios realizados por el usuario
- `auditLogsAsTarget`: Logs de auditoría donde el usuario es objetivo
- `auditLogsAsPerformer`: Logs de auditoría donde el usuario realiza la acción

### Modelo Direction (Direcciones)

```sql
CREATE TABLE directions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  services_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0
);
```

**Campos principales:**
- `id`: Identificador único de la dirección
- `name`: Nombre de la dirección
- `description`: Descripción opcional
- `services_count`: Contador de servicios en la dirección
- `display_order`: Orden de visualización en la interfaz

**Relaciones:**
- `services`: Servicios pertenecientes a esta dirección

### Modelo Service (Servicios)

```sql
CREATE TABLE services (
  id VARCHAR(50) PRIMARY KEY,
  direction_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  responsible_person VARCHAR(100),
  phone_extension VARCHAR(10),
  service_type VARCHAR(50),
  location VARCHAR(200),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (direction_id) REFERENCES directions(id)
);
```

**Campos principales:**
- `id`: Identificador único del servicio
- `direction_id`: Referencia a la dirección padre
- `name`: Nombre del servicio
- `responsible_person`: Persona responsable del servicio
- `phone_extension`: Extensión telefónica
- `service_type`: Tipo de servicio
- `location`: Ubicación física del servicio
- `is_active`: Estado activo/inactivo del servicio

**Relaciones:**
- `direction`: Dirección a la que pertenece el servicio
- `notifications`: Notificaciones relacionadas con el servicio

### Modelo Notification (Notificaciones)

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  user_id INTEGER,
  service_id VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);
```

**Campos principales:**
- `id`: Identificador único autoincremental
- `title`: Título de la notificación
- `message`: Mensaje detallado
- `user_id`: Usuario destinatario (opcional)
- `service_id`: Servicio relacionado (opcional)
- `is_read`: Estado de lectura de la notificación

**Relaciones:**
- `user`: Usuario destinatario de la notificación
- `service`: Servicio relacionado con la notificación

### Modelo UserChangeHistory (Historial de Cambios)

```sql
CREATE TABLE user_change_history (
  id SERIAL PRIMARY KEY,
  target_user_id INTEGER NOT NULL,
  action VARCHAR(255) NOT NULL,
  performed_by INTEGER NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (target_user_id) REFERENCES users(id),
  FOREIGN KEY (performed_by) REFERENCES users(id)
);
```

**Campos principales:**
- `id`: Identificador único autoincremental
- `target_user_id`: Usuario sobre el que se realizó el cambio
- `action`: Tipo de acción realizada
- `performed_by`: Usuario que realizó la acción
- `details`: Detalles adicionales del cambio

**Relaciones:**
- `targetUser`: Usuario objetivo del cambio
- `performedByUser`: Usuario que realizó la acción

### Modelo AuditLog (Log de Auditoría)

```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  target_user_id INTEGER,
  performed_by INTEGER,
  details TEXT,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (target_user_id) REFERENCES users(id),
  FOREIGN KEY (performed_by) REFERENCES users(id)
);
```

**Campos principales:**
- `id`: Identificador único autoincremental
- `action`: Acción registrada
- `target_user_id`: Usuario objetivo (opcional)
- `performed_by`: Usuario que realizó la acción (opcional)
- `ip`: Dirección IP de la acción
- `user_agent`: Agente de usuario del navegador

**Relaciones:**
- `targetUser`: Usuario objetivo de la auditoría
- `performedByUser`: Usuario que realizó la acción auditada

## Relaciones entre Modelos

### Diagrama de Relaciones

```
User (1) ←→ (N) Notification
User (1) ←→ (N) UserChangeHistory (como objetivo)
User (1) ←→ (N) UserChangeHistory (como ejecutor)
User (1) ←→ (N) AuditLog (como objetivo)
User (1) ←→ (N) AuditLog (como ejecutor)

Direction (1) ←→ (N) Service
Service (1) ←→ (N) Notification
```

### Tipos de Relaciones

1. **One-to-Many (1:N)**
   - Direction → Service: Una dirección puede tener múltiples servicios
   - User → Notification: Un usuario puede tener múltiples notificaciones
   - Service → Notification: Un servicio puede tener múltiples notificaciones

2. **Many-to-One (N:1)**
   - Service → Direction: Múltiples servicios pertenecen a una dirección
   - Notification → User: Una notificación puede pertenecer a un usuario
   - Notification → Service: Una notificación puede estar relacionada con un servicio

3. **Self-Referencing (User)**
   - User → UserChangeHistory: Un usuario puede ser objetivo de cambios
   - User → UserChangeHistory: Un usuario puede realizar cambios a otros

## Índices y Optimización

### Índices Recomendados

```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE INDEX idx_services_direction_id ON services(direction_id);
CREATE INDEX idx_services_is_active ON services(is_active);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_service_id ON notifications(service_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_user_change_history_target_user_id ON user_change_history(target_user_id);
CREATE INDEX idx_user_change_history_performed_by ON user_change_history(performed_by);
CREATE INDEX idx_user_change_history_created_at ON user_change_history(created_at);

CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_target_user_id ON audit_log(target_user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

### Optimizaciones de Consulta

1. **Paginación**: Uso de `LIMIT` y `OFFSET` para listas grandes
2. **Filtrado**: Índices en campos de filtrado frecuente
3. **Ordenamiento**: Índices en campos de ordenamiento
4. **Joins**: Uso de índices en claves foráneas

## Migraciones

### Estructura de Migraciones

Las migraciones se almacenan en `/prisma/migrations/` y siguen el formato:
```
YYYYMMDDHHMMSS_nombre_descriptivo/
├── migration.sql
└── migration_lock.toml
```

### Comandos de Migración

```bash
# Generar migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (desarrollo)
npx prisma migrate reset

# Ver estado de migraciones
npx prisma migrate status
```

## Consultas Principales

### Usuarios Activos por Departamento

```sql
SELECT 
  department,
  COUNT(*) as user_count
FROM users 
WHERE is_active = true 
GROUP BY department 
ORDER BY user_count DESC;
```

### Servicios por Dirección

```sql
SELECT 
  d.name as direction_name,
  COUNT(s.id) as service_count
FROM directions d
LEFT JOIN services s ON d.id = s.direction_id
WHERE s.is_active = true
GROUP BY d.id, d.name
ORDER BY d.display_order;
```

### Notificaciones No Leídas por Usuario

```sql
SELECT 
  u.username,
  COUNT(n.id) as unread_count
FROM users u
LEFT JOIN notifications n ON u.id = n.user_id AND n.is_read = false
GROUP BY u.id, u.username
HAVING COUNT(n.id) > 0
ORDER BY unread_count DESC;
```

### Historial de Cambios Recientes

```sql
SELECT 
  uch.action,
  uch.details,
  target.username as target_user,
  performer.username as performed_by,
  uch.created_at
FROM user_change_history uch
JOIN users target ON uch.target_user_id = target.id
JOIN users performer ON uch.performed_by = performer.id
ORDER BY uch.created_at DESC
LIMIT 50;
```

## Mantenimiento y Respaldo

### Scripts de Mantenimiento

Los scripts de mantenimiento se encuentran en `/scripts/` e incluyen:
- Limpieza de datos duplicados
- Corrección de órdenes de visualización
- Verificación de integridad referencial
- Respaldo de datos

### Respaldo Automático

```bash
# Respaldo completo
pg_dump -h localhost -U username -d cagpu > backup_cagpu.sql

# Restauración
psql -h localhost -U username -d cagpu < backup_cagpu.sql
```

### Monitoreo de Performance

```sql
-- Consultas lentas
SELECT 
  query,
  mean_time,
  calls
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Uso de índices
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;
```

## Consideraciones de Seguridad

### Encriptación
- Contraseñas encriptadas con bcrypt (salt rounds: 12)
- Tokens JWT con expiración configurable
- Conexiones HTTPS en producción

### Auditoría
- Log completo de cambios de usuario
- Registro de IPs y user agents
- Historial de acciones administrativas

### Acceso a Datos
- Validación de entrada en todas las consultas
- Uso de parámetros preparados
- Control de acceso basado en roles
