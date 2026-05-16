# AGENTS.md

Guidance for coding agents working in this repository.

## Project Overview

Presize.io is a pnpm monorepo for a Qwik City web app that bulk preprocesses, crops, resizes, captions, and downloads images in the browser.

- `apps/web`: the Qwik City app, deployed with the Cloudflare Pages adapter.
- `packages/eslint-config-custom`: shared ESLint config.
- `packages/tsconfig`: shared TypeScript configs.

The app uses Qwik for routing and shell state, plus `@builder.io/qwik-react` to embed React components for the image editor/dropzone flow.

## Tooling

- Package manager: `pnpm@8.6.2`.
- Local node version file: `.node-version` contains `20`.
- CI currently runs on Node `16.x` and executes `pnpm -r build` followed by `pnpm -r lint`.
- Workspace packages are declared in `pnpm-workspace.yaml` as `apps/*` and `packages/*`.

Install dependencies from the repo root:

```sh
pnpm install
```

Run the dev server from the repo root:

```sh
pnpm -r dev
```

Run checks from the repo root:

```sh
pnpm -r build
pnpm -r lint
```

Useful app-scoped commands:

```sh
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
pnpm --filter web preview
```

There is no dedicated test suite at the time this file was written.

## Web App Structure

Important paths in `apps/web`:

- `src/root.tsx`: Qwik City root, global CSS import, service worker registration, Mixpanel initialization, and context provider wiring.
- `src/routes/index.tsx`: main page UI and zip-download orchestration.
- `src/routes/layout.tsx`: route layout.
- `src/routes/service-worker.ts`: service worker entry.
- `src/components/ImageSelectorContext.tsx`: Qwik context for output options, processing state, and the image provider callback.
- `src/components/ImageSelector.tsx`: React dropzone/editor list, exported through `qwikify$`.
- `src/components/ImageItem.tsx`: React image editor card.
- `src/lib/types.ts`: shared app types.
- `src/lib/constants.ts`: app metadata and defaults.
- `src/lib/utils.ts`: image blob conversion helper.

Path alias `~/*` points to `apps/web/src/*`.

## Coding Conventions

- Use TypeScript and keep strict null checks in mind.
- Formatting is Prettier 2:
  - 2 spaces
  - semicolons
  - single quotes
  - trailing commas
  - `printWidth: 120`
- `.editorconfig` requests UTF-8, LF line endings, 2-space indentation, and no forced final newline.
- ESLint extends the shared `custom` config with Qwik, TypeScript, Prettier, and `simple-import-sort`.
- Unused variables are errors unless prefixed with `_`.
- Import sorting is a warning, but keep imports tidy when editing.

## Qwik And React Patterns

- Qwik components use `component$`, `$`-suffixed handlers, Qwik context, and Qwik City route conventions.
- React-only components in this app begin with `/** @jsxImportSource react */` and are wrapped with `qwikify$` when consumed from Qwik.
- Browser-only work belongs in client/visible tasks or React effects, not during SSR.
- Non-serializable callbacks stored in Qwik state should use `noSerialize`.
- The image processing path is intentionally client-side: files are dropped locally, edited through `react-avatar-editor`, converted to `Blob`s, zipped with `JSZip`, and downloaded via object URLs.

## Styling

- Styling is Tailwind CSS with DaisyUI.
- DaisyUI theme is `retro`.
- Global styles live in `apps/web/src/global.css`.
- Prefer existing Tailwind/DaisyUI class patterns before adding new CSS.

## Build And Deployment Notes

- `apps/web` build scripts:
  - `build`: `qwik build`
  - `build.client`: `vite build`
  - `build.preview`: `vite build --ssr src/entry.preview.tsx`
  - `build.server`: `vite build -c adapters/cloudflare-pages/vite.config.ts`
  - `build.types`: `tsc --incremental --noEmit`
- The Vite dev server is configured for port `3000`.
- Cloudflare Pages files live under `apps/web/public` and `apps/web/adapters/cloudflare-pages`.
- Public deployment config includes `_headers`, `_redirects`, `manifest.json`, and `robots.txt`.

## Agent Workflow

- Before editing, inspect the relevant files and preserve the current style.
- Keep changes scoped; this repo is compact and does not need broad refactors for small feature work.
- For frontend behavior changes, run at least `pnpm --filter web build` and `pnpm --filter web lint` when dependencies are installed.
- If touching workspace-level config, run `pnpm -r build` and `pnpm -r lint`.
- If you start a local dev server for visual verification, use the configured Vite port `3000` unless it is already occupied.
- Do not commit generated build output such as `dist`, `node_modules`, coverage, or temporary TypeScript incremental output.

## Known Quirks

- Git may report a safe-directory or dubious-ownership warning in sandboxed environments. Do not change global Git config unless the user asks or approves it.
- The repo has a local Node version of `20`, while GitHub Actions uses Node `16.x`; avoid introducing APIs that require a newer Node runtime unless CI is updated too.
- Mixpanel is initialized in `src/root.tsx`; avoid moving analytics into SSR paths.
- Some icons are implemented inline as SVG components rather than through an icon package. Match the local pattern unless adding an icon dependency is explicitly part of the task.
