# Issue Tracker

![Java](https://img.shields.io/badge/Java-17-e87f28?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-4caf50?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Relational%20DB-0277bd?style=flat-square)
![Redis](https://img.shields.io/badge/Redis-Caching-d32f2f?style=flat-square)
![React](https://img.shields.io/badge/React-18-00acc1?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-1976d2?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Containers-0277bd?style=flat-square)
![OAuth2](https://img.shields.io/badge/OAuth2-Google-4285f4?style=flat-square)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-424242?style=flat-square)

A full-stack, enterprise-grade issue tracking and project management platform. Built to demonstrate scalable architecture, strict type safety, and modern performance patterns.

## Tech Stack

### Infrastructure

- **PostgreSQL**: Relational data and transactional integrity.
- **Redis**: High-speed caching for read-heavy operations.
- **Docker Compose**: Container orchestration.
- **GitHub Actions**: Automated CI/CD pipelines for testing and building.

### Backend (Java 21)

- **Spring Boot 3**: Core framework.
- **Spring Security & JWT/OAuth2**: Stateless authentication, Google Sign-In, and Role-Based Access Control (RBAC).
- **Spring Data JPA**: Data access, including complex aggregations, filtering, and Pageable chunks.
- **Global Exception Handling**: Predictable, clean JSON error responses using `@RestControllerAdvice`.
- **Optimistic Locking**: Prevents concurrent edit conflicts.
- **Transactions**: Ensures atomic operations across audit logs and state changes.

### Frontend (React + TypeScript)

- **React 18 & Vite**: Fast, modern frontend tooling.
- **TanStack Query (React Query)**: Server-state management and optimistic UI updates.
- **Tailwind CSS**: Strict, minimalist enterprise design system.
- **React Hook Form & Zod**: Type-safe client-side validation.
- **@hello-pangea/dnd**: Performant drag-and-drop interactions for the Kanban board.
- **Axios**: Configured with interceptors for global authentication handling.

## Key Features

- **Authentication & Authorization**: Secure login with JWT or Google OAuth2. Endpoint and method-level security (`@PreAuthorize`) restricts actions based on user roles (e.g., ORG_ADMIN, PROJECT_MANAGER, DEVELOPER).
- **Interactive Kanban Board**: Fully functional drag-and-drop interface. Uses optimistic UI updates to ensure the application feels instantaneous, seamlessly syncing with the backend.
- **Immutable Audit Logging**: Status changes trigger transactional audit entries to preserve historical context for every issue.
- **Advanced Querying & Pagination**: Backend APIs support dynamic filtering and Spring Data `Pageable` pagination for large datasets.
- **File Uploads (Multipart)**: Support for attaching binary files to issues via `multipart/form-data`, stored securely via simulated Object Storage.
- **Performance Caching**: Redis is implemented to cache heavy read operations (like fetching organizational structures or project data), dropping response times to single-digit milliseconds.
- **Analytics Dashboard**: Aggregates ticket statuses into high-level metrics for management overviews.
- **CI/CD Pipeline**: GitHub Actions automatically runs Java unit tests and builds the React application upon push.

## Quick Start

### 1. Start Infrastructure

Make sure Docker is running, then spin up the database and cache:

```bash
docker-compose up -d
```

### 2. Start Backend

Navigate to the backend directory and run the Spring Boot application:

```bash
cd issue-tracker-backend
./mvnw spring-boot:run
```

*Note: The application runs on `http://localhost:8080`. Flyway/Hibernate will automatically run migrations or generate the schema.*

### 3. Start Frontend

Navigate to the frontend directory, install dependencies, and start the Vite dev server:

```bash
cd issue-tracker-frontend
npm install
npm run dev
```

*Note: The application runs on `http://localhost:5173`.*
