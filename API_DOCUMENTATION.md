# Kano State Political Registration Dashboard - Backend API Documentation

## Overview

This document describes the backend API endpoints that match the frontend implementation. The backend is built with NestJS and communicates with the frontend through RESTful APIs.

## Base URL
```
http://localhost:3000/api
```

---

## Authentication Endpoints

### Register New Agent (with User and Password Creation)
- **Method**: POST
- **Endpoint**: `/agents/register`
- **Authentication**: None (public endpoint)
- **Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+2348012345678",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "role": "field_agent",
  "state": "Kano",
  "lga": "Kano Municipal",
  "ward": "Sharada"
}
```
- **Response**:
```json
{
  "agent": {
    "id": "uuid",
    "userId": "uuid",
    "role": "field_agent",
    "state": "Kano",
    "lga": "Kano Municipal",
    "ward": "Sharada",
    "status": "active",
    "joinedAt": "2024-01-01T00:00:00Z"
  },
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+2348012345678",
    "role": "field_agent",
    "isActive": true
  }
}
```
- **Status**: 201 Created
- **Validation**:
  - Password must be at least 8 characters
  - Password and confirmPassword must match
  - Email must be unique
  - Email format must be valid
  - Phone format must be valid

---

## Agent Management Endpoints

### Get All Agents
- **Method**: GET
- **Endpoint**: `/agents`
- **Authentication**: Required (Super Admin, Supervisor)
- **Query Parameters**:
  - `skip`: number (default: 0)
  - `take`: number (default: 10)
  - `state`: string (optional)
  - `lga`: string (optional)
  - `role`: string (optional)
  - `status`: string (optional)
- **Response**:
```json
{
  "agents": [
    {
      "id": "uuid",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+2348012345678"
      },
      "role": "field_agent",
      "state": "Kano",
      "lga": "Kano Municipal",
      "ward": "Sharada",
      "status": "active",
      "totalRegistrations": 45,
      "verifiedRegistrations": 40,
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100
}
```

### Get Specific Agent by ID
- **Method**: GET
- **Endpoint**: `/agents/:id`
- **Authentication**: Required (Super Admin, Supervisor)
- **Response**: Single agent object with user details and registrations

### Get Agent Performance Report
- **Method**: GET
- **Endpoint**: `/agents/:id/performance`
- **Authentication**: Required (Super Admin, Supervisor)
- **Response**:
```json
{
  "agentId": "uuid",
  "agentName": "John Doe",
  "role": "field_agent",
  "state": "Kano",
  "lga": "Kano Municipal",
  "ward": "Sharada",
  "totalRegistrations": 45,
  "verifiedRegistrations": 40,
  "pendingRegistrations": 3,
  "rejectedRegistrations": 2,
  "verificationRate": "88.89",
  "joinedAt": "2024-01-01T00:00:00Z",
  "lastActivityAt": "2024-01-10T10:30:00Z",
  "status": "active"
}
```

### Update Agent Details
- **Method**: PUT
- **Endpoint**: `/agents/:id`
- **Authentication**: Required (Super Admin)
- **Request Body**:
```json
{
  "state": "Kano",
  "lga": "Kano Municipal",
  "ward": "Sharada",
  "status": "active",
  "notes": "Additional notes"
}
```

### Reset Agent Password
- **Method**: PUT
- **Endpoint**: `/agents/:id/reset-password`
- **Authentication**: Required (Super Admin)
- **Request Body**:
```json
{
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```
- **Response**: `{ "message": "Password reset successfully" }`
- **Status**: 200 OK

### Activate Agent
- **Method**: PUT
- **Endpoint**: `/agents/:id/activate`
- **Authentication**: Required (Super Admin)

### Deactivate Agent
- **Method**: PUT
- **Endpoint**: `/agents/:id/deactivate`
- **Authentication**: Required (Super Admin)

### Delete Agent
- **Method**: DELETE
- **Endpoint**: `/agents/:id`
- **Authentication**: Required (Super Admin)
- **Status**: 204 No Content

---

## Geographic Data Management Endpoints

### Local Government Areas (LGAs)

#### Create LGA
- **Method**: POST
- **Endpoint**: `/admin/locations/lga`
- **Authentication**: Required (Super Admin)
- **Request Body**:
```json
{
  "name": "Kano Municipal",
  "code": "KN/KNM",
  "description": "Kano Municipal Local Government Area"
}
```
- **Status**: 201 Created

#### Get All LGAs
- **Method**: GET
- **Endpoint**: `/admin/locations/lga`
- **Authentication**: Required (Super Admin)
- **Query Parameters**: `skip`, `take`

#### Get LGA by ID
- **Method**: GET
- **Endpoint**: `/admin/locations/lga/:id`
- **Authentication**: Required (Super Admin)

#### Update LGA
- **Method**: PUT
- **Endpoint**: `/admin/locations/lga/:id`
- **Authentication**: Required (Super Admin)
- **Request Body**: Same as Create

#### Delete LGA
- **Method**: DELETE
- **Endpoint**: `/admin/locations/lga/:id`
- **Authentication**: Required (Super Admin)
- **Status**: 204 No Content

### Wards

#### Create Ward
- **Method**: POST
- **Endpoint**: `/admin/locations/ward`
- **Authentication**: Required (Super Admin)
- **Request Body**:
```json
{
  "lgaId": "lga-uuid",
  "name": "Sharada",
  "code": "SHR",
  "description": "Sharada Ward"
}
```
- **Status**: 201 Created

#### Get All Wards
- **Method**: GET
- **Endpoint**: `/admin/locations/ward`
- **Authentication**: Required (Super Admin)
- **Query Parameters**: `lgaId`, `skip`, `take`

#### Get Ward by ID
- **Method**: GET
- **Endpoint**: `/admin/locations/ward/:id`
- **Authentication**: Required (Super Admin)

#### Update Ward
- **Method**: PUT
- **Endpoint**: `/admin/locations/ward/:id`
- **Authentication**: Required (Super Admin)

#### Delete Ward
- **Method**: DELETE
- **Endpoint**: `/admin/locations/ward/:id`
- **Authentication**: Required (Super Admin)
- **Status**: 204 No Content

### Polling Units

#### Create Polling Unit
- **Method**: POST
- **Endpoint**: `/admin/locations/polling-unit`
- **Authentication**: Required (Super Admin)
- **Request Body**:
```json
{
  "wardId": "ward-uuid",
  "lgaId": "lga-uuid",
  "name": "Sharada Industrial Area PU 001",
  "code": "KN/KNM/SHR/001",
  "address": "Sharada Industrial Area, Kano",
  "registeredVoters": 2450
}
```
- **Status**: 201 Created

#### Get All Polling Units
- **Method**: GET
- **Endpoint**: `/admin/locations/polling-unit`
- **Authentication**: Required (Super Admin)
- **Query Parameters**: `wardId`, `lgaId`, `skip`, `take`

#### Get Polling Unit by ID
- **Method**: GET
- **Endpoint**: `/admin/locations/polling-unit/:id`
- **Authentication**: Required (Super Admin)

#### Update Polling Unit
- **Method**: PUT
- **Endpoint**: `/admin/locations/polling-unit/:id`
- **Authentication**: Required (Super Admin)

#### Delete Polling Unit
- **Method**: DELETE
- **Endpoint**: `/admin/locations/polling-unit/:id`
- **Authentication**: Required (Super Admin)
- **Status**: 204 No Content

#### Get Location Hierarchy
- **Method**: GET
- **Endpoint**: `/admin/locations/hierarchy`
- **Authentication**: Required (Super Admin)
- **Response**: Complete hierarchical structure of all LGAs, Wards, and Polling Units

---

## Admin Dashboard Endpoints

### Get Dashboard Statistics
- **Method**: GET
- **Endpoint**: `/admin/dashboard`
- **Authentication**: Required (Super Admin)
- **Response**:
```json
{
  "users": {
    "total": 150,
    "superAdmins": 3,
    "supervisors": 15,
    "fieldAgents": 132
  },
  "agents": {
    "total": 100,
    "active": 90,
    "inactive": 8,
    "suspended": 2
  },
  "supporters": {
    "total": 5000,
    "verified": 4500,
    "pending": 400,
    "rejected": 100
  },
  "geography": {
    "lgas": 44,
    "wards": 429,
    "pollingUnits": 1200
  }
}
```

### Get User Statistics
- **Method**: GET
- **Endpoint**: `/admin/users/stats`
- **Authentication**: Required (Super Admin)

### Get Agent Statistics
- **Method**: GET
- **Endpoint**: `/admin/agents/stats`
- **Authentication**: Required (Super Admin)

---

## User Management Endpoints

### Get All Users
- **Method**: GET
- **Endpoint**: `/admin/users`
- **Authentication**: Required (Super Admin)
- **Query Parameters**: `skip`, `take`, `role`

### Update User Role
- **Method**: PUT
- **Endpoint**: `/admin/users/:id/role`
- **Authentication**: Required (Super Admin)
- **Request Body**:
```json
{
  "role": "supervisor"
}
```

### Block User
- **Method**: PUT
- **Endpoint**: `/admin/users/:id/block`
- **Authentication**: Required (Super Admin)

### Unblock User
- **Method**: PUT
- **Endpoint**: `/admin/users/:id/unblock`
- **Authentication**: Required (Super Admin)

---

## Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "BadRequest"
}
```

### Common Status Codes

- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **204**: No Content - Resource deleted successfully
- **400**: Bad Request - Invalid request data
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Not authorized to perform this action
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource already exists (e.g., duplicate email)
- **500**: Internal Server Error - Server error

---

## Frontend Integration Examples

### Register New Agent
```typescript
async function registerAgent(agentData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "field_agent" | "supervisor" | "super_admin";
  state: string;
  lga: string;
  ward: string;
}) {
  const response = await fetch('http://localhost:3000/api/agents/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentData),
  });
  
  if (!response.ok) {
    throw new Error(await response.text());
  }
  
  return response.json();
}
```

### Get All Agents (with filters)
```typescript
async function getAgents(filters?: {
  skip?: number;
  take?: number;
  lga?: string;
  role?: string;
  status?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.skip) params.append('skip', filters.skip.toString());
  if (filters?.take) params.append('take', filters.take.toString());
  if (filters?.lga) params.append('lga', filters.lga);
  if (filters?.role) params.append('role', filters.role);
  if (filters?.status) params.append('status', filters.status);
  
  const response = await fetch(
    `http://localhost:3000/api/agents?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  return response.json();
}
```

### Create LGA
```typescript
async function createLga(lgaData: {
  name: string;
  code: string;
  description?: string;
}) {
  const response = await fetch('http://localhost:3000/api/admin/locations/lga', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(lgaData),
  });
  
  return response.json();
}
```

### Reset Agent Password
```typescript
async function resetAgentPassword(agentId: string, newPassword: string) {
  const response = await fetch(
    `http://localhost:3000/api/agents/${agentId}/reset-password`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        newPassword,
        confirmPassword: newPassword,
      }),
    }
  );
  
  return response.json();
}
```

---

## Database Schema Updates

The following tables are created/updated based on the entities:

- `users`: User accounts with roles and authentication
- `agents`: Agent profiles linked to users
- `supporters`: Political supporter registrations
- `registrations`: Registration tracking and status
- `activity_logs`: Audit trail of system activities
- `file_uploads`: Document storage metadata
- `local_government_areas`: LGA data
- `wards`: Ward data linked to LGAs
- `polling_units`: Polling unit data linked to wards and LGAs

---

## Environment Variables Required

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=kano_registration_db
JWT_SECRET=your-secret-key
JWT_EXPIRY=3600
NODE_ENV=development
```

---

## Notes

1. All timestamps are in ISO 8601 format
2. UUIDs are used for all primary keys
3. Password hashing uses bcryptjs (10 salt rounds)
4. Roles are case-sensitive: `super_admin`, `supervisor`, `field_agent`
5. Agent status values: `active`, `inactive`, `suspended`
6. All password fields must be minimum 8 characters
7. Email addresses must be unique across the system
