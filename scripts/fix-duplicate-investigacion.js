const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDuplicateInvestigacion() {
    try {
        console.log('🔄 Solucionando duplicado de Dirección de Investigación...\n');

        // 1. Eliminar la dirección de investigación con ID 'research' (la duplicada)
        console.log('🗑️ Eliminando dirección de investigación duplicada (ID: research)...');
        await prisma.direction.delete({
            where: { id: 'research' }
        });
        console.log('✅ Dirección de investigación duplicada eliminada');

        // 2. Verificar que solo quede la correcta
        const remainingDirections = await prisma.direction.findMany({
            where: { name: { contains: 'Investigación' } }
        });

        console.log('\n📋 Direcciones de investigación restantes:');
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
fixDuplicateInvestigacion();
