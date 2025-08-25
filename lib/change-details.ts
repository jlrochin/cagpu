export function generateUserChangeDetails(oldUser: any, newUser: any): string {
  const changes: string[] = [];
  
  // Mapeo de campos a nombres legibles en español
  const fieldLabels: Record<string, string> = {
    username: 'nombre de usuario',
    email: 'correo electrónico', 
    role: 'rol',
    firstName: 'nombre',
    lastName: 'apellido',
    department: 'departamento',
    phone: 'teléfono',
    passwordHash: 'contraseña'
  };

  // Mapeo de roles a español
  const roleLabels: Record<string, string> = {
    admin: 'administrador',
    user: 'usuario'
  };

  // Comparar cada campo
  Object.keys(newUser).forEach(key => {
    if (key === 'passwordHash' || key === 'password') {
      // Para contraseña, solo indicar que cambió sin mostrar valores
      if (newUser[key] && newUser[key] !== oldUser[key]) {
        changes.push('contraseña actualizada');
      }
      return;
    }

    if (oldUser[key] !== newUser[key] && newUser[key] !== undefined) {
      const fieldName = fieldLabels[key] || key;
      let oldValue = oldUser[key] || '(vacío)';
      let newValue = newUser[key] || '(vacío)';
      
      // Traducir roles si es necesario
      if (key === 'role') {
        oldValue = roleLabels[oldValue] || oldValue;
        newValue = roleLabels[newValue] || newValue;
      }
      
      changes.push(`${fieldName}: "${oldValue}" → "${newValue}"`);
    }
  });

  if (changes.length === 0) {
    return 'Sin cambios detectados';
  }

  return changes.join(', ');
}

export function generateServiceChangeDetails(action: 'create' | 'update', serviceName: string, directionName: string, oldService?: any, newService?: any): string {
  if (action === 'create') {
    return `Servicio "${serviceName}" creado en ${directionName}`;
  }

  if (!oldService || !newService) {
    return `Servicio "${serviceName}" actualizado`;
  }

  const changes: string[] = [];
  
  // Mapeo de campos a nombres legibles
  const fieldLabels: Record<string, string> = {
    name: 'nombre',
    responsiblePerson: 'responsable',
    phoneExtension: 'extensión',
    serviceType: 'tipo',
    location: 'ubicación',
    description: 'descripción',
    directionId: 'dirección'
  };

  // Mapeo de tipos de servicio
  const serviceTypeLabels: Record<string, string> = {
    clinical: 'clínico',
    administrative: 'administrativo',
    support: 'apoyo',
    specialized: 'especializado'
  };

  // Comparar campos relevantes
  const fieldsToCheck = ['name', 'responsiblePerson', 'phoneExtension', 'serviceType', 'location', 'description'];
  
  fieldsToCheck.forEach(key => {
    if (oldService[key] !== newService[key]) {
      const fieldName = fieldLabels[key] || key;
      let oldValue = oldService[key] || '(vacío)';
      let newValue = newService[key] || '(vacío)';
      
      // Traducir tipos de servicio
      if (key === 'serviceType') {
        oldValue = serviceTypeLabels[oldValue] || oldValue;
        newValue = serviceTypeLabels[newValue] || newValue;
      }
      
      changes.push(`${fieldName}: "${oldValue}" → "${newValue}"`);
    }
  });

  if (changes.length === 0) {
    return `Servicio "${serviceName}" actualizado (sin cambios específicos)`;
  }

  return `Servicio "${serviceName}" actualizado: ${changes.join(', ')}`;
} 