'use client'

import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { DashboardOverview } from "@/components/dashboard-overview"
import { Header } from "@/components/header"
import { ServiceManagement } from "@/components/service-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AdminUsuariosPage from "../admin/usuarios/page"
import { prisma } from '@/lib/db'

function getRole() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('role') || 'user'
  }
  return 'user'
}

function AccessDenied({ onGoToServices }: { onGoToServices: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12">
      <span className="text-8xl">🚫</span>
      <h2 className="text-4xl font-extrabold text-red-500">¡Acceso denegado!</h2>
      <p className="text-2xl text-muted-foreground text-center max-w-xl">
        No tienes permiso para ver esta sección.<br />
        <span className="text-lg">(Error 403: Solo admins pueden entrar aquí. ¡Ups! 😅)</span>
      </p>
      <Button onClick={onGoToServices} className="mt-4 px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
        Ir a Servicios
      </Button>
    </div>
  )
}

function CambiosRecientes({ history }: { history: any[] }) {
  // Función para asignar color según la acción
  function actionBadgeClass(action: string) {
    switch (action) {
      case 'activate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'deactivate':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'create':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Cambios Recientes de Usuarios</h2>
      {history.length === 0 ? (
        <div className="text-gray-500">No hay cambios recientes.</div>
      ) : (
        <ul className="space-y-2">
          {history.map((item) => (
            <li key={item.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-1">
                <span className={`inline-block px-2 py-0.5 rounded font-semibold text-xs mr-2 capitalize ${actionBadgeClass(item.action)}`}>{item.action}</span>
                <span className="inline-block bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-0.5 rounded font-semibold text-xs">
                  {new Date(item.createdAt).toLocaleString('es-ES')}
                </span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {item.details}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex gap-2 items-center">
                Usuario afectado:
                <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded font-semibold text-xs">
                  {item.targetUser?.username || item.targetUserId}
                </span>
                |
                Realizado por:
                <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded font-semibold text-xs">
                  {item.performedByUser?.username || item.performedBy}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AuditoriaLog({ logs }: { logs: any[] }) {
  function actionBadgeClass(action: string) {
    switch (action) {
      case 'login':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'logout':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'create':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Auditoría del Sistema</h2>
      {logs.length === 0 ? (
        <div className="text-gray-500">No hay eventos de auditoría.</div>
      ) : (
        <ul className="space-y-2">
          {logs.map((item) => (
            <li key={item.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-1">
                <span className={`inline-block px-2 py-0.5 rounded font-semibold text-xs mr-2 capitalize ${actionBadgeClass(item.action)}`}>{item.action}</span>
                <span className="inline-block bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-0.5 rounded font-semibold text-xs">
                  {new Date(item.createdAt).toLocaleString('es-ES')}
                </span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {item.details}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex gap-2 items-center">
                {item.performedByUser?.username && (
                  <>
                    Usuario:
                    <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded font-semibold text-xs">
                      {item.performedByUser.username}
                    </span>
                  </>
                )}
                {item.targetUser?.username && (
                  <>
                    | Afectado:
                    <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded font-semibold text-xs">
                      {item.targetUser.username}
                    </span>
                  </>
                )}
                {item.ip && <span>| IP: {item.ip}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [role, setRole] = React.useState('user')
  const [tab, setTab] = React.useState('admin')
  const [history, setHistory] = React.useState<any[]>([])
  const [audit, setAudit] = React.useState<any[]>([])
  React.useEffect(() => {
    const r = getRole()
    console.log('🔍 DEBUG: Rol detectado:', r)
    setRole(r)
    // Si es user, mostrar primero Servicios; si es admin, Dashboard
    if (r === 'user') {
      setTab('services')
    } else {
      setTab('dashboard')
    }
    // Cargar historial de cambios recientes
    fetch('/api/user-change-history')
      .then(res => res.json())
      .then(data => setHistory(data.history || []));
    fetch('/api/audit-log')
      .then(res => res.json())
      .then(data => setAudit(data.logs || []));
  }, [])

  const handleGoToServices = () => setTab('services')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Tabs value={tab} onValueChange={setTab} defaultValue={role === 'user' ? 'services' : 'dashboard'} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="bg-muted/80 p-1">
              <TabsTrigger
                value="dashboard"
                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                Servicios
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                Analíticas
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
              >
                Administrador
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-lime-600 data-[state=active]:text-white"
              >
                Cambios Recientes
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-400 data-[state=active]:text-white"
              >
                Auditoría
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="mt-0 space-y-0">
            {role === 'user' ? (
              <AccessDenied onGoToServices={handleGoToServices} />
            ) : (
              <DashboardOverview />
            )}
          </TabsContent>

          <TabsContent value="services" className="mt-0 space-y-0">
            <ServiceManagement />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 space-y-0">
            {role === 'user' ? (
              <AccessDenied onGoToServices={handleGoToServices} />
            ) : (
              <AnalyticsDashboard />
            )}
          </TabsContent>

          <TabsContent value="admin" className="mt-0 space-y-0">
            <AdminUsuariosPage />
          </TabsContent>

          <TabsContent value="history" className="mt-0 space-y-0">
            <CambiosRecientes history={history} />
          </TabsContent>

          <TabsContent value="audit" className="mt-0 space-y-0">
            <AuditoriaLog logs={audit} />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  )
} 