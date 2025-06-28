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

export function ChangeHistorySummary({ changes }: { changes: any[] }) {
  if (changes.length === 0) {
    return <p className="text-muted-foreground">No hay cambios recientes.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <h3 className="text-lg font-medium text-foreground mb-2">Resumen de Cambios Recientes</h3>
      <ul className="space-y-1">
        {changes.map((change) => (
          <li key={change.id} className="rounded-md bg-muted px-3 py-2 flex flex-col md:flex-row md:items-center md:justify-between">
            <span>
              <span className="font-semibold capitalize mr-1">{formatAction(change.action)}</span>
              <span className="text-primary font-medium">{change.targetUser?.username || 'Desconocido'}</span>
              <span className="text-muted-foreground"> (por {change.performedByUser?.username || 'Desconocido'})</span>
            </span>
            <span className="text-xs text-muted-foreground mt-1 md:mt-0 md:ml-2">{formatDate(change.createdAt)}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
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

function formatAction(action: string): string {
  if (action === 'activate') return 'Usuario activado';
  if (action === 'deactivate') return 'Usuario desactivado';
  if (action === 'update') return 'Usuario modificado';
  return action;
}
