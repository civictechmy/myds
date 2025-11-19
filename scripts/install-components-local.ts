import fs from "fs";
import path from "path";

/**
 * Install all registry components to Storybook locally
 * This bypasses shadcn CLI and directly copies from registry
 */

const REGISTRY_DIR = path.join(__dirname, "../registry/styles/default");
const STORYBOOK_DIR = path.join(__dirname, "../apps/storybook");
const COMPONENTS_DIR = path.join(STORYBOOK_DIR, "components/ui");
const LIB_DIR = path.join(STORYBOOK_DIR, "lib");

interface RegistryComponent {
  name: string;
  type: string;
  dependencies: string[];
  registryDependencies: string[];
  files: Array<{
    path: string;
    content: string;
    type: string;
  }>;
}

function log(message: string) {
  console.log(`📦 ${message}`);
}

function installComponent(componentName: string): void {
  const registryPath = path.join(REGISTRY_DIR, `${componentName}.json`);

  if (!fs.existsSync(registryPath)) {
    console.warn(`⚠️  Registry file not found: ${componentName}.json`);
    return;
  }

  const componentData: RegistryComponent = JSON.parse(
    fs.readFileSync(registryPath, "utf-8")
  );

  // Install files
  for (const file of componentData.files) {
    const targetPath = path.join(STORYBOOK_DIR, file.path);
    const targetDir = path.dirname(targetPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(targetPath, file.content);
    log(`Installed: ${file.path}`);
  }

  // Install registry dependencies recursively
  for (const dep of componentData.registryDependencies) {
    if (!fs.existsSync(path.join(STORYBOOK_DIR, `components/ui/${dep}.tsx`)) &&
        !fs.existsSync(path.join(STORYBOOK_DIR, `lib/${dep}.ts`))) {
      log(`Installing dependency: ${dep}`);
      installComponent(dep);
    }
  }
}

async function main() {
  console.log("🚀 Installing all components from local registry to Storybook\n");

  // Read all component files from registry
  const files = fs.readdirSync(REGISTRY_DIR).filter(f => f.endsWith(".json"));

  log(`Found ${files.length} components in registry\n`);

  // Install all components
  for (const file of files) {
    const componentName = file.replace(".json", "");
    log(`Installing ${componentName}...`);
    installComponent(componentName);
  }

  console.log("\n✅ All components installed successfully!");
  console.log(`📁 Components: ${COMPONENTS_DIR}`);
  console.log(`📁 Lib: ${LIB_DIR}`);
}

main().catch((error) => {
  console.error("❌ Installation failed:", error);
  process.exit(1);
});
