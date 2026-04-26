## ADDED Requirements

### Requirement: Unified Session Management
The system SHALL use Better-Auth to manage user sessions through secure, HttpOnly, and SameSite=Lax cookies.

#### Scenario: Successful login
- **WHEN** user provides valid credentials
- **THEN** system sets a secure HttpOnly cookie and establishes a server-side session

### Requirement: Passwordless OTP Verification
The system SHALL support email-based OTP verification for both new registrations and logins.

#### Scenario: OTP Request
- **WHEN** user enters their email to login
- **THEN** system sends a 6-digit OTP to the email and displays a verification form

### Requirement: Redundant Token Protection
The system SHALL NOT store authentication tokens (JWTs) in LocalStorage or any client-accessible storage.

#### Scenario: Client-side storage audit
- **WHEN** a session is active
- **THEN** sensitive authentication tokens are absent from `window.localStorage` and `window.sessionStorage`
