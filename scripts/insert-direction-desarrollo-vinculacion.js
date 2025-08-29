const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertDirectionDesarrolloVinculacion() {
    try {
        console.log('🔄 Insertando Dirección de Desarrollo y Vinculación Institucional...\n');

        // Crear la dirección
        const direction = await prisma.direction.upsert({
            where: { id: 'DIRECCION_DESARROLLO_VINCULACION_INSTITUCIONAL' },
            update: {},
            create: {
                id: 'DIRECCION_DESARROLLO_VINCULACION_INSTITUCIONAL',
                name: 'Dirección de Desarrollo y Vinculación Institucional',
                description: 'Dirección de Desarrollo y Vinculación Institucional del sistema',
                servicesCount: 0
            }
        });

        console.log('✅ Dirección de Desarrollo y Vinculación Institucional creada/actualizada');

        // Lista de servicios de la Dirección de Desarrollo y Vinculación Institucional
        const servicios = [
            {
                id: 'UNIDAD_TRANSPARENCIA',
                name: 'Unidad de Transparencia',
                responsiblePerson: 'Lic. Bruno Enrique Canales Nila',
                location: 'Edificio B, Piso 1',
                serviceType: 'Unidad',
                description: 'Unidad encargada de la transparencia institucional'
            },
            {
                id: 'DIVISION_CALIDAD_ATENCION',
                name: 'División de Calidad de la Atención',
                responsiblePerson: 'DR. OSCAR SOSA HERNÁNDEZ',
                location: 'Edificio B, Piso 1',
                serviceType: 'División',
                description: 'División encargada de la calidad de la atención'
            },
            {
                id: 'FARMACIA_HOSPITALARIA',
                name: 'Farmacia Hospitalaria',
                responsiblePerson: 'Q.F.B.Francisco Antonio Jiménez Flores (ENC)',
                location: 'Edificio C, Piso 1',
                serviceType: 'Servicio',
                description: 'Servicio de farmacia hospitalaria'
            },
            {
                id: 'FARMACOVIGILANCIA',
                name: 'Farmacovigilancia',
                responsiblePerson: 'M. en C. Christy Hernández Salazar',
                location: 'Edificio C, Piso 1',
                serviceType: 'Servicio',
                description: 'Servicio de farmacovigilancia'
            },
            {
                id: 'CENTRO_MEZCLAS_INSTITUCIONAL',
                name: 'Centro de Mezclas Institucional',
                responsiblePerson: 'Q.F.B. Eli Oswaldo Pérez Tello (ENC)',
                location: 'Edificio A, Planta Baja',
                serviceType: 'Servicio',
                description: 'Servicio de centro de mezclas institucional'
            },
            {
                id: 'DIVISION_VINCULACION_SEGUIMIENTO_CLINICO',
                name: 'División de Vinculación y Seguimiento Clínico',
                responsiblePerson: 'DR. LUIS GUSTAVO ZÁRATE SÁNCHEZ',
                location: 'Edificio B, Piso 1',
                serviceType: 'División',
                description: 'División de vinculación y seguimiento clínico'
            },
            {
                id: 'ANALISIS_PROCESOS_MEJORA_CONTINUA',
                name: 'Análisis de Procesos y Mejora Continua',
                responsiblePerson: 'Lic. Aída Esperanza Velasco Hernández',
                location: 'Edificio B, Piso 1',
                serviceType: 'Servicio',
                description: 'Servicio de análisis de procesos y mejora continua'
            },
            {
                id: 'EVALUACION_DESEMPENO_INSTITUCIONAL',
                name: 'Evaluación del Desempeño Institucional',
                responsiblePerson: 'Lic. Omar Covarrubias González',
                location: 'Edificio B, Piso 1',
                serviceType: 'Servicio',
                description: 'Servicio de evaluación del desempeño institucional'
            },
            {
                id: 'ESTADISTICA_HOSPITALARIA',
                name: 'Estadística Hospitalaria',
                responsiblePerson: 'Lic. Marco Antonio Hernández Briseño (ENC)',
                location: 'Edificio A, Planta Baja',
                serviceType: 'Servicio',
                description: 'Servicio de estadística hospitalaria'
            }
        ];

        console.log(`🔄 Creando ${servicios.length} servicios...`);

        // Crear todos los servicios
        for (const servicio of servicios) {
            await prisma.service.create({
                data: {
                    id: servicio.id,
                    directionId: 'DIRECCION_DESARROLLO_VINCULACION_INSTITUCIONAL',
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
            where: { id: 'DIRECCION_DESARROLLO_VINCULACION_INSTITUCIONAL' },
            data: { servicesCount: servicios.length }
        });

        console.log('\n🎉 Dirección de Desarrollo y Vinculación Institucional configurada exitosamente!');
        console.log(`📊 Resumen:`);
        console.log(`   - Dirección: ${direction.name}`);
        console.log(`   - Total de servicios: ${servicios.length}`);
        console.log(`   - Tipos: 1 Unidad, 2 Divisiones, 6 Servicios`);

    } catch (error) {
        console.error('❌ Error durante la inserción:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la inserción
insertDirectionDesarrolloVinculacion();
