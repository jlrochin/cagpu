const bcrypt = require("bcryptjs");

// Función para generar hash de contraseña
async function hashPassword(password) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Función para generar el script SQL con contraseñas hasheadas
async function generateInitScript() {
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  const sqlScript = `
-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de direcciones
CREATE TABLE directions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    services_count INTEGER DEFAULT 0
);

-- Crear tabla de servicios
CREATE TABLE services (
    id VARCHAR(50) PRIMARY KEY,
    direction_id VARCHAR(50) REFERENCES directions(id),
    name VARCHAR(100) NOT NULL,
    responsible_person VARCHAR(100),
    phone_extension VARCHAR(10),
    service_type VARCHAR(50),
    location VARCHAR(200),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de notificaciones
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    user_id INTEGER REFERENCES users(id),
    service_id VARCHAR(50) REFERENCES services(id),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales de direcciones
INSERT INTO directions (id, name, description, services_count) VALUES
('medical', 'Dirección Médica', 'Servicios médicos y atención al paciente', 12),
('nursing', 'Dirección de Enfermería', 'Servicios de enfermería y cuidados', 8),
('research', 'Dirección de Investigación y Enseñanza', 'Investigación médica y formación', 5),
('development', 'Dirección de Desarrollo y Vinculación Institucional', 'Relaciones institucionales y desarrollo', 4),
('administration', 'Dirección de Administración', 'Gestión administrativa y recursos', 7);

-- Insertar datos iniciales de servicios
INSERT INTO services (id, direction_id, name, responsible_person, phone_extension, service_type, location, description) VALUES
('cardiology', 'medical', 'Cardiología', 'Dr. Carlos Rodríguez', '1234', 'clinical', 'Edificio A, Piso 2', 'Servicio especializado en diagnóstico y tratamiento de enfermedades cardiovasculares.'),
('neurology', 'medical', 'Neurología', 'Dra. Ana Martínez', '1235', 'clinical', 'Edificio A, Piso 3', 'Atención especializada en trastornos del sistema nervioso.'),
('pediatrics', 'medical', 'Pediatría', 'Dr. Miguel Sánchez', '1236', 'clinical', 'Edificio B, Piso 1', 'Atención médica para niños y adolescentes.'),
('emergency-nursing', 'nursing', 'Enfermería de Urgencias', 'Lic. Laura Gómez', '2234', 'support', 'Edificio C, Planta Baja', 'Servicios de enfermería en el área de urgencias.'),
('intensive-care-nursing', 'nursing', 'Enfermería de Cuidados Intensivos', 'Lic. Roberto Díaz', '2235', 'specialized', 'Edificio A, Piso 4', 'Cuidados de enfermería especializados para pacientes críticos.'),
('clinical-research', 'research', 'Investigación Clínica', 'Dr. Javier López', '3234', 'specialized', 'Edificio D, Piso 2', 'Desarrollo de estudios clínicos y protocolos de investigación.'),
('medical-education', 'research', 'Educación Médica Continua', 'Dra. Patricia Flores', '3235', 'support', 'Edificio D, Piso 1', 'Programas de actualización y formación continua para profesionales de la salud.'),
('institutional-relations', 'development', 'Relaciones Institucionales', 'Lic. Fernando Torres', '4234', 'administrative', 'Edificio E, Piso 3', 'Gestión de relaciones con otras instituciones y organismos.'),
('social-service', 'development', 'Servicio Social', 'Lic. Mariana Vega', '4235', 'support', 'Edificio E, Piso 2', 'Coordinación de programas de servicio social y voluntariado.'),
('human-resources', 'administration', 'Recursos Humanos', 'Lic. Gabriela Mendoza', '5234', 'administrative', 'Edificio F, Piso 1', 'Gestión del personal y procesos administrativos relacionados.'),
('finance', 'administration', 'Finanzas', 'C.P. Héctor Ramírez', '5235', 'administrative', 'Edificio F, Piso 2', 'Administración de recursos financieros y contabilidad.'),
('maintenance', 'administration', 'Mantenimiento', 'Ing. Ricardo Ortiz', '5236', 'support', 'Edificio F, Planta Baja', 'Mantenimiento de instalaciones y equipos.');

-- Insertar usuarios iniciales con contraseñas hasheadas
INSERT INTO users (username, email, password_hash, role, first_name, last_name, department) VALUES
('admin', 'admin@cagpu.com', '${adminPassword}', 'admin', 'Administrador', 'Sistema', 'TI'),
('user', 'user@cagpu.com', '${userPassword}', 'user', 'Usuario', 'Demo', 'Médica');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_services_direction_id ON services(direction_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
`;

  return sqlScript;
}

// Ejecutar el script
generateInitScript()
  .then((sql) => {
    console.log("Script SQL generado:");
    console.log(sql);

    // Escribir el archivo
    const fs = require("fs");
    fs.writeFileSync("init-db.sql", sql);
    console.log("\nArchivo init-db.sql creado exitosamente");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
