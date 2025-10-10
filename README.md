# Forked MYDS 

## Disclaimer

@civitechmy is not affiliated with or endorsed by the Government of Malaysia.

## What's inside?

1. Documentation
2. Component Library
3. Chart Library -- soon

We publish packages under `@civictechmy` on npm


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
