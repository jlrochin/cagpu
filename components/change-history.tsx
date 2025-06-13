"use client"

import { motion } from "framer-motion"
import type { ChangeRecord } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

export function ChangeHistory({ changes }: { changes: ChangeRecord[] }) {
  if (changes.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-medium text-foreground">Historial de Cambios</h3>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campo</TableHead>
              <TableHead>Valor Anterior</TableHead>
              <TableHead>Nuevo Valor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {changes.map((change) => (
              <TableRow key={change.id}>
                <TableCell className="font-medium capitalize">{translateFieldName(change.field)}</TableCell>
                <TableCell>{change.previousValue}</TableCell>
                <TableCell>{change.newValue}</TableCell>
                <TableCell>{formatDate(change.timestamp)}</TableCell>
                <TableCell>{change.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}

function translateFieldName(field: string): string {
  const translations: Record<string, string> = {
    name: "nombre",
    responsiblePerson: "responsable",
    phoneExtension: "extensión",
    serviceType: "tipo de servicio",
    location: "ubicación",
    description: "descripción",
  }

  return translations[field] || field
}
