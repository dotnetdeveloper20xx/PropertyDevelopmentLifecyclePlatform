# BuildEstate Pro — Coding Standards & Conventions

## General Principles
- Write clean, readable, maintainable code
- Follow SOLID principles
- DRY (Don't Repeat Yourself) — extract shared logic
- Prefer composition over inheritance
- Keep methods small and focused (single responsibility)
- All code must be strongly typed — no `any` in TypeScript, no `dynamic` in C# unless absolutely necessary

## C# / ASP.NET Core Conventions

### Naming
- **Classes/Interfaces:** PascalCase (`LandOpportunity`, `IOpportunityService`)
- **Methods:** PascalCase (`GetOpportunityById`)
- **Properties:** PascalCase (`PropertyName`)
- **Private fields:** _camelCase (`_opportunityRepository`)
- **Parameters/locals:** camelCase (`opportunityId`)
- **Constants:** PascalCase (`MaxRetryCount`)
- **Interfaces:** Prefix with `I` (`IRepository<T>`)

### Architecture Rules
- Controllers should be thin — delegate to Application services
- Use DTOs for API input/output, never expose domain entities directly
- Use MediatR for command/query handling (CQRS)
- Repository pattern via interfaces in Domain, implementations in Infrastructure
- Use FluentValidation for request validation
- Return appropriate HTTP status codes (200, 201, 400, 404, 409, 500)
- Use global exception handling middleware
- All endpoints require authorization unless explicitly public

### Entity Conventions
- Every entity inherits from `BaseEntity` (Id, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy)
- Soft delete via `IsDeleted` flag and `DeletedAt` timestamp
- Use strongly-typed IDs where appropriate
- Navigation properties for relationships

## TypeScript / Angular Conventions

### Naming
- **Components:** PascalCase with suffix (`OpportunityListComponent`)
- **Services:** PascalCase with suffix (`OpportunityService`)
- **Interfaces/Models:** PascalCase, prefix with `I` for interfaces (`IOpportunity`)
- **Files:** kebab-case (`opportunity-list.component.ts`)
- **Variables/functions:** camelCase
- **Constants:** UPPER_SNAKE_CASE for true constants, camelCase for config

### Component Rules
- Use standalone components (Angular 20)
- Smart (container) components handle data, dumb (presentational) components handle display
- Keep templates clean — extract complex logic to the component class
- Use OnPush change detection strategy
- Unsubscribe from observables (use `takeUntilDestroyed` or async pipe)

### State Management (NgRx)
- One store slice per feature module
- Actions: `[Feature] Action Name` format
- Effects for side effects (API calls)
- Selectors for derived state
- Use createFeature() for concise store setup

### Forms
- Use Reactive Forms for all data entry
- Validate on the client AND the server
- Show inline validation messages
- Disable submit until form is valid

## API Conventions
- RESTful endpoints: `api/v1/{resource}`
- Use plural nouns for resources (`/opportunities`, `/documents`)
- Pagination: `?page=1&pageSize=20`
- Filtering: query parameters (`?status=active&location=london`)
- Sorting: `?sortBy=createdAt&sortDir=desc`
- Consistent response envelope: `{ data, pagination, errors }`

## Git Conventions
- Branch naming: `feature/{module}/{short-description}` (e.g., `feature/land-acquisition/opportunity-pipeline`)
- Commit messages: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`)
- One feature per branch, one concern per commit
- PR required for merge to main

## Testing
- Unit tests for all services and business logic
- Integration tests for API endpoints
- Component tests for Angular components with complex logic
- Naming: `MethodName_Scenario_ExpectedResult`

## Documentation
- XML comments on all public C# methods and classes
- JSDoc comments on Angular services and complex components
- README per module explaining purpose and key decisions
- API documented via Swagger annotations
