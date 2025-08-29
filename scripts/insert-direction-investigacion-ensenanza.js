const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertDirectionInvestigacionEnsenanza() {
    try {
        console.log('🔄 Insertando Dirección de Investigación y Enseñanza...\n');

        // Crear la dirección
        const direction = await prisma.direction.upsert({
            where: { id: 'DIRECCION_INVESTIGACION_ENSENANZA' },
            update: {},
            create: {
                id: 'DIRECCION_INVESTIGACION_ENSENANZA',
                name: 'Dirección de Investigación y Enseñanza',
                description: 'Dirección de Investigación y Enseñanza del sistema',
                servicesCount: 0
            }
        });

        console.log('✅ Dirección de Investigación y Enseñanza creada/actualizada');

        // Lista de servicios de la Dirección de Investigación y Enseñanza
        const servicios = [
            {
                id: 'UNIDAD_COMUNICACION_SOCIAL',
                name: 'Unidad de Comunicación Social',
                responsiblePerson: 'Mtra. Edith Balleza Beltrán',
                location: 'Edificio B, Piso 1',
                serviceType: 'Unidad',
                description: 'Unidad de comunicación social'
            },
            {
                id: 'SUBDIRECCION_ENSENANZA',
                name: 'Subdirección de Enseñanza',
                responsiblePerson: 'DR. ANTONIO GUTIÉRREZ RAMÍREZ',
                location: 'Edificio G, Piso 2',
                serviceType: 'Subdirección',
                description: 'Subdirección de enseñanza'
            },
            {
                id: 'PREGRADO',
                name: 'Pregrado',
                responsiblePerson: 'Dra. Sandy Mariel Munguía Mogo (ENC)',
                location: 'Edificio G, Piso 2',
                serviceType: 'Servicio',
                description: 'Servicio de pregrado'
            },
            {
                id: 'POSGRADO',
                name: 'Posgrado',
                responsiblePerson: 'Dra. Madeleine Edith Velez Cruz',
                location: 'Edificio G, Piso 2',
                serviceType: 'Servicio',
                description: 'Servicio de posgrado'
            },
            {
                id: 'EXTENSION_CONTINUA',
                name: 'Extensión Continua',
                responsiblePerson: 'Dra. Paola Alheli Sánchez Jacobo (ENC)',
                location: 'Edificio G, Piso 2',
                serviceType: 'Servicio',
                description: 'Servicio de extensión continua'
            },
            {
                id: 'DIVISION_INVESTIGACION',
                name: 'División de Investigación',
                responsiblePerson: 'DRA. VERÓNICA FERNÁNDEZ SÁNCHEZ',
                location: 'Edificio G, Piso 2',
                serviceType: 'División',
                description: 'División de investigación'
            },
            {
                id: 'DESARROLLO_CIENTIFICO_TECNOLOGICO',
                name: 'Desarrollo Científico y Tecnológico',
                responsiblePerson: 'Dra. Dulce Milagros Razo Blanco Hernández (ENC)',
                location: 'Edificio G, Piso 2',
                serviceType: 'Servicio',
                description: 'Servicio de desarrollo científico y tecnológico'
            }
        ];

        console.log(`🔄 Creando ${servicios.length} servicios...`);

        // Crear todos los servicios
        for (const servicio of servicios) {
            await prisma.service.create({
                data: {
                    id: servicio.id,
                    directionId: 'DIRECCION_INVESTIGACION_ENSENANZA',
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
            where: { id: 'DIRECCION_INVESTIGACION_ENSENANZA' },
            data: { servicesCount: servicios.length }
        });

        console.log('\n🎉 Dirección de Investigación y Enseñanza configurada exitosamente!');
        console.log(`📊 Resumen:`);
        console.log(`   - Dirección: ${direction.name}`);
        console.log(`   - Total de servicios: ${servicios.length}`);
        console.log(`   - Tipos: 1 Unidad, 1 Subdirección, 1 División, 4 Servicios`);

    } catch (error) {
        console.error('❌ Error durante la inserción:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la inserción
insertDirectionInvestigacionEnsenanza();
