const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setDirectionOrder() {
  try {
    console.log('🔄 Estableciendo orden de las direcciones...\n');
    
    // Orden según la imagen (de arriba hacia abajo)
    const directionOrder = [
      {
        id: 'DIRECCION_GENERAL',
        name: 'Dirección General',
        order: 1
      },
      {
        id: 'DIRECCION_MEDICA',
        name: 'Dirección Médica',
        order: 2
      },
      {
        id: 'DIRECCION_INVESTIGACION_ENSENANZA',
        name: 'Dirección de Investigación y Enseñanza',
        order: 3
      },
      {
        id: 'DIRECCION_DESARROLLO_VINCULACION_INSTITUCIONAL',
        name: 'Dirección de Desarrollo y Vinculación Institucional',
        order: 4
      },
      {
        id: 'DIRECCION_ADMINISTRACION',
        name: 'Dirección de Administración',
        order: 5
      },
      {
        id: 'DIRECCION_ENFERMERIA',
        name: 'Dirección de Enfermería',
        order: 6
      }
    ];
    
    console.log('📋 Estableciendo orden de aparición:');
    
    // Actualizar el orden de cada dirección
    for (const direction of directionOrder) {
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
    
    console.log('\n📋 DIRECCIONES EN ORDEN:');
    orderedDirections.forEach(direction => {
      console.log(`   ${direction.displayOrder}. ${direction.name} (${direction.servicesCount} servicios)`);
    });
    
    console.log('\n🎉 ¡Orden de direcciones establecido correctamente!');
    
  } catch (error) {
    console.error('❌ Error durante la configuración del orden:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la configuración del orden
setDirectionOrder();
