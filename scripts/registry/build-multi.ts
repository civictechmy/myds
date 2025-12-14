import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { writeJsonFile } from "./utils";

/**
 * Build multi-registry system
 * 1. Generate UI registry
 * 2. Generate Icons registry
 * 3. Create index.json for each registry
 * 4. Create root registry index
 */

const REGISTRY_DIR = path.join(__dirname, "../../registry");
const UI_DIR = path.join(REGISTRY_DIR, "ui/styles/default");
const ICONS_DIR = path.join(REGISTRY_DIR, "icons/styles/default");
const STYLE_DIR = path.join(REGISTRY_DIR, "style/styles/default");

function log(message: string) {
  console.log(`📦 ${message}`);
}

async function generateRegistries() {
  console.log("🏗️  Building Multi-Registry System\n");
  console.log("=".repeat(60) + "\n");

  // Step 1: Generate UI registry
  console.log("Step 1: Generating UI Registry (@myds-ui)...");
  execSync("tsx scripts/registry/generate-ui.ts", { stdio: "inherit" });

  console.log("\n" + "-".repeat(60) + "\n");

  // Step 2: Generate Icons registry
  console.log("Step 2: Generating Icons Registry (@myds-icon)...");
  execSync("tsx scripts/registry/generate-icons.ts", { stdio: "inherit" });

  console.log("\n" + "-".repeat(60) + "\n");

  // Step 3: Generate Style registry
  console.log("Step 3: Generating Style Registry (@myds-style)...");
  execSync("tsx scripts/registry/generate-style.ts", { stdio: "inherit" });

  console.log("\n" + "-".repeat(60) + "\n");
}

async function buildUIIndex() {
  log("Building UI registry index...");

  const files = fs.readdirSync(UI_DIR).filter((file) => file.endsWith(".json"));
  const components = [];

  for (const file of files) {
    const filePath = path.join(UI_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    components.push({
      name: content.name,
      type: content.type,
      dependencies: content.dependencies || [],
      registryDependencies: content.registryDependencies || [],
      files: [`styles/default/${file}`],
    });
  }

  components.sort((a, b) => a.name.localeCompare(b.name));

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8")
  );

  const index = {
    name: "@myds-ui",
    version: packageJson.version || "2.0.0",
    description: "MYDS UI components, hooks, and utilities",
    components,
  };

  const indexPath = path.join(REGISTRY_DIR, "ui/index.json");
  writeJsonFile(indexPath, index);

  log(`✓ UI index created with ${components.length} components`);

  return { components: components.length };
}

async function buildIconsIndex() {
  log("Building Icons registry index...");

  const files = fs.readdirSync(ICONS_DIR).filter((file) => file.endsWith(".json"));
  const components = [];

  for (const file of files) {
    const filePath = path.join(ICONS_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    components.push({
      name: content.name,
      type: content.type,
      dependencies: content.dependencies || [],
      registryDependencies: content.registryDependencies || [],
      files: [`styles/default/${file}`],
    });
  }

  components.sort((a, b) => a.name.localeCompare(b.name));

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8")
  );

  const index = {
    name: "@myds-icon",
    version: packageJson.version || "2.0.0",
    description: "MYDS icon library",
    components,
  };

  const indexPath = path.join(REGISTRY_DIR, "icons/index.json");
  writeJsonFile(indexPath, index);

  log(`✓ Icons index created with ${components.length} icons`);

  return { components: components.length };
}

async function buildStyleIndex() {
  log("Building Style registry index...");

  const files = fs.readdirSync(STYLE_DIR).filter((file) => file.endsWith(".json"));
  const components = [];

  for (const file of files) {
    const filePath = path.join(STYLE_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    components.push({
      name: content.name,
      type: content.type,
      dependencies: content.dependencies || [],
      registryDependencies: content.registryDependencies || [],
      files: [`styles/default/${file}`],
    });
  }

  components.sort((a, b) => a.name.localeCompare(b.name));

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8")
  );

  const index = {
    name: "@myds-style",
    version: packageJson.version || "2.0.0",
    description: "MYDS Tailwind v4 styling system",
    components,
  };

  const indexPath = path.join(REGISTRY_DIR, "style/index.json");
  writeJsonFile(indexPath, index);

  log(`✓ Style index created with ${components.length} components`);

  return { components: components.length };
}

async function buildRootIndex(uiCount: number, iconsCount: number, styleCount: number) {
  log("Building root registry index...");

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8")
  );

  const rootIndex = {
    name: "@civictechmy/myds",
    version: packageJson.version || "2.0.0",
    description: "Malaysia Design System - Multi-registry component library",
    registries: {
      ui: {
        name: "@myds-ui",
        url: "/registry/ui",
        description: "UI components, hooks, and utilities",
        components: uiCount,
      },
      icons: {
        name: "@myds-icon",
        url: "/registry/icons",
        description: "Icon library",
        components: iconsCount,
      },
      style: {
        name: "@myds-style",
        url: "/registry/style",
        description: "Tailwind v4 styling system",
        components: styleCount,
      },
    },
    totalComponents: uiCount + iconsCount + styleCount,
  };

  const rootIndexPath = path.join(REGISTRY_DIR, "index.json");
  writeJsonFile(rootIndexPath, rootIndex);

  log("✓ Root index created");
}

async function createSchemas() {
  log("Creating registry schemas...");

  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    required: ["name", "type", "files"],
    properties: {
      name: {
        type: "string",
        description: "Component name",
      },
      type: {
        type: "string",
        enum: ["components:ui", "components:layout", "components:lib", "components:icon", "components:style"],
        description: "Component type",
      },
      dependencies: {
        type: "array",
        items: { type: "string" },
        description: "npm dependencies",
      },
      registryDependencies: {
        type: "array",
        items: { type: "string" },
        description: "Registry dependencies",
      },
      files: {
        type: "array",
        items: {
          type: "object",
          required: ["path", "content", "type"],
          properties: {
            path: { type: "string" },
            content: { type: "string" },
            type: { type: "string" },
          },
        },
      },
    },
  };

  writeJsonFile(path.join(REGISTRY_DIR, "ui/schema.json"), schema);
  writeJsonFile(path.join(REGISTRY_DIR, "icons/schema.json"), schema);
  writeJsonFile(path.join(REGISTRY_DIR, "style/schema.json"), schema);

  log("✓ Schemas created");
}

async function main() {
  try {
    // Generate all registries
    await generateRegistries();

    console.log("Step 4: Building registry indexes...\n");

    // Build indexes
    const uiStats = await buildUIIndex();
    const iconsStats = await buildIconsIndex();
    const styleStats = await buildStyleIndex();
    await buildRootIndex(uiStats.components, iconsStats.components, styleStats.components);
    await createSchemas();

    console.log("\n" + "=".repeat(60));
    console.log("✨ Multi-Registry Build Complete!\n");
    console.log("Registries:");
    console.log(`  📦 @myds-ui: ${uiStats.components} components`);
    console.log(`  🎨 @myds-icon: ${iconsStats.components} icons`);
    console.log(`  🎨 @myds-style: ${styleStats.components} style components`);
    console.log(`  📊 Total: ${uiStats.components + iconsStats.components + styleStats.components} components\n`);
    console.log("Structure:");
    console.log("  registry/");
    console.log("  ├── index.json (root catalog)");
    console.log("  ├── ui/ (components registry)");
    console.log("  ├── icons/ (icons registry)");
    console.log("  └── style/ (style registry)");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

main();
