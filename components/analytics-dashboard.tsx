"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { Calendar, Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { directionsData, servicesData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("month")
  const [exportLoading, setExportLoading] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  // Simulate loading data
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setAnalyticsData(generateAnalyticsData())
        setIsLoading(false)
      }, 400)
    }

    loadData()
  }, [])

  // Simulate refreshing data
  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData())
      setRefreshing(false)
      toast({
        title: "Datos actualizados",
        description: "Los datos de analíticas han sido actualizados correctamente.",
      })
    }, 400)
  }

  // Simulate export functionality
  const handleExport = (format: string) => {
    setExportLoading(format)
    setTimeout(() => {
      setExportLoading(null)
      // In a real app, this would trigger the actual download
      toast({
        title: "Exportación completada",
        description: `Los datos han sido exportados en formato ${format.toUpperCase()} correctamente.`,
      })
    }, 400)
  }

  // Generate mock data for analytics
  const generateAnalyticsData = () => {
    const servicesByDirection = directionsData.map((direction) => {
      const count = servicesData.filter((service) => service.directionId === direction.id).length
      return {
        name: direction.name.split(" ")[1] || direction.name.split(" ")[0],
        count,
        fullName: direction.name,
      }
    })

    const servicesByType = [
      { name: "Clínico", value: servicesData.filter((s) => s.serviceType === "clinical").length },
      { name: "Administrativo", value: servicesData.filter((s) => s.serviceType === "administrative").length },
      { name: "Apoyo", value: servicesData.filter((s) => s.serviceType === "support").length },
      { name: "Especializado", value: servicesData.filter((s) => s.serviceType === "specialized").length },
    ]

    // Mock data for time series
    const generateTimeSeriesData = (days: number) => {
      const data = []
      const now = new Date()
      for (let i = days; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        data.push({
          date: date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" }),
          actualizaciones: Math.floor(Math.random() * 10),
          consultas: Math.floor(Math.random() * 20) + 5,
        })
      }
      return data
    }

    const timeSeriesData = {
      week: generateTimeSeriesData(7),
      month: generateTimeSeriesData(30),
      year: generateTimeSeriesData(12).map((item, index) => ({
        ...item,
        date: new Date(new Date().getFullYear(), index, 1).toLocaleDateString("es-MX", { month: "short" }),
      })),
    }

    // Mock data for service usage
    const serviceUsageData = [
      { name: "Lun", consultas: 24, actualizaciones: 5 },
      { name: "Mar", consultas: 30, actualizaciones: 8 },
      { name: "Mié", consultas: 27, actualizaciones: 6 },
      { name: "Jue", consultas: 32, actualizaciones: 9 },
      { name: "Vie", consultas: 35, actualizaciones: 12 },
      { name: "Sáb", consultas: 18, actualizaciones: 3 },
      { name: "Dom", consultas: 12, actualizaciones: 2 },
    ]

    // Mock data for top services
    const topServices = [
      { name: "Cardiología", value: 120 },
      { name: "Pediatría", value: 98 },
      { name: "Neurología", value: 86 },
      { name: "Recursos Humanos", value: 75 },
      { name: "Enfermería de Urgencias", value: 65 },
    ]

    // Mock data for updates by direction
    const updatesByDirection = [
      { name: "Ene", medica: 12, enfermeria: 8, investigacion: 5, desarrollo: 3, administracion: 10 },
      { name: "Feb", medica: 15, enfermeria: 10, investigacion: 7, desarrollo: 4, administracion: 12 },
      { name: "Mar", medica: 18, enfermeria: 12, investigacion: 9, desarrollo: 6, administracion: 15 },
      { name: "Abr", medica: 14, enfermeria: 9, investigacion: 6, desarrollo: 5, administracion: 11 },
      { name: "May", medica: 16, enfermeria: 11, investigacion: 8, desarrollo: 7, administracion: 13 },
      { name: "Jun", medica: 19, enfermeria: 13, investigacion: 10, desarrollo: 8, administracion: 16 },
    ]

    // Mock data for activity by hour
    const activityByHour = [
      { hora: "00:00", actividad: 2 },
      { hora: "02:00", actividad: 1 },
      { hora: "04:00", actividad: 0 },
      { hora: "06:00", actividad: 3 },
      { hora: "08:00", actividad: 15 },
      { hora: "10:00", actividad: 25 },
      { hora: "12:00", actividad: 18 },
      { hora: "14:00", actividad: 20 },
      { hora: "16:00", actividad: 22 },
      { hora: "18:00", actividad: 12 },
      { hora: "20:00", actividad: 8 },
      { hora: "22:00", actividad: 4 },
    ]

    // Mock data for user distribution
    const userDistribution = [
      { name: "Médicos", value: 35 },
      { name: "Enfermería", value: 28 },
      { name: "Administrativos", value: 22 },
      { name: "Investigación", value: 15 },
    ]

    // Mock data for service growth
    const serviceGrowthData = [
      { name: "Ene", value: 42 },
      { name: "Feb", value: 45 },
      { name: "Mar", value: 48 },
      { name: "Abr", value: 52 },
      { name: "May", value: 58 },
      { name: "Jun", value: 62 },
      { name: "Jul", value: 68 },
      { name: "Ago", value: 72 },
      { name: "Sep", value: 75 },
      { name: "Oct", value: 80 },
      { name: "Nov", value: 87 },
      { name: "Dic", value: 92 },
    ]

    // Mock data for direction performance
    const directionPerformance = [
      { name: "Médica", updates: 120, consultations: 450 },
      { name: "Enfermería", updates: 85, consultations: 320 },
      { name: "Investigación", updates: 60, consultations: 180 },
      { name: "Desarrollo", updates: 45, consultations: 120 },
      { name: "Administración", updates: 95, consultations: 280 },
    ]

    // Mock data for service satisfaction
    const serviceSatisfaction = [
      { name: "Muy satisfecho", value: 45 },
      { name: "Satisfecho", value: 30 },
      { name: "Neutral", value: 15 },
      { name: "Insatisfecho", value: 7 },
      { name: "Muy insatisfecho", value: 3 },
    ]

    // Summary metrics
    const summaryMetrics = {
      totalServices: servicesData.length,
      totalUpdates: Math.floor(Math.random() * 100) + 50,
      activeUsers: Math.floor(Math.random() * 20) + 5,
      updatesLastWeek: Math.floor(Math.random() * 30) + 10,
      updatesLastMonth: Math.floor(Math.random() * 100) + 30,
    }

    return {
      servicesByDirection,
      servicesByType,
      timeSeriesData,
      serviceUsageData,
      topServices,
      updatesByDirection,
      activityByHour,
      summaryMetrics,
      userDistribution,
      serviceGrowthData,
      directionPerformance,
      serviceSatisfaction,
    }
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-6">
        <div className="animate-spin rounded-full border-4 border-blue-300 border-t-blue-600 h-16 w-16 mb-4" />
        <span className="text-lg text-blue-700 font-semibold">Cargando analíticas...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analíticas del Sistema</h2>
          <p className="text-muted-foreground">Visualización de datos y estadísticas de servicios</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="year">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Exportar datos</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport("pdf")} disabled={exportLoading === "pdf"}>
                <FileText className="mr-2 h-4 w-4 text-rose-500" />
                <span>Exportar como PDF</span>
                {exportLoading === "pdf" && (
                  <Badge variant="outline" className="ml-2 animate-pulse">
                    Exportando...
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")} disabled={exportLoading === "excel"}>
                <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Exportar como Excel</span>
                {exportLoading === "excel" && (
                  <Badge variant="outline" className="ml-2 animate-pulse">
                    Exportando...
                  </Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-100 dark:border-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Total de Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                {analyticsData.summaryMetrics.totalServices}
              </div>
              <p className="text-xs text-blue-700/70 dark:text-blue-400/70 mt-1">{directionsData.length} direcciones</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40 border-purple-100 dark:border-purple-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">
                Actualizaciones Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                {analyticsData.summaryMetrics.totalUpdates}
              </div>
              <p className="text-xs text-purple-700/70 dark:text-purple-400/70 mt-1">Desde el inicio</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 border-emerald-100 dark:border-emerald-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Actualizaciones Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                {analyticsData.summaryMetrics.updatesLastWeek}
              </div>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-1">Última semana</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40 border-amber-100 dark:border-amber-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Usuarios Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
                {analyticsData.summaryMetrics.activeUsers}
              </div>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-1">En este momento</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Actividad del Sistema</CardTitle>
                <CardDescription>Actualizaciones y consultas a lo largo del tiempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.timeSeriesData[timeRange]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="actualizaciones"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name="Actualizaciones"
                      />
                      <Line type="monotone" dataKey="consultas" stroke="#82ca9d" name="Consultas" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Servicios por Dirección</CardTitle>
                  <CardDescription>Distribución de servicios por dirección</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.servicesByDirection}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [value, "Cantidad"]}
                          labelFormatter={(label: any, payload: any) => {
                            if (payload && payload.length > 0) {
                              return payload[0].payload.fullName
                            }
                            return label
                          }}
                        />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Servicios" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Servicios por Tipo</CardTitle>
                  <CardDescription>Distribución de servicios por categoría</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-[300px] w-full max-w-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.servicesByType}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.servicesByType.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} servicios`, "Cantidad"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Dirección</CardTitle>
                <CardDescription>Comparativa de actualizaciones y consultas por dirección</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.directionPerformance}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="updates" name="Actualizaciones" fill="#8884d8" />
                      <Bar dataKey="consultations" name="Consultas" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Servicios Más Consultados</CardTitle>
                  <CardDescription>Top servicios con mayor número de consultas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={analyticsData.topServices}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => [`${value} consultas`, "Consultas"]} />
                        <Bar dataKey="value" fill="#8884d8" name="Consultas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de Actualizaciones por Dirección</CardTitle>
                  <CardDescription>Evolución de actualizaciones por dirección</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analyticsData.updatesByDirection}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="medica"
                          stackId="1"
                          stroke="#8884d8"
                          fill="#8884d8"
                          name="Médica"
                        />
                        <Area
                          type="monotone"
                          dataKey="enfermeria"
                          stackId="1"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          name="Enfermería"
                        />
                        <Area
                          type="monotone"
                          dataKey="investigacion"
                          stackId="1"
                          stroke="#ffc658"
                          fill="#ffc658"
                          name="Investigación"
                        />
                        <Area
                          type="monotone"
                          dataKey="desarrollo"
                          stackId="1"
                          stroke="#ff7300"
                          fill="#ff7300"
                          name="Desarrollo"
                        />
                        <Area
                          type="monotone"
                          dataKey="administracion"
                          stackId="1"
                          stroke="#0088fe"
                          fill="#0088fe"
                          name="Administración"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Crecimiento de Servicios</CardTitle>
                <CardDescription>Evolución del número de servicios a lo largo del año</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.serviceGrowthData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} servicios`, "Total"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name="Servicios"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Uso del Sistema por Día</CardTitle>
                <CardDescription>Consultas y actualizaciones por día de la semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.serviceUsageData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="consultas" fill="#8884d8" name="Consultas" />
                      <Bar dataKey="actualizaciones" fill="#82ca9d" name="Actualizaciones" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Horas de Mayor Actividad</CardTitle>
                <CardDescription>Distribución de actividad por hora del día</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analyticsData.activityByHour}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hora" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} acciones`, "Actividad"]} />
                      <Area
                        type="monotone"
                        dataKey="actividad"
                        stroke="#8884d8"
                        fill="url(#colorActividad)"
                        name="Actividad"
                      />
                      <defs>
                        <linearGradient id="colorActividad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Usuarios</CardTitle>
                  <CardDescription>Usuarios del sistema por categoría profesional</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-[300px] w-full max-w-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.userDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.userDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} usuarios`, "Cantidad"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Satisfacción del Servicio</CardTitle>
                  <CardDescription>Nivel de satisfacción reportado por los usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.serviceSatisfaction}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
                        <Bar
                          dataKey="value"
                          name="Porcentaje"
                          fill="#8884d8"
                          background={{ fill: "#eee" }}
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
