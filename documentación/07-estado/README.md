# Estado y Gestión de Datos - Sistema CAGPU

## Visión General

El sistema de gestión de estado del CAGPU está diseñado para manejar datos de manera eficiente y consistente a través de toda la aplicación. Utiliza una combinación de hooks personalizados, contexto de React y patrones de gestión de estado modernos para proporcionar una experiencia de usuario fluida.

## Arquitectura de Estado

### 1. Capas de Estado

```
┌─────────────────────────────────────┐
│           UI Components             │
├─────────────────────────────────────┤
│         Custom Hooks               │
├─────────────────────────────────────┤
│         Context Providers          │
├─────────────────────────────────────┤
│         API Layer                  │
├─────────────────────────────────────┤
│         Database                   │
└─────────────────────────────────────┘
```

**Descripción de Capas:**

- **UI Components**: Componentes que consumen y muestran datos
- **Custom Hooks**: Lógica de estado reutilizable
- **Context Providers**: Estado global compartido
- **API Layer**: Comunicación con el backend
- **Database**: Almacenamiento persistente

### 2. Patrones de Estado

**Estado Local:**

- Estado interno de componentes
- Formularios y controles de UI
- Estados de carga y error locales

**Estado Compartido:**

- Datos de usuario autenticado
- Configuración del sistema
- Estado de navegación

**Estado del Servidor:**

- Datos de la base de datos
- Cache de consultas
- Sincronización de datos

## Hooks Personalizados

### 1. useAuth Hook

**Descripción:** Hook principal para gestión de autenticación

**Implementación:**

```tsx
// hooks/use-auth.ts
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }

  return context;
}
```

**Uso en Componentes:**

```tsx
export function UserProfile() {
  const { user, updateUser, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleUpdate = async (data: ProfileData) => {
    try {
      await updateUser(data);
      toast.success("Perfil actualizado");
    } catch (error) {
      toast.error("Error al actualizar perfil");
    }
  };

  return (
    <div>
      <h1>Perfil de {user?.firstName}</h1>
      <ProfileForm user={user} onSubmit={handleUpdate} />
    </div>
  );
}
```

### 2. useMediaQuery Hook

**Descripción:** Hook para manejo de media queries responsive

**Implementación:**

```tsx
// hooks/use-media-query.ts
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// Hooks predefinidos
export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTablet = () =>
  useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)");
```

**Uso en Componentes:**

```tsx
export function ResponsiveNavigation() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileNavigation />;
  }

  return <DesktopNavigation />;
}
```

### 3. useToast Hook

**Descripción:** Hook para gestión de notificaciones toast

**Implementación:**

```tsx
// hooks/use-toast.ts
interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export function useToast() {
  const { toast } = useToastContext();

  const showToast = useCallback(
    (options: ToastOptions) => {
      toast({
        title: options.title,
        description: options.description,
        variant: options.variant || "default",
        duration: options.duration || 5000,
      });
    },
    [toast]
  );

  const success = useCallback(
    (message: string) => {
      showToast({ title: "Éxito", description: message, variant: "success" });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string) => {
      showToast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
    [showToast]
  );

  return { showToast, success, error };
}
```

**Uso en Componentes:**

```tsx
export function UserForm() {
  const { success, error } = useToast();

  const handleSubmit = async (data: UserData) => {
    try {
      await createUser(data);
      success("Usuario creado correctamente");
    } catch (err) {
      error("Error al crear usuario");
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 4. useLocalStorage Hook

**Descripción:** Hook para persistencia de datos en localStorage

**Implementación:**

```tsx
// hooks/use-local-storage.ts
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error("Error reading localStorage key:", key, err);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error("Error setting localStorage key:", key, err);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
```

**Uso en Componentes:**

```tsx
export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage("theme", "system");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Button onClick={toggleTheme}>
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}
```

### 5. useDebounce Hook

**Descripción:** Hook para debounce de valores

**Implementación:**

```tsx
// hooks/use-debounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Uso en Componentes:**

