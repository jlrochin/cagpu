const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        console.log('🔍 VERIFICANDO USUARIOS EN LA BASE DE DATOS\n');

        // Obtener todos los usuarios
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true
            }
        });

        if (users.length === 0) {
            console.log('❌ No hay usuarios en la base de datos');
            console.log('💡 Necesitas crear al menos un usuario administrador');
        } else {
            console.log(`✅ Se encontraron ${users.length} usuarios:\n`);

            users.forEach((user, index) => {
                console.log(`${index + 1}. Usuario: ${user.username}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Rol: ${user.role}`);
                console.log(`   Nombre: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
                console.log(`   Estado: ${user.isActive ? '✅ Activo' : '❌ Inactivo'}`);
                console.log(`   Creado: ${user.createdAt.toLocaleDateString()}`);
                console.log('');
            });

            // Verificar si hay usuarios administradores
            const admins = users.filter(u => u.role === 'admin' && u.isActive);
            if (admins.length === 0) {
                console.log('⚠️  No hay usuarios administradores activos');
                console.log('💡 Necesitas al menos un usuario con rol "admin"');
            } else {
                console.log(`✅ Hay ${admins.length} usuario(s) administrador(es) activo(s)`);
            }
        }

    } catch (error) {
        console.error('❌ Error al verificar usuarios:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la verificación
checkUsers();
