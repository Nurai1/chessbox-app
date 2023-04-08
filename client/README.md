## Before you enter `pnpm install`

### [Optional] These 2 steps can be skipped for non-husky users

- `git config core.hooksPath .git/hooks/`
- `rm -rf .git/hooks`

## Scripts

- `pnpm dev` - start a development server with hot reload.
- `pnpm build` - build for production. The generated files will be on the `dist` folder.
- `pnpm preview` - locally preview the production build.
- `pnpm format` - format all files with Prettier.
- `pnpm lint` - runs TypeScript, ESLint.
