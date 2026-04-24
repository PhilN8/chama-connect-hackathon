## ADDED Requirements

### Requirement: Member-First Identity Deduplication
The system SHALL prevent duplicate member records by using a unique combination of `email` and `phone_number` as the primary identity key.

#### Scenario: Duplicate Signup Prevention
- **WHEN** a user tries to register with a phone number that already exists in the system
- **THEN** the system redirects them to login or password recovery

### Requirement: Invitation Lifecycle (Ghost Users)
The system SHALL support the creation of "Shadow Users" for invitations, which expire after 48 hours if not activated.

#### Scenario: Invitation Expiration
- **WHEN** 48 hours have passed since an invitation was sent and not accepted
- **THEN** the invitation is marked as expired and the shadow record is eligible for cleanup

### Requirement: Deactivation over Deletion
The system SHALL deactivate memberships rather than deleting them to preserve financial audit history.

#### Scenario: Member Departure
- **WHEN** a member leaves a Chama
- **THEN** their membership status is set to `DEACTIVATED`, and they lose all access to the Chama resources
