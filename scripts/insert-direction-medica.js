const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertDirectionMedica() {
    try {
        console.log('🔄 Insertando Dirección Médica...');

        // Crear la dirección médica
        const direction = await prisma.direction.upsert({
            where: { id: 'DIRECCION_MEDICA' },
            update: {},
            create: {
                id: 'DIRECCION_MEDICA',
                name: 'Dirección Médica',
                description: 'Dirección Médica del sistema',
                servicesCount: 0
            }
        });

        console.log('✅ Dirección Médica creada/actualizada');

        // Lista de servicios de la Dirección Médica
        const servicios = [
            {
                id: 'DIVISION_MEDICINA',
                name: 'División de Medicina',
                responsiblePerson: 'DR. JESÚS DEL CARMEN MADRIGAL ANAYA (ENC)',
                location: 'Edificio B, Piso 1',
                serviceType: 'División',
                description: 'División principal de medicina'
            },
            {
                id: 'ALERGIA_INMUNOLOGIA',
                name: 'Alergia e Inmunología',
                responsiblePerson: 'Dra. Carol Vivian Moncayo Coello (ENC)',
                location: 'Edificio A, Piso 2',
                serviceType: 'Servicio',
                description: 'Servicio de alergia e inmunología'
            },
            {
                id: 'DERMATOLOGIA',
                name: 'Dermatología',
                responsiblePerson: 'Dra. Miriam Puebla Miranda (ENC)',
                location: 'Edificio A, Piso 2',
                serviceType: 'Servicio',
                description: 'Servicio de dermatología'
            },
            {
                id: 'ENDOCRINOLOGIA_BARIATRIA',
                name: 'Endocrinología y Bariatria',
                responsiblePerson: 'Dra. Sandra Haide Aguilar Maciel (ENC)',
                location: 'Edificio A, Piso 1',
                serviceType: 'Servicio',
                description: 'Servicio de endocrinología y bariatria'
            },
            {
                id: 'HEMATOLOGIA',
                name: 'Hematología',
                responsiblePerson: 'Dr. Jorge Cruz Rico',
                location: 'Edificio D, Piso 3',
                serviceType: 'Servicio',
                description: 'Servicio de hematología'
            },
            {
                id: 'MEDICINA_INTERNA',
                name: 'Medicina Interna',
                responsiblePerson: 'Dra. Lizbeth Teresa Becerril Mendoza',
                location: 'Edificio D, Piso 3 (Lado Sur)',
                serviceType: 'Servicio',
                description: 'Servicio de medicina interna'
            },
            {
                id: 'NEUMOLOGIA_INHALOTERAPIA',
                name: 'Neumología e Inhaloterapia',
                responsiblePerson: 'Dr. Guillermo Martínez Cuevas (ENC)',
                location: 'Edificio C, Piso 1',
                serviceType: 'Servicio',
                description: 'Servicio de neumología e inhaloterapia'
            },
            {
                id: 'GERIATRIA',
                name: 'Geriatría',
                responsiblePerson: 'Dra. María del Rosario Martínez Esteves (ENC)',
                location: 'Edificio C, Planta Baja',
                serviceType: 'Servicio',
                description: 'Servicio de geriatría'
            },
            {
                id: 'GASTROENTEROLOGIA',
                name: 'Gastroenterología',
                responsiblePerson: 'Dra. Scherezada María Isabel Mejia Loza (ENC)',
                location: 'Edificio D, Piso 3',
                serviceType: 'Servicio',
                description: 'Servicio de gastroenterología'
            },
            {
                id: 'NEFROLOGIA',
                name: 'Nefrología',
                responsiblePerson: 'Dr. Enzo Christopher Vásquez Jiménez',
                location: 'Edificio B, Planta Baja',
                serviceType: 'Servicio',
                description: 'Servicio de nefrología'
            },
            {
                id: 'NEUROLOGIA',
                name: 'Neurología',
                responsiblePerson: 'Dr. Medardo Alejandro González Muñoz (ENC)',
                location: 'Edificio D, Piso 2',
                serviceType: 'Servicio',
                description: 'Servicio de neurología'
            },
            {
                id: 'PSIQUIATRIA_SALUD_MENTAL',
                name: 'Psiquiatría y Salud Mental',
                responsiblePerson: 'Dra. Eloisa Vargas Paredes (ENC)',
                location: 'Edificio A, Planta Baja',
                serviceType: 'Servicio',
                description: 'Servicio de psiquiatría y salud mental'
            },
            {
                id: 'REUMATOLOGIA',
                name: 'Reumatología',
                responsiblePerson: 'Dra. Rosa Elda Barbosa Cobos (ENC)',
                location: 'Edificio A, Piso 3',
                serviceType: 'Servicio',
                description: 'Servicio de reumatología'
            },
            {
                id: 'NEUROFISIOLOGIA',
                name: 'Neurofisiología',
                responsiblePerson: 'Dra. Aidé Montante Montes de Oca (ENC)',
                location: 'Edificio A, Piso 2',
                serviceType: 'Servicio',
                description: 'Servicio de neurofisiología'
            },
            {
                id: 'CARDIOLOGIA',
                name: 'Cardiología',
                responsiblePerson: 'Dr. Leobardo Valle Molina (ENC)',
                location: 'Edificio D, Piso 3',
                serviceType: 'Servicio',
                description: 'Servicio de cardiología'
            },
            {
                id: 'HEMODINAMIA',
                name: 'Hemodinamia',
                responsiblePerson: 'Dr. Heriberto Ontiveros Mercado',
                location: 'Edificio C, Piso 1',
                serviceType: 'Servicio',
                description: 'Servicio de hemodinamia'
            },
            {
                id: 'UNIDAD_CUIDADOS_CORONARIOS',
                name: 'Unidad de Cuidados Coronarios',
                responsiblePerson: 'Dr. Horacio Pérez Salgado',
                location: 'Edificio C, Piso 1',
                serviceType: 'Unidad',
                description: 'Unidad de cuidados coronarios'
            },
            {
                id: 'TOXICOLOGIA_CLINICA',
                name: 'Toxicología Clínica',
                responsiblePerson: 'Dra. Yessika Paola Rodríguez Torres (ENC)',
                location: 'Edificio C, Planta Baja',
                serviceType: 'Servicio',
                description: 'Servicio de toxicología clínica'
            },
            {
                id: 'NUTRICION_HOSPITALARIA',
                name: 'Nutrición Hospitalaria',
                responsiblePerson: 'Lic. Elisa Pedraza Rosas',
                location: 'Edificio F, Planta Baja',
                serviceType: 'Servicio',
                description: 'Servicio de nutrición hospitalaria'
            }
        ];

        console.log(`🔄 Creando ${servicios.length} servicios...`);

        // Crear todos los servicios
        for (const servicio of servicios) {
            await prisma.service.create({
                data: {
                    id: servicio.id,
                    directionId: 'DIRECCION_MEDICA',
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
            where: { id: 'DIRECCION_MEDICA' },
            data: { servicesCount: servicios.length }
        });

        console.log('\n🎉 Dirección Médica configurada exitosamente!');
        console.log(`📊 Resumen:`);
        console.log(`   - Dirección: ${direction.name}`);
        console.log(`   - Total de servicios: ${servicios.length}`);
        console.log(`   - Tipos: 1 División, ${servicios.length - 1} Servicios, 1 Unidad`);

    } catch (error) {
        console.error('❌ Error durante la inserción:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la inserción
insertDirectionMedica();
