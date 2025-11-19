import fs from "fs";
import path from "path";

/**
 * Utility functions for registry generation
 */

export interface ComponentFile {
  path: string;
  content: string;
  type: string;
}

export interface RegistryComponent {
  name: string;
  type: string;
  dependencies: string[];
  registryDependencies: string[];
  files: ComponentFile[];
  tailwind?: {
    config?: Record<string, any>;
  };
}

/**
 * Read file content and return as string
 */
export function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Get all TypeScript/TSX files in a directory
 */
export function getComponentFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))
      ) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Extract import statements from source code
 */
export function extractImports(content: string): {
  npmDependencies: Set<string>;
  localDependencies: Set<string>;
} {
  const npmDependencies = new Set<string>();
  const localDependencies = new Set<string>();

  // Match import statements
  const importRegex =
    /import\s+(?:(?:\*\s+as\s+\w+)|(?:\{[^}]+\})|(?:\w+))\s+from\s+["']([^"']+)["']/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];

    // Skip React and type imports
    if (importPath === "react" || importPath === "react-dom") {
      continue;
    }

    // Check if it's a local import (starts with . or /)
    if (importPath.startsWith(".") || importPath.startsWith("/")) {
      // Extract component name from path
      const parts = importPath.split("/");
      const fileName = parts[parts.length - 1];
      // Remove file extension if present
      const componentName = fileName.replace(/\.(tsx?|jsx?)$/, "");
      localDependencies.add(componentName);
    } else {
      // It's an npm package
      // Handle scoped packages (@radix-ui/react-accordion)
      if (importPath.startsWith("@")) {
        const parts = importPath.split("/");
        const packageName = `${parts[0]}/${parts[1]}`;
        npmDependencies.add(packageName);
      } else {
        // Regular package
        const packageName = importPath.split("/")[0];
        npmDependencies.add(packageName);
      }
    }
  }

  return { npmDependencies, localDependencies };
}

/**
 * Transform relative imports to alias-based imports
 */
export function transformImports(content: string): string {
  let transformed = content;

  // Transform local component imports
  // Example: from "../utils" to "@/lib/utils"
  transformed = transformed.replace(
    /from\s+["']\.\.\/utils["']/g,
    'from "@/lib/utils"'
  );

  // Transform icon imports
  // Example: from "../icons/chevron-down" to "@/components/ui/icons/chevron-down"
  transformed = transformed.replace(
    /from\s+["']\.\.\/icons\/([^"']+)["']/g,
    'from "@/components/ui/icons/$1"'
  );

  // Transform component imports
  // Example: from "../button" to "@/components/ui/button"
  transformed = transformed.replace(
    /from\s+["']\.\.\/([^"']+)["']/g,
    'from "@/components/ui/$1"'
  );

  // Transform hooks imports
  // Example: from "../hooks" to "@/lib/hooks"
  transformed = transformed.replace(
    /from\s+["']\.\.\/hooks["']/g,
    'from "@/lib/hooks"'
  );

  return transformed;
}

/**
 * Map internal component names to registry dependency names
 */
export function mapToRegistryDependency(localDep: string): string {
  // Map common internal dependencies to their registry names
  const mapping: Record<string, string> = {
    utils: "utils",
    hooks: "hooks",
    index: "utils", // hooks/index or utils/index
  };

  return mapping[localDep] || localDep;
}

/**
 * Get component name from file path
 */
export function getComponentName(filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  return fileName;
}

/**
 * Write JSON file with formatting
 */
export function writeJsonFile(filePath: string, data: any): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Determine component type based on file location or name
 */
export function getComponentType(componentName: string): string {
  const layoutComponents = ["navbar", "footer", "masthead", "announce-bar"];
  const utilityComponents = ["utils", "hooks"];

  if (utilityComponents.includes(componentName)) {
    return "components:lib";
  }

  if (layoutComponents.includes(componentName)) {
    return "components:layout";
  }

  return "components:ui";
}

/**
 * Get registry file path for component
 */
export function getRegistryPath(componentName: string, type: string): string {
  if (type === "components:lib") {
    return `lib/${componentName}.ts`;
  }

  if (componentName.startsWith("icon")) {
    return `components/ui/icons/${componentName}.tsx`;
  }

  return `components/ui/${componentName}.tsx`;
}
