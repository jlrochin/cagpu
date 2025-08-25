"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Edit, Filter, Plus, Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ServiceForm } from "@/components/service-form"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExportOptions } from "@/components/export-options"
import type { Service } from "@/lib/types"

export function ServiceManagement() {
  // 1. Hooks de estado
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [modalService, setModalService] = useState<Service | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [tipoExport, setTipoExport] = useState("servicios")
  const [dataExport, setDataExport] = useState<any[]>([])
  const [servicesData, setServicesData] = useState<any[]>([])
  const [directionsData, setDirectionsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(localStorage.getItem('role'))
    }
  }, [])

  // Cargar datos de la base de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [servicesRes, directionsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/directions')
        ])

        const services = await servicesRes.json()
        const directions = await directionsRes.json()

        setServicesData(services)
        setDirectionsData(directions)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 2. Cálculo de filteredServices - memoizado para evitar infinite loops
  const filteredServices = useMemo(() => {
    return servicesData.filter((service) => {
      const matchesSearch =
        searchQuery === "" ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.location.toLowerCase().includes(searchQuery.toLowerCase())

      // Filtrar por tab activo (si no es "all")
      const matchesTab = activeTab === "all" || service.directionId === activeTab

      // Filtrar por direcciones adicionales (filtros del dropdown)
      // Si hay filtros activos, se aplican además del tab
      const matchesDirection = activeFilters.length === 0 || activeFilters.includes(service.directionId)

      return matchesSearch && matchesTab && matchesDirection
    })
  }, [servicesData, searchQuery, activeTab, activeFilters])

  // 3. useEffect que depende de filteredServices
  useEffect(() => {
    if (tipoExport === "servicios") {
      setDataExport(filteredServices)
    } else if (tipoExport === "usuarios") {
      fetch("/api/users")
        .then(res => res.json())
        .then(data => setDataExport(data || []))
    } else if (tipoExport === "cambios") {
      fetch("/api/user-change-history")
        .then(res => res.json())
        .then(data => setDataExport(data.history || []))
    }
  }, [tipoExport, filteredServices])

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId === selectedService ? null : serviceId)
  }

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const clearFilters = () => {
    setActiveFilters([])
    setSearchQuery("")
    setActiveTab("all")
  }

  const serviceTypeOptions = [
    { value: "clinical", label: "Clínico" },
    { value: "administrative", label: "Administrativo" },
    { value: "support", label: "Apoyo" },
    { value: "specialized", label: "Especializado" },
  ]

  const getServiceTypeLabel = (value: string) => {
    return serviceTypeOptions.find((option) => option.value === value)?.label || value
  }

  const getServiceTypeBadgeColor = (type: string) => {
    switch (type) {
      case "clinical":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800"
      case "administrative":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
      case "support":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800"
      case "specialized":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800"
      default:
        return ""
    }
  }

  const formatDirectionName = (name: string) => {
    if (!name) return ""
    // Asegurar que los nombres se vean consistentes
    return name
      .replace(/^DIRECCIÓN\s+DE\s+/, "")
      .replace(/^DIRECCIÓN\s+/, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  const getDirectionShortName = (name: string) => {
    if (!name) return ""
    // Devolver el nombre completo sin "DIRECCIÓN DE"
    return formatDirectionName(name)
  }

  function handleEditService(service: Service) {
    setModalService(service)
  }

  function handleNewService() {
    // Crear un objeto de servicio vacío pero con estructura válida
    const newService = {
      id: "",
      name: "",
      directionId: "",
      responsiblePerson: "",
      phoneExtension: "",
      serviceType: "support",
      location: "",
      description: "",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      direction: null
    } as any
    setModalService(newService)
  }

  function handleCloseModal() {
    setModalService(null)
    // Recargar datos después de cerrar el modal
    refetchData()
  }

  // Función para recargar los datos
  const refetchData = async () => {
    try {
      const [servicesRes, directionsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/directions')
      ])

      const services = await servicesRes.json()
      const directions = await directionsRes.json()

      setServicesData(services)
      setDirectionsData(directions)
    } catch (error) {
      console.error('Error al recargar datos:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Gestión de Servicios</CardTitle>
                <CardDescription>Cargando información de los servicios...</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-muted-foreground">Cargando servicios de la base de datos...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Gestión de Servicios</CardTitle>
              <CardDescription>
                Acceda y modifique la información de los servicios. Use las pestañas para filtrar por dirección y el menú de filtros para refinar su búsqueda.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {role !== 'user' && (
                <ExportOptions data={filteredServices} filename="servicios-hospital" />
              )}
              {role !== 'user' && (
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleNewService}
                >
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Servicio
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, responsable o ubicación..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filtros</span>
                    {activeFilters.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFilters.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Filtros adicionales por dirección</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {directionsData.map((direction) => (
                      <DropdownMenuItem
                        key={direction.id}
                        className="flex items-center gap-2"
                        onSelect={(e) => {
                          e.preventDefault()
                          toggleFilter(direction.id)
                        }}
                      >
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            activeFilters.includes(direction.id) ? "bg-primary" : "bg-muted",
                          )}
                        />
                        <span className="text-sm">{formatDirectionName(direction.name)}</span>
                        {activeTab === direction.id && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            Activo
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  {activeFilters.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-center text-muted-foreground"
                        onSelect={(e) => {
                          e.preventDefault()
                          clearFilters()
                        }}
                      >
                        Limpiar filtros
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none px-3"
                  onClick={() => setViewMode("grid")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none px-3"
                  onClick={() => setViewMode("list")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">Filtros aplicados:</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearFilters}>
                  Limpiar todos
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => {
                  const direction = directionsData.find(d => d.id === filter)
                  return (
                    <Badge key={filter} variant="outline" className="gap-1 pl-2 text-xs max-w-[300px]">
                      <span className="truncate">{direction ? formatDirectionName(direction.name) : filter}</span>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1 flex-shrink-0" onClick={() => toggleFilter(filter)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-4">
              <TabsList className="flex flex-wrap justify-around w-full h-auto p-3 gap-1 bg-muted/50">
                <TabsTrigger value="all" className="text-sm px-3 py-2 h-[4rem] flex items-center justify-center text-center min-w-[150px] max-w-[150px] flex-1 whitespace-normal">
                  <span className="font-medium">Todos</span>
                </TabsTrigger>
                {directionsData.map((direction) => {
                  return (
                    <TabsTrigger key={direction.id} value={direction.id} className="text-xs px-3 py-2 h-[4rem] flex items-center justify-center text-center min-w-[150px] max-w-[150px] flex-1 whitespace-normal">
                      <span className="leading-tight text-center font-medium break-words">
                        {getDirectionShortName(direction.name)}
                      </span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderServiceCards(filteredServices)}
                </div>
              ) : (
                <div className="space-y-3">{renderServiceList(filteredServices)}</div>
              )}
            </TabsContent>

            {directionsData.map((direction) => (
              <TabsContent key={direction.id} value={direction.id} className="mt-0">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderServiceCards(filteredServices)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {renderServiceList(filteredServices)}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        {filteredServices.length === 0 && (
          <CardFooter className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No se encontraron servicios</h3>
            <p className="text-muted-foreground mt-1">
              {activeTab !== "all" || activeFilters.length > 0 || searchQuery ? (
                "Intente ajustar sus filtros o términos de búsqueda para encontrar lo que busca."
              ) : (
                "No hay servicios disponibles en este momento."
              )}
            </p>
            {(activeTab !== "all" || activeFilters.length > 0 || searchQuery) && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
      <Dialog open={!!modalService} onOpenChange={open => { if (!open) handleCloseModal() }}>
        <DialogContent className="w-[98vw] max-w-5xl max-h-[90vh] overflow-y-auto">
          {modalService && <ServiceForm service={modalService} onSaved={handleCloseModal} />}
        </DialogContent>
      </Dialog>
    </div>
  )

  function renderServiceCards(services: typeof servicesData) {
    if (services.length === 0) {
      return null
    }

    return services.map((service) => (
      <motion.div key={service.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Card
          className={cn(
            "h-full transition-all hover:border-primary/50",
            selectedService === service.id && "border-primary shadow-md",
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{service.name}</CardTitle>
                <CardDescription>{formatDirectionName(service.direction?.name || directionsData.find((d) => d.id === service.directionId)?.name || "")}</CardDescription>
              </div>
              <Badge className={cn("ml-2", getServiceTypeBadgeColor(service.serviceType))}>
                {getServiceTypeLabel(service.serviceType)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Responsable:</span> {service.responsiblePerson}
              </p>
              <p>
                <span className="font-medium">Extensión:</span> {service.phoneExtension}
              </p>
              <p>
                <span className="font-medium">Ubicación:</span> {service.location}
              </p>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{service.description}</p>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant={selectedService === service.id ? "default" : "outline"}
              size="sm"
              className="w-full"
              onClick={() => handleEditService(service)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {selectedService === service.id ? "Cerrar edición" : "Editar servicio"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    ))
  }

  function renderServiceList(services: typeof servicesData) {
    if (services.length === 0) {
      return null
    }

    return services.map((service) => (
      <motion.div key={service.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <Card
          className={cn(
            "transition-all hover:border-primary/50",
            selectedService === service.id && "border-primary shadow-md",
          )}
        >
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDirectionName(service.direction?.name || directionsData.find((d) => d.id === service.directionId)?.name || "")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={cn(getServiceTypeBadgeColor(service.serviceType))}>
                  {getServiceTypeLabel(service.serviceType)}
                </Badge>
                <Button
                  variant={selectedService === service.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleEditService(service)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {selectedService === service.id ? "Cerrar" : "Editar"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm">
                  <span className="font-medium">Responsable:</span> {service.responsiblePerson}
                </p>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Extensión:</span> {service.phoneExtension}
                </p>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Ubicación:</span> {service.location}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">{service.description}</p>
          </div>
        </Card>
      </motion.div>
    ))
  }
}
