const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setGeneralFirst() {
    try {
        console.log('🔄 Configurando Dirección General como primera...\n');

        // Orden con Dirección General primero
        const newOrder = [
            {
                id: 'DIRECCION_GENERAL',
                name: 'Dirección General',
                order: 1
            },
            {
                id: 'DIRECCION_ADMINISTRACION',
                name: 'Dirección de Administración',
                order: 2
            },
            {
                id: 'DIRECCION_DESARROLLO_VINCULACION_INSTITUCIONAL',
                name: 'Dirección de Desarrollo y Vinculación Institucional',
                order: 3
            },
            {
                id: 'DIRECCION_ENFERMERIA',
                name: 'Dirección de Enfermería',
                order: 4
            },
            {
                id: 'DIRECCION_INVESTIGACION_ENSENANZA',
                name: 'Dirección de Investigación y Enseñanza',
                order: 5
            },
            {
                id: 'DIRECCION_MEDICA',
                name: 'Dirección Médica',
                order: 6
            }
        ];

        console.log('📋 Estableciendo nuevo orden:');

        // Actualizar el orden de cada dirección
        for (const direction of newOrder) {
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

        console.log('\n📋 DIRECCIONES EN NUEVO ORDEN:');
        orderedDirections.forEach(direction => {
            console.log(`   ${direction.displayOrder}. ${direction.name} (${direction.servicesCount} servicios)`);
        });

        console.log('\n🎉 ¡Dirección General ahora es la primera!');
        console.log('Orden: General → Administración → Desarrollo → Enfermería → Investigación → Médica');

    } catch (error) {
        console.error('❌ Error durante la configuración:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la configuración
setGeneralFirst();
