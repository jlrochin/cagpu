const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertDirectionGeneral() {
    try {
        console.log('🔄 Insertando Dirección General...');

        // Primero, crear la dirección si no existe
        const direction = await prisma.direction.upsert({
            where: { id: 'DIRECCION_GENERAL' },
            update: {},
            create: {
                id: 'DIRECCION_GENERAL',
                name: 'Dirección General',
                description: 'Dirección General del sistema',
                servicesCount: 1
            }
        });

        console.log('✅ Dirección General creada/actualizada');

        // Crear el servicio de la Unidad Jurídica
        const service = await prisma.service.create({
            data: {
                id: 'UNIDAD_JURIDICA',
                directionId: 'DIRECCION_GENERAL',
                name: 'Unidad Jurídica',
                responsiblePerson: 'Lic. Gabriela Rangel Cruz',
                phoneExtension: null,
                serviceType: 'Unidad',
                location: 'Edificio B, Piso 1 (Aula A)',
                description: 'Unidad jurídica de la Dirección General',
                isActive: true
            }
        });

        console.log('✅ Servicio Unidad Jurídica creado exitosamente');

        // Actualizar el contador de servicios
        await prisma.direction.update({
            where: { id: 'DIRECCION_GENERAL' },
            data: { servicesCount: 1 }
        });

        console.log('\n🎉 Dirección General configurada exitosamente!');
        console.log(`📊 Resumen:`);
        console.log(`   - Dirección: ${direction.name}`);
        console.log(`   - Servicio: ${service.name}`);
        console.log(`   - Responsable: ${service.responsiblePerson}`);
        console.log(`   - Ubicación: ${service.location}`);

    } catch (error) {
        console.error('❌ Error durante la inserción:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la inserción
insertDirectionGeneral();
