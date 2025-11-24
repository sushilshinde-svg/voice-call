# Security Audit Report

## Findings

### 1. Lack of Input Validation (High)
**Location**: `server.js`
**Description**: The server accepts arbitrary data for `username`, `signalData`, and `name`.
-   **Risk**:
    -   **DoS**: An attacker could send a massive `signalData` payload (e.g., 100MB string) to crash the server or exhaust bandwidth.
    -   **Injection**: While React protects against XSS, storing malicious scripts in `username` is bad practice.

### 2. No Rate Limiting (Medium)
**Location**: `server.js`
**Description**: There is no limit on how many events a user can emit.
-   **Risk**: An attacker can spam `call-user` events, flooding the server and the target user, effectively causing a Denial of Service.

### 3. Permissive CORS (Medium)
**Location**: `server.js`
**Description**: `origin: "*"` allows any website to connect to your websocket server.
-   **Risk**: Malicious websites could connect to your server from a victim's browser (CSWSH - Cross-Site WebSocket Hijacking).

### 4. Information Leakage (Low)
**Location**: `server.js`
**Description**: `io.emit('user-list', ...)` broadcasts all users to everyone.
-   **Risk**: In a public app, this exposes who is online. (Acceptable for a small prototype, but a privacy risk at scale).

## Remediation Plan

1.  **Implement Input Validation**:
    -   Enforce max length for `username` (e.g., 20 chars).
    -   Enforce max length for `signalData`.
    -   Sanitize strings to remove special characters.
2.  **Add Rate Limiting**:
    -   Limit users to 5 calls per minute.
    -   Limit registration attempts.
3.  **Harden CORS**:
    -   Restrict to `localhost` for dev, and specific domains for prod.
