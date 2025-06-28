"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, AlertCircle, CheckCircle, Clock, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { directionsData, servicesData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DashboardOverview() {
  const [stats, setStats] = useState({
    activeServices: 0,
    pendingUpdates: 0,
    recentChanges: 0,
    serviceStatus: 0,
    activeUsers: 0,
  })

  // Simulate real-time updates
  useEffect(() => {
    // Initial stats
    setStats({
      activeServices: servicesData.length,
      pendingUpdates: Math.floor(Math.random() * 5) + 2,
      recentChanges: Math.floor(Math.random() * 10) + 5,
      serviceStatus: Math.floor(Math.random() * 30) + 70, // 70-100%
      activeUsers: Math.floor(Math.random() * 5) + 3,
    })

    // Update stats periodically
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        pendingUpdates: Math.max(0, prev.pendingUpdates + (Math.random() > 0.7 ? 1 : -1)),
        recentChanges: prev.recentChanges + (Math.random() > 0.5 ? 1 : 0),
        serviceStatus: Math.min(100, Math.max(70, prev.serviceStatus + (Math.random() > 0.5 ? 1 : -1))),
        activeUsers: Math.max(1, Math.min(10, prev.activeUsers + (Math.random() > 0.7 ? 1 : -1))),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Fetch usuarios activos en tiempo real
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await fetch('/api/users/active');
        const data = await res.json();
        setStats((prev) => ({ ...prev, activeUsers: data.activeUsers }));
      } catch (e) {
        // Silenciar error
      }
    };
    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  // Mantener lastActiveAt actualizado
  useEffect(() => {
    const ping = async () => {
      try {
        await fetch('/api/ping');
      } catch {}
    };
    ping();
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get recent activity data
  const recentActivity = [
    {
      id: 1,
      service: "Cardiología",
      action: "Actualización de responsable",
      time: "hace 10 minutos",
      user: "Dr. García",
    },
    {
      id: 2,
      service: "Enfermería de Urgencias",
      action: "Cambio de extensión",
      time: "hace 25 minutos",
      user: "Lic. Rodríguez",
    },
    {
      id: 3,
      service: "Recursos Humanos",
      action: "Actualización de ubicación",
      time: "hace 1 hora",
      user: "Lic. Martínez",
    },
    {
      id: 4,
      service: "Investigación Clínica",
      action: "Modificación de descripción",
      time: "hace 2 horas",
      user: "Dr. López",
    },
    { id: 5, service: "Pediatría", action: "Cambio de responsable", time: "hace 3 horas", user: "Dra. Sánchez" },
    { id: 6, service: "Finanzas", action: "Actualización de extensión", time: "hace 4 horas", user: "C.P. Ramírez" },
  ]

  const upcomingTasks = [
    { id: 1, title: "Revisión de servicios clínicos", dueDate: "Hoy", priority: "high" },
    { id: 2, title: "Actualización de extensiones telefónicas", dueDate: "Mañana", priority: "medium" },
    { id: 3, title: "Verificación de ubicaciones", dueDate: "En 2 días", priority: "low" },
    { id: 4, title: "Actualización de responsables", dueDate: "En 3 días", priority: "medium" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-100 dark:border-green-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">
                Servicios Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <div className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.activeServices}</div>
              </div>
              <p className="text-xs text-green-700/70 dark:text-green-400/70 mt-1">
                {directionsData.length} direcciones
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40 border-amber-100 dark:border-amber-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Actualizaciones Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">{stats.pendingUpdates}</div>
              </div>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-1">Requieren revisión</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-100 dark:border-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Cambios Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.recentChanges}</div>
              </div>
              <p className="text-xs text-blue-700/70 dark:text-blue-400/70 mt-1">En las últimas 24 horas</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40 border-purple-100 dark:border-purple-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">
                Usuarios Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">{stats.activeUsers}</div>
              </div>
              <p className="text-xs text-purple-700/70 dark:text-purple-400/70 mt-1">En este momento</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40 border-rose-100 dark:border-rose-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-rose-800 dark:text-rose-300">
                Estado de Servicios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2">
                <AlertCircle
                  className={cn(
                    "h-5 w-5 mr-2",
                    stats.serviceStatus > 90
                      ? "text-green-600 dark:text-green-400"
                      : stats.serviceStatus > 80
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-600 dark:text-rose-400",
                  )}
                />
                <div className="text-2xl font-bold text-rose-800 dark:text-rose-300">{stats.serviceStatus}%</div>
              </div>
              <Progress
                value={stats.serviceStatus}
                className="h-2"
                indicatorClassName={cn(
                  stats.serviceStatus > 90
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : stats.serviceStatus > 80
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                      : "bg-gradient-to-r from-rose-500 to-pink-500",
                )}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas actualizaciones en los servicios</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-start"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{activity.service}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Por: {activity.user}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle>Tareas Pendientes</CardTitle>
              <CardDescription>Próximas actividades programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">Vence: {task.dueDate}</p>
                        </div>
                        <div
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            task.priority === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : task.priority === "medium"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                          )}
                        >
                          {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
