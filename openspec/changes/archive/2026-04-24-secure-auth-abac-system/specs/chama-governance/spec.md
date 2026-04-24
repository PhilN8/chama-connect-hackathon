## ADDED Requirements

### Requirement: Self-Dealing Prevention
The system SHALL prevent any member (including Admins and Treasurers) from verifying their own financial contributions.

#### Scenario: Self-Verification Block
- **WHEN** a Treasurer attempts to verify a contribution where `memberId` equals their own `userId`
- **THEN** the system denies the request and displays a "Self-verification prohibited" message

### Requirement: Minimum Contribution Enforcement
The system SHALL enforce a Chama-specific minimum contribution amount during the creation of any contribution record.

#### Scenario: Low Amount Rejection
- **WHEN** a member attempts to submit a contribution below the `min_contribution_amount` set for that Chama
- **THEN** the system rejects the submission with a validation error

### Requirement: Cash Contribution Governance
The system SHALL require explicit verification by a Treasurer or Admin for all contributions where the payment method is `CASH`.

#### Scenario: Cash Approval Required
- **WHEN** a cash contribution is submitted
- **THEN** its status remains `PENDING` until a non-owner Treasurer or Admin approves it
