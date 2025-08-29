const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkOrderExplicitly() {
  try {
    console.log('🔍 VERIFICANDO EXPLÍCITAMENTE EL ORDEN DE LAS DIRECCIONES\n');
    
    // Obtener todas las direcciones ordenadas por displayOrder
    const orderedDirections = await prisma.direction.findMany({
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        displayOrder: true,
        servicesCount: true
      }
    });
    
    console.log('📋 DIRECCIONES ORDENADAS POR displayOrder:');
    console.log('=' .repeat(80));
    
    orderedDirections.forEach((direction, index) => {
      console.log(`${index + 1}. [Orden ${direction.displayOrder}] ${direction.name} (${direction.servicesCount} servicios)`);
    });
    
    // Verificar que el orden es secuencial
    const orders = orderedDirections.map(d => d.displayOrder);
    const isSequential = orders.every((order, index) => order === index + 1);
    
    console.log('\n🔍 VERIFICACIÓN DEL ORDEN:');
    console.log('=' .repeat(80));
    console.log(`   Valores de displayOrder: [${orders.join(', ')}]`);
    console.log(`   ¿Es secuencial? ${isSequential ? '✅ SÍ' : '❌ NO'}`);
    
    if (!isSequential) {
      console.log('\n⚠️ PROBLEMA DETECTADO:');
      console.log('   Los valores de displayOrder no son secuenciales.');
      console.log('   Esto puede causar que el frontend no muestre el orden correcto.');
    }
    
    // Verificar también sin ordenar
    const unorderedDirections = await prisma.direction.findMany({
      select: {
        id: true,
        name: true,
        displayOrder: true,
        servicesCount: true
      }
    });
    
    console.log('\n📋 DIRECCIONES SIN ORDENAR (orden natural de la base de datos):');
    console.log('=' .repeat(80));
    
    unorderedDirections.forEach((direction, index) => {
      console.log(`${index + 1}. [Orden ${direction.displayOrder}] ${direction.name} (${direction.servicesCount} servicios)`);
    });
    
    console.log('\n💡 INFORMACIÓN IMPORTANTE:');
    console.log('   - Si el frontend no está usando displayOrder, verás el orden natural de la base de datos');
    console.log('   - Si el frontend SÍ está usando displayOrder, verás el orden que configuramos');
    console.log('   - El problema puede estar en el código del frontend que no consulta displayOrder');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la verificación
checkOrderExplicitly();
