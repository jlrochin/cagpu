"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Service } from '@/lib/types'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

const instructivo = {
  area: "Indicar el nombre del Área o Servicio de acuerdo al Organigrama Funcional",
  responsible: "Indicar el nombre completo de la persona responsable del Área o Servicio y el cargo.",
  phoneExtension: "Proporcionar número de extensión.",
  location: "Indicar localización del Servicio (Edif., Piso, Consultorio)",
  direction: "Nombre completo de la Dirección a la que pertenece el Área o Servicio",
  division: "Nombre completo de la División o Subdirección a la que pertenece el Área o Servicio.",
  serviceType: "Indicar la función principal que proporciona.",
  particularInfo: "Indicar información específica del Área o Servicio, dicha información, el personal del Servicio de Informes y Hospitalidad la transmitirá a la población usuaria.",
  documentation: "Indicar qué tipo de documentación requiere la persona usuaria y especificar para qué trámite.",
  consultorioNumber: "Proporcionar número de consultorio del servicio.",
  externalControl: "Proporcionar número de módulo de Consulta Externa al que pertenece.",
  consultorioPhone: "Proporcionar número de extensión de consultorio.",
  controlPhone: "Proporcionar número de extensión de control.",
  schedule: "Indicar horarios de atención a la población usuaria.",
  appointmentPlace: "Indicar área donde se agenda cita.",
  academicEvents: "Especificar los eventos académicos programados, en los que habrá participación de la población usuaria.",
  additionalInfo: "Anotar la información que el Área o Servicio, desee puntualizar a la población usuaria, a través del personal del Servicio de Informes y Hospitalidad."
}

export function ServiceForm({ service, onSaved }: { service?: Service, onSaved?: () => void }) {
  const [formData, setFormData] = useState({
    area: service?.name || "",
    responsible: service?.responsiblePerson || "",
    phoneExtension: service?.phoneExtension || "",
    location: service?.location || "",
    direction: "",
    division: "",
    serviceType: service?.serviceType || "",
    particularInfo: service?.description || "",
    documentation: "",
    consultorioNumber: "",
    externalControl: "",
    consultorioPhone: "",
    controlPhone: "",
    schedule: "",
    appointmentPlace: "",
    academicEvents: "",
    additionalInfo: "",
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      const isNewService = !service?.id
      toast({
        title: isNewService ? "Servicio creado" : "Cambios guardados",
        description: isNewService 
          ? "El nuevo servicio se creó correctamente." 
          : "La información del servicio se actualizó correctamente."
      })
      if (onSaved) onSaved()
      // Aquí iría la lógica para guardar los datos
    }, 1500)
  }

  return (
    <TooltipProvider>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-8 max-w-5xl mx-auto"
        onSubmit={handleSubmit}
      >
        {/* Sección 1 */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4 text-center border-b pb-2">INFORMACIÓN GENERAL DEL ÁREA O SERVICIO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">ÁREA O SERVICIO</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.area}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.area} onChange={e => handleChange("area", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">NOMBRE Y CARGO DE LA PERSONA TITULAR RESPONSABLE DEL ÁREA O SERVICIO</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.responsible}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.responsible} onChange={e => handleChange("responsible", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">EXTENSIÓN TELEFÓNICA</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.phoneExtension}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.phoneExtension} onChange={e => handleChange("phoneExtension", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">UBICACIÓN</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.location}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.location} onChange={e => handleChange("location", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">DIRECCIÓN A LA QUE PERTENECE</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.direction}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.direction} onChange={e => handleChange("direction", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">DIVISIÓN O SUBDIRECCIÓN A LA QUE PERTENECE</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.division}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.division} onChange={e => handleChange("division", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">TIPO DE SERVICIO QUE BRINDA</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.serviceType}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.serviceType} onChange={e => handleChange("serviceType", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">INFORMACIÓN PARTICULAR QUE EL SERVICIO DE INFORMES Y HOSPITALIDAD DEBE PROPORCIONAR A LA POBLACIÓN USUARIA</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.particularInfo}</TooltipContent>
                </Tooltip>
              </div>
              <Textarea rows={2} value={formData.particularInfo} onChange={e => handleChange("particularInfo", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">EL ÁREA O SERVICIO REQUIERE DOCUMENTACIÓN ESPECÍFICA DE LA PERSONA USUARIA, PARA REALIZAR ALGÚN TIPO DE TRÁMITE</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.documentation}</TooltipContent>
                </Tooltip>
              </div>
              <Textarea rows={2} value={formData.documentation} onChange={e => handleChange("documentation", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Sección 2 */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4 text-center border-b pb-2">INFORMACIÓN ESPECÍFICA DE ÁREAS O SERVICIOS MÉDICOS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">EN QUÉ NÚMERO DE CONSULTORIO PROPORCIONA ATENCIÓN A PACIENTES</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.consultorioNumber}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.consultorioNumber} onChange={e => handleChange("consultorioNumber", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">EN QUÉ CONTROL DE CONSULTA EXTERNA SE AGENDAN CITAS PARA ESPECIALIDAD</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.externalControl}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.externalControl} onChange={e => handleChange("externalControl", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">EXTENSIÓN TELEFÓNICA DEL CONSULTORIO</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.consultorioPhone}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.consultorioPhone} onChange={e => handleChange("consultorioPhone", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">EXTENSIÓN TELEFÓNICA DEL CONTROL</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.controlPhone}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.controlPhone} onChange={e => handleChange("controlPhone", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">HORARIOS DE ATENCIÓN</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.schedule}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.schedule} onChange={e => handleChange("schedule", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">LUGAR PARA AGENDAR CITAS</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.appointmentPlace}</TooltipContent>
                </Tooltip>
              </div>
              <Input value={formData.appointmentPlace} onChange={e => handleChange("appointmentPlace", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">EVENTOS ACADÉMICOS PROGRAMADOS E INDICACIONES PARA LA POBLACIÓN USUARIA</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.academicEvents}</TooltipContent>
                </Tooltip>
              </div>
              <Textarea rows={2} value={formData.academicEvents} onChange={e => handleChange("academicEvents", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <div className="flex items-center gap-1 min-h-[24px]">
                <Label className="whitespace-normal">INFORMACIÓN ADICIONAL</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-muted-foreground"><HelpCircle className="w-4 h-4" /></span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={12} className="max-w-4xl break-words text-xs">{instructivo.additionalInfo}</TooltipContent>
                </Tooltip>
              </div>
              <Textarea rows={2} value={formData.additionalInfo} onChange={e => handleChange("additionalInfo", e.target.value)} />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full md:w-auto" disabled={isSaving}>
          {isSaving ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Guardando..." : (!service?.id ? "Crear Servicio" : "Guardar Cambios")}
        </Button>
      </motion.form>
    </TooltipProvider>
  )
}
