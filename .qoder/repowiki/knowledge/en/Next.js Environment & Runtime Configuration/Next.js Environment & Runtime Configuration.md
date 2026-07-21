---
kind: configuration_system
name: Next.js Environment & Runtime Configuration
category: configuration_system
scope:
    - '**'
source_files:
    - next.config.mjs
    - src/lib/api/config.js
    - src/app/api/chat/route.js
    - .gitignore
---

This Next.js application uses a minimal, file-based configuration approach with no dedicated config directory or third-party configuration library. Configuration is split across three layers:

1. Build-time/framework config: next.config.mjs declares the only Next.js runtime options - React Compiler enabled and allowed remote image hosts (images.unsplash.com, i.pravatar.cc). No i18n routing, redirects, rewrites, or env variable exposure are configured here.

2. Environment variables: Secrets and feature toggles are consumed via process.env.*:
- OPENAI_API_KEY (server-only, used in src/app/api/chat/route.js) - controls whether the chatbot calls OpenAI or falls back to keyword-matched mock responses. The code checks that it starts with sk- before enabling the real API.
- NEXT_PUBLIC_API_BASE_URL (client-exposed) - base URL for the Axios client in src/lib/api/config.js, defaulting to https://api.yourbackend.com/v1.
- NEXT_PUBLIC_FSQ_KEY (client-exposed) - Foursquare key used by src/lib/api/explore.js; when missing the module logs a warning and falls back to mock data.
All .env* files are gitignored (.gitignore line 34), so environment values must be supplied per deployment environment.

3. In-code feature flags: USE_MOCK_API = true in src/lib/api/config.js is a hard-coded boolean toggle that switches between mock and real backend responses. There is no env-driven override for this flag.

Conventions observed:
- Server secrets use unprefixed process.env.* names; client-visible values use the NEXT_PUBLIC_ prefix as required by Next.js.
- External service integrations (OpenAI, Foursquare) include graceful fallbacks to local mock data when their keys are absent, making the app runnable without any environment setup.
- No centralized config loader, schema validation, or typed config object exists - each module reads its own process.env entries directly.