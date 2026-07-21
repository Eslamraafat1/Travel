---
kind: dependency_management
name: npm-based dependency management with lockfile
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
    - .gitignore
---

This Next.js application uses npm as its package manager. Dependencies are declared in the root `package.json` and pinned to exact or caret ranges, while a `package-lock.json` (lockfileVersion 3) is committed to the repository to ensure deterministic installs across environments.

**System used**: npm + `package-lock.json`. No monorepo workspaces, no vendoring, no private registry configuration, and no `.yarnrc.yml` / pnpm lockfile present — despite `.gitignore` containing generic entries for Yarn/PNPM artifacts (leftover from a template).

**Key files**:
- `package.json` — declares runtime dependencies (`next`, `react`, `react-dom`, `axios`, `framer-motion`, `gsap`, `lucide-react`, `openai`) and devDependencies (`eslint`, `eslint-config-next`, `babel-plugin-react-compiler`).
- `package-lock.json` — generated lockfile that pins every transitive dependency tree; checked into version control.
- `.gitignore` — ignores `node_modules/`, build output, and debug logs; includes leftover Yarn/PNPM ignore rules but no active Yarn/PNPM config files exist.

**Conventions observed**:
- All third-party packages are listed at the top-level `package.json`; there are no nested `package.json` files, so this is a flat single-package project rather than a true monorepo.
- Versions use a mix of exact (`"19.2.4"`, `"16.2.10"`) and caret (`"^1.18.1"`) ranges — React/Next/Eslint configs are pinned exactly, while most libraries allow minor/patch upgrades.
- Scripts expose standard Next.js commands (`dev`, `build`, `start`) plus `lint`.
- No `pnpm-workspace.yaml`, `yarn.lock`, or custom registry settings were found; the README mentions both `yarn dev` and `pnpm dev` but only npm tooling is actually configured.