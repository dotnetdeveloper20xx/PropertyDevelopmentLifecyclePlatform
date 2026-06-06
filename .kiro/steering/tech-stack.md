# BuildEstate Pro — Technology Stack & Architecture

## Frontend
- **Framework:** Angular 20 (standalone components)
- **State Management:** NgRx Store
- **UI Library:** Angular Material / PrimeNG
- **Maps Integration:** Google Maps / Mapbox API
- **Language:** TypeScript (strict mode)
- **Styling:** SCSS with BEM naming convention
- **Responsive:** Mobile-first, cloud-ready

## Backend
- **Framework:** ASP.NET Core Web API (.NET 8+)
- **Language:** C#
- **ORM:** Entity Framework Core (Code-First migrations)
- **Authentication:** Identity & Access Management (JWT-based)
- **API Style:** RESTful with versioning (api/v1/)
- **Documentation:** Swagger / OpenAPI

## Database
- **Primary:** SQL Server (relational)
- **Schema:** Multi-tenant capable
- **Approach:** Code-First with EF Core migrations

## Cloud & Storage
- **File Storage:** Azure Blob Storage / AWS S3
- **Hosting:** Azure App Service or AWS (cloud-native)
- **CDN:** For static assets

## Cross-Cutting Concerns
- **Audit Logging:** Every action logged with user, timestamp, entity
- **Activity Tracking:** Full audit trail per entity
- **Security:** Role-based access control (RBAC), data encryption at rest & in transit
- **Compliance:** GDPR-compliant, ISO 27001 aligned
- **Backups:** Regular automated backups & recovery

## Integrations
- Land Registry API
- Companies House API
- Google Maps / Mapbox
- Planning Portal API
- Document e-Signature (Adobe / DocuSign)
- Email & Notifications
- Payment Gateways

## Project Structure Conventions

### Angular Frontend
```
src/
├── app/
│   ├── core/                  # Singleton services, guards, interceptors
│   ├── shared/                # Shared components, pipes, directives
│   ├── features/              # Feature modules (one per domain)
│   │   ├── land-acquisition/
│   │   ├── planning/
│   │   ├── legal/
│   │   ├── project-management/
│   │   ├── construction/
│   │   ├── procurement/
│   │   ├── contractors/
│   │   ├── finance/
│   │   ├── investors/
│   │   ├── property-units/
│   │   ├── sales/
│   │   ├── rental/
│   │   ├── documents/
│   │   └── reports/
│   ├── layout/                # Shell, navigation, header, sidebar
│   └── app.routes.ts
├── assets/
├── environments/
└── styles/
```

### ASP.NET Core Backend
```
src/
├── BuildEstate.API/              # Web API project (controllers, middleware)
├── BuildEstate.Application/      # Application layer (services, DTOs, CQRS)
├── BuildEstate.Domain/           # Domain entities, value objects, interfaces
├── BuildEstate.Infrastructure/   # EF Core, repositories, external services
└── BuildEstate.Shared/           # Cross-cutting: exceptions, constants, helpers
```

## Architecture Pattern
- **Backend:** Clean Architecture (Domain → Application → Infrastructure → API)
- **Frontend:** Feature-based modular architecture with lazy loading
- **Communication:** CQRS pattern with MediatR
- **Validation:** FluentValidation on backend, reactive forms on frontend
