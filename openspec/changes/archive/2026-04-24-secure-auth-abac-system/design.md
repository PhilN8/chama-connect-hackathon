## Context

The current ChamaConnect implementation lacks a centralized, secure authentication and authorization layer. It relies on redundant token storage which increases the attack surface for XSS and CSRF. Furthermore, the "Member-First" vision requires an architecture where a single user can have multiple contextual roles across different Chamas, which the current flat-role model cannot support.

## Goals / Non-Goals

**Goals:**
- Implement Better-Auth with a Drizzle SQLite adapter for secure, HttpOnly session management.
- Establish a "Member-First" database schema with a Join Table for multi-Chama roles.
- Develop a type-safe ABAC engine in TypeScript to handle complex financial permissions.
- Provide a database initialization strategy that ensures local environment parity without committing the database file.

**Non-Goals:**
- Migrating existing production data (this is a hackathon prototype/demo).
- Implementing SMS OTP (Email/Passwordless focus for this phase).
- Complex multi-currency support beyond KES.

## Decisions

### 1. Better-Auth with Drizzle & SQLite
- **Rationale**: Better-Auth provides a production-grade session manager that integrates deeply with Next.js middleware and server components. Using Drizzle ensures type-safe database interactions and easy schema migrations.
- **Alternatives**: Auth.js (NextAuth) was considered, but Better-Auth's plugin system and cleaner Drizzle integration were preferred for this specialized ABAC requirement.

### 2. Contextual ABAC over DB-Stored Permissions
- **Rationale**: Storing permissions as TypeScript predicates allows for complex logic (like self-dealing checks) that are difficult to express in SQL. It also provides compile-time safety.
- **Alternatives**: Database-stored permissions (Option B in explore mode) was considered for flexibility but rejected due to the complexity and brittleness it would introduce during a hackathon.

### 3. Join-Table Membership Model
- **Rationale**: A `chama_memberships` table allows a user to have a different `role` and `status` in every Chama they belong to.
- **Constraint**: Unique index on `(chama_id, member_id)` to prevent role collision.

### 4. Shadow User Invitation Flow
- **Rationale**: Allowing admins to invite members via phone/email before the member registers. This handles the "Identity Deduplication" by checking for existing users/shadow users before creating a new record.

## Risks / Trade-offs

- **[Risk] Session Size** → **[Mitigation]**: We will not store all memberships in the JWT. Instead, we will store only the `userId` and fetch the contextual role from the DB/Cache on-demand.
- **[Risk] Ghost User Bloat** → **[Mitigation]**: 48-hour expiration on invitations with a "cleanup" check during new invite creation.
- **[Risk] Last Admin Paradox** → **[Mitigation]**: Implement a "Self-Verified" status that broadcasts an alert to all Chama members for transparency.
