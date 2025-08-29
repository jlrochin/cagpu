const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function completeDirectionMedica() {
  try {
    console.log('🔄 Completando Dirección Médica con todos los servicios...\n');
    
    // Servicios de nivel superior (no bajo división específica)
    const serviciosSuperiores = [
      {
        id: 'UNIDAD_INTELIGENCIA_EPIDEMIOLOGICA',
        name: 'Unidad de Inteligencia Epidemiológica y Sanitaria Hospitalaria',
        responsiblePerson: 'Dra. Beatriz Leal Escobar',
        location: 'Edificio D, Planta Baja',
        serviceType: 'Unidad',
        description: 'Unidad de inteligencia epidemiológica y sanitaria hospitalaria'
      },
      {
        id: 'COORDINACION_SEGURIDAD_RADIOLOGICA',
        name: 'Coordinación de Seguridad Radiológica y Física Médica',
        responsiblePerson: 'Fis. César Arturo Díaz Pérez (ENC)',
        location: 'Edificio F, Planta Baja',
        serviceType: 'Coordinación',
        description: 'Coordinación de seguridad radiológica y física médica'
      }
    ];
    
    // División de Cirugía
    const serviciosCirugia = [
      {
        id: 'DIVISION_CIRUGIA',
        name: 'División de Cirugía',
        responsiblePerson: 'DRA. INGRID PATRICIA URRUTIA BRETÓN (ENC)',
        location: 'Edificio B, Piso 1',
        serviceType: 'División',
        description: 'División de cirugía'
      },
      {
        id: 'CIRUGIA_GENERAL',
        name: 'Cirugía General',
        responsiblePerson: 'Dr. Victor Manuel Pinto Angulo (ENC)',
        location: 'Edificio D, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de cirugía general'
      },
      {
        id: 'OFTALMOLOGIA',
        name: 'Oftalmología',
        responsiblePerson: 'Dr. Urbano Manuel Sánchez Cornejo (ENC)',
        location: 'Edificio D, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de oftalmología'
      },
      {
        id: 'ONCOLOGIA',
        name: 'Oncología',
        responsiblePerson: 'Dr. Erik Efraín Sosa Durán (ENC)',
        location: 'Edificio C, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de oncología'
      },
      {
        id: 'ORTOPEDIA_TRAUMATOLOGIA',
        name: 'Ortopedia y Traumatología',
        responsiblePerson: 'Dr. Leobardo Guerrero Beltrán',
        location: 'Edificio D, Piso 2',
        serviceType: 'Servicio',
        description: 'Servicio de ortopedia y traumatología'
      },
      {
        id: 'OTORRINOLARINGOLOGIA',
        name: 'Otorrinolaringología',
        responsiblePerson: 'Dr. Leonardo Padilla Aguilar (ENC)',
        location: 'Edificio D, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de otorrinolaringología'
      },
      {
        id: 'CIRUGIA_PLASTICA_RECONSTRUCTIVA',
        name: 'Cirugía Plástica y Reconstructiva',
        responsiblePerson: 'Dr. Alfredo Lima Romero (ENC)',
        location: 'Edificio D, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de cirugía plástica y reconstructiva'
      },
      {
        id: 'UROLOGIA',
        name: 'Urología',
        responsiblePerson: 'Dr. Omar Hernández León (ENC)',
        location: 'Edificio D, Piso 2',
        serviceType: 'Servicio',
        description: 'Servicio de urología'
      },
      {
        id: 'CIRUGIA_MAXILOFACIAL',
        name: 'Cirugía Maxilofacial',
        responsiblePerson: 'Dr. Juan José Trujillo Fandiño (ENC)',
        location: 'Edificio A, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de cirugía maxilofacial'
      },
      {
        id: 'NEUROCIRUGIA',
        name: 'Neurocirugía',
        responsiblePerson: 'Dr. Gustavo Melo Guzmán (ENC)',
        location: 'Edificio D, Piso 2',
        serviceType: 'Servicio',
        description: 'Servicio de neurocirugía'
      },
      {
        id: 'TRASPLANTES',
        name: 'Trasplantes',
        responsiblePerson: 'Dra. Paulina Carpinteyro Espin',
        location: 'Edificio B, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de trasplantes'
      },
      {
        id: 'CIRUGIA_CARDIOVASCULAR',
        name: 'Cirugía Cardiovascular',
        responsiblePerson: 'Dr. Alejandro Jiménez Hernández (ENC)',
        location: 'Edificio C, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de cirugía cardiovascular'
      },
      {
        id: 'QUIROFANOS',
        name: 'Quirófanos',
        responsiblePerson: 'Dra. Sandra Olivares Cruz (ENC)',
        location: 'Edificio C, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de quirófanos'
      },
      {
        id: 'ENDOSCOPIA',
        name: 'Endoscopía',
        responsiblePerson: 'Dr. Alberto Bazán Soto',
        location: 'Edificio C, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de endoscopía'
      },
      {
        id: 'ANESTESIOLOGIA',
        name: 'Anestesiología',
        responsiblePerson: 'Dra. Xóchiti Popoca Mondragón (ENC)',
        location: 'Edificio C, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de anestesiología'
      },
      {
        id: 'ANGIOLOGIA',
        name: 'Angiología',
        responsiblePerson: 'Dr. Alejandro Piña Aviles (ENC)',
        location: 'Edificio A, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de angiología'
      }
    ];
    
    // División de Gineco-Pediatría
    const serviciosGinecoPediatria = [
      {
        id: 'DIVISION_GINECO_PEDIATRIA',
        name: 'División de Gineco - Pediatría',
        responsiblePerson: 'DRA. MARLEN ESMERALDA MUÑOZ VALENCIA',
        location: 'Edificio B, Piso 1',
        serviceType: 'División',
        description: 'División de gineco-pediatría'
      },
      {
        id: 'GINECOLOGIA_OBSTETRICIA',
        name: 'Ginecología y Obstetricia',
        responsiblePerson: 'Dra. Griselda Patricia Bejarano De La Cruz (ENC)',
        location: 'Edificio D, Piso 4',
        serviceType: 'Servicio',
        description: 'Servicio de ginecología y obstetricia'
      },
      {
        id: 'NEONATOLOGIA',
        name: 'Neonatología',
        responsiblePerson: 'Dra. Martha Gutiérrez de Gress (ENC)',
        location: 'Edificio D, Piso 4',
        serviceType: 'Servicio',
        description: 'Servicio de neonatología'
      },
      {
        id: 'PEDIATRIA_MEDICA',
        name: 'Pediatría Médica',
        responsiblePerson: 'Dr. Luis Eduardo López Arreola (ENC)',
        location: 'Edificio D, Piso 4',
        serviceType: 'Servicio',
        description: 'Servicio de pediatría médica'
      },
      {
        id: 'TERAPIA_INTENSIVA_PEDIATRICA',
        name: 'Terapia Intensiva Pediátrica',
        responsiblePerson: 'Dra. Astrid Cortes Vargas',
        location: 'Edificio D, Piso 4',
        serviceType: 'Servicio',
        description: 'Servicio de terapia intensiva pediátrica'
      },
      {
        id: 'CIRUGIA_PEDIATRICA',
        name: 'Cirugía Pediátrica',
        responsiblePerson: 'Dra. Alma Veronica Martínez Luis (ENC)',
        location: 'Edificio D, Piso 4',
        serviceType: 'Servicio',
        description: 'Servicio de cirugía pediátrica'
      },
      {
        id: 'URGENCIAS_PEDIATRICAS',
        name: 'Urgencias Pediátricas',
        responsiblePerson: 'Dra. Patricia Espinosa Rivas (ENC)',
        location: 'Edificio C, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de urgencias pediátricas'
      },
      {
        id: 'GENETICA',
        name: 'Genética',
        responsiblePerson: 'Dra. Sonia del Carmen Chávez Ocaña (ENC)',
        location: 'Edificio F, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de genética'
      },
      {
        id: 'LABORATORIO_GENETICA',
        name: 'Laboratorio de Genética y Diagnóstico Molecular',
        responsiblePerson: 'Mtro. Juan Carlos Bravata Alcántara (ENC)',
        location: 'Edificio C, Planta Baja',
        serviceType: 'Área de Genética',
        description: 'Laboratorio de genética y diagnóstico molecular'
      },
      {
        id: 'ONCO_HEMATO_PEDIATRIA',
        name: 'Onco Hemato Pediatría',
        responsiblePerson: 'Dr. José Gabriel Peñaloza González (ENC)',
        location: 'Edificio A, Piso 1',
        serviceType: 'Servicio',
        description: 'Servicio de onco hemato pediatría'
      }
    ];
    
    // División de Apoyo a la Atención
    const serviciosApoyoAtencion = [
      {
        id: 'DIVISION_APOYO_ATENCION',
        name: 'División de Apoyo a la Atención',
        responsiblePerson: 'DR. FRANCISCO GABRIEL REYES RODRÍGUEZ',
        location: 'Edificio B, Piso 1',
        serviceType: 'División',
        description: 'División de apoyo a la atención'
      },
      {
        id: 'LABORATORIO_CLINICO',
        name: 'Laboratorio Clínico',
        responsiblePerson: 'Mtra. Briceida López Martínez',
        location: 'Edificio D, Planta Baja',
        serviceType: 'Laboratorio',
        description: 'Laboratorio clínico'
      },
      {
        id: 'BANCO_SANGRE',
        name: 'Banco de Sangre',
        responsiblePerson: 'Dr. Francisco Álvarez Mora',
        location: 'Edificio C, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de banco de sangre'
      },
      {
        id: 'ANATOMIA_PATOLOGICA',
        name: 'Anatomía Patológica',
        responsiblePerson: 'Dra. Eva Guadalupe López Pérez (ENC)',
        location: 'Edificio C, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de anatomía patológica'
      },
      {
        id: 'RADIODIAGNOSTICO_IMAGEN',
        name: 'Radiodiagnóstico e Imagen',
        responsiblePerson: 'Dr. Agustín Isidoro Rodríguez Blas (ENC)',
        location: 'Edificio B, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de radiodiagnóstico e imagen'
      },
      {
        id: 'MEDICINA_NUCLEAR',
        name: 'Medicina Nuclear',
        responsiblePerson: 'Dr. Pablo Moreno Hernández',
        location: 'Edificio C, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de medicina nuclear'
      },
      {
        id: 'URGENCIAS_ADULTOS',
        name: 'Urgencias Adultos',
        responsiblePerson: 'Dr. Victor Manuel Guzmán Espinosa',
        location: 'Edificio C, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de urgencias adultos'
      },
      {
        id: 'UNIDAD_CUIDADOS_INTENSIVOS_ADULTOS',
        name: 'Unidad de Cuidados Intensivos Adultos',
        responsiblePerson: 'Dr. José Carlos Gasca Aldama (ENC)',
        location: 'Edificio C, Piso 1',
        serviceType: 'Servicio',
        description: 'Unidad de cuidados intensivos adultos'
      },
      {
        id: 'APOYO_NUTRICIO_METABOLICO',
        name: 'Apoyo Nutricio y Metabólico',
        responsiblePerson: 'Dra. Elizabeth Pérez Cruz (ENC)',
        location: 'Edificio D, Piso 4',
        serviceType: 'Área de cuidados intensivos adultos',
        description: 'Área de apoyo nutricio y metabólico'
      },
      {
        id: 'HOMEOPATIA',
        name: 'Homeopatía',
        responsiblePerson: 'Dra. Emma del Carmen Macías Cortés (ENC)',
        location: 'Edificio A, Piso 2',
        serviceType: 'Servicio',
        description: 'Servicio de homeopatía'
      },
      {
        id: 'MEDICINA_FISICA_REHABILITACION',
        name: 'Medicina Física y Rehabilitación',
        responsiblePerson: 'Dra. Perla Zuriel Santiago Galindo (ENC)',
        location: 'Edificio C, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de medicina física y rehabilitación'
      },
      {
        id: 'CONSULTA_EXTERNA',
        name: 'Consulta Externa',
        responsiblePerson: 'Dra. Angela Karina Arce Peralta (ENC)',
        location: 'Edificio A, Piso 2',
        serviceType: 'Servicio',
        description: 'Servicio de consulta externa'
      },
      {
        id: 'ADMISION_HOSPITALARIA',
        name: 'Admisión Hospitalaria',
        responsiblePerson: 'Lic. Alma Griselda Angeles Gómez',
        location: 'Edificio D, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de admisión hospitalaria'
      },
      {
        id: 'TRABAJO_SOCIAL',
        name: 'Trabajo Social',
        responsiblePerson: 'Mtra. Viridiana Judith González Zavala (ENC)',
        location: 'Edificio D, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de trabajo social'
      },
      {
        id: 'ARCHIVO_CLINICO',
        name: 'Archivo Clínico',
        responsiblePerson: 'Lic. Marin Roberto Guerrero Quiroz',
        location: 'Edificio A, Planta Baja',
        serviceType: 'Servicio',
        description: 'Servicio de archivo clínico'
      }
    ];
    
    // Combinar todos los servicios
    const todosLosServicios = [
      ...serviciosSuperiores,
      ...serviciosCirugia,
      ...serviciosGinecoPediatria,
      ...serviciosApoyoAtencion
    ];
    
    console.log(`🔄 Agregando ${todosLosServicios.length} servicios adicionales...`);
    
    // Crear todos los servicios adicionales
    for (const servicio of todosLosServicios) {
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
    
    // Actualizar el contador de servicios (19 existentes + nuevos)
    const totalServicios = 19 + todosLosServicios.length;
    await prisma.direction.update({
      where: { id: 'DIRECCION_MEDICA' },
      data: { servicesCount: totalServicios }
    });
    
    console.log('\n🎉 Dirección Médica completada exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - Servicios existentes: 19`);
    console.log(`   - Servicios agregados: ${todosLosServicios.length}`);
    console.log(`   - Total final: ${totalServicios} servicios`);
    
  } catch (error) {
    console.error('❌ Error durante la inserción:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la inserción
completeDirectionMedica();
