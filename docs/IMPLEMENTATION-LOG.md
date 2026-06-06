# BuildEstate Pro — Implementation Log

This document tracks important design decisions, their rationale, and outcomes.
Every significant architectural choice must be recorded here.

---

## Decision Log

### DEC-001: Clean Architecture with CQRS
**Date:** 2026-06-06
**Decision:** Use Clean Architecture (4 layers) with CQRS pattern via MediatR.
**Rationale:**
- Strict separation allows independent testing of business logic
- CQRS separates read/write concerns — queries are fast (no validation overhead), commands are safe (full validation)
- MediatR provides a clean dispatch mechanism without coupling controllers to handlers
- Pipeline behaviors allow cross-cutting concerns (validation, logging, audit) without code duplication
**Trade-offs:**
- More files per feature (command + handler + validator + DTO)
- Learning curve for developers unfamiliar with MediatR
- Slight indirection overhead (negligible in real-world perf)
**Alternatives Considered:**
- Traditional N-Tier (rejected: mixes concerns, harder to test)
- Vertical Slice Architecture (considered: good option but less strict boundaries)

---

### DEC-002: Guid Primary Keys
**Date:** 2026-06-06
**Decision:** Use Guid (UUID) for all entity primary keys.
**Rationale:**
- Distributed-safe: no conflicts when merging data or scaling horizontally
- Client-side generation: entities have IDs before database round-trip
- No information leakage (sequential ints reveal record counts)
**Trade-offs:**
- 16 bytes vs 4 bytes for int (marginal storage impact)
- Index fragmentation (mitigated by sequential GUID generation in future)
- Slightly harder to read in logs (use entity name + short ID in logs)

---

### DEC-003: Soft Delete Pattern
**Date:** 2026-06-06
**Decision:** All entities use soft delete (IsDeleted flag + DeletedAt timestamp).
**Rationale:**
- Compliance: audit trail requires knowing what existed and when it was removed
- Recoverability: accidental deletions can be reversed
- Referential integrity: no orphaned records from cascade delete
- Reporting: historical data available for analytics
**Trade-offs:**
- Query filters must be applied everywhere (EF Core global filter handles this)
- Database grows over time (mitigated by archival strategy)
- Must explicitly filter in raw SQL / reporting queries

---

### DEC-004: Entity Framework Core with Code-First
**Date:** 2026-06-06
**Decision:** Use EF Core Code-First with explicit Fluent API configurations.
**Rationale:**
- Domain model drives database schema (not the other way around)
- Migrations are version-controlled and reviewable
- Explicit configurations prevent convention surprises
- Strongly typed — compile-time safety for schema changes
**Trade-offs:**
- Less control than raw SQL for complex queries (mitigated: use raw SQL where needed)
- Migration conflicts in team environments (mitigated: small, frequent migrations)

---

### DEC-005: JWT Bearer Authentication
**Date:** 2026-06-06
**Decision:** Stateless JWT Bearer tokens for API authentication.
**Rationale:**
- Stateless: no server-side session storage needed (horizontal scaling)
- Standard: widely understood, tooling support everywhere
- Claims-based: roles and permissions embedded in token
- Mobile/SPA friendly: works with any client
**Trade-offs:**
- Cannot revoke individual tokens (mitigated: short expiry + refresh rotation)
- Token size grows with claims (keep claims minimal)
- Must protect from XSS/CSRF (HttpOnly cookies for web, secure storage for mobile)

---

### DEC-006: Feature-Based Organisation
**Date:** 2026-06-06
**Decision:** Organise code by feature/domain, not by technical concern.
**Rationale:**
- Everything related to a feature lives together (high cohesion)
- New developers find code faster (search by business concept, not by type)
- Modules can be developed and deployed independently (future microservices path)
- Reduces merge conflicts (teams work in different folders)
**Trade-offs:**
- Some shared code needed across features (placed in Shared/Common)
- Must avoid cross-feature dependencies (enforced by architecture reviews)

---

## Future Decisions Needed
- [ ] Message queue technology (Azure Service Bus vs RabbitMQ)
- [ ] Caching strategy (Redis vs IMemoryCache)
- [ ] File storage provider (Azure Blob vs AWS S3 — finalise)
- [ ] CI/CD pipeline tool (GitHub Actions vs Azure DevOps)
- [ ] Monitoring/APM tool (Application Insights vs Serilog + Seq)
- [ ] Multi-tenancy strategy (schema per tenant vs row-level filtering)
