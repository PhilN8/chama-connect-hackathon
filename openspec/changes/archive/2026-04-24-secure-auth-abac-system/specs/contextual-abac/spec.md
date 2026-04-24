## ADDED Requirements

### Requirement: Context-Aware Authorization
The system SHALL evaluate permissions based on a combination of user attributes, resource attributes, and the specific Chama context.

#### Scenario: Verify Permission Check
- **WHEN** a Treasurer attempts to verify a contribution in their assigned Chama
- **THEN** the ABAC engine returns true

### Requirement: Cross-Chama Role Isolation
The system SHALL ensure that a user's permissions are scoped strictly to the Chama context provided in the request.

#### Scenario: Unauthorized Access Attempt
- **WHEN** a user is an Admin in Chama A but attempts to delete a record in Chama B (where they are a Member)
- **THEN** the system denies the deletion request

### Requirement: System Admin Override
The system SHALL grant all permissions to users with the `SYSTEM_ADMIN` global role, regardless of Chama-specific memberships.

#### Scenario: System Admin Global Access
- **WHEN** a System Admin accesses any resource in any Chama
- **THEN** all permission checks evaluate to true
