"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = void 0;
const express_1 = require("express");
const utils_1 = require("./utils");
const router = (0, express_1.Router)();
const createAuthRoutes = (prisma) => {
    // Register endpoint
    router.post('/register', async (req, res) => {
        try {
            const { email, username, password } = req.body;
            // Validation
            if (!email || !username || !password) {
                return res.status(400).json({ error: 'Email, username, and password are required' });
            }
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters long' });
            }
            // Check if user already exists
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: email.toLowerCase() },
                        { username }
                    ]
                }
            });
            if (existingUser) {
                return res.status(409).json({ error: 'User with this email or username already exists' });
            }
            // Hash password and create user
            const passwordHash = await utils_1.AuthUtils.hashPassword(password);
            const user = await prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    username,
                    password_hash: passwordHash
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    role: true,
                    is_verified: true,
                    created_at: true
                }
            });
            // Generate JWT token
            const token = utils_1.AuthUtils.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role
            });
            res.status(201).json({
                message: 'User registered successfully',
                user,
                token
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    // Login endpoint
    router.post('/login', async (req, res) => {
        try {
            const { emailOrUsername, password } = req.body;
            // Validation
            if (!emailOrUsername || !password) {
                return res.status(400).json({ error: 'Email/Username and password are required' });
            }
            // Find user by email or username
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: emailOrUsername.toLowerCase() },
                        { username: emailOrUsername }
                    ]
                }
            });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Verify password
            const isValidPassword = await utils_1.AuthUtils.verifyPassword(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Generate JWT token
            const token = utils_1.AuthUtils.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role
            });
            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    is_verified: user.is_verified
                },
                token
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    return router;
};
exports.createAuthRoutes = createAuthRoutes;
//# sourceMappingURL=routes.js.map