const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearAllServices() {
  try {
    console.log('🔄 Iniciando limpieza de todos los servicios...');
    
    // Primero, eliminar todas las notificaciones relacionadas con servicios
    console.log('🗑️ Eliminando notificaciones relacionadas con servicios...');
    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        serviceId: {
          not: null
        }
      }
    });
    console.log(`✅ ${deletedNotifications.count} notificaciones eliminadas`);
    
    // Luego, eliminar todos los servicios
    console.log('🗑️ Eliminando todos los servicios...');
    const deletedServices = await prisma.service.deleteMany({});
    console.log(`✅ ${deletedServices.count} servicios eliminados`);
    
    // Actualizar el contador de servicios en las direcciones
    console.log('🔄 Actualizando contadores de servicios en direcciones...');
    await prisma.direction.updateMany({
      data: {
        servicesCount: 0
      }
    });
    console.log('✅ Contadores de servicios actualizados');
    
    console.log('\n🎉 ¡Limpieza completada exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - Servicios eliminados: ${deletedServices.count}`);
    console.log(`   - Notificaciones eliminadas: ${deletedNotifications.count}`);
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la limpieza
clearAllServices();
