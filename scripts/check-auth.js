const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAuth() {
    try {
        console.log('🔍 VERIFICANDO ESTADO DE AUTENTICACIÓN\n');

        // Verificar usuarios existentes
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                serviceId: true,
                isActive: true
            }
        });

        console.log(`📊 Total de usuarios: ${users.length}`);

        const admins = users.filter(u => u.role === 'admin');
        const serviceUsers = users.filter(u => u.role === 'user' && u.serviceId);
        const orphanUsers = users.filter(u => u.role === 'user' && !u.serviceId);

        console.log(`👑 Administradores: ${admins.length}`);
        console.log(`👤 Usuarios de servicio: ${serviceUsers.length}`);
        console.log(`⚠️  Usuarios sin servicio: ${orphanUsers.length}\n`);

        if (admins.length > 0) {
            console.log('✅ Usuarios administradores disponibles:');
            admins.forEach(admin => {
                console.log(`   - ${admin.username} (${admin.email})`);
            });
            console.log('');
        }

        if (serviceUsers.length > 0) {
            console.log('✅ Usuarios de servicio disponibles:');
            serviceUsers.slice(0, 5).forEach(user => {
                console.log(`   - ${user.username} → Servicio: ${user.serviceId}`);
            });
            if (serviceUsers.length > 5) {
                console.log(`   ... y ${serviceUsers.length - 5} más`);
            }
            console.log('');
        }

        // Verificar servicios
        const services = await prisma.service.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                directionId: true
            }
        });

        console.log(`🏥 Total de servicios activos: ${services.length}`);

        const servicesWithUsers = services.filter(s =>
            serviceUsers.some(u => u.serviceId === s.id)
        );
        const servicesWithoutUsers = services.filter(s =>
            !serviceUsers.some(u => u.serviceId === s.id)
        );

        console.log(`✅ Servicios con usuario: ${servicesWithUsers.length}`);
        console.log(`⚠️  Servicios sin usuario: ${servicesWithoutUsers.length}\n`);

        if (servicesWithoutUsers.length > 0) {
            console.log('⚠️  Servicios sin usuario asignado:');
            servicesWithoutUsers.slice(0, 5).forEach(service => {
                console.log(`   - ${service.name} (${service.id})`);
            });
            if (servicesWithoutUsers.length > 5) {
                console.log(`   ... y ${servicesWithoutUsers.length - 5} más`);
            }
            console.log('');
        }

        console.log('🔑 CREDENCIALES DE ACCESO:');
        console.log('   Para probar el sistema, inicia sesión con:');
        if (admins.length > 0) {
            const admin = admins[0];
            console.log(`   👑 Admin: ${admin.username} (contraseña: admin123)`);
        }
        if (serviceUsers.length > 0) {
            const serviceUser = serviceUsers[0];
            console.log(`   👤 Usuario de servicio: ${serviceUser.username} (contraseña: ${serviceUser.username})`);
        }

    } catch (error) {
        console.error('❌ Error al verificar autenticación:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAuth();
