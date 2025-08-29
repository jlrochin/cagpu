const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyFinalState() {
    try {
        console.log('🔍 VERIFICACIÓN FINAL DEL ESTADO DE LA BASE DE DATOS\n');

        // Obtener todas las direcciones ordenadas por displayOrder
        const orderedDirections = await prisma.direction.findMany({
            orderBy: { displayOrder: 'asc' },
            include: {
                services: true
            }
        });

        console.log('📋 DIRECCIONES EN ORDEN DE APARICIÓN (según la imagen):');
        console.log('='.repeat(80));

        orderedDirections.forEach((direction, index) => {
            console.log(`\n${index + 1}. ${direction.name.toUpperCase()}`);
            console.log(`   ID: ${direction.id}`);
            console.log(`   Orden: ${direction.displayOrder}`);
            console.log(`   Servicios: ${direction.servicesCount} (reales: ${direction.services.length})`);
            console.log(`   Descripción: ${direction.description || 'Sin descripción'}`);

            if (direction.services.length > 0) {
                console.log('   Lista de servicios:');
                direction.services.forEach(service => {
                    console.log(`     • ${service.name} (${service.serviceType})`);
                });
            }
            console.log('-'.repeat(60));
        });

        // Verificar totales
        const totalDirections = await prisma.direction.count();
        const totalServices = await prisma.service.count();

        console.log('\n📊 RESUMEN FINAL:');
        console.log('='.repeat(80));
        console.log(`   Total de direcciones: ${totalDirections}`);
        console.log(`   Total de servicios: ${totalServices}`);
        console.log(`   Promedio de servicios por dirección: ${(totalServices / totalDirections).toFixed(1)}`);

        // Verificar que no hay duplicados
        const directionNames = orderedDirections.map(d => d.name);
        const uniqueNames = [...new Set(directionNames)];

        if (directionNames.length === uniqueNames.length) {
            console.log('   ✅ No hay nombres de direcciones duplicados');
        } else {
            console.log('   ❌ HAY NOMBRES DE DIRECCIONES DUPLICADOS');
        }

        // Verificar que el orden es secuencial
        const orders = orderedDirections.map(d => d.displayOrder);
        const isSequential = orders.every((order, index) => order === index + 1);

        if (isSequential) {
            console.log('   ✅ El orden de las direcciones es secuencial (1, 2, 3, 4, 5, 6)');
        } else {
            console.log('   ❌ El orden de las direcciones NO es secuencial');
        }

        console.log('\n🎉 ¡VERIFICACIÓN COMPLETADA!');
        console.log('El sistema está listo para mostrar las direcciones en el orden correcto.');

    } catch (error) {
        console.error('❌ Error durante la verificación:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la verificación
verifyFinalState();
