const bcrypt = require('bcryptjs');

// Función para hashear contraseñas
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
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

-- Insertar usuarios básicos del sistema
INSERT INTO users (username, email, password_hash, role, first_name, last_name, department) VALUES
('admin', 'admin@sistema.local', '${adminPassword}', 'admin', 'Administrador', 'Sistema', 'TI'),
('user', 'user@sistema.local', '${userPassword}', 'user', 'Usuario', 'Sistema', 'General');

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
