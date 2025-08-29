const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertDirectionAdministracion() {
  try {
    console.log('🔄 Insertando Dirección de Administración...\n');
    
    // Crear la dirección
    const direction = await prisma.direction.upsert({
      where: { id: 'DIRECCION_ADMINISTRACION' },
      update: {},
      create: {
        id: 'DIRECCION_ADMINISTRACION',
        name: 'Dirección de Administración',
        description: 'Dirección de Administración del sistema',
        servicesCount: 0
      }
    });
    
    console.log('✅ Dirección de Administración creada/actualizada');
    
    // Lista de servicios de la Dirección de Administración
    const servicios = [
      // Servicios directos (3)
      {
        id: 'COORDINACION_ARCHIVOS_GESTION_DOCUMENTAL',
        name: 'Coordinación de Archivos y Gestión Documental',
        responsiblePerson: 'L.C. Cynthia Yanelly Arellano Barajas',
        location: 'Edificio B, Piso 1',
        serviceType: 'Departamento',
        description: 'Coordinación de archivos y gestión documental'
      },
      {
        id: 'CORRESPONDENCIA',
        name: 'Correspondencia',
        responsiblePerson: 'C. María del Pilar Hernández Mora (ENC)',
        location: 'Edificio A, Planta Baja',
        serviceType: 'Área de coordinación de archivos y gestión documental',
        description: 'Área de coordinación de archivos y gestión documental'
      },
      {
        id: 'CENTRO_INTEGRACION_INFORMATICA_MEDICA',
        name: 'Centro de Integración Informática Médica e Innovación Tecnológica',
        responsiblePerson: 'Ing. José Hector Paredes Martínez',
        location: 'Edificio A-1, Planta Baja',
        serviceType: 'Servicio',
        description: 'Centro de integración informática médica e innovación tecnológica'
      },
      
      // SUBDIRECCIÓN DE RECURSOS HUMANOS
      {
        id: 'SUBDIRECCION_RECURSOS_HUMANOS',
        name: 'Subdirección de Recursos Humanos',
        responsiblePerson: 'LIC. ARTURO BOLAÑOS FAVILA',
        location: 'Edificio B, Piso 1',
        serviceType: 'Subdirección',
        description: 'Subdirección de recursos humanos'
      },
      {
        id: 'OPERACION_CONTROL_SERVICIOS_PERSONALES',
        name: 'Operación y Control de Servicios Personales',
        responsiblePerson: 'Lic. Oscar Sánchez Ayala',
        location: 'Edificio B, Piso 1',
        serviceType: 'Departamento',
        description: 'Departamento de operación y control de servicios personales'
      },
      {
        id: 'RELACIONES_LABORALES',
        name: 'Relaciones Laborales',
        responsiblePerson: 'Lic. Elvia Fuentes Flores',
        location: 'Edificio B, Piso 1',
        serviceType: 'Departamento',
        description: 'Departamento de relaciones laborales'
      },
      {
        id: 'SISTEMAS_NOMINA',
        name: 'Sistemas de Nómina',
        responsiblePerson: 'Lic. Rafael Romero Denis',
        location: 'Edificio B, Piso 1',
        serviceType: 'Departamento',
        description: 'Departamento de sistemas de nómina'
      },
      
      // SUBDIRECCIÓN DE RECURSOS MATERIALES Y SERVICIOS
      {
        id: 'SUBDIRECCION_RECURSOS_MATERIALES_SERVICIOS',
        name: 'Subdirección de Recursos Materiales y Servicios',
        responsiblePerson: 'LIC. ANA LUISA OLIVERA GARCÍA',
        location: 'Edificio B, Piso 1',
        serviceType: 'Subdirección',
        description: 'Subdirección de recursos materiales y servicios'
      },
      {
        id: 'ABASTECIMIENTO',
        name: 'Abastecimiento',
        responsiblePerson: 'Lic. Emilio Morales Tirado',
        location: 'Edificio B, Piso 1',
        serviceType: 'Departamento',
        description: 'Departamento de abastecimiento'
      },
      {
        id: 'SERVICIOS_GENERALES',
        name: 'Servicios Generales',
        responsiblePerson: 'Lic. Jorge Oswaldo Martínez Rodríguez',
        location: 'Edificio D, Planta Baja',
        serviceType: 'Departamento',
        description: 'Departamento de servicios generales'
      },
      {
        id: 'ALMACENES_INVENTARIOS',
        name: 'Almacenes e Inventarios',
        responsiblePerson: 'Lic. Elia Reyes Sánchez',
        location: 'Edificio F, Planta Baja',
        serviceType: 'Departamento',
        description: 'Departamento de almacenes e inventarios'
      },
      
      // SUBDIRECCIÓN DE RECURSOS FINANCIEROS
      {
        id: 'SUBDIRECCION_RECURSOS_FINANCIEROS',
        name: 'Subdirección de Recursos Financieros',
        responsiblePerson: 'MTRA. SHEILA GUADALUPE LÓPEZ SORIANO',
        location: 'Edificio B, Piso 1',
        serviceType: 'Subdirección',
        description: 'Subdirección de recursos financieros'
      },
      {
        id: 'CONTABILIDAD',
        name: 'Contabilidad',
        responsiblePerson: 'Mtra. Liliana Terán Loyola',
        location: 'Edificio B, Piso 1',
        serviceType: 'Departamento',
        description: 'Departamento de contabilidad'
      },
      {
        id: 'INTEGRACION_PRESUPUESTAL',
        name: 'Integración Presupuestal',
        responsiblePerson: 'Lic. Leslye Labastida Castro',
        location: 'Edificio B, Piso 1',
        serviceType: 'Departamento',
        description: 'Departamento de integración presupuestal'
      },
      {
        id: 'TESORERIA',
        name: 'Tesorería',
        responsiblePerson: 'Lic. Gerardo Moreno Hernández',
        location: 'Edificio B, Piso 1',
        serviceType: 'Departamento',
        description: 'Departamento de tesorería'
      },
      {
        id: 'PROYECTOS_INVERSION_COSTOS',
        name: 'Proyectos de Inversión y Costos',
        responsiblePerson: 'Lic. Dayana Michelle Jiménez Osnaya',
        location: 'Edificio B, Piso 1',
        serviceType: 'Departamento',
        description: 'Departamento de proyectos de inversión y costos'
      },
      
      // SUBDIRECCIÓN DE CONSERVACIÓN Y MANTENIMIENTO
      {
        id: 'SUBDIRECCION_CONSERVACION_MANTENIMIENTO',
        name: 'Subdirección de Conservación y Mantenimiento',
        responsiblePerson: 'ING. LUIS OROZCO MARTÍNEZ',
        location: 'Edificio D, Piso 2',
        serviceType: 'Subdirección',
        description: 'Subdirección de conservación y mantenimiento'
      },
      {
        id: 'INGENIERIA_BIOMEDICA',
        name: 'Ingeniería Biomédica',
        responsiblePerson: 'Mtra. Miriam Lissette Godínez Torres',
        location: 'Edificio D, Piso 2',
        serviceType: 'Departamento',
        description: 'Departamento de ingeniería biomédica'
      },
      {
        id: 'MANTENIMIENTO',
        name: 'Mantenimiento',
        responsiblePerson: 'Mtro. Juan César Argumosa Zárate',
        location: 'Edificio F, Planta Baja',
        serviceType: 'Departamento',
        description: 'Departamento de mantenimiento'
      },
      {
        id: 'PROTECCION_CIVIL',
        name: 'Protección Civil',
        responsiblePerson: 'Lic. Jorge Armando Benítez Corona',
        location: 'Edificio D, Planta Baja',
        serviceType: 'Departamento',
        description: 'Departamento de protección civil'
      },
      {
        id: 'OBRAS',
        name: 'Obras',
        responsiblePerson: 'Arq. Jaime Rodríguez Martínez',
        location: 'Edificio B, Piso 1',
        serviceType: 'Departamento',
        description: 'Departamento de obras'
      }
    ];
    
    console.log(`🔄 Creando ${servicios.length} servicios...`);
    
    // Crear todos los servicios
    for (const servicio of servicios) {
      await prisma.service.create({
        data: {
          id: servicio.id,
          directionId: 'DIRECCION_ADMINISTRACION',
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
      where: { id: 'DIRECCION_ADMINISTRACION' },
      data: { servicesCount: servicios.length }
    });
    
    console.log('\n🎉 Dirección de Administración configurada exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - Dirección: ${direction.name}`);
    console.log(`   - Total de servicios: ${servicios.length}`);
    console.log(`   - Tipos: 3 Servicios directos, 4 Subdirecciones, 10 Departamentos`);
    
  } catch (error) {
    console.error('❌ Error durante la inserción:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la inserción
insertDirectionAdministracion();
