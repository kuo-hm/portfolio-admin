# Portfolio Admin Backend

A RESTful API built with Express.js, TypeScript, and PostgreSQL for managing a portfolio website's content.

## Features

- 🔐 JWT Authentication
- 📝 Project Management
- 🛠️ Skill Management
- 📄 Resume Management
- 📚 API Documentation with Swagger
- 🐳 Docker Support
- 🗄️ PostgreSQL Database with Prisma ORM

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd portfolio-admin/backend
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio_admin"
JWT_SECRET="your-secret-key"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"  # Comma-separated list of allowed origins
```

4. Set up the database:

```bash
yarn prisma:generate
yarn prisma:migrate
```

## Development

Start the development server:

```bash
yarn dev
```

The server will start on port 3000 (or the port specified in your .env file).

## API Documentation

Access the Swagger documentation at `http://localhost:3000/docs`

### Authentication

All endpoints except authentication endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

#### Auth Endpoints

- `POST /api/auth/signup`

  - Register a new user
  - Body: `{ "email": string, "password": string, "name": string }`

- `POST /api/auth/login`

  - Login user
  - Body: `{ "email": string, "password": string }`

- `GET /api/auth/me`
  - Get current user information
  - Requires authentication
  - Response: `{ "id": string, "email": string, "name": string, "createdAt": string, "updatedAt": string }`

### Projects

- `GET /api/projects`

  - Get all projects
  - Query params: `page`, `limit`

- `GET /api/projects/:id`

  - Get project by ID

- `POST /api/projects`

  - Create new project
  - Body: `{ "name": string, "description": string, "websiteLink": string, "githubLink": string }`

- `PUT /api/projects/:id`

  - Update project
  - Body: `{ "name": string, "description": string, "websiteLink": string, "githubLink": string }`

- `DELETE /api/projects/:id`
  - Delete project

### Skills

- `GET /api/skills`

  - Get all skills
  - Query params: `page`, `limit`

- `GET /api/skills/:id`

  - Get skill by ID

- `POST /api/skills`

  - Create new skill
  - Body: `{ "name": string, "type": "backend" | "frontend" | "database" | "other", "imageUrl": string, "docsLink": string }`

- `PUT /api/skills/:id`

  - Update skill
  - Body: `{ "name": string, "type": string, "imageUrl": string, "docsLink": string }`

- `DELETE /api/skills/:id`
  - Delete skill

### Resumes

- `GET /api/resumes`

  - Get all resumes
  - Query params: `page`, `limit`

- `GET /api/resumes/:id`

  - Get resume by ID

- `POST /api/resumes`

  - Upload new resume
  - Form data: `resume` (PDF file)

- `DELETE /api/resumes/:id`
  - Delete resume

## Docker

Build and run with Docker Compose:

```bash
docker-compose up --build
```

Stop the application:

```bash
docker-compose down
```

## Database

The application uses PostgreSQL with Prisma ORM. The database schema includes:

- Users
- Projects
- Skills
- Resumes

To view and manage the database:

```bash
yarn prisma:studio
```

## Scripts

- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn start`: Start production server
- `yarn prisma:generate`: Generate Prisma client
- `yarn prisma:migrate`: Run database migrations
- `yarn prisma:studio`: Open Prisma Studio

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## File Upload

Resume files are stored in the `uploads` directory and served statically at `/uploads`.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
