# MYDS - Malaysia Design System

> Multi-registry shadcn-compatible component library for Malaysian government-style applications

## Disclaimer

@civictechmy is not affiliated with or endorsed by the Government of Malaysia.

## What's inside?

1. **@myds-ui Registry** - 42 shadcn-compatible React components, hooks, utilities
2. **@myds-icon Registry** - 220+ icons
3. **Style Package** - Tailwind CSS theme and color system
4. **Storybook** - Interactive component browser

**Total: 262 components across 2 registries**

## Installation

### Quick Start

```bash
# Initialize shadcn in your project
npx shadcn@latest init
```

#### Option A: Install UI Components
```bash
npx shadcn@latest add button --registry=https://username.github.io/myds/registry/ui
npx shadcn@latest add accordion --registry=https://username.github.io/myds/registry/ui
```

#### Option B: Install Icons
```bash
npx shadcn@latest add chevron-down --registry=https://username.github.io/myds/registry/icons
npx shadcn@latest add check --registry=https://username.github.io/myds/registry/icons
```

#### Option C: Configure Multiple Registries
```json
// components.json
{
  "registries": {
    "ui": "https://username.github.io/myds/registry/ui",
    "icons": "https://username.github.io/myds/registry/icons"
  }
}
```

Then install with registry key:
```bash
npx shadcn add button --registry-key=ui
npx shadcn add chevron-down --registry-key=icons
```

### Install Style Package

MYDS components use a shared style package for theming:

```bash
npm install @civictechmy/myds-style
# or
pnpm add @civictechmy/myds-style
```

Import styles in your global CSS:

```css
@import "@civictechmy/myds-style/color.css";
@import "@civictechmy/myds-style/light.css";
@import "@civictechmy/myds-style/dark.css";
```

## Available Components

42 components available:
- **UI Primitives**: button, input, checkbox, radio, select, etc.
- **Complex Components**: data-table, date-picker, dropdown, etc.
- **Layout Components**: navbar, footer, masthead, announce-bar
- **Utilities**: utils (clx), hooks

See [REGISTRY.md](./REGISTRY.md) for full component list and details.

## Documentation & Demo

- **Storybook**: Browse all components interactively
- **Registry Docs**: See [REGISTRY.md](./REGISTRY.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)


---

## important note

### 1. Tailwind Intellisense Workaround

MYDS incorporates a unified tailwind config file, as the base config for multiple apps/packages. If you are using Tailwind Intellisense extension on VSCode, you may lose the extension's ability to auto-suggest and CSS preview if you work within `packages/**`. This is because the extension requires `tailwind.config` to be available in the local package workspace, which is not defined in individual packages.

To solve this, add the following in your VSCode **Workspace settings** (_Not your User settings_):

```json
// .vscode/settings.json
{
  "tailwindCSS.experimental.configFile": {
    "apps/docs/tailwind.config.ts": "apps/docs/**",
    "packages/tailwindcss/tailwind.config.ts": "packages/**"
  }
}
```

This will override Intellisense's auto-config-locator to point to the defined config files and together with its glob scope.

Made with ❤️ by MY tech folks
