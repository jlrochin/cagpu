# Utilidades y Helpers - Sistema CAGPU

## Visión General

El sistema de utilidades del CAGPU proporciona funciones auxiliares, validaciones, formateo de datos y constantes que son utilizadas en toda la aplicación para mantener consistencia y reutilización de código.

## Funciones Auxiliares

### 1. Generación de IDs

```typescript
// lib/utils.ts
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
```

### 2. Formateo de Fechas

```typescript
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "hace un momento";
  if (diffInSeconds < 3600)
    return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400)
    return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 2592000)
    return `hace ${Math.floor(diffInSeconds / 86400)} días`;

  return formatDate(date);
}
```

### 3. Formateo de Números

```typescript
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
```

## Validaciones

### 1. Validación de Email

```typescript
// lib/validation.ts
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEmail(email: string): string | null {
  if (!email) return "El email es requerido";
  if (!isValidEmail(email)) return "El email no es válido";
  return null;
}
```

### 2. Validación de Contraseña

```typescript
export function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("La contraseña debe contener al menos una letra minúscula");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("La contraseña debe contener al menos una letra mayúscula");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("La contraseña debe contener al menos un número");
  }

  return errors;
}
```

### 3. Validación de Campos

```typescript
export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} es requerido`;
  }
  return null;
}

export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (value.length < min) {
    return `${fieldName} debe tener al menos ${min} caracteres`;
  }
  if (value.length > max) {
    return `${fieldName} debe tener máximo ${max} caracteres`;
  }
  return null;
}
```

## Constantes del Sistema

### 1. Roles de Usuario

```typescript
// lib/constants.ts
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: "Administrador",
  [USER_ROLES.USER]: "Usuario",
};
```

### 2. Estados de Usuario

```typescript
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const STATUS_LABELS: Record<UserStatus, string> = {
  [USER_STATUS.ACTIVE]: "Activo",
  [USER_STATUS.INACTIVE]: "Inactivo",
  [USER_STATUS.SUSPENDED]: "Suspendido",
};
```

### 3. Configuración de Paginación

```typescript
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;
```

## Helpers de Formularios

### 1. Manejo de Errores

```typescript
// lib/form-helpers.ts
export function getFieldError(
  errors: any,
  fieldName: string
): string | undefined {
  return errors[fieldName]?.message;
}

export function hasFieldError(errors: any, fieldName: string): boolean {
  return !!errors[fieldName];
}

export function isFormValid(errors: any): boolean {
  return Object.keys(errors).length === 0;
}
```

### 2. Transformación de Datos

```typescript
export function transformFormData(data: any): any {
  const transformed: any = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === "" || value === null || value === undefined) {
      return;
    }

    if (typeof value === "string") {
      transformed[key] = value.trim();
    } else {
      transformed[key] = value;
    }
  });

  return transformed;
}
```

## Helpers de API

### 1. Manejo de Respuestas

```typescript
// lib/api-helpers.ts
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function createApiError(message: string, status: number = 400): Error {
  const error = new Error(message);
  (error as any).status = status;
  return error;
}
```

### 2. Headers de Autenticación

```typescript
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}
```

## Helpers de UI

### 1. Clases CSS Condicionales

```typescript
// lib/ui-helpers.ts
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getStatusColor(status: string): string {
  const colors = {
    active: "text-green-600 bg-green-100",
    inactive: "text-red-600 bg-red-100",
    pending: "text-yellow-600 bg-yellow-100",
  };

  return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-100";
}
```

### 2. Formateo de Texto

```typescript
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
}
```

## Helpers de Seguridad

### 1. Sanitización de Datos

```typescript
// lib/security-helpers.ts
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
```

### 2. Validación de Entrada

```typescript
export function validateInput(
  input: string,
  maxLength: number = 1000
): boolean {
  if (input.length > maxLength) return false;
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(input))
    return false;
  return true;
}
```

## Helpers de Testing

### 1. Mocks de Datos

```typescript
// lib/test-helpers.ts
export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    role: "user",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockService(overrides: Partial<Service> = {}): Service {
  return {
    id: "SERV001",
    name: "Test Service",
    directionId: "DIR001",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
```

## Próximas Mejoras

### 1. Internacionalización

- Soporte multi-idioma para mensajes de error
- Formateo regional de fechas y números
- Traducciones automáticas

### 2. Validación Avanzada

- Validación en tiempo real
- Validación de esquemas complejos
- Validación de archivos

### 3. Performance

- Lazy loading de utilidades
- Caching de funciones costosas
- Optimización de validaciones
