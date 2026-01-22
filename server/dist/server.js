"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("../generated/prisma");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const routes_1 = require("./auth/routes");
// Load environment variables
dotenv_1.default.config();
console.log('🚀 Starting Trade2Help API server...');
console.log('📝 Database URL:', process.env.DATABASE_URL?.replace(/:([^:@]{4})[^:@]*@/, ':****@'));
const app = (0, express_1.default)();
// Create a PostgreSQL connection pool (EXACTLY like test-db.ts)
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
// Create the Prisma Client with the adapter (EXACTLY like test-db.ts)
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new prisma_1.PrismaClient({ adapter });
console.log('✅ Prisma client created successfully with adapter');
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Trade2Help API is running' });
});
// Auth routes
app.use('/api/auth', (0, routes_1.createAuthRoutes)(prisma));
// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        console.log('Testing database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL);
        console.log('Prisma client type:', typeof prisma);
        console.log('Prisma client has adapter:', !!prisma._engine?.adapter);
        // Test connection
        await prisma.$connect();
        console.log('✅ Prisma connect successful');
        // Test with a simple query
        const result = await prisma.user.count();
        console.log('✅ Query successful, user count:', result);
        res.json({
            status: 'OK',
            message: 'Database connection successful',
            userCount: result,
            databaseUrl: process.env.DATABASE_URL?.replace(/:([^:@]{4})[^:@]*@/, ':****@'), // Hide password
            hasAdapter: !!prisma._engine?.adapter
        });
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
    }
});
// Basic user routes (placeholder)
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                is_verified: true,
                created_at: true
            }
        });
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Trade2Help API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database test: http://localhost:${PORT}/api/test-db`);
    console.log(`📝 Database URL: ${process.env.DATABASE_URL}`);
});
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down server...');
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('🛑 Shutting down server...');
    await prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=server.js.map