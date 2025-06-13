import { directionsData, servicesData } from "./data"

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  serviceId?: string
}

const notificationTypes = [
  {
    type: "update",
    titleTemplate: "Actualización en {service}",
    messageTemplates: [
      "Se ha actualizado la información de contacto.",
      "Se ha cambiado el responsable del servicio.",
      "Se ha modificado la ubicación del servicio.",
      "Se ha actualizado la descripción del servicio.",
    ],
  },
  {
    type: "alert",
    titleTemplate: "Alerta en {service}",
    messageTemplates: [
      "Se requiere actualizar la información de este servicio.",
      "Este servicio necesita revisión urgente.",
      "Hay cambios pendientes de aprobación.",
    ],
  },
  {
    type: "info",
    titleTemplate: "Información sobre {service}",
    messageTemplates: [
      "Se ha programado una revisión para este servicio.",
      "Nuevas directrices disponibles para este servicio.",
      "Se ha añadido nueva documentación.",
    ],
  },
]

export function generateNotifications(count: number): Notification[] {
  const notifications: Notification[] = []

  for (let i = 0; i < count; i++) {
    // Select a random service
    const service = servicesData[Math.floor(Math.random() * servicesData.length)]
    const direction = directionsData.find((d) => d.id === service.directionId)

    // Select a random notification type
    const notificationType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]

    // Select a random message template
    const messageTemplate =
      notificationType.messageTemplates[Math.floor(Math.random() * notificationType.messageTemplates.length)]

    // Create the notification
    notifications.push({
      id: `notification-${Date.now()}-${i}`,
      title: notificationType.titleTemplate.replace("{service}", service.name),
      message: messageTemplate,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)), // Random time in the last 24 hours
      read: false,
      serviceId: service.id,
    })
  }

  // Sort by timestamp (newest first)
  return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
