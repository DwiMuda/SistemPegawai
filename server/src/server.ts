import { PrismaClient } from '@prisma/client';
import app from './app';
import { config } from './config';

const prisma = new PrismaClient({
  log: config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Export prisma client for use across the application
export { prisma };

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(config.PORT, () => {
      console.log(`
╔══════════════════════════════════════════╗
║     ${config.APP_NAME}                   
║     Server running on port ${config.PORT}         
║     Environment: ${config.NODE_ENV}               
║     Health: http://localhost:${config.PORT}/api/v1/health
╚══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

main();