```tsx
export function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <Input
      placeholder="Buscar..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

## Context Providers

### 1. AuthContext

**Descripción:** Contexto para gestión de autenticación global

**Implementación:**

```tsx
// context/auth-context.tsx
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const login = useCallback(async (username: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        setState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true,
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setState((prev) => ({
          ...prev,
          user: { ...prev.user!, ...result.profile },
        }));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/profile");
      const result = await response.json();

      if (result.success) {
        setState((prev) => ({
          ...prev,
          user: result.profile,
          isAuthenticated: true,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      updateUser,
      refreshUser,
    }),
    [state, login, logout, updateUser, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### 2. ThemeContext

**Descripción:** Contexto para gestión del tema de la aplicación

**Implementación:**

```tsx
// context/theme-context.tsx
type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
}

interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<(ThemeState & ThemeActions) | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setResolvedTheme(systemTheme);
      document.documentElement.classList.toggle("dark", systemTheme === "dark");
    } else {
      setResolvedTheme(newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "system";
    setTheme(savedTheme);
  }, [setTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        setResolvedTheme(e.matches ? "dark" : "light");
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
```

### 3. NotificationContext

**Descripción:** Contexto para gestión de notificaciones del sistema

**Implementación:**

```tsx
// context/notification-context.tsx
interface Notification {
  id: string;
  title: string;
  message?: string;
  type: "info" | "success" | "warning" | "error";
  duration?: number;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

interface NotificationActions {
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt" | "isRead">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<
  (NotificationState & NotificationActions) | null
>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => {
      const newNotification: Notification = {
        ...notification,
        id: generateId(),
        createdAt: new Date(),
        isRead: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Auto-remove after duration
      if (notification.duration !== 0) {
        setTimeout(() => {
          removeNotification(newNotification.id);
        }, notification.duration || 5000);
      }
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
```

## Gestión de Datos del Servidor

### 1. SWR para Caching

**Descripción:** Hook SWR para gestión de datos del servidor con cache

**Implementación:**

```tsx
// hooks/use-api.ts
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export function useUsers(filters?: UserFilters) {
  const queryString = filters
    ? `?${new URLSearchParams(filters).toString()}`
    : "";
  const { data, error, isLoading, mutate } = useSWR(
    `/api/users${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minuto
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    users: data?.users || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}

export function useUser(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/users/${id}` : null,
    fetcher
  );

  return {
    user: data?.user,
    isLoading,
    error,
    mutate,
  };
}

export function useServices(filters?: ServiceFilters) {
  const queryString = filters
    ? `?${new URLSearchParams(filters).toString()}`
    : "";
  const { data, error, isLoading, mutate } = useSWR(
    `/api/services${queryString}`,
    fetcher
  );

  return {
    services: data?.services || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}
```

**Uso en Componentes:**

```tsx
export function UsersList() {
  const { users, isLoading, error, mutate } = useUsers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const handleUserUpdate = async (userId: string, data: UserUpdateData) => {
    try {
      await updateUser(userId, data);
      mutate(); // Revalidar datos
      toast.success("Usuario actualizado");
    } catch (error) {
      toast.error("Error al actualizar usuario");
    }
  };

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} onUpdate={handleUserUpdate} />
      ))}
    </div>
  );
}
```

### 2. Mutaciones Optimistas

**Descripción:** Actualizaciones inmediatas de UI con rollback en caso de error

**Implementación:**

```tsx
// hooks/use-optimistic-update.ts
export function useOptimisticUpdate<T>(
  key: string,
  updateFn: (data: T) => Promise<void>
) {
  const { mutate } = useSWR(key);

  const optimisticUpdate = useCallback(
    async (newData: T, rollbackData: T) => {
      // Actualización optimista
      mutate(newData, false);

      try {
        await updateFn(newData);
        // Confirmar actualización
        mutate(newData, true);
      } catch (error) {
        // Rollback en caso de error
        mutate(rollbackData, false);
        throw error;
      }
    },
    [key, mutate, updateFn]
  );

  return { optimisticUpdate };
}

// Uso en componentes
export function UserForm({ user }: { user: User }) {
  const { optimisticUpdate } = useOptimisticUpdate(`/api/users/${user.id}`);

  const handleSubmit = async (data: UserUpdateData) => {
    const newUser = { ...user, ...data };

    try {
      await optimisticUpdate(newUser, user);
      toast.success("Usuario actualizado");
    } catch (error) {
      toast.error("Error al actualizar usuario");
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 3. Sincronización de Datos

**Descripción:** Sincronización automática de datos entre componentes

**Implementación:**

```tsx
// hooks/use-sync-data.ts
export function useSyncData<T>(key: string, syncInterval: number = 30000) {
  const { data, mutate } = useSWR(key, fetcher, {
    refreshInterval: syncInterval,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, syncInterval);

    return () => clearInterval(interval);
  }, [mutate, syncInterval]);

  return { data, mutate };
}

// Uso para datos que cambian frecuentemente
export function RealTimeNotifications() {
  const { data: notifications } = useSyncData("/api/notifications", 10000); // 10 segundos

  return (
    <div>
      {notifications?.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
```

## Persistencia de Datos

### 1. Cache en Memoria

**Descripción:** Cache temporal para datos frecuentemente accedidos

**Implementación:**

```tsx
// utils/cache.ts
class MemoryCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  set(key: string, data: any, ttl: number = 60000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const memoryCache = new MemoryCache();
```

### 2. Cache en localStorage

**Descripción:** Persistencia de datos en el navegador

**Implementación:**

```tsx
// utils/storage.ts
export class StorageManager {
  private prefix = "cagpu_";

  set(key: string, value: any, ttl?: number) {
    const item = {
      value,
      timestamp: Date.now(),
      ttl: ttl || 0,
    };

    localStorage.setItem(this.prefix + key, JSON.stringify(item));
  }

  get(key: string): any | null {
    const item = localStorage.getItem(this.prefix + key);

    if (!item) return null;

    try {
      const parsed = JSON.parse(item);

      if (parsed.ttl > 0 && Date.now() - parsed.timestamp > parsed.ttl) {
        this.delete(key);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  }

  delete(key: string) {
    localStorage.removeItem(this.prefix + key);
  }

  clear() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
  }
}

export const storage = new StorageManager();
```

### 3. IndexedDB para Datos Grandes

**Descripción:** Almacenamiento de grandes cantidades de datos en el navegador

**Implementación:**

```tsx
// utils/indexed-db.ts
export class IndexedDBManager {
  private dbName = "CAGPU_DB";
  private version = 1;

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crear stores
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("services")) {
          db.createObjectStore("services", { keyPath: "id" });
        }
      };
    });
  }

  async save(storeName: string, data: any): Promise<void> {
    const db = await this.init();
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName: string, key: string): Promise<any> {
    const db = await this.init();
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName: string): Promise<any[]> {
    const db = await this.init();
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDB = new IndexedDBManager();
```

## Manejo de Estados de Carga

### 1. Estados de Carga Compuestos

**Descripción:** Manejo de múltiples estados de carga simultáneos

**Implementación:**

```tsx
// hooks/use-loading-states.ts
interface LoadingStates {
  [key: string]: boolean;
}

export function useLoadingStates() {
  const [states, setStates] = useState<LoadingStates>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setStates((prev) => ({ ...prev, [key]: loading }));
  }, []);

  const isLoading = useCallback(
    (key: string) => states[key] || false,
    [states]
  );

  const isAnyLoading = useCallback(
    () => Object.values(states).some(Boolean),
    [states]
  );

  const clearLoading = useCallback((key: string) => {
    setStates((prev) => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  const clearAllLoading = useCallback(() => {
    setStates({});
  }, []);

  return {
    states,
    setLoading,
    isLoading,
    isAnyLoading,
    clearLoading,
    clearAllLoading,
  };
}
```

**Uso en Componentes:**

```tsx
export function UserManagement() {
  const { setLoading, isLoading, isAnyLoading } = useLoadingStates();

  const handleCreateUser = async (data: UserData) => {
    setLoading("create", true);
    try {
      await createUser(data);
      toast.success("Usuario creado");
    } finally {
      setLoading("create", false);
    }
  };

  const handleUpdateUser = async (id: string, data: UserData) => {
    setLoading(`update-${id}`, true);
    try {
      await updateUser(id, data);
      toast.success("Usuario actualizado");
    } finally {
      setLoading(`update-${id}`, false);
    }
  };

  return (
    <div>
      <Button onClick={handleCreateUser} disabled={isAnyLoading()}>
        {isLoading("create") ? "Creando..." : "Crear Usuario"}
      </Button>

      {users.map((user) => (
        <Button
          key={user.id}
          onClick={() => handleUpdateUser(user.id, user)}
          disabled={isLoading(`update-${user.id}`)}
        >
          {isLoading(`update-${user.id}`) ? "Actualizando..." : "Actualizar"}
        </Button>
      ))}
    </div>
  );
}
```

### 2. Estados de Error

**Descripción:** Manejo centralizado de errores

**Implementación:**

```tsx
// hooks/use-error-handling.ts
interface ErrorState {
  [key: string]: Error | null;
}

export function useErrorHandling() {
  const [errors, setErrors] = useState<ErrorState>({});

  const setError = useCallback((key: string, error: Error | null) => {
    setErrors((prev) => ({ ...prev, [key]: error }));
  }, []);

  const getError = useCallback((key: string) => errors[key] || null, [errors]);

  const hasError = useCallback((key: string) => !!errors[key], [errors]);

  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    setError,
    getError,
    hasError,
    clearError,
    clearAllErrors,
  };
}
```

## Optimización de Performance

### 1. Memoización de Datos

**Descripción:** Evitar recálculos innecesarios de datos derivados

**Implementación:**

```tsx
export function UsersDashboard({ users }: { users: User[] }) {
  // Memoizar estadísticas calculadas
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const admins = users.filter((u) => u.role === "admin").length;
    const byDepartment = users.reduce((acc, user) => {
      const dept = user.department || "Sin departamento";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, active, admins, byDepartment };
  }, [users]);

  // Memoizar usuarios filtrados
  const activeUsers = useMemo(() => users.filter((u) => u.isActive), [users]);

  return (
    <div>
      <StatsCards stats={stats} />
      <ActiveUsersList users={activeUsers} />
    </div>
  );
}
```

### 2. Lazy Loading de Datos

**Descripción:** Carga progresiva de datos según necesidad

**Implementación:**

```tsx
export function LazyUsersList() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { users, isLoading, error } = useUsers({ page, limit: 20 });

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (users.length < 20) {
      setHasMore(false);
    }
  }, [users.length]);

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}

      {hasMore && (
        <Button onClick={loadMore} disabled={isLoading} className="w-full mt-4">
          {isLoading ? "Cargando..." : "Cargar más"}
        </Button>
      )}
    </div>
  );
}
```

## Testing de Hooks

### 1. Tests de Hooks Personalizados

**Implementación:**

```tsx
// __tests__/hooks/use-auth.test.tsx
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/auth-context";

describe("useAuth", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it("should provide initial state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should handle login", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const success = await result.current.login("test", "password");
      expect(success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it("should handle logout", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login first
    await act(async () => {
      await result.current.login("test", "password");
    });

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

### 2. Tests de Integración

**Implementación:**

```tsx
// __tests__/integration/user-management.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "@/context/auth-context";
import { UserManagement } from "@/components/user-management";

describe("UserManagement Integration", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it("should create and display users", async () => {
    render(<UserManagement />, { wrapper });

    // Fill form
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "juan@example.com" },
    });

    // Submit form
    fireEvent.click(screen.getByText("Crear Usuario"));

    // Wait for user to appear
    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });
  });
});
```

## Próximas Mejoras

### 1. Estado Global Avanzado

**Funcionalidades Planeadas:**

- Zustand para estado global complejo
- Redux Toolkit para aplicaciones grandes
- Jotai para estado atómico
- Recoil para estado compartido

### 2. Sincronización en Tiempo Real

**Características Futuras:**

- WebSockets para actualizaciones en vivo
- Server-Sent Events para notificaciones
- Polling inteligente con backoff exponencial
- Sincronización offline con conflict resolution

### 3. Optimización de Memoria

**Mejoras Técnicas:**

- Virtualización de listas grandes
- Lazy loading de imágenes
- Compresión de datos en cache
- Garbage collection optimizado

### 4. Analytics de Estado

**Monitoreo y Métricas:**

- Tracking de cambios de estado
- Métricas de performance
- Debug de re-renders
- Profiling de hooks
