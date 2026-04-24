## Why

The current system has critical security vulnerabilities, including redundant storage of sensitive tokens (Cookies and LocalStorage) and excessive data exposure. Additionally, the lack of a structured, context-aware authorization model leads to data integrity issues like member duplication and insufficient governance over sensitive financial actions (e.g., self-verification of cash contributions).

## What Changes

- **Secure-Only HttpOnly Session Management**: Moving from redundant token storage to a unified, server-side session management system using Better-Auth.
- **Identity Deduplication Engine**: Implementation of unique member identifiers and a "Shadow User" flow to prevent duplicate records.
- **Contextual ABAC System**: Transition from flat roles to an Attribute-Based Access Control system that understands a member's role relative to a specific Chama.
- **Self-Dealing Protection**: Implementation of system-level guardrails preventing financial officers from verifying their own contributions.
- **Ghost User Lifecycle**: Introduction of a 48-hour expiration for invitations to maintain a clean identity graph.

## Capabilities

### New Capabilities
- `secure-auth`: Unified session management using Better-Auth with HttpOnly secure cookies.
- `contextual-abac`: A type-safe authorization engine that evaluates permissions based on member attributes and Chama context.
- `member-identity`: A member-centric identity system supporting shadow users, deduplication, and invitation lifecycles.
- `chama-governance`: Rules and constraints for Chama-level settings, such as minimum allocations and self-verification protections.

### Modified Capabilities
<!-- No existing capabilities detected in openspec/specs -->

## Impact

- **Database**: Migration to SQLite via Drizzle ORM; new tables for `memberships`, `invitations`, and `contributions` status.
- **Authentication**: Introduction of `better-auth` as the primary auth provider.
- **Frontend**: Refactoring of login, registration, and onboarding flows to support OTP and shadow user verification.
- **Security**: Elimination of client-side accessible JWTs and session leakage.
