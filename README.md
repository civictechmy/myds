# MYDS - Malaysia Design System

> Multi-registry shadcn-compatible component library for Malaysian government-style applications

## Disclaimer

@civictechmy is not affiliated with or endorsed by the Government of Malaysia.

## What's inside?

1. **@myds-style Registry** - Tailwind v4 styling system (6 style components)
2. **@myds-ui Registry** - 42 shadcn-compatible React components, hooks, utilities
3. **@myds-icon Registry** - 220+ icons
4. **Storybook** - Interactive component browser

**Total: 268 components across 3 registries**

## Installation

### Quick Start

MYDS v2 is distributed entirely via shadcn registry. No npm packages required!

```bash
# 1. Initialize shadcn in your project (if not already done)
npx shadcn@latest init

# 2. Install MYDS styles (Tailwind v4)
npx shadcn@latest add myds-init --registry=https://civictechmy.github.io/myds/registry/style

# 3. Install UI components
npx shadcn@latest add button --registry=https://civictechmy.github.io/myds/registry/ui

# 4. Install icons
npx shadcn@latest add chevron-down --registry=https://civictechmy.github.io/myds/registry/icons
```

### Style Installation Options

#### Option A: Quick Setup (Recommended)
Install all MYDS styles at once:
```bash
npx shadcn@latest add myds-init --registry=https://civictechmy.github.io/myds/registry/style
```

This installs:
- Base color variables
- Light theme semantic tokens
- Dark theme semantic tokens
- Tailwind v4 configuration
- Base CSS utilities

#### Option B: Granular Control
Install individual style components:
```bash
npx shadcn@latest add colors theme-light theme-dark theme-config base-styles --registry=https://civictechmy.github.io/myds/registry/style
```

### Configure Multiple Registries

For easier installation, configure all registries in `components.json`:

```json
{
  "registries": {
    "style": "https://civictechmy.github.io/myds/registry/style",
    "ui": "https://civictechmy.github.io/myds/registry/ui",
    "icons": "https://civictechmy.github.io/myds/registry/icons"
  }
}
```

Then install with registry keys:
```bash
npx shadcn add myds-init --registry-key=style
npx shadcn add button --registry-key=ui
npx shadcn add chevron-down --registry-key=icons
```

### Requirements

- **Tailwind CSS v4**: `npm install tailwindcss@^4.0.0`
- **React 18+**: Components are built for React 18 or 19
- **TypeScript**: Recommended for best experience

## Available Components

### Style Components (6)
- `myds-init` - Complete MYDS styling system (all-in-one)
- `colors` - Base color variables
- `theme-light` - Light mode semantic tokens
- `theme-dark` - Dark mode semantic tokens
- `theme-config` - Tailwind v4 @theme configuration
- `base-styles` - Base CSS layers and utilities

### UI Components (42)
- **UI Primitives**: button, input, checkbox, radio, select, etc.
- **Complex Components**: data-table, date-picker, dropdown, etc.
- **Layout Components**: navbar, footer, masthead, announce-bar
- **Utilities**: utils (clx), hooks

### Icons (220)
- Government agency icons (legacy)
- UI icons (chevron, arrow, check, cross, etc.)
- Social media icons (facebook, twitter, instagram, etc.)
- Action icons (edit, delete, download, etc.)

See [REGISTRY.md](./REGISTRY.md) for full component list and details.

## Documentation & Demo

- **🎨 Live Demo**: [https://civictechmy.github.io/myds](https://civictechmy.github.io/myds)
- **📚 Storybook**: [https://civictechmy.github.io/myds/storybook](https://civictechmy.github.io/myds/storybook)
- **📦 Registry Catalog**: [https://civictechmy.github.io/myds/registry](https://civictechmy.github.io/myds/registry/index.json)
- **Registry Docs**: See [REGISTRY.md](./REGISTRY.md)
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Migration from v1 (npm)

If you were using the old `@civictechmy/myds-style` npm package, you'll need to migrate to the new registry-based approach:

### Before (v1)
```bash
npm install @civictechmy/myds-style
```

```css
/* app/globals.css */
@import "@civictechmy/myds-style/color.css";
@import "@civictechmy/myds-style/light.css";
@import "@civictechmy/myds-style/dark.css";
```

### After (v2)
```bash
npx shadcn@latest add myds-init --registry=https://civictechmy.github.io/myds/registry/style
```

The styles are now automatically injected into your `app/globals.css` file with Tailwind v4 configuration.

**Benefits:**
- ✅ No npm dependencies to manage
- ✅ Tailwind v4 native CSS configuration
- ✅ Full ownership of your styles
- ✅ Easy customization
- ✅ Dark mode support out of the box

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
