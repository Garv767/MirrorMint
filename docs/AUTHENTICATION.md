# Authentication & Security

MirrorMint implements a robust security layer for managing sensitive financial strategy data.

## Identity Management
- **Password Hashing:** Uses `bcrypt` for secure storage.
- **Token System:** JSON Web Tokens (JWT) for stateless authentication.
- **Persistence:** Tokens are stored in the browser's `localStorage` and managed via a React `AuthContext`.

## Role-Based Access Control (RBAC)
The platform supports two roles:
1. **Admin:** Full control over all strategies, regardless of ownership.
2. **User:** Can create strategies and manage (edit/delete) only the ones they own.

## Testing Admin Access
A "Demo Admin" feature is available for reviewers:
- **Invite Code:** `PRIME-ADMIN-2026`
- Enter this code during registration to grant your profile administrative privileges.
