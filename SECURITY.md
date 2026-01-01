# Security Policy

This document describes the security policies and responsible disclosure process for the Voice Call prototype:
Live demo: https://voice-call-three.vercel.app/
Repository: https://github.com/sushilshinde-svg/voice-call

Voice Call is an early-stage prototype. Security and privacy are important priorities — thank you for taking the time to report issues responsibly.

---

## Summary / Scope

This policy covers:
- The public repository and its branches.
- The deployed demo at https://voice-call-three.vercel.app/.
- Any official services operated by the project (signaling endpoints, TURN/STUN servers, storage).

This policy does NOT cover third-party services, forks, or other deployments not under the project's control.

---

## Reporting a security vulnerability (preferred flow)

Preferred method: Create a private GitHub Security Advisory for the repository. This allows maintainers to coordinate privately and provides tools for disclosure.

If you cannot create a private security advisory, follow these steps:

1. Do NOT publish the vulnerability or any secrets publicly (issues, PRs, social media).
2. Open a new GitHub Issue titled:
   [SECURITY] Confidential — do not disclose publicly
   - In the issue body, provide the required disclosure template (see below).
   - Immediately request that the discussion be moved to a private channel, or explicitly request a maintainer to start a private discussion.
3. If you need an alternative private channel and a maintainer has provided an email or PGP key in the repo, use that. If no private contact exists and you cannot use GitHub's private advisory, indicate that in your issue and include a maintainer contact request.

---

## Disclosure template (what to include)

When reporting, please provide the following to help us reproduce and assess the issue:

- Short summary (one sentence)
- Affected component(s) and branch/tag (e.g., `client/src/webrtc.js`, `main` branch, deployed demo)
- Versions / environment (browser, OS, repo commit SHA, deployed URL)
- Steps to reproduce (concise and reproducible). If a PoC is necessary, include it but redact secrets.
- Actual result and expected result
- Potential impact and risk (data exposure, remote code execution, DoS, etc.)
- Any logs, screenshots, or network traces (redact tokens and secrets)
- Disclosure preference: coordinated disclosure timeline or immediate public disclosure
- Optional: suggested fix or mitigation

Important: do not include actual secrets (API keys, tokens, credentials) in the public issue body. If you must demonstrate possession of a secret, include only a redacted sample and indicate how to verify privately.

---

## Response & handling timeline

We commit to the following, subject to contributor/maintainer availability:

- Acknowledgement: within 3 business days of receiving a valid report.
- Initial assessment: within 7 calendar days.
- Remediation plan: within 14 calendar days for confirmed issues or sooner for critical vulnerabilities.
- Coordinated disclosure: we will coordinate with the reporter on an appropriate public disclosure timeline. If the issue is critical and no fix can be implemented in a reasonable time, we may request that the reporter wait up to 90 days before public disclosure to allow mitigation; we will communicate and negotiate timelines in the private advisory.

If you have not received a response in the expected timeframe, please follow up on the same private advisory or issue thread.

---

## Severity classification

We use the following high-level categories:

- Critical — remote code execution, unauthenticated access to private data, secret leakage allowing full account/service compromise, or ability to pivot to infrastructure control.
- High — authentication bypass, ability to access or manipulate other users' sessions or data without privileged access, large-scale DoS vectors.
- Medium — information leaks with limited impact, privilege escalation in constrained contexts, or flaws requiring user interaction.
- Low — minor bugs, UI issues, or weaknesses with low risk or difficult to exploit.

Severity assessment will consider ease of exploitation, impact, and exploitability at scale.

---

## Remediation & recommended mitigations

If you discover secrets or credentials in the repository or deployed site, recommended immediate actions for maintainers:

1. Revoke and rotate the exposed credentials (API keys, tokens, certificates) immediately.
2. Remove secrets from the repository and history:
   - Use tools like git filter-repo or BFG to purge secrets from history (do NOT rely on a single commit revert).
   - After history rewrite, force-push and notify collaborators to re-clone.
3. If secrets were exposed in the deployed site, rotate them at provider-level and update environment variables/secrets in the deployment platform.
4. Add secret-scanning to CI (GitHub secret scanning, git-secrets, pre-commit hooks).
5. Add code scanning/dependency checks (GitHub Code Scanning, Dependabot alerts, Snyk, etc.).
6. Consider adding rate-limiting, WAF rules, and additional monitoring on affected endpoints.

If you are reporting as an external finder and have proof (e.g., a key that allows access), do not share the fully usable key publicly. Work with maintainers to validate privately.

---

## If you discover an exposed secret on the deployed demo

- Do NOT attempt to use the secret to access systems beyond the minimum verification.
- Immediately report using the confidential reporting flow described above.
- If you already used the secret accidentally, disclose what you did and provide logs so maintainers can assess impact.

---

## Responsible testing rules (what we expect from researchers)

- Do not attempt to exploit, tamper with, or exfiltrate sensitive user data.
- Do not perform destructive testing or tests that could cause service disruption (DoS) without explicit permission.
- Limit testing to the minimum required to demonstrate the issue.
- If your testing inadvertently impacts other users, stop immediately and report what happened.

Failure to adhere to these rules may result in the maintainers refusing to work with the reporter or reporting unacceptable activity to hosting providers or authorities.

---

## Public disclosure & credit

We will coordinate public disclosure with the reporter. If you wish to remain anonymous, indicate this preference. If you would like credit, we will add you to an acknowledgements list unless you request otherwise.

---

## Preventive measures & best practices (recommended for maintainers)

- Use environment variables and secrets management (do not commit credentials).
- Add pre-commit hooks to scan for secrets (git-secrets, pre-commit).
- Enable GitHub Advanced Security if available: secret scanning and code scanning.
- Keep dependencies up to date; enable Dependabot or similar.
- Harden signaling endpoints (rate-limits, authentication where appropriate).
- Use TLS everywhere (HTTPS and WSS) and ensure TURN servers are authenticated.
- Log minimal information and rotate logs regularly.

---

## Legal and safe-harbor statement

We appreciate security research and aim to cooperate in good faith. If you follow this policy and act in good faith to report vulnerabilities without violating laws or causing harm, we will not pursue legal action against you for testing consistent with this policy.

This is not legal advice. If you are unsure whether your tests are permitted, ask for permission first.

---

## Contact & next steps

Preferred: create a private GitHub Security Advisory for this repository.

If that is not possible: open a GitHub Issue titled:
[SECURITY] Confidential — do not disclose publicly
and include the disclosure template (without secrets).

If the repository includes an email or PGP key in the future, that will be the alternative private contact channel. Currently there is no public maintainer security email listed in the repo; use GitHub's private advisory flow when possible.

Thank you for helping keep Voice Call safer and more private.
