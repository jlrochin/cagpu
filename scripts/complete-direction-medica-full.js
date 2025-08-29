const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function completeDirectionMedica() {
    try {
        console.log('🔄 Completando Dirección Médica con todos los servicios...\n');

        // Lista completa de los 62 servicios de la Dirección Médica
        const serviciosMedicos = [
            // DIVISIÓN DE MEDICINA
            { id: 'DIVISION_MEDICINA', name: 'División de Medicina', responsiblePerson: 'DR. JESÚS DEL CARMEN MADRIGAL ANAYA (ENC)', location: 'Edificio B, Piso 1', serviceType: 'División' },
            { id: 'ALERGIA_INMUNOLOGIA', name: 'Alergia e Inmunología', responsiblePerson: 'Dra. Carol Vivian Moncayo Coello (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'DERMATOLOGIA', name: 'Dermatología', responsiblePerson: 'Dra. Miriam Puebla Miranda (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'ENDOCRINOLOGIA_BARIATRIA', name: 'Endocrinología y Bariatria', responsiblePerson: 'Dra. María Guadalupe Guzmán Ortiz (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'HEMATOLOGIA', name: 'Hematología', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'MEDICINA_INTERNA', name: 'Medicina Interna', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'NEUMOLOGIA_INHALOTERAPIA', name: 'Neumología e Inhaloterapia', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'GERIATRIA', name: 'Geriatría', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'GASTROENTEROLOGIA', name: 'Gastroenterología', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'NEFROLOGIA', name: 'Nefrología', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'NEUROLOGIA', name: 'Neurología', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'PSIQUIATRIA_SALUD_MENTAL', name: 'Psiquiatría y Salud Mental', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'REUMATOLOGIA', name: 'Reumatología', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'NEUROFISIOLOGIA', name: 'Neurofisiología', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'CARDIOLOGIA', name: 'Cardiología', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'HEMODINAMIA', name: 'Hemodinamia', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'UNIDAD_CUIDADOS_CORONARIOS', name: 'Unidad de Cuidados Coronarios', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Unidad' },
            { id: 'TOXICOLOGIA_CLINICA', name: 'Toxicología Clínica', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'NUTRICION_HOSPITALARIA', name: 'Nutrición Hospitalaria', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'UNIDAD_INTELIGENCIA_EPIDEMIOLOGICA', name: 'Unidad de Inteligencia Epidemiológica y Sanitaria Hospitalaria', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Unidad' },
            { id: 'COORDINACION_SEGURIDAD_RADIOLOGICA', name: 'Coordinación de Seguridad Radiológica y Física Médica', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Coordinación' },

            // DIVISIÓN DE CIRUGÍA
            { id: 'DIVISION_CIRUGIA', name: 'División de Cirugía', responsiblePerson: 'DR. JOSÉ LUIS GARCÍA GARCÍA (ENC)', location: 'Edificio A, Piso 2', serviceType: 'División' },
            { id: 'CIRUGIA_GENERAL', name: 'Cirugía General', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'OFTALMOLOGIA', name: 'Oftalmología', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'ONCOLOGIA', name: 'Oncología', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'ORTOPEDIA_TRAUMATOLOGIA', name: 'Ortopedia y Traumatología', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'OTORRINOLARINGOLOGIA', name: 'Otorrinolaringología', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'CIRUGIA_PLASTICA_RECONSTRUCTIVA', name: 'Cirugía Plástica y Reconstructiva', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'UROLOGIA', name: 'Urología', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'CIRUGIA_MAXILOFACIAL', name: 'Cirugía Maxilofacial', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'NEUROCIRUGIA', name: 'Neurocirugía', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'TRASPLANTES', name: 'Trasplantes', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'CIRUGIA_CARDIOVASCULAR', name: 'Cirugía Cardiovascular', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'QUIROFANOS', name: 'Quirófanos', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'ENDOSCOPIA', name: 'Endoscopía', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'ANESTESIOLOGIA', name: 'Anestesiología', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'ANGIOLOGIA', name: 'Angiología', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },

            // DIVISIÓN DE GINECO - PEDIATRÍA
            { id: 'DIVISION_GINECO_PEDIATRIA', name: 'División de Gineco - Pediatría', responsiblePerson: 'DRA. MARÍA DEL CARMEN CHÁVEZ SÁNCHEZ (ENC)', location: 'Edificio A, Piso 2', serviceType: 'División' },
            { id: 'GINECOLOGIA_OBSTETRICIA', name: 'Ginecología y Obstetricia', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'NEONATOLOGIA', name: 'Neonatología', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'PEDIATRIA_MEDICA', name: 'Pediatría Médica', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'TERAPIA_INTENSIVA_PEDIATRICA', name: 'Terapia Intensiva Pediátrica', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'CIRUGIA_PEDIATRICA', name: 'Cirugía Pediátrica', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'URGENCIAS_PEDIATRICAS', name: 'Urgencias Pediátricas', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'GENETICA', name: 'Genética', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'LABORATORIO_GENETICA_DIAGNOSTICO_MOLECULAR', name: 'Laboratorio de Genética y Diagnóstico Molecular', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Área de Genética' },
            { id: 'ONCO_HEMATO_PEDIATRIA', name: 'Onco Hemato Pediatría', responsiblePerson: 'Dra. María del Carmen Chávez Sánchez (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },

            // DIVISIÓN DE APOYO A LA ATENCIÓN
            { id: 'DIVISION_APOYO_ATENCION', name: 'División de Apoyo a la Atención', responsiblePerson: 'DR. JOSÉ LUIS GARCÍA GARCÍA (ENC)', location: 'Edificio A, Piso 2', serviceType: 'División' },
            { id: 'LABORATORIO_CLINICO', name: 'Laboratorio Clínico', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Laboratorio' },
            { id: 'BANCO_SANGRE', name: 'Banco de Sangre', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'ANATOMIA_PATOLOGICA', name: 'Anatomía Patológica', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'RADIODIAGNOSTICO_IMAGEN', name: 'Radiodiagnóstico e Imagen', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'MEDICINA_NUCLEAR', name: 'Medicina Nuclear', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'URGENCIAS_ADULTOS', name: 'Urgencias Adultos', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'UNIDAD_CUIDADOS_INTENSIVOS_ADULTOS', name: 'Unidad de Cuidados Intensivos Adultos', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Unidad' },
            { id: 'APOYO_NUTRICIO_METABOLICO', name: 'Apoyo Nutricio y Metabólico', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Área de cuidados intensivos adultos' },
            { id: 'HOMEOPATIA', name: 'Homeopatía', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'MEDICINA_FISICA_REHABILITACION', name: 'Medicina Física y Rehabilitación', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'CONSULTA_EXTERNA', name: 'Consulta Externa', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'ADMISION_HOSPITALARIA', name: 'Admisión Hospitalaria', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'TRABAJO_SOCIAL', name: 'Trabajo Social', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' },
            { id: 'ARCHIVO_CLINICO', name: 'Archivo Clínico', responsiblePerson: 'Dr. José Luis García García (ENC)', location: 'Edificio A, Piso 2', serviceType: 'Servicio' }
        ];

        console.log(`🔄 Creando ${serviciosMedicos.length} servicios médicos...`);

        // Crear todos los servicios médicos
        for (const servicio of serviciosMedicos) {
            await prisma.service.upsert({
                where: { id: servicio.id },
                update: {
                    name: servicio.name,
                    responsiblePerson: servicio.responsiblePerson,
                    phoneExtension: null,
                    serviceType: servicio.serviceType,
                    location: servicio.location,
                    description: `Servicio de ${servicio.name.toLowerCase()}`,
                    directionId: 'DIRECCION_MEDICA',
                    isActive: true
                },
                create: {
                    id: servicio.id,
                    directionId: 'DIRECCION_MEDICA',
                    name: servicio.name,
                    responsiblePerson: servicio.responsiblePerson,
                    phoneExtension: null,
                    serviceType: servicio.serviceType,
                    location: servicio.location,
                    description: `Servicio de ${servicio.name.toLowerCase()}`,
                    isActive: true
                }
            });
            console.log(`✅ ${servicio.name} creado/actualizado`);
        }

        // Actualizar el contador de servicios
        await prisma.direction.update({
            where: { id: 'DIRECCION_MEDICA' },
            data: { servicesCount: serviciosMedicos.length }
        });

        console.log('\n🎉 Dirección Médica completada exitosamente!');
        console.log(`📊 Resumen:`);
        console.log(`   - Total de servicios: ${serviciosMedicos.length}`);
        console.log(`   - Divisiones: 4`);
        console.log(`   - Servicios: 58`);

    } catch (error) {
        console.error('❌ Error durante la creación de servicios médicos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la creación
completeDirectionMedica();
