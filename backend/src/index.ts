import 'reflect-metadata';
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import projectRoutes from './routes/projectRoutes';
import skillRoutes from './routes/skillRoutes';
import resumeRoutes from './routes/resumeRoutes';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import publicRoutes from './routes/publicRoutes';
import { requestLogger } from './middleware/requestLogger';
import logger from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio Admin API',
      version: '1.0.0',
      description: 'API documentation for Portfolio Admin backend',
    },
    servers: [
      {
        url: process.env.SWAGGER_URL || `http://localhost:${port}`,
        description: 'API Server'
      },
      {
        url: process.env.PRODUCTION_URL || `http://185.197.251.224:${port}`,
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.ts', './src/dto/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add request logger middleware
app.use(requestLogger);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error('Application error', { error: err.message, stack: err.stack });
  if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'Something went wrong!' });
};

app.use(errorHandler);

app.use('/api', routes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/public', publicRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.info(`Swagger docs available at http://localhost:${port}/docs`);
  logger.info('Allowed CORS origins:', { origins: allowedOrigins });
}); 
