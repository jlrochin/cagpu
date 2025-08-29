const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanFinalDuplicates() {
    try {
        console.log('🔄 Limpiando duplicados finales...\n');

        // 1. Eliminar la dirección de enfermería duplicada (ID: nursing)
        console.log('🗑️ Eliminando dirección de enfermería duplicada (ID: nursing)...');
        await prisma.direction.delete({
            where: { id: 'nursing' }
        });
        console.log('✅ Dirección de enfermería duplicada eliminada');

        // 2. Eliminar la dirección de administración duplicada (ID: administration)
        console.log('🗑️ Eliminando dirección de administración duplicada (ID: administration)...');
        await prisma.direction.delete({
            where: { id: 'administration' }
        });
        console.log('✅ Dirección de administración duplicada eliminada');

        // 3. Verificar el estado final
        console.log('\n🔍 Verificando estado final...');
        const directions = await prisma.direction.findMany({
            include: {
                services: true
            }
        });

        console.log('\n📋 DIRECCIONES FINALES:');
        directions.forEach(direction => {
            console.log(`   - ${direction.name} (ID: ${direction.id})`);
            console.log(`     Servicios: ${direction.servicesCount}`);
            console.log(`     Servicios reales: ${direction.services.length}`);
        });

        // 4. Verificar el total de servicios
        const totalServices = await prisma.service.count();
        console.log(`\n📊 TOTAL DE SERVICIOS: ${totalServices}`);

        console.log('\n🎉 ¡Limpieza final completada! No hay duplicados.');

    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la limpieza
cleanFinalDuplicates();
