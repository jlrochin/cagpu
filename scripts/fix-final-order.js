const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixFinalOrder() {
    try {
        console.log('🔄 Corrigiendo el orden final según la imagen...\n');

        // Orden correcto según la imagen (de izquierda a derecha)
        const correctOrder = [
            {
                id: 'DIRECCION_ADMINISTRACION',
                name: 'Dirección de Administración',
                order: 1
            },
            {
                id: 'DIRECCION_DESARROLLO_VINCULACION_INSTITUCIONAL',
                name: 'Dirección de Desarrollo y Vinculación Institucional',
                order: 2
            },
            {
                id: 'DIRECCION_ENFERMERIA',
                name: 'Dirección de Enfermería',
                order: 3
            },
            {
                id: 'DIRECCION_INVESTIGACION_ENSENANZA',
                name: 'Dirección de Investigación y Enseñanza',
                order: 4
            },
            {
                id: 'DIRECCION_GENERAL',
                name: 'Dirección General',
                order: 5
            },
            {
                id: 'DIRECCION_MEDICA',
                name: 'Dirección Médica',
                order: 6
            }
        ];

        console.log('📋 Estableciendo orden correcto (según la imagen):');

        // Actualizar el orden de cada dirección
        for (const direction of correctOrder) {
            await prisma.direction.update({
                where: { id: direction.id },
                data: { displayOrder: direction.order }
            });
            console.log(`   ${direction.order}. ${direction.name}`);
        }

        // Verificar el resultado
        console.log('\n🔍 Verificando orden final...');
        const orderedDirections = await prisma.direction.findMany({
            orderBy: { displayOrder: 'asc' },
            select: {
                id: true,
                name: true,
                displayOrder: true,
                servicesCount: true
            }
        });

        console.log('\n📋 DIRECCIONES EN ORDEN CORREGIDO:');
        orderedDirections.forEach(direction => {
            console.log(`   ${direction.displayOrder}. ${direction.name} (${direction.servicesCount} servicios)`);
        });

        console.log('\n🎉 ¡Orden corregido según la imagen!');
        console.log('Ahora aparecerán en el orden: Administración → Desarrollo → Enfermería → Investigación → General → Médica');

    } catch (error) {
        console.error('❌ Error durante la corrección del orden:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la corrección
fixFinalOrder();
