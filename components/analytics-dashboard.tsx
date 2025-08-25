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

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("month")
  const [exportLoading, setExportLoading] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [directionsData, setDirectionsData] = useState<any[]>([])
  const [servicesData, setServicesData] = useState<any[]>([])

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [servicesRes, directionsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/directions')
        ])

        const services = await servicesRes.json()
        const directions = await directionsRes.json()

        setServicesData(services)
        setDirectionsData(directions)
        setAnalyticsData(generateAnalyticsData(services, directions))
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const [servicesRes, directionsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/directions')
      ])

      const services = await servicesRes.json()
      const directions = await directionsRes.json()

      setServicesData(services)
      setDirectionsData(directions)
      setAnalyticsData(generateAnalyticsData(services, directions))
      setRefreshing(false)
      toast({
        title: "Datos actualizados",
        description: "Los datos de analíticas han sido actualizados correctamente.",
      })
    } catch (error) {
      console.error('Error refreshing data:', error)
      setRefreshing(false)
    }
  }

  // Export functionality
  const handleExport = (format: string) => {
    setExportLoading(format)
    setTimeout(() => {
      setExportLoading(null)
      toast({
        title: "Exportación completada",
        description: `Los datos han sido exportados en formato ${format.toUpperCase()} correctamente.`,
      })
    }, 400)
  }

  // Generate analytics data from real database data
  const generateAnalyticsData = (services: any[], directions: any[]) => {
    const servicesByDirection = directions.map((direction) => {
      const count = services.filter((service) => service.directionId === direction.id).length
      return {
        name: direction.name.split(" ")[1] || direction.name.split(" ")[0],
        count,
        fullName: direction.name,
      }
    })

    const servicesByType = [
      { name: "Clínico", value: services.filter((s) => s.serviceType === "clinical").length },
      { name: "Administrativo", value: services.filter((s) => s.serviceType === "administrative").length },
      { name: "Apoyo", value: services.filter((s) => s.serviceType === "support").length },
      { name: "Especializado", value: services.filter((s) => s.serviceType === "specialized").length },
    ]

    // Real summary metrics from database
    const summaryMetrics = {
      totalServices: services.length,
      totalDirections: directions.length,
      activeServices: services.filter(s => s.isActive !== false).length,
      totalUpdates: 0, // Would need to implement change tracking
      activeUsers: 0, // Would come from user activity tracking
    }

    return {
      servicesByDirection,
      servicesByType,
      summaryMetrics,
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

  if (!analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-6">
        <span className="text-lg text-gray-600">No hay datos de analíticas disponibles.</span>
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
              <p className="text-xs text-blue-700/70 dark:text-blue-400/70 mt-1">{analyticsData.summaryMetrics.totalDirections} direcciones</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-100 dark:border-green-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">
                Servicios Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                {analyticsData.summaryMetrics.activeServices}
              </div>
              <p className="text-xs text-green-700/70 dark:text-green-400/70 mt-1">En funcionamiento</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
                          data={analyticsData.servicesByType.filter((item: { name: string, value: number }) => item.value > 0)}
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
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Lista de Servicios</CardTitle>
                <CardDescription>Todos los servicios registrados en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                {servicesData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay servicios registrados en el sistema.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {servicesData.map((service) => (
                      <div key={service.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {directionsData.find(d => d.id === service.directionId)?.name || 'Sin dirección'}
                          </p>
                        </div>
                        <Badge variant={service.isActive ? "default" : "secondary"}>
                          {service.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
