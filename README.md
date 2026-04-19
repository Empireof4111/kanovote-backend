# Kano State Political Registration Dashboard - Backend

A comprehensive NestJS backend API for managing political supporter registrations, field agent activities, and campaign data for Kano State.

## Features

✅ **Authentication & Authorization**
- JWT-based authentication
- Session-based authentication support
- Role-Based Access Control (RBAC) for 3 agent roles: Admin, Coordinator, Supervisor, Field Agent

✅ **Core Modules**
- **Authentication**: User registration, login, password reset
- **User Management**: Profile management, role assignment
- **Agent Management**: Agent registration, performance tracking, status management
- **Supporter Management**: Supporter registration, verification workflow
- **Registration Tracking**: Multi-step registration workflow management
- **File Uploads**: Document upload with validation
- **Activity Logging**: Comprehensive audit trails
- **Data Export**: CSV export for supporters, agents, registrations
- **Admin Panel**: User management, system statistics

## Tech Stack

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL 12+
- **ORM**: TypeORM
- **Authentication**: JWT + Passport.js + Express Sessions
- **Validation**: Class-validator + Class-transformer
- **File Upload**: Multer
- **CSV Export**: json2csv
- **Environment**: dotenv

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- PostgreSQL 12+

### Setup

1. **Install dependencies:**
```bash
cd backend
npm install --legacy-peer-deps --no-audit --no-fund
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Configure environment variables:**
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=kano_registration_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=3600

# Session
SESSION_SECRET=your-super-secret-session-key

# Server
PORT=3000
NODE_ENV=development

# File Upload
FILE_UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

4. **Create PostgreSQL database:**
```bash
createdb kano_registration_db
```

5. **Run migrations (auto-sync in development):**
```bash
npm run migration:run
```

## Running the Application

### Development
```bash
npm run start:dev
```
Server will run on `http://localhost:3000`

### Production
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email and password
- `POST /auth/logout` - Logout user
- `GET /auth/profile` - Get current user profile
- `POST /auth/request-password-reset` - Request password reset
- `POST /auth/set-new-password` - Set new password

### Supporters
- `POST /supporters` - Create new supporter
- `GET /supporters` - List supporters (with filters)
- `GET /supporters/:id` - Get supporter details
- `PUT /supporters/:id` - Update supporter
- `PUT /supporters/:id/verify` - Verify/approve/reject supporter
- `GET /supporters/statistics` - Get overall statistics
- `GET /supporters/statistics/:state` - Get location-specific statistics

### Agents
- `POST /agents` - Create new agent
- `GET /agents` - List agents
- `GET /agents/:id` - Get agent details
- `GET /agents/:id/performance` - Get performance report
- `PUT /agents/:id` - Update agent
- `PUT /agents/:id/activate` - Activate agent
- `PUT /agents/:id/deactivate` - Deactivate agent
- `PUT /agents/:id/suspend` - Suspend agent (admin only)

### Registrations
- `POST /registrations` - Create registration
- `GET /registrations/:id` - Get registration details
- `GET /registrations/agent/:agentId` - List registrations by agent
- `GET /registrations/supporter/:supporterId` - List registrations by supporter
- `PUT /registrations/:id/status` - Update registration status
- `GET /registrations/statistics` - Get registration statistics

### File Uploads
- `POST /file-uploads/:supporterId` - Upload document
- `GET /file-uploads/:id` - Get file details
- `GET /file-uploads/supporter/:supporterId` - List files for supporter
- `GET /file-uploads/:id/download` - Download file
- `DELETE /file-uploads/:id` - Delete file

### Activity Logging
- `GET /activity/recent` - Get recent activities
- `GET /activity/audit-log` - Get audit log (admin only)
- `GET /activity/user/:userId` - Get user activities
- `GET /activity/entity/:entityType/:entityId` - Get activities for a specific entity

### Data Export
- `GET /export/supporters-csv` - Export supporters as CSV
- `GET /export/agents-csv` - Export agents as CSV
- `GET /export/registrations-csv` - Export registrations as CSV

### Admin
- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/users` - List all users
- `GET /admin/users/stats` - User statistics
- `GET /admin/agents/stats` - Agent statistics
- `PUT /admin/users/:id/role` - Update user role
- `PUT /admin/users/:id/block` - Block user
- `PUT /admin/users/:id/unblock` - Unblock user

## Role-Based Access Control

### Admin
- Full system access
- User management
- System configuration
- View all reports

### Coordinator
- Create and manage agents
- Create supporters
- Verify supporter status
- View reports and analytics
- Data export

### Supervisor
- Monitor agent performance
- Create supporters
- Verify supporter status
- View assigned agents' data

### Field Agent
- Register supporters
- Update own registration data
- View own performance

## Database Schema

### Users
- id (UUID)
- firstName, lastName
- email, username (unique)
- password (hashed)
- role (ENUM: admin, coordinator, supervisor, field_agent)
- phone, profileImage
- isActive, isEmailVerified
- createdAt, updatedAt

### Agents
- id (UUID)
- userId (FK to Users)
- role, state, lga, ward
- registrationStats (total, verified, pending, rejected)
- status (active, inactive, suspended)
- joinedAt, lastActivityAt

### Supporters
- id (UUID)
- firstName, lastName, email, phone
- dateOfBirth, gender, occupation
- state, lga, ward, pollingUnit, address
- voterCardNumber (unique)
- documentUrl, documentUploaded
- status (pending, verified, rejected)
- registeredByUserId, verifiedByUserId
- registeredAt, verifiedAt

### Registrations
- id (UUID)
- agentId, supporterId (FK)
- status (initiated, in_progress, completed, verified, rejected)
- completionPercentage
- createdAt, completedAt, verifiedAt

### ActivityLog
- id (UUID)
- userId (FK)
- action (ENUM: login, logout, create_supporter, verify_supporter, etc.)
- entityType, entityId
- details, ipAddress, userAgent
- createdAt

### FileUpload
- id (UUID)
- supporterId (FK)
- uploadedByUserId (FK)
- fileType (voter_card, identity_card, passport, etc.)
- fileName, filePath, mimeType, fileSize
- url, isActive
- createdAt

## Error Handling

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "BadRequest"
}
```

## Security Considerations

1. **Password Hashing**: Passwords are hashed using bcryptjs with salt rounds of 10
2. **JWT Expiration**: Tokens expire after 1 hour (configurable)
3. **Session Security**: HTTPS cookies in production, httpOnly flag enabled
4. **CORS**: Configured to allow frontend origin only
5. **Validation**: All inputs validated using class-validator
6. **File Upload**: File type and size validation
7. **RBAC**: Route-level role protection with @Roles decorator

## Development

### Generate Migration
```bash
npm run migration:generate -- src/migrations/InitialMigration
```

### Run Tests
```bash
npm run test
npm run test:watch
npm run test:e2e
```

### Code Linting
```bash
npm run lint
npm run format
```

## Deployment

### Using Environment Variables
Set environment variables before starting:
```bash
export DATABASE_HOST=your-db-host
export DATABASE_USER=your-db-user
npm run start:prod
```

### Docker (Optional)
Create a Dockerfile for containerization and deploy to your cloud platform (AWS, GCP, Azure, etc.)

## Support

For issues and questions, please refer to the NestJS documentation:
- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)

## License

MIT
