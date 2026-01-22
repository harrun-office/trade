# Trade2Help Backend API

A Node.js/Express backend API for the Trade2Help platform built with TypeScript and Prisma.

## Features

- 🚀 Express.js server with TypeScript
- 🗄️ Prisma ORM with PostgreSQL
- 🔐 JWT authentication (planned)
- 📊 RESTful API endpoints
- 🛡️ CORS enabled
- 📝 Request logging
- 🧪 TypeScript compilation checks

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the local Prisma Postgres database:
```bash
npx prisma dev
```

3. Push the database schema:
```bash
npx prisma db push
```

4. Generate Prisma client:
```bash
npx prisma generate
```

## Development

### Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server (after build)
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Database Test
- `GET /api/test-db` - Test database connection

### Users (Placeholder)
- `GET /api/users` - Get all users (basic info)

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-database-connection-string"
PORT=3001
JWT_SECRET="your-jwt-secret"
```

## Database Schema

The application uses Prisma ORM with the following main models:

- **User** - Platform users
- **Product** - Items for sale
- **Order** - Purchase transactions
- **Category** - Product categories
- **Charity** - Supported charities
- **Review** - User reviews
- **Conversation** - User messaging

See `prisma/schema.prisma` for the complete schema definition.

## Project Structure

```
server/
├── src/
│   └── server.ts          # Main server file
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── config.ts          # Prisma configuration
├── generated/             # Generated Prisma client
├── dist/                  # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Update API documentation
4. Test database operations
5. Use meaningful commit messages

## License

ISC
