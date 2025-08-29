const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkServices() {
  try {
    console.log('🔍 Verificando estado actual de la base de datos...\n');
    
    // Verificar direcciones
    const directions = await prisma.direction.findMany({
      include: {
        services: true
      }
    });
    
    console.log('📋 DIRECCIONES:');
    directions.forEach(direction => {
      console.log(`   - ${direction.name} (ID: ${direction.id})`);
      console.log(`     Servicios: ${direction.servicesCount}`);
      console.log(`     Servicios reales: ${direction.services.length}`);
      
      if (direction.services.length > 0) {
        console.log('     Lista de servicios:');
        direction.services.forEach(service => {
          console.log(`       • ${service.name} (${service.serviceType})`);
        });
      }
      console.log('');
    });
    
    // Verificar total de servicios
    const totalServices = await prisma.service.count();
    console.log(`📊 TOTAL DE SERVICIOS EN LA BASE DE DATOS: ${totalServices}`);
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la verificación
checkServices();
