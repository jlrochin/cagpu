export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateServiceData(data: any): ValidationResult {
  const errors: string[] = [];

  // Validar campos requeridos
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('El nombre del servicio es requerido');
  }

  if (!data.directionId || typeof data.directionId !== 'string' || data.directionId.trim().length === 0) {
    errors.push('La dirección es requerida');
  }

  // Validar campos opcionales si están presentes
  if (data.responsiblePerson && typeof data.responsiblePerson !== 'string') {
    errors.push('El responsable debe ser una cadena de texto');
  }

  if (data.phoneExtension && typeof data.phoneExtension !== 'string') {
    errors.push('La extensión telefónica debe ser una cadena de texto');
  }

  if (data.serviceType && !['clinical', 'administrative', 'support', 'specialized'].includes(data.serviceType)) {
    errors.push('El tipo de servicio debe ser: clinical, administrative, support o specialized');
  }

  if (data.location && typeof data.location !== 'string') {
    errors.push('La ubicación debe ser una cadena de texto');
  }

  if (data.description && typeof data.description !== 'string') {
    errors.push('La descripción debe ser una cadena de texto');
  }

  if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
    errors.push('El estado activo debe ser un valor booleano');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
} 