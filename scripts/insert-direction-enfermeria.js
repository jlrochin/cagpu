const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertDirectionEnfermeria() {
    try {
        console.log('🔄 Insertando Dirección de Enfermería...\n');

        // Crear la dirección
        const direction = await prisma.direction.upsert({
            where: { id: 'DIRECCION_ENFERMERIA' },
            update: {},
            create: {
                id: 'DIRECCION_ENFERMERIA',
                name: 'Dirección de Enfermería',
                description: 'Dirección de Enfermería del sistema',
                servicesCount: 0
            }
        });

        console.log('✅ Dirección de Enfermería creada/actualizada');

        // Lista de servicios de la Dirección de Enfermería
        const servicios = [
            {
                id: 'DIRECCION_ENFERMERIA_PRINCIPAL',
                name: 'Dirección de Enfermería',
                responsiblePerson: 'Mtra. Blanca Estela Cervantes Guzmán',
                location: 'Edificio B, Piso 1',
                serviceType: 'Dirección',
                description: 'Dirección principal de enfermería'
            },
            {
                id: 'SERVICIOS_ENFERMERIA',
                name: 'Servicios de Enfermería',
                responsiblePerson: 'Mtra. Leticia Arellano Alvarez (ENC)',
                location: 'Edificio B, Piso 1',
                serviceType: 'Servicio',
                description: 'Servicios de enfermería'
            },
            {
                id: 'ESCUELA_ENFERMERIA',
                name: 'Escuela de Enfermería',
                responsiblePerson: 'Mtra. Ma. Tolina Alcántara García (ENC)',
                location: 'Juárez del Centro',
                serviceType: 'Servicio',
                description: 'Escuela de enfermería'
            }
        ];

        console.log(`🔄 Creando ${servicios.length} servicios...`);

        // Crear todos los servicios
        for (const servicio of servicios) {
            await prisma.service.create({
                data: {
                    id: servicio.id,
                    directionId: 'DIRECCION_ENFERMERIA',
                    name: servicio.name,
                    responsiblePerson: servicio.responsiblePerson,
                    phoneExtension: null,
                    serviceType: servicio.serviceType,
                    location: servicio.location,
                    description: servicio.description,
                    isActive: true
                }
            });
            console.log(`✅ ${servicio.name} creado`);
        }

        // Actualizar el contador de servicios
        await prisma.direction.update({
            where: { id: 'DIRECCION_ENFERMERIA' },
            data: { servicesCount: servicios.length }
        });

        console.log('\n🎉 Dirección de Enfermería configurada exitosamente!');
        console.log(`📊 Resumen:`);
        console.log(`   - Dirección: ${direction.name}`);
        console.log(`   - Total de servicios: ${servicios.length}`);
        console.log(`   - Tipos: 1 Dirección, 2 Servicios`);

    } catch (error) {
        console.error('❌ Error durante la inserción:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la inserción
insertDirectionEnfermeria();
