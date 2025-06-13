import type { Direction, Service } from "./types"

export const directionsData: Direction[] = [
  {
    id: "medical",
    name: "Dirección Médica",
    description: "Servicios médicos y atención al paciente",
    servicesCount: 12,
  },
  {
    id: "nursing",
    name: "Dirección de Enfermería",
    description: "Servicios de enfermería y cuidados",
    servicesCount: 8,
  },
  {
    id: "research",
    name: "Dirección de Investigación y Enseñanza",
    description: "Investigación médica y formación",
    servicesCount: 5,
  },
  {
    id: "development",
    name: "Dirección de Desarrollo y Vinculación Institucional",
    description: "Relaciones institucionales y desarrollo",
    servicesCount: 4,
  },
  {
    id: "administration",
    name: "Dirección de Administración",
    description: "Gestión administrativa y recursos",
    servicesCount: 7,
  },
]

export const servicesData: Service[] = [
  // Dirección Médica
  {
    id: "cardiology",
    directionId: "medical",
    name: "Cardiología",
    responsiblePerson: "Dr. Carlos Rodríguez",
    phoneExtension: "1234",
    serviceType: "clinical",
    location: "Edificio A, Piso 2",
    description: "Servicio especializado en diagnóstico y tratamiento de enfermedades cardiovasculares.",
  },
  {
    id: "neurology",
    directionId: "medical",
    name: "Neurología",
    responsiblePerson: "Dra. Ana Martínez",
    phoneExtension: "1235",
    serviceType: "clinical",
    location: "Edificio A, Piso 3",
    description: "Atención especializada en trastornos del sistema nervioso.",
  },
  {
    id: "pediatrics",
    directionId: "medical",
    name: "Pediatría",
    responsiblePerson: "Dr. Miguel Sánchez",
    phoneExtension: "1236",
    serviceType: "clinical",
    location: "Edificio B, Piso 1",
    description: "Atención médica para niños y adolescentes.",
  },

  // Dirección de Enfermería
  {
    id: "emergency-nursing",
    directionId: "nursing",
    name: "Enfermería de Urgencias",
    responsiblePerson: "Lic. Laura Gómez",
    phoneExtension: "2234",
    serviceType: "support",
    location: "Edificio C, Planta Baja",
    description: "Servicios de enfermería en el área de urgencias.",
  },
  {
    id: "intensive-care-nursing",
    directionId: "nursing",
    name: "Enfermería de Cuidados Intensivos",
    responsiblePerson: "Lic. Roberto Díaz",
    phoneExtension: "2235",
    serviceType: "specialized",
    location: "Edificio A, Piso 4",
    description: "Cuidados de enfermería especializados para pacientes críticos.",
  },

  // Dirección de Investigación y Enseñanza
  {
    id: "clinical-research",
    directionId: "research",
    name: "Investigación Clínica",
    responsiblePerson: "Dr. Javier López",
    phoneExtension: "3234",
    serviceType: "specialized",
    location: "Edificio D, Piso 2",
    description: "Desarrollo de estudios clínicos y protocolos de investigación.",
  },
  {
    id: "medical-education",
    directionId: "research",
    name: "Educación Médica Continua",
    responsiblePerson: "Dra. Patricia Flores",
    phoneExtension: "3235",
    serviceType: "support",
    location: "Edificio D, Piso 1",
    description: "Programas de actualización y formación continua para profesionales de la salud.",
  },

  // Dirección de Desarrollo y Vinculación Institucional
  {
    id: "institutional-relations",
    directionId: "development",
    name: "Relaciones Institucionales",
    responsiblePerson: "Lic. Fernando Torres",
    phoneExtension: "4234",
    serviceType: "administrative",
    location: "Edificio E, Piso 3",
    description: "Gestión de relaciones con otras instituciones y organismos.",
  },
  {
    id: "social-service",
    directionId: "development",
    name: "Servicio Social",
    responsiblePerson: "Lic. Mariana Vega",
    phoneExtension: "4235",
    serviceType: "support",
    location: "Edificio E, Piso 2",
    description: "Coordinación de programas de servicio social y voluntariado.",
  },

  // Dirección de Administración
  {
    id: "human-resources",
    directionId: "administration",
    name: "Recursos Humanos",
    responsiblePerson: "Lic. Gabriela Mendoza",
    phoneExtension: "5234",
    serviceType: "administrative",
    location: "Edificio F, Piso 1",
    description: "Gestión del personal y procesos administrativos relacionados.",
  },
  {
    id: "finance",
    directionId: "administration",
    name: "Finanzas",
    responsiblePerson: "C.P. Héctor Ramírez",
    phoneExtension: "5235",
    serviceType: "administrative",
    location: "Edificio F, Piso 2",
    description: "Administración de recursos financieros y contabilidad.",
  },
  {
    id: "maintenance",
    directionId: "administration",
    name: "Mantenimiento",
    responsiblePerson: "Ing. Ricardo Ortiz",
    phoneExtension: "5236",
    serviceType: "support",
    location: "Edificio F, Planta Baja",
    description: "Mantenimiento de instalaciones y equipos.",
  },
]
