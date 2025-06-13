"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface ExportOptionsProps {
  data: any[]
  filename?: string
}

export function ExportOptions({ data, filename = "servicios" }: ExportOptionsProps) {
  const [exportLoading, setExportLoading] = useState<string | null>(null)

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
    }, 1500)
  }

  return (
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
  )
}
