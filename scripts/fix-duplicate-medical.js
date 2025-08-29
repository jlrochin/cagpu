const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDuplicateMedical() {
    try {
        console.log('🔄 Solucionando duplicado de Dirección Médica...\n');

        // 1. Eliminar la dirección médica con ID 'medical' (la duplicada)
        console.log('🗑️ Eliminando dirección médica duplicada (ID: medical)...');
        await prisma.direction.delete({
            where: { id: 'medical' }
        });
        console.log('✅ Dirección médica duplicada eliminada');

        // 2. Verificar que solo quede la correcta
        const remainingDirections = await prisma.direction.findMany({
            where: { name: { contains: 'Médica' } }
        });

        console.log('\n📋 Direcciones médicas restantes:');
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
fixDuplicateMedical();
