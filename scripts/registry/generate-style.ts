import fs from "fs";
import path from "path";
import { readFileContent, writeJsonFile, type RegistryComponent } from "./utils";

/**
 * Generate style registry components
 * Converts CSS files from packages/style into shadcn registry format
 */

const STYLE_SOURCE_DIR = path.join(__dirname, "../../packages/style/styles");
const REGISTRY_OUTPUT_DIR = path.join(
  __dirname,
  "../../registry/style/styles/default"
);

function log(message: string) {
  console.log(`🎨 ${message}`);
}

/**
 * Generate colors component - base color variables
 */
function generateColorsComponent(): RegistryComponent {
  log("Generating colors component...");

  const content = readFileContent(path.join(STYLE_SOURCE_DIR, "theme/color.css"));

  return {
    name: "colors",
    type: "components:style",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "app/globals.css",
        content: `/* MYDS Base Colors */\n${content}`,
        type: "components:style",
      },
    ],
  };
}

/**
 * Generate theme-light component - light mode semantic tokens
 */
function generateThemeLightComponent(): RegistryComponent {
  log("Generating theme-light component...");

  const content = readFileContent(path.join(STYLE_SOURCE_DIR, "theme/light.css"));

  return {
    name: "theme-light",
    type: "components:style",
    dependencies: [],
    registryDependencies: ["colors"],
    files: [
      {
        path: "app/globals.css",
        content: `/* MYDS Light Theme */\n${content}`,
        type: "components:style",
      },
    ],
  };
}

/**
 * Generate theme-dark component - dark mode semantic tokens
 */
function generateThemeDarkComponent(): RegistryComponent {
  log("Generating theme-dark component...");

  const content = readFileContent(path.join(STYLE_SOURCE_DIR, "theme/dark.css"));

  return {
    name: "theme-dark",
    type: "components:style",
    dependencies: [],
    registryDependencies: ["colors"],
    files: [
      {
        path: "app/globals.css",
        content: `/* MYDS Dark Theme */\n${content}`,
        type: "components:style",
      },
    ],
  };
}

/**
 * Generate theme-config component - Tailwind v4 @theme configuration
 */
function generateThemeConfigComponent(): RegistryComponent {
  log("Generating theme-config component...");

  const content = readFileContent(
    path.join(STYLE_SOURCE_DIR, "tailwind.config.css")
  );

  return {
    name: "theme-config",
    type: "components:style",
    dependencies: [],
    registryDependencies: ["colors", "theme-light", "theme-dark"],
    files: [
      {
        path: "app/globals.css",
        content: `/* MYDS Theme Configuration */\n${content}`,
        type: "components:style",
      },
    ],
  };
}

/**
 * Generate base-styles component - base CSS layers and utilities
 */
function generateBaseStylesComponent(): RegistryComponent {
  log("Generating base-styles component...");

  const fullContent = readFileContent(
    path.join(STYLE_SOURCE_DIR, "input.tailwind.css")
  );

  // Extract only the parts we need (fonts import, @layer base, @layer utilities)
  const lines = fullContent.split("\n");

  // Find Google Fonts import (line 7)
  const fontsImport = lines[6] || "";

  // Extract @layer base (lines 11-26)
  const layerBaseStart = lines.findIndex(line => line.includes("@layer base"));
  const layerBaseEnd = layerBaseStart + 16; // roughly 15 lines for @layer base
  const layerBase = lines.slice(layerBaseStart, layerBaseEnd).join("\n");

  // Extract @layer utilities (lines 29-34)
  const layerUtilitiesStart = lines.findIndex(line => line.includes("@layer utilities"));
  const layerUtilitiesEnd = layerUtilitiesStart + 5; // roughly 5 lines for @layer utilities
  const layerUtilities = lines.slice(layerUtilitiesStart, layerUtilitiesEnd).join("\n");

  const content = `/* MYDS Base Styles */
${fontsImport}

${layerBase}

${layerUtilities}`;

  return {
    name: "base-styles",
    type: "components:style",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "app/globals.css",
        content,
        type: "components:style",
      },
    ],
  };
}

/**
 * Generate myds-init component - convenience component that installs everything
 */
function generateMYDSInitComponent(
  colors: RegistryComponent,
  themeLight: RegistryComponent,
  themeDark: RegistryComponent,
  themeConfig: RegistryComponent,
  baseStyles: RegistryComponent
): RegistryComponent {
  log("Generating myds-init component...");

  // Combine all content in the correct order
  const combinedContent = `@import "tailwindcss";

${colors.files[0].content}

${themeLight.files[0].content}

${themeDark.files[0].content}

${themeConfig.files[0].content}

${baseStyles.files[0].content}`;

  return {
    name: "myds-init",
    type: "components:style",
    dependencies: [],
    registryDependencies: [
      "colors",
      "theme-light",
      "theme-dark",
      "theme-config",
      "base-styles",
    ],
    files: [
      {
        path: "app/globals.css",
        content: combinedContent,
        type: "components:style",
      },
    ],
  };
}

/**
 * Main function to generate all style components
 */
async function main() {
  console.log("🎨 Generating Style Registry Components\n");
  console.log("=".repeat(60) + "\n");

  // Ensure output directory exists
  if (!fs.existsSync(REGISTRY_OUTPUT_DIR)) {
    fs.mkdirSync(REGISTRY_OUTPUT_DIR, { recursive: true });
  }

  // Generate individual components
  const colors = generateColorsComponent();
  const themeLight = generateThemeLightComponent();
  const themeDark = generateThemeDarkComponent();
  const themeConfig = generateThemeConfigComponent();
  const baseStyles = generateBaseStylesComponent();
  const mydsInit = generateMYDSInitComponent(
    colors,
    themeLight,
    themeDark,
    themeConfig,
    baseStyles
  );

  // Write all components to registry
  const components = [
    colors,
    themeLight,
    themeDark,
    themeConfig,
    baseStyles,
    mydsInit,
  ];

  for (const component of components) {
    const outputPath = path.join(REGISTRY_OUTPUT_DIR, `${component.name}.json`);
    writeJsonFile(outputPath, component);
    log(`✓ Generated ${component.name}.json`);
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✨ Style Registry Generation Complete!`);
  console.log(`Generated ${components.length} style components`);
  console.log("=".repeat(60) + "\n");
}

main().catch((error) => {
  console.error("❌ Generation failed:", error);
  process.exit(1);
});
