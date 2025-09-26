const { PrismaClient } = require("@prisma/client");

async function checkPrisma() {
  try {
    console.log("Checking Prisma connection...");
    const prisma = new PrismaClient();

    // Test connection
    await prisma.$connect();
    console.log("✅ Prisma connected successfully");

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Database accessible, found ${userCount} users`);

    await prisma.$disconnect();
    console.log("✅ Prisma disconnected successfully");
  } catch (error) {
    console.error("❌ Prisma connection failed:", error.message);
    process.exit(1);
  }
}

checkPrisma();
