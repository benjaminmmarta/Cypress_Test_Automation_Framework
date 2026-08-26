# Cypress Test Automation Framework — Progress Notes

A running log of this project's goals, status, decisions, and gotchas — kept as a plain file
so progress survives even if chat/session history doesn't. Last updated: 2026-08-26.

## Project goal

A portfolio-quality Cypress UI test automation framework, built against
[ParaBank](https://parabank.parasoft.com/parabank/index.htm) (Parasoft's public demo banking
site). Working style: the user writes the test code themselves; Claude acts as a mentor/guide
(explains concepts, reviews code, helps debug) rather than authoring test files directly.

A separate, standalone **Postman project** is planned to cover API testing — this Cypress
framework is scoped to **UI testing only**.

Repo: `benjaminmmarta/Cypress_Test_Automation_Framework` on GitHub, `main` branch.

## Current status

✅ **Registration test** (`cypress/e2e/registration.cy.js`) — built and was confirmed passing
5 runs in a row as of the last verified run. Flow: visits ParaBank, clicks the Register link,
fills the registration form from `cypress/fixtures/registration.json`, submits, and asserts
both the "Welcome, [username]" heading and the "account created successfully" confirmation text.

⚠️ **Possible regression to check first:** the last file read shows the `id` selectors
(e.g. `'#customer.firstName'`) **without** the double-backslash escaping
(`'#customer\\.firstName'`) that was required to make them match ParaBank's literal-dot ids —
see the escaping gotcha below. If a recent edit dropped that escaping, the test will likely fail
again with "expected to find element... but never found it" errors. Worth re-running and
re-checking before doing anything else.

There's also a dangling comment at the bottom of the file: `// Make Login with newly created
registration username and password.` — a note-to-self for the next test to build.

## Planned roadmap (UI-only scope)

Roughly in priority order:

1. ✅ Registration — happy path
2. ⬜ Registration — negative cases (mismatched password/confirm, missing required field,
   duplicate username, etc.)
3. ⬜ Login — happy path (log in with a known/newly-registered account, reach account overview)
4. ⬜ Login — negative case (wrong password → error message shown)
5. ⬜ One banking flow post-login — Transfer Funds is the simplest starting point; Bill Pay is
   a good second flow. (Still a **UI** test — driving the browser/forms, not calling the
   underlying REST API directly. API-style testing is out of scope here, reserved for the
   separate Postman project.)
6. ⬜ Page Object Model refactor — pull selectors/actions for each page into page object
   classes/objects, starting with registration, then reusing the pattern for login/transfer.
7. ⬜ Custom Cypress commands — e.g. a `cy.login()` command so any test needing an authenticated
   session doesn't repeat that logic.
8. ⬜ GitHub Actions CI — run the suite automatically on push.
9. ⬜ README — what the framework covers, how to run it, and why (POM, why ParaBank, what CI does).

Items 1–5 + 6–7 + 8–9 are considered enough to call this "portfolio worthy"; API tests were
deliberately dropped from this list since they're being handled in the separate Postman project.

## Key ParaBank-specific gotchas (learned the hard way — useful if debugging similar issues again)

- **Literal dots in `id` attributes.** ParaBank's form field ids are like
  `id="customer.firstName"` or `id="customer.address.street"` — literal periods, not just
  namespacing. In a CSS selector, an unescaped period means "and has this class," so it has to
  be escaped: `#customer\.firstName`. But that selector lives inside a **JS string**, and a
  single backslash in a JS string literal followed by a non-special character gets silently
  stripped before CSS ever sees it — so the JS source needs a **double** backslash:
  `'#customer\\.firstName'`. (This is the exact thing flagged as possibly regressed above.)

- **Casing matters.** The username field's real `id` is `customer.username` (lowercase),
  not `customer.userName` — a subtle mismatch that caused a "never found" selector error.

- **`baseUrl` + `cy.visit()` path-joining.** With `baseUrl` set to a specific file
  (`.../parabank/index.htm`), `cy.visit('/')` appends a slash and produces a broken URL
  (`.../index.htm/`, 404). Fix: use `cy.visit('')` (empty string) to visit `baseUrl` exactly
  as-is, with nothing appended.

- **`.should('include', text)` doesn't work on a `cy.get()`/jQuery subject** — throws
  "the given combination of arguments (object and string) is invalid for this assertion."
  Use `.should('contain', text)` instead; chai-jquery only patches `contain` for DOM text
  checks, not the `include` alias, even though they're normally synonyms in plain chai.

- **Silent server-side username length limit.** There's no `maxlength` attribute in the HTML,
  but ParaBank's server appears to silently reject/collide on long usernames. A ~23-character
  username like `'test-data-' + Date.now()` kept colliding as "already exists" across fresh,
  genuinely-different values; switching to a short username — just `Date.now()` alone
  (13 digits, no prefix) — fixed it reliably. Keep generated usernames short.

- **Duplicate usernames are rejected; most other fields are not.** Only fields the app
  actually enforces uniqueness on (here, just `username`) need a fresh/dynamic value per test
  run. Password, name, address, etc. can safely stay static in the fixture.

- **The homepage's "ATM Services" / "Online Services" links go to a WADL/API description
  page (an XML document), not real UI pages.** That's expected — they point at ParaBank's
  REST API documentation (endpoints like `login/{username}/{password}`, `transfer`, `billpay`,
  `deposit`, `withdraw`, `createAccount`, etc.), separate from the actual customer-facing site.
  The real, testable banking UI (Transfer Funds, Bill Pay, Accounts Overview, Find Transactions,
  Update Contact Info, Request Loan) only appears in the sidebar **after logging in** — and
  registering successfully already logs you in, so that sidebar is reachable right after the
  registration test completes.

## File structure (as of last update)

```
cypress.config.js          # baseUrl set to ParaBank; e2e config
cypress/
  e2e/
    registration.cy.js     # the one test built so far
  fixtures/
    registration.json      # static registration form data (userName intentionally omitted —
                            # generated at runtime instead, see gotcha above)
  support/
    commands.js            # still default Cypress scaffold, no custom commands yet
    e2e.js                 # default scaffold
.gitignore                 # node_modules, cypress artifacts, env files
```

## How to resume this project in a new session

Just say something like "let's continue the Cypress framework" — Claude has persistent memory
notes on this project's status and the gotchas above, plus this file, so context should
reconstruct quickly even without chat history. Good next single step per the roadmap above:
either the registration negative-path tests, or the login happy-path test using the
already-noted plan of reusing a newly-registered account's credentials.
