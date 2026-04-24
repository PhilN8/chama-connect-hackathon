## 1. Database & Schema Setup

- [x] 1.1 Configure Drizzle with SQLite adapter and environment variables
- [x] 1.2 Implement `users` schema with `global_role` and deduplication keys
- [x] 1.3 Implement `chamas` schema with `min_contribution_amount` field
- [x] 1.4 Implement `chama_memberships` join table with unique `(chamaId, memberId)` index
- [x] 1.5 Implement `invitations` table with `expires_at` and `status` fields
- [x] 1.6 Implement `contributions` table with `REJECTED` and `SELF_VERIFIED` status support
- [x] 1.7 Create a database initialization script for local development

## 2. Authentication with Better-Auth

- [x] 2.1 Initialize Better-Auth with the Drizzle SQLite adapter
- [x] 2.2 Configure session storage to use HttpOnly, secure, Lax cookies
- [x] 2.3 Implement Email OTP flow for login and registration
- [x] 2.4 Create Next.js middleware for global session protection
- [x] 2.5 Expose Auth client and server helpers for session retrieval

## 3. ABAC Permission Engine

- [x] 3.1 Implement the core `hasPermission` engine based on TypeScript predicates
- [x] 3.2 Define `CHAMA_ROLES` policy object with contextual permissions
- [x] 3.3 Add `SYSTEM_ADMIN` global override logic to the engine
- [x] 3.4 Implement the "Anti-Self-Dealing" predicate for contribution verification
- [x] 3.5 Implement "Minimum Allocation" check for contribution creation

## 4. Member Lifecycle & Invitations

- [x] 4.1 Implement the "Shadow User" creation logic for new invitations
- [x] 4.2 Create the invitation acceptance flow (Verify Email -> Activate Account -> Join Chama)
- [x] 4.3 Add background check/logic for 48-hour invitation expiration
- [x] 4.4 Implement membership deactivation logic for departing members

## 5. UI & Integration

- [x] 5.1 Refactor RegisterForm to use the new Better-Auth OTP flow
- [x] 5.2 Update OnboardingFlow to handle shadow user activation
- [x] 5.3 Implement Chama switcher/context helper for the frontend
- [x] 5.4 Integrate permission checks into UI elements (e.g., hiding Verify button for owners)
