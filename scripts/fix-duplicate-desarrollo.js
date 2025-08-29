const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDuplicateDesarrollo() {
    try {
        console.log('🔄 Solucionando duplicado de Dirección de Desarrollo...\n');

        // 1. Eliminar la dirección de desarrollo con ID 'development' (la duplicada)
        console.log('🗑️ Eliminando dirección de desarrollo duplicada (ID: development)...');
        await prisma.direction.delete({
            where: { id: 'development' }
        });
        console.log('✅ Dirección de desarrollo duplicada eliminada');

        // 2. Verificar que solo quede la correcta
        const remainingDirections = await prisma.direction.findMany({
            where: { name: { contains: 'Desarrollo' } }
        });

        console.log('\n📋 Direcciones de desarrollo restantes:');
        remainingDirections.forEach(direction => {
            console.log(`   - ${direction.name} (ID: ${direction.id})`);
        });

        // 3. Verificar el total de servicios
        const totalServices = await prisma.service.count();
        console.log(`\n📊 TOTAL DE SERVICIOS: ${totalServices}`);

        console.log('\n🎉 ¡Problema de duplicado resuelto!');

    } catch (error) {
        console.error('❌ Error durante la corrección:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la corrección
fixDuplicateDesarrollo();
