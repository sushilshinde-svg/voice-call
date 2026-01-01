# Contributing — Prototype Notice

Thank you for your interest in contributing to this project. This repository is a prototype for an anonymous voice chat app (live demo: https://voice-call-three.vercel.app/). The project is early-stage and actively evolving — contributions are very welcome, especially for features such as rooms, multi-party conference calls, improved NAT/traversal (TURN), moderation tools, and accessibility.

Please read this document before contributing.

---

## Prototype status — read this first

- This project is a prototype/experimental implementation. Expect bugs, incomplete features, and occasional breaking changes.
- The live instance may be used for testing and demonstration; do not rely on it for production or sensitive conversations.
- Features you might want to contribute:
  - Persistent and temporary rooms (multi-user sessions)
  - Group conference audio (N-party mixing or selective forwarding)
  - TURN server integration and improved NAT traversal
  - Optional text chat alongside voice
  - Ownership/moderation tools for public rooms
  - End-to-end encryption (E2EE) improvements
  - UI/UX polish, mobile optimizations, accessibility (a11y)
  - Automated tests, CI, and deployment improvements

If you plan to implement any of the above, open an issue first to discuss design and avoid duplicate work.

---

## How to contribute

1. Fork the repository.
2. Create a topic branch with a descriptive name:
   - git checkout -b feat/rooms
3. Make your changes, include tests where appropriate.
4. Run linters and tests locally.
5. Open a pull request describing:
   - What you changed and why
   - Any migration or deployment notes
   - How to test the change
6. Be responsive to review feedback — maintainers may request changes.

Guidelines:
- Keep changes small and focused where possible.
- Write clear commit messages and PR descriptions.
- Include screenshots or example flows for UI changes.
- Add documentation updates when you add or change functionality.

---

## Do NOT exploit the app

This project is intended for learning, research, and safe experimentation. Do NOT exploit this app or the live demo in any way:

- Do not attempt to access, tamper with, or extract data from other users' sessions.
- Do not attempt unauthorized access to servers, databases, or admin interfaces.
- Do not abuse the signaling server, perform automated scraping, or run denial-of-service attacks against the site or infrastructure.
- Do not publish or share secrets or credentials that you discover.

Abusive behavior may result in permanent blocks from the live demo and could have legal consequences. Respect the privacy and safety of users.

---

## Security & responsible disclosure

If you discover a security vulnerability, exposed secret, or any sensitive information (for example: API keys, credentials, private certificates, or tokens) in the repository or on the deployed site, please follow these steps:

1. Do NOT publish the secret publicly (issues, PRs, or social media).
2. Prefer responsible disclosure:
   - If the repository or organization has a security contact or email, use that.
   - If not, open a private GitHub Security Advisory (recommended) or create an issue and mark it clearly as a security report. If you cannot open a private advisory, contact the maintainer by any direct method provided in the repository (email/social) and indicate that you need a private channel.
3. Provide:
   - A short description of the issue
   - Exact reproduction steps and required URLs or repo paths
   - Screenshots or redacted logs (do not include the secret itself in public text)
   - Suggested remediation (if known), e.g., rotate keys, remove secrets from history
4. If you accidentally published a secret (in a PR or issue), please notify maintainers immediately so the secret can be invalidated and removed.

Recommended actions for maintainers if secrets are found:
- Revoke/rotate exposed keys immediately.
- Remove secrets from the repo and history (filter-branch, BFG, or other history-rewriting tools) and publish updated credentials to required services.
- Consider adding a pre-commit secret scanner (e.g., git-secrets, pre-commit-hooks) and CI checks to prevent future leaks.

---

## Reporting publicly visible secrets found on the deployed app

If you find credentials or sensitive data exposed by the deployed site (https://voice-call-three.vercel.app/) rather than the repo:
- Do NOT download or copy the secrets.
- Report the issue privately using the Security Advisory flow or the maintainer contact.
- If no private contact exists, open a GitHub issue titled "[SECURITY] Confidential - do not disclose publicly" and include minimal, necessary information to reproduce (avoid posting secrets). Maintain communication privately as requested.

---

## Code of conduct

Please follow a respectful, inclusive, and constructive tone in all discussions. Be mindful that users and contributors may come from diverse backgrounds and skill levels.

---

## Attribution & license

Contributions are subject to the repository license (check LICENSE file). By contributing you agree your contributions will be licensed under the project license.

---

## Thank you

Thank you for helping improve this prototype. If you have ideas but prefer a conversation first, open an issue describing the feature and we can coordinate roadmap and design before implementation.

If you'd like, I can also:
- Add issue/PR templates for features and bugs,
- Provide a SECURITY.md with exact contact guidance,
- Add a pre-commit configuration to scan for secrets.

Please let me know which of those you'd like added next.
